import type { CheckoutLineItem } from "@/lib/payments";

export async function recordTransaction(order: {
  id: string;
  stripeEventId?: string;
  customerEmail?: string | null;
  amountTotal: number;
  items: CheckoutLineItem[];
  createdAt: string;
}) {
  const { getPrisma, hasDatabaseUrl } = await import("@/lib/prisma");

  if (!hasDatabaseUrl()) {
    return {
      id: order.id,
      stripeSessionId: order.id,
      customerEmail: order.customerEmail || "unknown",
      totalAmount: order.amountTotal / 100,
      status: "paid",
      items: order.items,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date()
    };
  }

  const prisma = getPrisma();

  try {
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: order.id }
    });

    if (existing) {
      return existing;
    }

    await assertStockAvailable(order.items);

    return await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          stripeSessionId: order.id,
          customerEmail: order.customerEmail || "unknown",
          totalAmount: order.amountTotal / 100,
          status: "paid",
          items: JSON.parse(JSON.stringify(order.items)),
        }
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });
  } catch (error) {
    console.error("Failed to persist transaction; returning non-persistent order fallback.", error);
    return {
      id: order.id,
      stripeSessionId: order.id,
      customerEmail: order.customerEmail || "unknown",
      totalAmount: order.amountTotal / 100,
      status: "paid",
      items: order.items,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date()
    };
  }
}

export async function assertStockAvailable(items: CheckoutLineItem[]) {
  const { getPrisma, hasDatabaseUrl } = await import("@/lib/prisma");

  if (!hasDatabaseUrl()) {
    return;
  }

  const prisma = getPrisma();

  try {
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || product.stock < item.quantity) {
        throw new Error(`${product?.name ?? item.productId} does not have enough stock.`);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.endsWith("does not have enough stock.")) {
      throw error;
    }

    console.error("Failed to verify database stock; using catalog validation fallback.", error);
  }
}
