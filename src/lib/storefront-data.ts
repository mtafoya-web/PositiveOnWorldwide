import { prisma } from "@/lib/db";
import { mockOrders, mockProducts, withProductRelations } from "@/lib/mock-data";
import { getFileStoreProducts, usesFileContentStore } from "@/lib/content-store";

export async function getFeaturedProducts(take = 3) {
  if (usesFileContentStore()) {
    const products = await getFileStoreProducts();
    return products.filter((product) => product.active && product.featured).slice(0, take);
  }

  try {
    return await prisma.product.findMany({
      where: { active: true, featured: true },
      take,
    });
  } catch (error) {
    console.error("Falling back to mock featured products:", error);
    return mockProducts.filter((product) => product.active && product.featured).slice(0, take);
  }
}

export async function getProducts() {
  if (usesFileContentStore()) {
    const products = await getFileStoreProducts();
    return products
      .filter((product) => product.active)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  try {
    return await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Falling back to mock products:", error);
    return mockProducts
      .filter((product) => product.active)
      .map(withProductRelations)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getProductBySlug(slug: string) {
  if (usesFileContentStore()) {
    const products = await getFileStoreProducts();
    return products.find((product) => product.slug === slug && product.active) ?? null;
  }

  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: { variants: true, category: true },
    });
  } catch (error) {
    console.error("Falling back to mock product:", error);
    const product = mockProducts.find((item) => item.slug === slug);
    return product ? withProductRelations(product) : null;
  }
}

export async function getAdminProducts() {
  if (usesFileContentStore()) {
    const products = await getFileStoreProducts();
    return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  try {
    return await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Falling back to mock admin products:", error);
    return mockProducts.map(withProductRelations).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Falling back to mock orders:", error);
    return [...mockOrders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getDashboardMetrics() {
  const [products, orders] = await Promise.all([getAdminProducts(), getOrders()]);
  const paidOrders = orders.filter((order) => ["paid", "processing", "shipped", "delivered"].includes(order.status));
  const revenueCents = paidOrders.reduce((total, order) => total + order.totalCents, 0);
  const orderCount = orders.length;
  const averageOrderValueCents = orderCount > 0 ? Math.round(revenueCents / orderCount) : 0;
  const topProducts = products
    .map((product) => {
      const units = orders.reduce((total, order) => {
        return (
          total +
          order.orderItems
            .filter((item) => item.productId === product.id)
            .reduce((itemTotal, item) => itemTotal + item.quantity, 0)
        );
      }, 0);

      return { product, units };
    })
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const salesByDate = paidOrders.reduce<Record<string, number>>((acc, order) => {
    const key = order.createdAt.toISOString().slice(0, 10);
    acc[key] = (acc[key] || 0) + order.totalCents;
    return acc;
  }, {});

  return {
    productCount: products.length,
    orderCount,
    revenueCents,
    averageOrderValueCents,
    conversionRate: 2.8,
    products,
    orders,
    topProducts,
    salesByDate,
  };
}
