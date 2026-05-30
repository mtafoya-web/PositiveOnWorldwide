import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { getProducts } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 italic">
            Shop the Drop
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg font-medium">
            High-performance apparel designed for those who lead with positive energy.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {products.map((p) => (
            <div key={p.id} className="group relative">
              <Link href={`/product/${p.slug}`} className="block">
                <div className="aspect-[4/5] bg-neutral-950 overflow-hidden rounded-[2rem] relative mb-6 border border-gray-900 group-hover:border-white transition-colors duration-500">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="object-cover w-full h-full transition-all duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold uppercase tracking-widest text-xs">
                      No Image
                    </div>
                  )}
                  {p.featured && (
                    <div className="absolute top-6 left-6 bg-white text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-2xl">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 px-2">
                  <div className="flex flex-col gap-1 min-[420px]:flex-row min-[420px]:items-baseline min-[420px]:justify-between">
                    <h2 className="text-lg font-black uppercase tracking-tight group-hover:underline underline-offset-8 decoration-2 decoration-white/20 sm:text-xl">
                      {p.name}
                    </h2>
                    <span className="font-bold text-gray-400 text-lg italic">
                      {formatCurrency(p.priceCents, p.currency)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                    {p.category?.name || "Apparel"}
                  </p>
                </div>
              </Link>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <div className="inline-block p-12 border border-dashed border-gray-800 rounded-[3rem]">
                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">
                  The collection is coming soon.
                </p>
                <Link href="/" className="mt-8 inline-block text-white hover:underline underline-offset-8 font-black text-xs uppercase tracking-[0.2em] transition-all">
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
