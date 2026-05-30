"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Instagram, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { brandLinks } from "@/lib/brand";

export function SiteHeader() {
  const { count, openCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 border-b border-chalk/5 bg-ink/60 backdrop-blur-lg">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8 lg:px-10">
          <div className="h-6 w-48 animate-pulse bg-chalk/10" />
          <div className="hidden h-4 w-96 animate-pulse bg-chalk/5 md:block" />
          <div className="flex gap-3">
            <div className="h-10 w-10 animate-pulse bg-chalk/10" />
            <div className="h-10 w-10 animate-pulse bg-chalk/10" />
            <div className="h-10 w-10 animate-pulse bg-chalk/20" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-chalk/5 bg-ink/60 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8 lg:px-10">
        <Link href="/" className="font-display text-xl font-black uppercase tracking-tighter text-chalk">
          PositiveOnWorldwide
        </Link>
        <nav className="hidden items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-chalk/70 md:flex">
          <Link href="/#shop" className="transition hover:text-limeflash">Shop</Link>
          <Link href="/#collections" className="transition hover:text-limeflash">Collections</Link>
          <Link href="/#shop" className="transition hover:text-limeflash">New Arrivals</Link>
          <Link href={brandLinks.instagram} target="_blank" rel="noreferrer" className="transition hover:text-limeflash">
            Instagram
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            aria-label="PositiveOnWorldwide Instagram"
            href={brandLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center border border-chalk/10 text-chalk transition hover:border-limeflash hover:text-limeflash"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link aria-label="Account profile" href="/profile" className="flex h-10 w-10 items-center justify-center border border-chalk/10 text-chalk transition hover:border-limeflash hover:text-limeflash">
            <UserRound className="h-5 w-5" />
          </Link>
          <button 
            aria-label="Open cart" 
            onClick={openCart} 
            className="relative flex h-10 w-10 items-center justify-center bg-chalk text-ink transition hover:bg-limeflash"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-limeflash px-1 text-[10px] font-black text-ink ring-2 ring-ink">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
