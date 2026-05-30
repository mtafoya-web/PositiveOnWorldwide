import { formatCurrency } from "@/lib/utils";
import { getAdminProducts } from "@/lib/storefront-data";
import Link from "next/link";
import { Plus, Package, Eye, Edit } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-2">Inventory</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Manage your storefront catalog</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </header>

      <div className="bg-neutral-900/50 border border-gray-800 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Product</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Price</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Stock</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {products.map((p) => {
              const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
              return (
                <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-black rounded-lg overflow-hidden border border-gray-800 flex-shrink-0">
                        <img src={p.image} alt="" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-white uppercase tracking-tight text-sm mb-1">{p.name}</div>
                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{p.category?.name || "Uncategorized"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-gray-400 italic">{formatCurrency(p.priceCents, p.currency)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-black uppercase tracking-widest ${totalStock > 0 ? "text-white" : "text-red-500"}`}>
                        {totalStock} Units
                      </span>
                      <div className="flex gap-1">
                        {p.variants.map(v => (
                          <span key={v.id} className="text-[8px] font-black text-gray-600 bg-black border border-gray-900 px-1 rounded">
                            {v.size}:{v.stock}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.active ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{p.active ? "Live" : "Draft"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/product/${p.slug}`}
                        className="p-2 hover:text-white text-gray-500 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/products/${p.id}`}
                        className="p-2 hover:text-white text-gray-500 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="py-24 text-center">
            <Package className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No products in catalog.</p>
          </div>
        )}
      </div>
    </div>
  );
}
