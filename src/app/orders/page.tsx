import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isAuth0Configured } from "@/lib/auth0";
import { getOrders } from "@/lib/storefront-data";
import { formatCurrency } from "@/lib/utils";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (isAuth0Configured && !user) {
    redirect("/api/auth/login?returnTo=/orders");
  }

  if (!isAuth0Configured) {
    return (
      <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white">
        <div className="mx-auto max-w-2xl border border-amber-400/30 bg-amber-400/10 p-10 text-center">
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter">Orders Require Login</h1>
          <p className="mb-8 text-sm font-medium leading-6 text-amber-100">
            Order history is protected by Auth0. Configure Auth0 to enable customer order lookup.
          </p>
          <Link href="/shop" className="inline-flex bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-black">
            Shop the Drop
          </Link>
        </div>
      </main>
    );
  }

  const allOrders = await getOrders();
  const orders = allOrders.filter((order) => order.customerEmail.toLowerCase() === user?.email?.toLowerCase());

  return (
    <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Orders</h1>
          <p className="mt-3 text-sm font-medium text-gray-400">Track previous purchases and fulfillment status.</p>
        </header>

        {orders.length === 0 ? (
          <div className="border border-dashed border-white/15 bg-neutral-950 p-10 text-center">
            <h2 className="mb-3 text-2xl font-black uppercase tracking-tight">No Orders Yet</h2>
            <p className="mb-8 text-sm text-gray-400">Your completed orders will appear here after checkout.</p>
            <Link href="/shop" className="inline-flex bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-black">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="border border-white/10 bg-neutral-950 p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Order #{order.orderNumber}</h2>
                    <p className="text-sm text-gray-500">{order.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">{order.status}</p>
                    <p className="text-xl font-black">{formatCurrency(order.totalCents, order.currency)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
