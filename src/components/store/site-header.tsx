"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/components/store/cart-provider";
import { BarChart3, ShoppingBag } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
      {announcement && (
        <div className="bg-[var(--brand-primary)] px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.24em] text-black">
          {announcement}
        </div>
      )}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-lg tracking-tighter text-white">
          <img src={logoUrl} alt="" className="h-8 w-8" />
          <span>{brandName.toUpperCase()}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            HOME
          </Link>
          <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">
            SHOP
          </Link>
          <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
            CART
          </Link>
          <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
            ABOUT
          </Link>
          {user ? (
            <>
              <Link href="/orders" className="text-gray-400 hover:text-white transition-colors">
                ORDERS
              </Link>
              <Link href="/profile" className="text-gray-400 hover:text-white transition-colors">
                PROFILE
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                ADMIN
              </Link>
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
      </div>
    </header>
  );
}
