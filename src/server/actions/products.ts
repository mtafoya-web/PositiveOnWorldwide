"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth0";
import { prisma } from "@/lib/db";
import { getAdminProducts } from "@/lib/storefront-data";
import { saveFileStoreProducts, usesFileContentStore } from "@/lib/content-store";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

const productSchema = z.object({
  name: z.string().trim().min(1).max(90),
  slug: slugSchema,
  categoryId: z.string().trim().optional(),
  collectionId: z.string().trim().optional(),
  priceCents: z.coerce.number().int().min(0).max(1000000),
  currency: z.string().trim().min(3).max(3).default("USD"),
  description: z.string().trim().min(1).max(1200),
  sizes: z.array(z.string().trim().min(1).max(12)).min(1).max(12),
  stock: z.coerce.number().int().min(0).max(100000),
  image: z.string().trim().url(),
  gallery: z.array(z.string().trim().url()).max(8),
  active: z.boolean(),
  featured: z.boolean(),
});

function pathsToRevalidate(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/analytics");
  if (slug) revalidatePath(`/product/${slug}`);
}

function formToProduct(formData: FormData) {
  const sizes = String(formData.get("sizes") || "")
    .split(",")
    .map((size) => size.trim().toUpperCase())
    .filter(Boolean);
  const gallery = String(formData.get("gallery") || "")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  return productSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: String(formData.get("categoryId") || "") || undefined,
    collectionId: String(formData.get("collectionId") || "") || undefined,
    priceCents: formData.get("priceCents"),
    currency: String(formData.get("currency") || "USD").toUpperCase(),
    description: formData.get("description"),
    sizes,
    stock: formData.get("stock"),
    image: formData.get("image"),
    gallery,
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
  });
}

async function upsertFileProduct(id: string | null, data: z.infer<typeof productSchema>) {
  const products = await getAdminProducts();
  const now = new Date();
  const existing = id ? products.find((product) => product.id === id) : null;
  const product = {
    ...(existing ?? {}),
    id: existing?.id ?? `prod-${data.slug}`,
    ...data,
    gallery: data.gallery.length > 0 ? data.gallery : [data.image],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const nextProducts = existing
    ? products.map((item) => (item.id === existing.id ? product : item))
    : [product, ...products];

  await saveFileStoreProducts(nextProducts);
  return product;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = formToProduct(formData);

  if (usesFileContentStore()) {
    const product = await upsertFileProduct(null, parsed);
    pathsToRevalidate(product.slug);
    redirect("/admin/products?saved=created");
  }

  const product = await prisma.product.create({
    data: {
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      priceCents: parsed.priceCents,
      currency: parsed.currency,
      image: parsed.image,
      gallery: parsed.gallery.length > 0 ? parsed.gallery : [parsed.image],
      sizes: parsed.sizes,
      stock: parsed.stock,
      active: parsed.active,
      featured: parsed.featured,
      categoryId: parsed.categoryId,
      collectionId: parsed.collectionId,
      variants: {
        create: parsed.sizes.map((size) => ({
          size,
          stock: Math.floor(parsed.stock / parsed.sizes.length),
          sku: `${parsed.slug}-${size}`.toUpperCase(),
        })),
      },
    },
  });

  pathsToRevalidate(product.slug);
  redirect("/admin/products?saved=created");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = formToProduct(formData);

  if (usesFileContentStore()) {
    const product = await upsertFileProduct(id, parsed);
    pathsToRevalidate(product.slug);
    redirect(`/admin/products/${product.id}?saved=updated`);
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      priceCents: parsed.priceCents,
      currency: parsed.currency,
      image: parsed.image,
      gallery: parsed.gallery.length > 0 ? parsed.gallery : [parsed.image],
      sizes: parsed.sizes,
      stock: parsed.stock,
      active: parsed.active,
      featured: parsed.featured,
      categoryId: parsed.categoryId,
      collectionId: parsed.collectionId,
    },
  });

  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.productVariant.createMany({
    data: parsed.sizes.map((size) => ({
      productId: id,
      size,
      stock: Math.floor(parsed.stock / parsed.sizes.length),
      sku: `${parsed.slug}-${size}`.toUpperCase(),
    })),
  });

  pathsToRevalidate(product.slug);
  redirect(`/admin/products/${id}?saved=updated`);
}

export async function updateProductStatus(id: string, active: boolean) {
  await requireAdmin();

  if (usesFileContentStore()) {
    const products = await getAdminProducts();
    const product = products.find((item) => item.id === id);
    if (product) {
      await saveFileStoreProducts(
        products.map((item) =>
          item.id === id ? { ...item, active, updatedAt: new Date() } : item,
        ),
      );
      pathsToRevalidate(product.slug);
    }
    return;
  }

  const product = await prisma.product.update({
    where: { id },
    data: { active },
  });
  pathsToRevalidate(product.slug);
}
