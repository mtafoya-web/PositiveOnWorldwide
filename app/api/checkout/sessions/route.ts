import { NextResponse } from "next/server";
import Stripe from "stripe";
import { assertStockAvailable } from "@/lib/db";
import { getConfiguredPaymentMethods, normalizeCheckoutPayload, toStripeLineItems } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await normalizeCheckoutPayload(await request.json());
    await assertStockAvailable(payload.items);
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    if (!secretKey) {
      return NextResponse.json({
        message: "Stripe placeholder mode: add STRIPE_SECRET_KEY to create live checkout sessions.",
        url: null
      });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: payload.customerEmail,
      payment_method_types: getConfiguredPaymentMethods(),
      line_items: await toStripeLineItems(payload.items),
      success_url: process.env.STRIPE_SUCCESS_URL ?? `${siteUrl}/orders?checkout=success`,
      cancel_url: process.env.STRIPE_CANCEL_URL ?? `${siteUrl}/checkout?checkout=cancelled`,
      metadata: {
        items: JSON.stringify(payload.items)
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL"]
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
