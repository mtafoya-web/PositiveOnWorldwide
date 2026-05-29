import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-provider";
import { SiteHeader } from "@/components/store/site-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "PositiveOnWorldwide | Premium Clothing",
  description: "Premium streetwear, essentials, and limited apparel drops by PositiveOnWorldwide."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <UserProvider>
          <CartProvider>
            <SiteHeader />
            <main id="main-content">
              {children}
            </main>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
