import type { CheckoutLineItem } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

export async function recordTransaction(order: {
  id: string;
  stripeEventId?: string;
  customerEmail?: string | null;
  amountTotal: number;
  items: CheckoutLineItem[];
  createdAt: string;
}) {
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
}

export async function assertStockAvailable(items: CheckoutLineItem[]) {
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    });
    
    if (!product || product.stock < item.quantity) {
      throw new Error(`${product?.name ?? item.productId} does not have enough stock.`);
    }
  }
}
