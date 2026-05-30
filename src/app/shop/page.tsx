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
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
            Shop the Drop
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            High-performance apparel designed for those who lead with positive energy.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((p) => (
            <div key={p.id} className="group relative">
              <Link href={`/product/${p.slug}`} className="block">
                <div className="aspect-[4/5] bg-neutral-900 overflow-hidden rounded-2xl relative mb-6">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold uppercase tracking-widest text-xs">
                      No Image
                    </div>
                  )}
                  {p.featured && (
                    <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-black uppercase px-2 py-1 rounded-sm">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold uppercase tracking-tight group-hover:underline underline-offset-4 decoration-2">
                      {p.name}
                    </h2>
                    <span className="font-medium text-gray-400">
                      {formatCurrency(p.priceCents, p.currency)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{p.category}</p>
                </div>
              </Link>

              <div className="mt-4 flex gap-2">
                <form action="/api/checkout/sessions" method="POST" className="flex-1">
                  <input type="hidden" name="productId" value={p.id} />
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neutral-200 transition-colors rounded-lg"
                  >
                    Quick Buy
                  </button>
                </form>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <div className="inline-block p-8 border border-dashed border-gray-800 rounded-3xl">
                <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">
                  The collection is coming soon.
                </p>
                <Link href="/" className="mt-4 inline-block text-white hover:underline underline-offset-4 font-bold text-xs uppercase tracking-widest">
                  Return Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
