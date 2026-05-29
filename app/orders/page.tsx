import { auth0 } from "@/lib/auth0";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth0.getSession();
  const userEmail = session?.user?.email;

  let orders: any[] = [];
  if (userEmail) {
    const { prisma } = await import("@/lib/prisma");
    orders = await prisma.order.findMany({
      where: { customerEmail: userEmail },
      orderBy: { createdAt: "desc" }
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-32 md:px-8 text-chalk">
      <h1 className="font-display text-5xl font-black uppercase md:text-7xl tracking-tighter text-chalk">Orders</h1>
      <section className="mt-8 border border-chalk/10 bg-graphite p-8">
        {orders.length === 0 ? (
          <p className="text-chalk/40 uppercase tracking-widest text-sm">No recorded orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border-b border-chalk/5 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-lg uppercase tracking-tight">{order.stripeSessionId}</p>
                  <p className="font-display text-xl font-black text-limeflash">${order.totalAmount}</p>
                </div>
                <div className="flex justify-between items-center text-xs text-chalk/40 uppercase tracking-widest">
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="bg-chalk/10 px-2 py-1 text-chalk">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
