import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-gray-800 rounded-lg">
          <h2 className="text-gray-400 text-sm font-semibold uppercase">Total Products</h2>
          <p className="text-4xl font-bold mt-2">{productCount}</p>
        </div>
        <div className="p-6 border border-gray-800 rounded-lg">
          <h2 className="text-gray-400 text-sm font-semibold uppercase">Total Orders</h2>
          <p className="text-4xl font-bold mt-2">{orderCount}</p>
        </div>
      </div>
    </div>
  );
}
