import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import { Product } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: Product[] = [];
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });
    products = dbProducts as unknown as Product[];
  } catch (e) {
    console.error("Failed to fetch products from DB:", e);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-chalk/10 text-[10px] font-bold uppercase tracking-[0.2em] text-chalk/40">
            <th className="py-4 px-2">Image</th>
            <th className="py-4 px-2">Name</th>
            <th className="py-4 px-2">Category</th>
            <th className="py-4 px-2">Price</th>
            <th className="py-4 px-2">Stock</th>
            <th className="py-4 px-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-chalk/5">
          {products.map((product) => (
            <tr key={product.id} className="group hover:bg-chalk/5 transition-colors">
              <td className="py-4 px-2">
                <div className="relative h-12 w-12 bg-graphite overflow-hidden">
                  <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                </div>
              </td>
              <td className="py-4 px-2">
                <div className="font-bold">{product.name}</div>
                <div className="text-[10px] text-chalk/40 uppercase tracking-wider">{product.slug}</div>
              </td>
              <td className="py-4 px-2 text-sm text-chalk/60 uppercase">{product.category}</td>
              <td className="py-4 px-2 font-bold">${product.price}</td>
              <td className="py-4 px-2">
                <span className={product.stock < 10 ? "text-limeflash" : "text-chalk/60"}>
                  {product.stock}
                </span>
              </td>
              <td className="py-4 px-2 text-right">
                <div className="flex justify-end gap-2">
                  <Link 
                    href={`/product/${product.slug}`} 
                    target="_blank"
                    className="p-2 border border-chalk/10 hover:border-chalk/30 transition text-chalk/60 hover:text-chalk"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link 
                    href={`/admin/products/${product.id}`} 
                    className="p-2 border border-chalk/10 hover:border-limeflash transition text-chalk/60 hover:text-limeflash"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  {/* Delete button would go here with a Server Action */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="py-20 text-center text-chalk/40 uppercase tracking-widest text-sm">
          No products found. Ensure DATABASE_URL is set and migrations are run.
        </div>
      )}
    </div>
  );
}
