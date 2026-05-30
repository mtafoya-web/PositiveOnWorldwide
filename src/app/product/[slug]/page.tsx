import ProductDetailClient from "@/components/store/product-detail-client";
import { getProductBySlug } from "@/lib/storefront-data";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Product Not Found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-4 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Visual Section */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-neutral-950 rounded-[2.5rem] overflow-hidden relative border border-gray-900 group">
            {product.image && (
               // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-cover w-full h-full opacity-90 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {product.gallery.map((img, i) => (
              <div key={i} className="aspect-square bg-neutral-950 rounded-3xl overflow-hidden border border-gray-900">
                <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover opacity-80" />
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <ProductDetailClient product={product} />
      </div>
    </main>
  );
}
