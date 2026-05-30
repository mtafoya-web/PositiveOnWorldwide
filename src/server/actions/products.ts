"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth0";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.string().min(1).optional(),
  priceCents: z.number().min(0),
  description: z.string().min(1),
  sizes: z.array(z.string()),
  stock: z.number().min(0),
  image: z.string().url(),
  active: z.boolean(),
  featured: z.boolean(),
});

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    categoryId: formData.get("categoryId") as string || undefined,
    priceCents: parseInt(formData.get("priceCents") as string, 10),
    description: formData.get("description") as string,
    sizes: (formData.get("sizes") as string).split(",").map((s) => s.trim()),
    stock: parseInt(formData.get("stock") as string, 10),
    image: formData.get("image") as string,
    active: formData.get("active") === "true",
    featured: formData.get("featured") === "true",
  };

  const parsed = productSchema.parse(data);

  await prisma.product.create({
    data: {
      ...parsed,
      categoryId: parsed.categoryId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateProductStatus(id: string, active: boolean) {
  await requireAdmin();
  await prisma.product.update({
    where: { id },
    data: { active },
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
