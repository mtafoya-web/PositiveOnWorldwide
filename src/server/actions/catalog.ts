"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth0";
import { prisma } from "@/lib/db";
import { catalogItemSchema, getCatalogItems, saveCatalogItems, usesFileContentStore } from "@/lib/content-store";

function revalidateCatalogPaths() {
  revalidatePath("/shop");
  revalidatePath("/admin/catalog");
  revalidatePath("/admin/products");
}

function catalogFormToData(formData: FormData) {
  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return catalogItemSchema.parse({
    id: String(formData.get("id") || `${formData.get("kind")}-${slug}`),
    slug,
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    active: formData.get("active") === "on",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function createCatalogItem(kind: "categories" | "collections", formData: FormData) {
  await requireAdmin();
  const parsed = catalogFormToData(formData);

  if (usesFileContentStore()) {
    const items = await getCatalogItems(kind);
    await saveCatalogItems(kind, [{ ...parsed, id: `${kind.slice(0, -1)}-${parsed.slug}` }, ...items]);
    revalidateCatalogPaths();
    redirect("/admin/catalog?saved=catalog");
  }

  if (kind === "categories") {
    await prisma.category.create({
      data: {
        slug: parsed.slug,
        name: parsed.name,
        description: parsed.description,
        image: parsed.image || null,
        active: parsed.active,
      },
    });
  } else {
    await prisma.collection.create({
      data: {
        slug: parsed.slug,
        name: parsed.name,
        description: parsed.description,
        image: parsed.image || null,
        active: parsed.active,
      },
    });
  }

  revalidateCatalogPaths();
  redirect("/admin/catalog?saved=catalog");
}
