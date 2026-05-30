import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { SiteHeader } from "@/components/store/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Positive On Worldwide",
  description: "Wear the Energy. Spread the Movement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <UserProvider>
        <body className={`${inter.className} bg-black text-white antialiased`}>
          <SiteHeader />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
