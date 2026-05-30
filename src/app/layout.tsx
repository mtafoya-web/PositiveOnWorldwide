import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { SiteHeader } from "@/components/store/site-header";
import { CartProvider } from "@/components/store/cart-provider";
import { getStoreContent } from "@/lib/content-store";
import { getConfiguredSiteUrl } from "@/lib/runtime-urls";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const content = await getStoreContent();

  return {
    metadataBase: new URL(getConfiguredSiteUrl() || "http://localhost:3000"),
    title: {
      default: content.seoTitle,
      template: `%s | ${content.brandName}`,
    },
    description: content.seoDescription,
    applicationName: content.brandName,
    icons: {
      icon: content.faviconUrl,
      shortcut: content.faviconUrl,
      apple: content.faviconUrl,
    },
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      url: "/",
      siteName: content.brandName,
      images: [{ url: content.logoUrl, width: 512, height: 512, alt: content.brandName }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle,
      description: content.seoDescription,
      images: [content.logoUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getStoreContent();

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-black text-white antialiased`}
        style={
          {
            "--brand-primary": content.primaryColor,
            "--brand-bg": content.backgroundColor,
          } as React.CSSProperties
        }
      >
        <UserProvider>
          <CartProvider>
            <SiteHeader
              brandName={content.brandName}
              logoUrl={content.logoUrl}
              announcement={content.announcement}
            />
            {children}
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
