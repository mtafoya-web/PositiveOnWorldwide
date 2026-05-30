import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-brand-dark p-8 md:p-16">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">SHOP THE DROP</h1>
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          Back Home
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <div key={p.id} className="group relative block bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-gray-500 transition-colors">
            <div className="aspect-square bg-gray-900 relative">
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{p.name}</h2>
              <p className="text-gray-400 mb-4 line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{formatCurrency(p.priceCents, p.currency)}</span>
                <form action="/api/checkout/sessions" method="POST">
                  <input type="hidden" name="productId" value={p.id} />
                  <button type="submit" className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                    Buy Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500">
            No products available yet. Check back soon!
          </div>
        )}
      </div>
    </main>
  );
}
