"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";

export function CartDrawer() {
  const { isOpen, closeCart, items, total, updateQuantity, removeItem } = useCart();

  return (
    <div className={isOpen ? "fixed inset-0 z-[60]" : "pointer-events-none fixed inset-0 z-[60]"}>
      <button
        aria-label="Close cart overlay"
        type="button"
        tabIndex={isOpen ? 0 : -1}
        className={isOpen ? "absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity duration-500" : "absolute inset-0 bg-transparent opacity-0"}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-chalk/10 bg-graphite transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
        aria-modal="true"
        aria-hidden={!isOpen}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-chalk/10 p-6">
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-chalk">Cart</h2>
          <button 
            type="button" 
            aria-label="Close cart" 
            onClick={closeCart} 
            className="flex h-10 w-10 items-center justify-center border border-chalk/10 text-chalk hover:border-limeflash hover:text-limeflash transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-chalk/40">Your cart is empty.</p>
              <button 
                aria-label="Continue shopping and close cart"
                onClick={closeCart} 
                className="mt-4 text-xs font-bold uppercase tracking-widest text-limeflash underline underline-offset-4"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="grid grid-cols-[100px_1fr] gap-6 border-b border-chalk/5 pb-6 last:border-0">
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                    <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-4">
                        <h3 className="font-bold text-chalk uppercase leading-tight tracking-tight">{item.name}</h3>
                        <p className="font-bold text-chalk">${item.price * item.quantity}</p>
                      </div>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-chalk/40">Size {item.size}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-chalk/10">
                        <button
                          type="button"
                          aria-label={`Decrease quantity for ${item.name} size ${item.size}`}
                          className="p-2 text-chalk/60 hover:text-chalk"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-chalk">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity for ${item.name} size ${item.size}`}
                          className="p-2 text-chalk/60 hover:text-chalk"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-[10px] font-bold uppercase tracking-widest text-chalk/40 hover:text-red-500 transition-colors"
                        onClick={() => removeItem(item.productId, item.size)}
                        aria-label={`Remove ${item.name} size ${item.size} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-chalk/10 p-6 bg-ink/50 backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-chalk/60">Subtotal</span>
            <span className="font-display text-2xl font-black text-chalk tracking-tight">${total}</span>
          </div>
          <Link 
            href="/checkout" 
            onClick={closeCart}
            className="flex w-full items-center justify-center bg-chalk py-5 text-xs font-black uppercase tracking-[0.2em] text-ink transition-all hover:bg-limeflash hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:pointer-events-none"
          >
            Checkout Now
          </Link>
        </div>
      </aside>
    </div>
  );
}
