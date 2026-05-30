import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutClient } from "@/components/store/checkout-client";
import { getCurrentUser, isAuth0Configured } from "@/lib/auth0";
import { getStoreContent } from "@/lib/content-store";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (isAuth0Configured && !user) {
    redirect("/api/auth/login?returnTo=/checkout");
  }

  if (!isAuth0Configured) {
    return (
      <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white">
        <div className="mx-auto max-w-2xl border border-amber-400/30 bg-amber-400/10 p-10 text-center">
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter">Auth0 Required</h1>
          <p className="mb-8 text-sm font-medium leading-6 text-amber-100">
            Checkout is protected. Configure the Auth0 environment variables before accepting production orders.
          </p>
          <Link
            href="/cart"
            className="inline-flex bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-black"
          >
            Return to Cart
          </Link>
        </div>
      </main>
    );
  }

  const content = await getStoreContent();

  return (
    <CheckoutClient
      customerEmail={user?.email}
      freeShippingThresholdCents={content.freeShippingThresholdCents}
      flatShippingCents={content.flatShippingCents}
      taxNote={content.taxNote}
    />
  );
}
