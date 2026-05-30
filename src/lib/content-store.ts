import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { mockCategories, mockProducts, withProductRelations } from "@/lib/mock-data";

const contentFilePath = path.join(process.cwd(), ".data", "store.json");

export const homeSectionSchema = z.object({
  title: z.string().trim().min(1).max(80),
  copy: z.string().trim().min(1).max(240),
});

export const storeContentSchema = z.object({
  brandName: z.string().trim().min(1).max(80),
  logoUrl: z.string().trim().min(1).max(500),
  faviconUrl: z.string().trim().min(1).max(500),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  announcement: z.string().trim().max(160),
  heroTitle: z.string().trim().min(1).max(120),
  heroCopy: z.string().trim().min(1).max(260),
  heroPrimaryCtaLabel: z.string().trim().min(1).max(40),
  heroPrimaryCtaHref: z.string().trim().min(1).max(120),
  heroSecondaryCtaLabel: z.string().trim().min(1).max(40),
  heroSecondaryCtaHref: z.string().trim().min(1).max(120),
  seoTitle: z.string().trim().min(1).max(80),
  seoDescription: z.string().trim().min(1).max(180),
  contactEmail: z.string().trim().email(),
  instagramUrl: z.string().trim().url().or(z.literal("")),
  tiktokUrl: z.string().trim().url().or(z.literal("")),
  twitterUrl: z.string().trim().url().or(z.literal("")),
  freeShippingThresholdCents: z.coerce.number().int().min(0).max(1000000),
  flatShippingCents: z.coerce.number().int().min(0).max(1000000),
  taxNote: z.string().trim().min(1).max(140),
  sections: z.array(homeSectionSchema).min(1).max(6),
});

export type StoreContent = z.infer<typeof storeContentSchema>;

export const defaultStoreContent: StoreContent = {
  brandName: "Positive On Worldwide",
  logoUrl: "/brand-mark.svg",
  faviconUrl: "/brand-mark.svg",
  primaryColor: "#d9ff4f",
  backgroundColor: "#050505",
  announcement: "Worldwide shipping available on the current drop.",
  heroTitle: "Wear the Energy. Spread the Movement.",
  heroCopy:
    "Premium streetwear built for people who move with purpose, confidence, and positive energy everywhere they go.",
  heroPrimaryCtaLabel: "Shop the Drop",
  heroPrimaryCtaHref: "/shop",
  heroSecondaryCtaLabel: "Explore the Brand",
  heroSecondaryCtaHref: "/about",
  seoTitle: "Positive On Worldwide",
  seoDescription:
    "Premium worldwide streetwear built for positive energy, purpose, and movement.",
  contactEmail: "support@positiveonworldwide.com",
  instagramUrl: "https://instagram.com",
  tiktokUrl: "https://tiktok.com",
  twitterUrl: "https://twitter.com",
  freeShippingThresholdCents: 15000,
  flatShippingCents: 1200,
  taxNote: "Taxes calculated at checkout.",
  sections: [
    {
      title: "Drop Calendar",
      copy: "Seasonal capsules release in focused runs, keeping the catalog intentional.",
    },
    {
      title: "Materials",
      copy: "Heavy cotton, brushed fleece, and durable trims selected for daily wear.",
    },
    {
      title: "Fulfillment",
      copy: "Shipping, returns, privacy, and terms pages are ready for final policy copy.",
    },
  ],
};

type StoreFile = {
  content?: Partial<StoreContent>;
  products?: any[];
  categories?: any[];
  collections?: any[];
};

export const catalogItemSchema = z.object({
  id: z.string().trim().min(1).max(90),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240).optional().default(""),
  image: z.string().trim().url().or(z.literal("")).optional().default(""),
  active: z.boolean().default(true),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export function usesFileContentStore() {
  return env.USE_MOCK_DATA === "true" || !env.DATABASE_URL || process.env.NEXT_PHASE === "phase-production-build";
}

async function readStoreFile(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(contentFilePath, "utf8");
    return JSON.parse(raw) as StoreFile;
  } catch {
    return { content: defaultStoreContent, products: [] };
  }
}

async function writeStoreFile(data: StoreFile) {
  await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
  await fs.writeFile(contentFilePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function getStoreContent(): Promise<StoreContent> {
  if (!usesFileContentStore()) {
    try {
      const record = await (prisma as any).storeContent.findUnique({ where: { key: "site" } });
      if (record?.value) {
        return storeContentSchema.parse({ ...defaultStoreContent, ...(record.value as object) });
      }
    } catch (error) {
      console.error("Falling back to file store content:", error);
    }
  }

  const store = await readStoreFile();
  return storeContentSchema.parse({ ...defaultStoreContent, ...(store.content ?? {}) });
}

export async function saveStoreContent(content: StoreContent) {
  const parsed = storeContentSchema.parse(content);

  if (!usesFileContentStore()) {
    try {
      await (prisma as any).storeContent.upsert({
        where: { key: "site" },
        update: { value: parsed },
        create: { key: "site", value: parsed },
      });
      return parsed;
    } catch (error) {
      console.error("Falling back to file store content save:", error);
    }
  }

  const store = await readStoreFile();
  await writeStoreFile({ ...store, content: parsed });
  return parsed;
}

export async function getFileStoreProducts() {
  const store = await readStoreFile();
  const fileProducts = store.products && store.products.length > 0 ? store.products : [];
  const categories = await getCatalogItems("categories");
  const products = fileProducts.length > 0 ? fileProducts : mockProducts;
  return products.map((product) => {
    const normalized = {
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    };

    return {
      ...withProductRelations(normalized),
      category: categories.find((category) => category.id === normalized.categoryId) ?? null,
    };
  });
}

export async function saveFileStoreProducts(products: any[]) {
  const store = await readStoreFile();
  await writeStoreFile({
    ...store,
    products: products.map(({ category, variants, ...product }) => product),
  });
}

export async function getCatalogItems(kind: "categories" | "collections") {
  if (!usesFileContentStore()) {
    try {
      const records =
        kind === "categories"
          ? await prisma.category.findMany({ orderBy: { name: "asc" } })
          : await prisma.collection.findMany({ orderBy: { name: "asc" } });
      return records;
    } catch (error) {
      console.error(`Falling back to file ${kind}:`, error);
    }
  }

  const store = await readStoreFile();
  const fallback = kind === "categories" ? mockCategories : [];
  const records = store[kind] && store[kind]!.length > 0 ? store[kind]! : fallback;
  return records.map((item) => catalogItemSchema.parse(item));
}

export async function saveCatalogItems(kind: "categories" | "collections", items: any[]) {
  const store = await readStoreFile();
  await writeStoreFile({ ...store, [kind]: items });
}
