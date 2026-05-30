import { upsertProduct } from "@/lib/actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  let product = null;

  if (!isNew) {
    try {
      const { getPrisma, hasDatabaseUrl } = await import("@/lib/prisma");
      if (!hasDatabaseUrl()) notFound();
      product = await getPrisma().product.findUnique({
        where: { id: params.id }
      });
      if (!product) notFound();
    } catch (e) {
      console.error("Failed to fetch product for editing:", e);
      notFound();
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-black uppercase mb-8">
        {isNew ? "Create New Product" : `Edit: ${product?.name}`}
      </h2>
      
      <form action={upsertProduct} className="space-y-6">
        <input type="hidden" name="id" value={params.id} />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Name</label>
            <input 
              required
              name="name" 
              defaultValue={product?.name}
              placeholder="e.g. Core Black Hoodie"
              className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Slug</label>
            <input 
              required
              name="slug" 
              defaultValue={product?.slug}
              placeholder="e.g. core-black-hoodie"
              className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Category</label>
            <input 
              required
              name="category" 
              defaultValue={product?.category}
              placeholder="e.g. Fleece"
              className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Price</label>
            <input 
              required
              type="number"
              step="0.01"
              name="price" 
              defaultValue={product?.price}
              placeholder="88.00"
              className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Stock</label>
            <input 
              required
              type="number"
              name="stock" 
              defaultValue={product?.stock}
              placeholder="50"
              className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Description</label>
          <textarea 
            required
            name="description" 
            defaultValue={product?.description}
            rows={4}
            placeholder="Describe the product..."
            className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Main Image URL</label>
          <input 
            required
            name="image" 
            defaultValue={product?.image}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Gallery URLs (comma separated)</label>
          <input 
            name="gallery" 
            defaultValue={product?.gallery ? product.gallery.join(", ") : ""}
            placeholder="url1, url2, url3"
            className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-chalk/40">Sizes (comma separated)</label>
          <input 
            required
            name="sizes" 
            defaultValue={product?.sizes ? product.sizes.join(", ") : "XS, S, M, L, XL, XXL"}
            placeholder="S, M, L"
            className="w-full bg-graphite border border-chalk/10 p-3 text-sm focus:border-limeflash outline-none"
          />
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button 
            type="submit"
            className="flex-1 bg-limeflash p-4 text-sm font-bold uppercase text-ink transition hover:opacity-90 active:scale-95"
          >
            {isNew ? "Create Product" : "Save Changes"}
          </button>
          <a 
            href="/admin"
            className="flex-1 border border-chalk/10 p-4 text-sm font-bold uppercase text-chalk text-center transition hover:bg-chalk/5"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
