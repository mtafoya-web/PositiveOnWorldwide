"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export function CartDrawer() {
  const { isOpen, closeCart, items, total, updateQuantity, removeItem } = useCart();

  return (
    <div className={isOpen ? "fixed inset-0 z-50" : "pointer-events-none fixed inset-0 z-50"}>
      <button
        aria-label="Close cart overlay"
        type="button"
        tabIndex={isOpen ? 0 : -1}
        className={isOpen ? "absolute inset-0 bg-ink/40 backdrop-blur-sm transition" : "absolute inset-0 bg-transparent opacity-0"}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-ink bg-chalk transition duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
        aria-modal="true"
        aria-hidden={!isOpen}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-ink p-5">
          <h2 className="font-[var(--font-display)] text-2xl font-black uppercase">Cart</h2>
          <button type="button" aria-label="Close cart" onClick={closeCart} className="grid h-10 w-10 place-items-center border border-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-graphite/70">Your cart is ready for the next drop.</p>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="grid grid-cols-[88px_1fr] gap-4 border-b border-ink/10 pb-5">
                  <Image src={item.image} alt={item.name} width={88} height={112} className="h-28 w-[88px] object-cover" />
                  <div>
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-graphite/65">Size {item.size}</p>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-bold uppercase"
                        onClick={() => removeItem(item.productId, item.size)}
                        aria-label={`Remove ${item.name} size ${item.size} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-ink">
                        <button
                          type="button"
                          aria-label={`Decrease quantity for ${item.name} size ${item.size}`}
                          className="p-2"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity for ${item.name} size ${item.size}`}
                          className="p-2"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-bold">${item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-ink p-5">
          <div className="mb-5 flex items-center justify-between text-lg font-black">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <ShimmerButton asChild className="w-full" onClick={closeCart}>
            <Link href="/checkout">Checkout</Link>
          </ShimmerButton>
        </div>
      </aside>
    </div>
  );
}
