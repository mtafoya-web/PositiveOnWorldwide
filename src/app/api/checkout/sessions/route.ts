import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { auth0, isAuth0Configured } from "@/lib/auth0";
import { mockProducts, withProductRelations } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  try {
    const session = isAuth0Configured ? await auth0.getSession() : null;
    const user = session?.user;

    if (isAuth0Configured && !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    // Expecting JSON payload: { items: [{ id: string, size: string, quantity: number }] }
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = items.map(item => item.id);
    let dbProducts;
    try {
      dbProducts = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          active: true
        },
        include: {
          variants: true
        }
      });
    } catch (productError) {
      console.error("Falling back to mock checkout products:", productError);
      dbProducts = mockProducts
        .filter((product) => productIds.includes(product.id) && product.active)
        .map(withProductRelations);
    }

    const lineItems = items.map(item => {
      const dbProduct = dbProducts.find(p => p.id === item.id);
      if (!dbProduct) throw new Error(`Product ${item.id} not found`);

      // Verify stock for specific variant
      const variant = dbProduct.variants.find(v => v.size === item.size);
      if (!variant || variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${dbProduct.name} in size ${item.size}`);
      }

      return {
        price_data: {
          currency: dbProduct.currency.toLowerCase(),
          product_data: {
            name: `${dbProduct.name} - ${item.size}`,
            images: [dbProduct.image],
            metadata: {
              productId: dbProduct.id,
              size: item.size
            }
          },
          unit_amount: dbProduct.priceCents,
        },
        quantity: item.quantity,
      };
    });

    if (!stripe) {
      const fallbackUrl = env.STRIPE_SUCCESS_URL || `${env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success`;
      return NextResponse.json({
        url: `${fallbackUrl}?mock_checkout=true`,
        mock: true,
        message: "Stripe is not configured. Returning a deterministic local success URL.",
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: env.STRIPE_SUCCESS_URL || `${env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success`,
      cancel_url: env.STRIPE_CANCEL_URL || `${env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cancel`,
      customer_email: user?.email,
      metadata: {
        userId: user?.sub || "",
        items: JSON.stringify(items.map(i => ({ id: i.id, size: i.size, quantity: i.quantity })))
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
