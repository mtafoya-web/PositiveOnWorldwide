"use client";

import Link from "next/link";
import { Instagram, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { brandLinks } from "@/lib/products";

export function SiteHeader() {
  const { count, openCart } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-chalk/88 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8 lg:px-10">
        <Link href="/" className="font-[var(--font-display)] text-xl font-black uppercase">
          PositiveOnWorldwide
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold uppercase md:flex">
          <Link href="/#shop">Shop</Link>
          <Link href="/#collections">Collections</Link>
          <Link href="/#shop">New Arrivals</Link>
          <Link href={brandLinks.instagram} target="_blank" rel="noreferrer">
            Instagram
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            aria-label="PositiveOnWorldwide Instagram"
            href={brandLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="grid h-10 w-10 place-items-center border border-ink"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link aria-label="Account profile" href="/profile" className="grid h-10 w-10 place-items-center border border-ink">
            <UserRound className="h-5 w-5" />
          </Link>
          <button aria-label="Open cart" onClick={openCart} className="relative grid h-10 w-10 place-items-center border border-ink bg-ink text-chalk">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-limeflash px-1 text-xs font-black text-ink">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
