import { getRecordedOrders } from "@/lib/db";

export default function OrdersPage() {
  const orders = getRecordedOrders();

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-[var(--font-display)] text-5xl font-black uppercase md:text-7xl">Orders</h1>
      <section className="mt-8 border border-ink bg-white p-6">
        {orders.length === 0 ? (
          <p className="text-graphite/70">No recorded orders yet. Successful Stripe webhooks will appear here when durable storage is connected.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border-b border-ink/10 pb-4">
                <p className="font-bold">{order.id}</p>
                <p className="text-sm text-graphite/65">${order.amountTotal / 100} / {order.customerEmail ?? "No email"}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
