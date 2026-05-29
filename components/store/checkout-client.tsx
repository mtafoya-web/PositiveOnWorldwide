"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useCart } from "@/components/store/cart-provider";

export function CheckoutClient() {
  const { items, total } = useCart();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function startCheckout() {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/checkout/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity
          }))
        })
      });
      const data = (await response.json()) as { url?: string; message?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setStatus(data.message ?? data.error ?? "Checkout is waiting for Stripe credentials.");
    } catch {
      setStatus("Checkout could not be started. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isMounted) {
    return (
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 lg:px-10">
        <div className="mb-10">
          <div className="h-16 w-64 animate-pulse bg-ink/10 md:h-20" />
          <div className="mt-3 h-4 w-48 animate-pulse bg-ink/5" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="h-96 animate-pulse border border-ink/10 bg-white" />
          <div className="h-96 animate-pulse border border-ink/10 bg-chalk" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 lg:px-10">
      <div className="mb-10">
        <h1 className="font-[var(--font-display)] text-5xl font-black uppercase md:text-7xl">Checkout</h1>
        <p className="mt-3 text-graphite/70">Review your cart and launch secure payment.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="border border-ink bg-white p-5">
          <h2 className="mb-5 font-[var(--font-display)] text-3xl font-black uppercase">Order</h2>
          {items.length === 0 ? (
            <div className="border border-dashed border-ink/40 p-8 text-center">
              <p className="text-graphite/70">Your cart is empty.</p>
              <Link href="/#shop" className="mt-4 inline-block font-black uppercase underline underline-offset-8">
                Shop apparel
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="grid grid-cols-[88px_1fr_auto] gap-4 border-b border-ink/10 pb-4">
                  <Image src={item.image} alt={item.name} width={88} height={112} className="h-28 w-[88px] object-cover" />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-graphite/65">Size {item.size} / Qty {item.quantity}</p>
                  </div>
                  <p className="font-black">${(item.price || 0) * (item.quantity || 0)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
        <aside className="border border-ink bg-chalk p-5">
          <h2 className="font-[var(--font-display)] text-3xl font-black uppercase">Payment</h2>
          <label className="mt-6 block text-sm font-black uppercase" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 h-12 w-full border border-ink bg-white px-3 outline-none focus:ring-2 focus:ring-limeflash"
          />
          <div className="my-6 space-y-3 border-y border-ink/20 py-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">${total}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold">Calculated by Stripe</span>
            </div>
          </div>
          <div className="mb-5 flex items-center justify-between text-xl font-black">
            <span>Due today</span>
            <span>${total}</span>
          </div>
          <ShimmerButton className="w-full" disabled={!items.length || loading} onClick={startCheckout}>
            <LockKeyhole className="h-4 w-4" />
            {loading ? "Starting checkout" : "Pay securely"}
          </ShimmerButton>
          {status ? <p className="mt-4 text-sm text-graphite/70">{status}</p> : null}
          <p className="mt-5 text-xs leading-5 text-graphite/60">Supports cards, Apple Pay, Google Pay, Klarna, and Afterpay/Clearpay when enabled in Stripe.</p>
        </aside>
      </div>
    </main>
  );
}
