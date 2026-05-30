"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/components/store/cart-provider";
import { BarChart3, Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader({
  brandName,
  logoUrl,
  announcement,
}: {
  brandName: string;
  logoUrl: string;
  announcement?: string;
}) {
  const { user } = useUser();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    ["HOME", "/"],
    ["SHOP", "/shop"],
    ["CART", "/cart"],
    ["ABOUT", "/about"],
  ] as const;

  const accountLinks = user
    ? ([
        ["ORDERS", "/orders"],
        ["PROFILE", "/profile"],
        ["ADMIN", "/admin"],
        ["ANALYTICS", "/admin/analytics"],
        ["LOGOUT", "/api/auth/logout"],
      ] as const)
    : ([["LOGIN", "/api/auth/login"]] as const);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
      {announcement && (
        <div className="truncate bg-[var(--brand-primary)] px-3 py-2 text-center text-[8px] font-black uppercase leading-4 tracking-[0.08em] text-black sm:px-4 sm:text-[10px] sm:tracking-[0.24em]">
          {announcement}
        </div>
      )}
      <div className="container relative mx-auto flex h-16 w-full max-w-full items-center justify-between px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 pr-24 font-bold text-base tracking-tighter text-white sm:gap-3 sm:text-lg md:pr-0">
          <img src={logoUrl} alt="" className="h-8 w-8" />
          <span className="max-w-[5.75rem] truncate min-[360px]:max-w-[8rem] sm:max-w-none">{brandName.toUpperCase()}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(([label, href]) => (
            <Link key={href} href={href} className="text-gray-400 hover:text-white transition-colors">
              {label}
            </Link>
          ))}
          {user ? (
            <>
              {accountLinks.slice(0, 3).map(([label, href]) => (
                <Link key={href} href={href} className="text-gray-400 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
              <Link href="/admin/analytics" className="text-gray-400 hover:text-white transition-colors" aria-label="Admin analytics">
                <BarChart3 className="h-4 w-4" />
              </Link>
              <Link
                href="/api/auth/logout"
                className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                LOGOUT
              </Link>
            </>
          ) : (
            <Link
              href="/api/auth/login"
              className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              LOGIN
            </Link>
          )}
          
          <Link href="/cart" className="relative text-gray-400 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        <div className="fixed right-4 top-12 z-[60] flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="relative flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 min-[360px]:min-h-11 min-[360px]:min-w-11"
            aria-label={`Cart with ${totalItems} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-black">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/10 text-white min-[360px]:min-h-11 min-[360px]:min-w-11"
            aria-expanded={isOpen}
            aria-controls="mobile-site-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav
          id="mobile-site-menu"
          className="border-t border-white/10 bg-black px-4 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="grid grid-cols-1 gap-2">
            {[...navLinks, ...accountLinks].map(([label, href]) => (
              <Link
                key={`${label}-${href}`}
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex min-h-12 items-center justify-between border border-white/10 bg-neutral-950 px-4 text-sm font-black uppercase tracking-[0.18em] text-white"
              >
                {label}
                {label === "ANALYTICS" && <BarChart3 className="h-4 w-4" />}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
