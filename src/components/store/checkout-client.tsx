"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ArrowRight, Loader2, LockKeyhole, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";

type CheckoutClientProps = {
  customerEmail?: string | null;
  freeShippingThresholdCents: number;
  flatShippingCents: number;
  taxNote: string;
};

export function CheckoutClient({
  customerEmail,
  freeShippingThresholdCents,
  flatShippingCents,
  taxNote,
}: CheckoutClientProps) {
  const { items, totalAmountCents, totalItems } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingEstimateCents =
    totalAmountCents >= freeShippingThresholdCents || totalAmountCents === 0 ? 0 : flatShippingCents;
  const estimatedTotalCents = totalAmountCents + shippingEstimateCents;

  async function startCheckout() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white">
        <div className="mx-auto max-w-xl border border-dashed border-white/15 bg-neutral-950 p-6 text-center sm:p-10">
          <ShoppingBag className="mx-auto mb-6 h-10 w-10 text-gray-600" />
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter">Checkout</h1>
          <p className="mb-8 text-sm font-medium text-gray-400">
            Your cart is empty. Add pieces from the shop before starting checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-black hover:bg-neutral-200"
          >
            Shop the Drop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">Checkout</h1>
            <p className="mt-3 text-sm font-medium text-gray-400">
              Review your order, then continue to secure Stripe Checkout.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-lime-300">
            <LockKeyhole className="h-4 w-4" />
            Protected checkout
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="space-y-4">
            {items.map((item) => (
              <article key={`${item.id}-${item.size}`} className="flex flex-col gap-4 border border-white/10 bg-neutral-950 p-4 min-[380px]:flex-row min-[380px]:gap-5 sm:p-5">
                <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-black">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight">{item.name}</h2>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                        Size {item.size} / Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-black">{formatCurrency(item.priceCents * item.quantity, item.currency)}</p>
                  </div>
                  <p className="text-xs font-medium text-gray-500">
                    {taxNote} Shipping is estimated here and finalized at checkout.
                  </p>
                </div>
              </article>
            ))}
          </section>

          <aside className="border border-white/10 bg-white p-6 text-black sm:p-8 lg:sticky lg:top-28 lg:self-start">
            <h2 className="mb-8 text-2xl font-black uppercase tracking-tight">Order Summary</h2>
            <div className="space-y-4 text-sm font-bold">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmountCents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping estimate</span>
                <span>{shippingEstimateCents === 0 ? "Free" : formatCurrency(shippingEstimateCents)}</span>
              </div>
              <div className="border-t border-black/10 pt-4 text-xl font-black">
                <div className="flex justify-between">
                  <span>Estimated total</span>
                  <span>{formatCurrency(estimatedTotalCents)}</span>
                </div>
              </div>
            </div>

            <div className="my-8 bg-black/5 p-4 text-xs font-medium text-black/60">
              Customer: {customerEmail || "Authenticated customer"}
            </div>

            {error && (
              <div className="mb-6 flex gap-3 bg-red-50 p-4 text-sm font-bold text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={startCheckout}
              disabled={isSubmitting}
              className="flex min-h-14 w-full items-center justify-center gap-3 bg-black px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {isSubmitting ? "Starting checkout" : "Continue to Stripe"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
