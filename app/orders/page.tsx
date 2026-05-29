import { auth0 } from "@/lib/auth0";
import { OrdersClient } from "@/components/store/orders-client";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth0.getSession();
  const userEmail = session?.user?.email;

  let orders: any[] = [];
  if (userEmail) {
    const { getPrisma, hasDatabaseUrl } = await import("@/lib/prisma");
    if (hasDatabaseUrl()) {
      orders = await getPrisma().order.findMany({
        where: { customerEmail: userEmail },
        orderBy: { createdAt: "desc" }
      });
    }
  }

  // Use a plain object for items if it's Json in Prisma, or just pass the orders
  const serializedOrders = JSON.parse(JSON.stringify(orders));

  return <OrdersClient orders={serializedOrders} />;
}
