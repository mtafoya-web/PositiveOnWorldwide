import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-provider";
import { SiteHeader } from "@/components/store/site-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: {
    default: "PositiveOnWorldwide | Premium Streetwear",
    template: "%s | PositiveOnWorldwide"
  },
  description: "Premium streetwear, essentials, and limited apparel drops. Stay positive, move with purpose.",
  keywords: ["streetwear", "clothing brand", "premium apparel", "essentials", "PositiveOnWorldwide"],
  authors: [{ name: "PositiveOnWorldwide" }],
  creator: "PositiveOnWorldwide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://positiveonworldwide.com",
    siteName: "PositiveOnWorldwide",
    title: "PositiveOnWorldwide | Premium Streetwear",
    description: "Premium streetwear, essentials, and limited apparel drops. Stay positive, move with purpose.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PositiveOnWorldwide"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PositiveOnWorldwide | Premium Streetwear",
    description: "Premium streetwear, essentials, and limited apparel drops.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true
  }
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
