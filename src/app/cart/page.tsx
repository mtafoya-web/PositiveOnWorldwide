"use client";

import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmountCents, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">Your Cart</h1>
        <div className="w-full max-w-lg border border-gray-800 p-8 sm:p-16 rounded-3xl mb-8">
          <p className="text-gray-500 font-medium uppercase tracking-widest mb-8 text-sm">Your cart is currently empty.</p>
          <Link href="/shop" className="inline-flex min-h-12 items-center justify-center px-8 sm:px-12 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-neutral-200 transition-all active:scale-95">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3 border-b border-gray-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">Your Bag</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{totalItems} Items</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex flex-col gap-4 pb-8 border-b border-gray-900 group min-[420px]:flex-row min-[420px]:gap-6">
                <div className="w-full max-w-32 aspect-[4/5] bg-neutral-900 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold uppercase tracking-tight mb-1 sm:text-xl">{item.name}</h2>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Size: {item.size}</p>
                    </div>
                    <p className="font-bold text-lg">{formatCurrency(item.priceCents * item.quantity, item.currency)}</p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center border border-gray-800 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="flex min-h-10 min-w-10 items-center justify-center hover:text-white text-gray-500 transition-colors"
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="flex min-h-10 min-w-10 items-center justify-center hover:text-white text-gray-500 transition-colors"
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id, item.size)}
                      className="flex min-h-11 items-center justify-center gap-2 border border-gray-800 px-4 text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-red-500 sm:border-0 sm:px-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-neutral-950 border border-gray-800 rounded-2xl p-6 sm:p-8 lg:sticky lg:top-32">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmountCents)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="pt-4 border-t border-gray-800 flex justify-between text-white font-black uppercase tracking-tighter text-xl">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmountCents)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full min-h-14 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 group"
              >
                Secure Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <p className="mt-6 text-center text-gray-600 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                Taxes and shipping are calculated by Stripe in the next step. 
                All payments are secured and encrypted.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
