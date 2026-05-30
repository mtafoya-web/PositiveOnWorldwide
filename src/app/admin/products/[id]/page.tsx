import { ProductForm } from "@/components/admin/product-form";
import { getAdminProducts } from "@/lib/storefront-data";
import { updateProduct } from "@/server/actions/products";

export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { saved?: string };
}) {
  const products = await getAdminProducts();
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    return (
      <div className="p-8 md:p-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Product Not Found</h1>
      </div>
    );
  }

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-5xl p-8 md:p-12">
      <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Edit Product</h1>
          <p className="mt-3 text-sm text-gray-500">
            Changes update storefront product data after save.
          </p>
        </div>
        {searchParams?.saved && (
          <div className="border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-200">
            Saved
          </div>
        )}
      </header>
      <ProductForm product={product} action={updateProductWithId} />
    </div>
  );
}
