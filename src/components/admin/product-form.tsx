import Link from "next/link";
import { SubmitButton } from "@/components/admin/submit-button";
import { getCatalogItems } from "@/lib/content-store";

type ProductFormProps = {
  product?: any;
  action: (formData: FormData) => void | Promise<void>;
};

export async function ProductForm({ product, action }: ProductFormProps) {
  const [categories, collections] = await Promise.all([
    getCatalogItems("categories"),
    getCatalogItems("collections"),
  ]);

  return (
    <form action={action} className="grid grid-cols-1 gap-5 border border-gray-800 bg-neutral-900/50 p-6 md:grid-cols-2 md:p-8">
      <label className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Product name</span>
        <input name="name" required defaultValue={product?.name ?? ""} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
      </label>
      <label className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Slug</span>
        <input name="slug" required defaultValue={product?.slug ?? ""} pattern="[a-z0-9]+(-[a-z0-9]+)*" className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
      </label>
      <label className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Category</span>
        <select name="categoryId" defaultValue={product?.categoryId ?? ""} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white">
          <option value="">Uncategorized</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Collection</span>
        <select name="collectionId" defaultValue={product?.collectionId ?? ""} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white">
          <option value="">No collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>{collection.name}</option>
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Price in cents</span>
        <input name="priceCents" required type="number" min="0" defaultValue={product?.priceCents ?? 0} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
      </label>
      <label className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Currency</span>
        <input name="currency" required maxLength={3} defaultValue={product?.currency ?? "USD"} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm uppercase text-white" />
      </label>
      <label className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Sizes</span>
        <input name="sizes" required defaultValue={(product?.sizes ?? ["S", "M", "L", "XL"]).join(", ")} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
      </label>
      <label className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Total stock</span>
        <input name="stock" required type="number" min="0" defaultValue={product?.stock ?? 0} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
      </label>
      <label className="space-y-2 md:col-span-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Primary image URL</span>
        <input name="image" required type="url" defaultValue={product?.image ?? ""} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
      </label>
      <label className="space-y-2 md:col-span-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Gallery image URLs, one per line</span>
        <textarea name="gallery" defaultValue={(product?.gallery ?? []).join("\n")} className="min-h-28 w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
      </label>
      <label className="space-y-2 md:col-span-2">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Description</span>
        <textarea name="description" required defaultValue={product?.description ?? ""} className="min-h-32 w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
      </label>
      <div className="flex flex-wrap gap-6 md:col-span-2">
        <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-300">
          <input name="active" type="checkbox" defaultChecked={product?.active ?? true} />
          Active
        </label>
        <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-300">
          <input name="featured" type="checkbox" defaultChecked={product?.featured ?? false} />
          Featured
        </label>
      </div>
      <div className="flex flex-wrap gap-4 md:col-span-2">
        <SubmitButton>Save Product</SubmitButton>
        <Link href="/admin/products" className="inline-flex items-center justify-center border border-gray-700 px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
