import type { CheckoutLineItem } from "@/lib/payments";
import { products } from "@/lib/products";

export type RecordedOrder = {
  id: string;
  stripeEventId?: string;
  customerEmail?: string | null;
  amountTotal: number;
  items: CheckoutLineItem[];
  createdAt: string;
};

const orders = new Map<string, RecordedOrder>();
const stock = new Map(products.map((product) => [product.id, product.stock]));

export function recordTransaction(order: RecordedOrder) {
  const existing = orders.get(order.id);
  if (existing) {
    return existing;
  }

  assertStockAvailable(order.items);
  orders.set(order.id, order);
  for (const item of order.items) {
    stock.set(item.productId, getStock(item.productId) - item.quantity);
  }
  return order;
}

export function getRecordedOrders() {
  return Array.from(orders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getStock(productId: string) {
  return stock.get(productId) ?? 0;
}

export function assertStockAvailable(items: CheckoutLineItem[]) {
  for (const item of items) {
    if (getStock(item.productId) < item.quantity) {
      const product = products.find((entry) => entry.id === item.productId);
      throw new Error(`${product?.name ?? item.productId} does not have enough stock.`);
    }
  }
}
