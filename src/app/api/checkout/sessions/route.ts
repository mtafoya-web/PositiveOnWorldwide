import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const productId = formData.get("productId") as string;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product || !product.active || product.stock <= 0) {
      return NextResponse.json({ error: "Product unavailable" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.name,
              images: [product.image],
            },
            unit_amount: product.priceCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: env.STRIPE_SUCCESS_URL,
      cancel_url: env.STRIPE_CANCEL_URL,
      metadata: {
        productId: product.id,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe session URL");
    }

    // Pre-create the order as pending
    await prisma.order.create({
      data: {
        stripeCheckoutSessionId: session.id,
        customerEmail: "", // Will be filled by webhook
        totalCents: product.priceCents,
        subtotalCents: product.priceCents,
        currency: product.currency,
        status: "pending",
        items: [{ productId: product.id, quantity: 1, size: "Default", priceCents: product.priceCents }],
      },
    });

    return NextResponse.redirect(session.url, 303);
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
