import { getDashboardMetrics } from "@/lib/storefront-data";
import { formatCurrency } from "@/lib/utils";
import { MOCK_DATA_NOTICE } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const metrics = await getDashboardMetrics();
  const maxSales = Math.max(...Object.values(metrics.salesByDate), 1);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8 md:space-y-10 md:p-12">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic sm:text-5xl">Analytics</h1>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
            Sales insight, customer activity, and storefront performance
          </p>
        </div>
        <div className="border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-xs font-bold leading-5 text-lime-100">
          {MOCK_DATA_NOTICE}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {[
          ["Total sales", metrics.orderCount.toString()],
          ["Revenue", formatCurrency(metrics.revenueCents)],
          ["Orders", metrics.orderCount.toString()],
          ["Average order value", formatCurrency(metrics.averageOrderValueCents)],
          ["Conversion rate", `${metrics.conversionRate.toFixed(1)}%`],
        ].map(([label, value]) => (
          <div key={label} className="border border-gray-800 bg-black p-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.26em] text-gray-500">{label}</h2>
            <p className="mt-4 text-3xl font-black tracking-tight">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="border border-gray-800 bg-neutral-900/50 p-4 sm:p-8">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight">Sales by Date</h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">Last activity</span>
          </div>
          <div className="space-y-4">
            {Object.entries(metrics.salesByDate).map(([date, value]) => (
              <div key={date} className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-[6.5rem_1fr_5.5rem] min-[420px]:items-center min-[420px]:gap-3 sm:grid-cols-[7rem_1fr_6rem] sm:gap-4">
                <span className="text-xs font-bold text-gray-500">{date}</span>
                <div className="h-3 bg-black">
                  <div
                    className="h-full bg-lime-300"
                    style={{ width: `${Math.max(8, (value / maxSales) * 100)}%` }}
                  />
                </div>
                <span className="text-left text-xs font-black min-[420px]:text-right">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-800 bg-neutral-900/50 p-4 sm:p-8">
          <h2 className="mb-8 text-xl font-black uppercase tracking-tight">Top Products</h2>
          <div className="space-y-6">
            {metrics.topProducts.map(({ product, units }) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="h-16 w-12 overflow-hidden bg-black">
                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black uppercase tracking-tight">{product.name}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(product.priceCents, product.currency)}</p>
                </div>
                <p className="text-right text-xs font-black uppercase tracking-[0.14em] text-lime-300 sm:tracking-[0.2em]">{units} sold</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-gray-800 bg-neutral-900/50">
        <div className="border-b border-gray-800 p-6">
          <h2 className="text-xl font-black uppercase tracking-tight">Customer Activity</h2>
        </div>
        <div className="overflow-x-auto" tabIndex={0} aria-label="Customer activity table, scroll horizontally on small screens">
          <table className="w-full min-w-[720px] text-left">
            <thead className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {metrics.orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-bold">{order.customerEmail}</td>
                  <td className="px-6 py-4 text-sm">#{order.orderNumber}</td>
                  <td className="px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-lime-300">
                    {order.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{order.orderItems.length}</td>
                  <td className="px-6 py-4 text-right text-sm font-black">
                    {formatCurrency(order.totalCents, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
