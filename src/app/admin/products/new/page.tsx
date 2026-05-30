import { createProduct } from "@/server/actions/products";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">New Product</h1>
        <Link href="/admin/products" className="text-gray-400 hover:text-white">Back to Products</Link>
      </div>

      <form action={createProduct} className="space-y-4 bg-gray-900 border border-gray-800 p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
          <input name="name" required className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Slug</label>
          <input name="slug" required className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
          <input name="category" required className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Price (in cents)</label>
          <input type="number" name="priceCents" required className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
          <textarea name="description" required rows={3} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Sizes (comma separated)</label>
          <input name="sizes" required placeholder="S, M, L, XL" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Initial Stock</label>
          <input type="number" name="stock" defaultValue={0} required className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
          <input type="url" name="image" required className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <input type="checkbox" name="active" value="true" defaultChecked className="rounded border-gray-700 bg-black" />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <input type="checkbox" name="featured" value="true" className="rounded border-gray-700 bg-black" />
            Featured
          </label>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <button type="submit" className="w-full py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors">
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
