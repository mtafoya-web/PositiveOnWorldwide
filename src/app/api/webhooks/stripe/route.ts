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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        
        await prisma.order.update({
          where: { stripeCheckoutSessionId: session.id },
          data: {
            status: "paid",
            customerEmail: session.customer_details?.email || "",
            stripePaymentIntentId: session.payment_intent as string,
          },
        });

        // Deduct inventory
        const order = await prisma.order.findUnique({ where: { stripeCheckoutSessionId: session.id } });
        if (order && Array.isArray(order.items)) {
          for (const item of order.items as any[]) {
            if (item.productId) {
              await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
              });
            }
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
