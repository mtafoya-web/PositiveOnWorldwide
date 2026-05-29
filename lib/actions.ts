"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { isAdmin } from "@/lib/auth";

async function checkAdmin() {
  const session = await auth0.getSession();
  if (!session || !session.user || !isAdmin(session.user.email)) {
    throw new Error("Unauthorized");
  }
}

export async function upsertProduct(formData: FormData) {
  await checkAdmin();
  const { prisma } = await import("@/lib/prisma");
  
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const stock = parseInt(formData.get("stock") as string);
  const image = formData.get("image") as string;
  const sizes = (formData.get("sizes") as string).split(",").map(s => s.trim());
  const galleryStr = formData.get("gallery") as string;
  const gallery = galleryStr ? galleryStr.split(",").map(s => s.trim()).filter(Boolean) : [];

  const data = {
    name,
    slug,
    category,
    price,
    description,
    stock,
    image,
    sizes,
    gallery,
  };

  try {
    if (id && id !== "new") {
      await prisma.product.update({
        where: { id },
        data,
      });
    } else {
      await prisma.product.create({
        data,
      });
    }
  } catch (e) {
    console.error("Failed to upsert product:", e);
    throw new Error("Failed to save product. Check if slug is unique.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/product/${slug}`);
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  const { prisma } = await import("@/lib/prisma");
  await prisma.product.delete({
    where: { id }
  });
  revalidatePath("/admin");
}
