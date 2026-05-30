"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { user, isLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tighter text-white">
          POSITIVE ON WORLDWIDE
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">
            SHOP
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
        </nav>

        {/* Mobile menu could go here */}
      </div>
    </header>
  );
}
