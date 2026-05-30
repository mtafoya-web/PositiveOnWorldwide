import { formatCurrency } from "@/lib/utils";
import { getAdminProducts } from "@/lib/storefront-data";
import Link from "next/link";
import { Plus, Package, Eye, Edit } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-end sm:justify-between md:mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-2 sm:text-5xl">Inventory</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Manage your storefront catalog</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-black shadow-xl transition-all hover:bg-neutral-200 sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </header>

      <div className="hidden overflow-x-auto rounded-[2rem] border border-gray-800 bg-neutral-900/50 lg:block">
        <table className="w-full min-w-[760px] text-left border-collapse">
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
                    <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                      <Link 
                        href={`/product/${p.slug}`}
                        className="flex min-h-10 min-w-10 items-center justify-center hover:text-white text-gray-500 transition-colors"
                        aria-label={`View ${p.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/products/${p.id}`}
                        className="flex min-h-10 min-w-10 items-center justify-center hover:text-white text-gray-500 transition-colors"
                        aria-label={`Edit ${p.name}`}
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

      <div className="space-y-4 lg:hidden">
        {products.map((p) => {
          const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
          return (
            <article key={p.id} className="border border-gray-800 bg-neutral-900/50 p-4">
              <div className="flex gap-4">
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-800 bg-black">
                  <img src={p.image} alt="" className="h-full w-full object-cover opacity-80" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-black uppercase tracking-tight text-white">{p.name}</h2>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-600">{p.category?.name || "Uncategorized"}</p>
                  <p className="mt-3 text-sm font-bold italic text-gray-400">{formatCurrency(p.priceCents, p.currency)}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.variants.map((v) => (
                      <span key={v.id} className="border border-gray-800 bg-black px-2 py-1 text-[9px] font-black uppercase text-gray-500">
                        {v.size}:{v.stock}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${totalStock > 0 ? "text-lime-300" : "text-red-500"}`}>
                  {p.active ? "Live" : "Draft"} / {totalStock} units
                </span>
                <div className="flex gap-2">
                  <Link href={`/product/${p.slug}`} className="flex min-h-11 min-w-11 items-center justify-center border border-gray-800 text-gray-300" aria-label={`View ${p.name}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link href={`/admin/products/${p.id}`} className="flex min-h-11 min-w-11 items-center justify-center border border-gray-800 text-gray-300" aria-label={`Edit ${p.name}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
        {products.length === 0 && (
          <div className="border border-dashed border-gray-800 py-16 text-center">
            <Package className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No products in catalog.</p>
          </div>
        )}
      </div>
    </div>
  );
}
