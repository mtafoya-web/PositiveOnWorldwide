import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/server/actions/products";

export default function AdminProductNewPage() {
  return (
    <div className="mx-auto max-w-5xl p-8 md:p-12">
      <header className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Add Product</h1>
        <p className="mt-3 text-sm text-gray-500">
          Create products, images, pricing, inventory, status, and featured placement from the admin.
        </p>
      </header>
      <ProductForm action={createProduct} />
    </div>
  );
}
