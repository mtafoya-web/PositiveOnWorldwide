import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { recordTransaction } from "@/lib/db";
import { normalizeCheckoutPayload, type CheckoutLineItem } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook credentials are not configured." }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    let items: CheckoutLineItem[];
    try {
      items = parseItems(session.metadata?.items);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid checkout line item metadata.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    recordTransaction({
      id: session.id,
      stripeEventId: event.id,
      customerEmail: session.customer_details?.email ?? session.customer_email,
      amountTotal: session.amount_total ?? 0,
      items,
      createdAt: new Date().toISOString()
    });
  }

  return NextResponse.json({ received: true });
}

function parseItems(value: string | undefined): CheckoutLineItem[] {
  if (!value) {
    throw new Error("Missing checkout line item metadata.");
  }

  try {
    return normalizeCheckoutPayload({ items: JSON.parse(value) }).items;
  } catch {
    throw new Error("Invalid checkout line item metadata.");
  }
}
