import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/store/product-detail-client";
import { getProductBySlug, getProducts } from "@/lib/products";

export async function generateStaticParams() {
  const productsList = await getProducts();
  return productsList.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const related = allProducts.filter((item) => item.id !== product.id).slice(0, 3);

  return <ProductDetailClient product={product} related={related} />;
}
