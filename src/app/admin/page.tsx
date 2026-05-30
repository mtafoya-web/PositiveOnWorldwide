import Link from "next/link";
import { getDashboardMetrics } from "@/lib/storefront-data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8 md:space-y-10 md:p-12">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic sm:text-5xl">Dashboard</h1>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
            Store operations and launch readiness
          </p>
        </div>
        <Link href="/admin/analytics" className="inline-flex min-h-12 items-center justify-center bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black">
          View Analytics
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="border border-gray-800 bg-black p-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Products</h2>
          <p className="mt-4 text-4xl font-black">{metrics.productCount}</p>
        </div>
        <div className="border border-gray-800 bg-black p-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Orders</h2>
          <p className="mt-4 text-4xl font-black">{metrics.orderCount}</p>
        </div>
        <div className="border border-gray-800 bg-black p-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Revenue</h2>
          <p className="mt-4 text-4xl font-black">{formatCurrency(metrics.revenueCents)}</p>
        </div>
        <div className="border border-gray-800 bg-black p-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">AOV</h2>
          <p className="mt-4 text-4xl font-black">{formatCurrency(metrics.averageOrderValueCents)}</p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-gray-800 bg-neutral-900/50 p-4 sm:p-8">
          <h2 className="mb-6 text-xl font-black uppercase tracking-tight">Recent Orders</h2>
          <div className="space-y-4">
            {metrics.orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <p className="text-sm font-black uppercase">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.customerEmail}</p>
                </div>
                <p className="font-black">{formatCurrency(order.totalCents, order.currency)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-gray-800 bg-neutral-900/50 p-4 sm:p-8">
          <h2 className="mb-6 text-xl font-black uppercase tracking-tight">Top Products</h2>
          <div className="space-y-4">
            {metrics.topProducts.map(({ product, units }) => (
              <div key={product.id} className="flex items-center justify-between border-b border-gray-800 pb-4">
                <p className="text-sm font-black uppercase">{product.name}</p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{units} sold</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
