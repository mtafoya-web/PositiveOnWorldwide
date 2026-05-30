import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  let event;

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  if (!stripe) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not configured" }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Idempotency check: Have we processed this event already?
  const existingEvent = await prisma.stripeEvent.findUnique({
    where: { stripeEventId: event.id }
  });

  if (existingEvent) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  await prisma.stripeEvent.create({
    data: {
      stripeEventId: event.id,
      type: event.type
    }
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const items = JSON.parse(session.metadata.items);

        // Create the order in the database
        const order = await prisma.order.create({
          data: {
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            customerEmail: session.customer_details?.email || "",
            totalCents: session.amount_total,
            subtotalCents: session.amount_subtotal,
            currency: session.currency.toUpperCase(),
            status: "paid",
            items: items, // Snapshot of items
            shippingAddress: session.shipping_details || {},
            orderItems: {
              create: items.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                size: item.size,
                priceCents: item.priceCents || 0,
              }))
            }
          }
        });

        // Deduct inventory from VARIANTS (specific sizes)
        for (const item of items) {
          await prisma.productVariant.update({
            where: {
              productId_size: {
                productId: item.id,
                size: item.size
              }
            },
            data: {
              stock: { decrement: item.quantity }
            }
          });
          
          // Also sync root product aggregate stock for fallback
          await prisma.product.update({
            where: { id: item.id },
            data: {
              stock: { decrement: item.quantity }
            }
          });
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Mark event as processed
    await prisma.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { processed: true }
    });

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
