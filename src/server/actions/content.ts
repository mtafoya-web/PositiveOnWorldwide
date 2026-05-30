"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth0";
import { getStoreContent, saveStoreContent, storeContentSchema } from "@/lib/content-store";

function revalidateContentPaths() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
}

export async function updateStoreContent(formData: FormData) {
  await requireAdmin();
  const current = await getStoreContent();
  const sections = [0, 1, 2, 3, 4, 5]
    .map((index) => ({
      title: String(formData.get(`sectionTitle${index}`) || "").trim(),
      copy: String(formData.get(`sectionCopy${index}`) || "").trim(),
    }))
    .filter((section) => section.title || section.copy);

  const parsed = storeContentSchema.parse({
    ...current,
    announcement: formData.get("announcement"),
    heroTitle: formData.get("heroTitle"),
    heroCopy: formData.get("heroCopy"),
    heroPrimaryCtaLabel: formData.get("heroPrimaryCtaLabel"),
    heroPrimaryCtaHref: formData.get("heroPrimaryCtaHref"),
    heroSecondaryCtaLabel: formData.get("heroSecondaryCtaLabel"),
    heroSecondaryCtaHref: formData.get("heroSecondaryCtaHref"),
    sections,
  });

  await saveStoreContent(parsed);
  revalidateContentPaths();
  redirect("/admin/content?saved=content");
}

export async function updateStoreSettings(formData: FormData) {
  await requireAdmin();
  const current = await getStoreContent();

  const parsed = storeContentSchema.parse({
    ...current,
    brandName: formData.get("brandName"),
    logoUrl: formData.get("logoUrl"),
    faviconUrl: formData.get("faviconUrl"),
    primaryColor: formData.get("primaryColor"),
    backgroundColor: formData.get("backgroundColor"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    contactEmail: formData.get("contactEmail"),
    instagramUrl: formData.get("instagramUrl"),
    tiktokUrl: formData.get("tiktokUrl"),
    twitterUrl: formData.get("twitterUrl"),
    freeShippingThresholdCents: formData.get("freeShippingThresholdCents"),
    flatShippingCents: formData.get("flatShippingCents"),
    taxNote: formData.get("taxNote"),
  });

  await saveStoreContent(parsed);
  revalidateContentPaths();
  redirect("/admin/settings?saved=settings");
}

export async function validateStoreContentForTests(input: unknown) {
  return z.promise(z.any()).parse(Promise.resolve(storeContentSchema.parse(input)));
}
