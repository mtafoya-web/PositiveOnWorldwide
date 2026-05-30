import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { auth0, isAuth0Configured } from "@/lib/auth0";
import { mockProducts, withProductRelations } from "@/lib/mock-data";
import { getStripeRedirectUrl } from "@/lib/runtime-urls";

const checkoutItemSchema = z.object({
  id: z.string().min(1),
  size: z.string().min(1).max(20),
  quantity: z.coerce.number().int().min(1).max(99),
});

const checkoutPayloadSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(50),
});

const allowedPaymentMethods = new Set(["card", "klarna", "afterpay_clearpay", "affirm", "cashapp"]);

function getPaymentMethodTypes() {
  const methods = (env.STRIPE_CHECKOUT_PAYMENT_METHODS || "card")
    .split(",")
    .map((method) => method.trim().toLowerCase())
    .filter((method) => allowedPaymentMethods.has(method));

  return (methods.length > 0 ? methods : ["card"]) as any;
}

export async function POST(req: NextRequest) {
  try {
    const session = isAuth0Configured ? await auth0.getSession() : null;
    const user = session?.user;

    if (isAuth0Configured && !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const parsedPayload = checkoutPayloadSchema.safeParse(await req.json());
    if (!parsedPayload.success) {
      return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
    }

    const { items } = parsedPayload.data;

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
      console.error("Checkout product lookup failed:", productError);
      if (env.NODE_ENV === "production" && env.USE_MOCK_DATA !== "true") {
        return NextResponse.json({ error: "Unable to load products for checkout" }, { status: 503 });
      }

      dbProducts = mockProducts
        .filter((product) => productIds.includes(product.id) && product.active)
        .map(withProductRelations);
    }

    const lineItems = items.map(item => {
      const dbProduct = dbProducts.find(p => p.id === item.id);
      if (!dbProduct) throw new Error(`Product ${item.id} not found`);

      const variant = dbProduct.variants?.find(v => v.size === item.size);
      const sizeAllowed = dbProduct.sizes?.includes(item.size) || Boolean(variant);
      const stockAvailable = variant?.stock ?? dbProduct.stock ?? 0;

      if (!dbProduct.active || !sizeAllowed || stockAvailable < item.quantity) {
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
      if (env.NODE_ENV === "production" && env.USE_MOCK_DATA !== "true") {
        return NextResponse.json({ error: "STRIPE_SECRET_KEY is not configured" }, { status: 500 });
      }

      const fallbackUrl = getStripeRedirectUrl("success", req);
      return NextResponse.json({
        url: `${fallbackUrl}?mock_checkout=true`,
        mock: true,
        message: "Stripe is not configured. Returning a deterministic local success URL.",
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: getPaymentMethodTypes(),
      line_items: lineItems,
      mode: "payment",
      success_url: `${getStripeRedirectUrl("success", req)}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: getStripeRedirectUrl("cancel", req),
      customer_email: user?.email,
      metadata: {
        userId: user?.sub || "",
        items: JSON.stringify(
          items.map((i) => {
            const product = dbProducts.find((p) => p.id === i.id);
            return {
              id: i.id,
              size: i.size,
              quantity: i.quantity,
              priceCents: product?.priceCents || 0,
            };
          }),
        ),
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
