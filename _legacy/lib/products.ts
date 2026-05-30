export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  sizes: Size[];
  stock: number;
  image: string;
  gallery: string[];
  active?: boolean;
};

export type Collection = {
  title: string;
  description: string;
  image: string;
  active?: boolean;
};

// Fallback hardcoded products for development/seeding
export const products: Product[] = [
  {
    id: "hoodie-core-black",
    slug: "core-black-hoodie",
    name: "Core Black Hoodie",
    category: "Fleece",
    price: 88,
    description: "Heavyweight brushed fleece with a structured hood and clean tonal mark.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 24,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: "varsity-graphite-jacket",
    slug: "graphite-varsity-jacket",
    name: "Graphite Varsity Jacket",
    category: "Outerwear",
    price: 148,
    description: "Wool-blend varsity jacket with snap closure and contrast positive stitch work.",
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: "worldwide-tee-white",
    slug: "worldwide-white-tee",
    name: "Worldwide White Tee",
    category: "Tees",
    price: 42,
    description: "Dense cotton jersey tee with a relaxed shoulder and crisp screen print.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 40,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: "utility-cargo-pant",
    slug: "utility-cargo-pant",
    name: "Utility Cargo Pant",
    category: "Pants",
    price: 96,
    description: "Relaxed cargo pant with reinforced pocketing and adjustable hem toggles.",
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1506629905607-d9f297d2dbfd?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: "lime-stitch-cap",
    slug: "lime-stitch-cap",
    name: "Lime Stitch Cap",
    category: "Accessories",
    price: 34,
    description: "Low-profile cotton_cap with electric lime embroidery and metal back clasp.",
    sizes: ["S", "M", "L"],
    stock: 33,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: "travel-overshirt",
    slug: "travel-overshirt",
    name: "Travel Overshirt",
    category: "Shirts",
    price: 112,
    description: "Boxy ripstop overshirt with concealed pockets and wrinkle-resistant finish.",
    sizes: ["S", "M", "L", "XL"],
    stock: 16,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=85"
    ]
  }
];

export const collections: Collection[] = [
  {
    title: "Drop One",
    description: "The core uniform: fleece, sharp tees, and structured layers.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Travel Ready",
    description: "Lightweight layers made to move across cities.",
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Night Fits",
    description: "Graphite tones, clean cuts, and elevated texture.",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Essentials",
    description: "Daily pieces with a premium hand feel.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85"
  }
];

export async function getProducts() {
  try {
    const { getPrisma, hasDatabaseUrl } = await import("@/lib/prisma");
    if (!hasDatabaseUrl()) return products;
    
    const dbProducts = await getPrisma().product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });

    return (dbProducts || []) as unknown as Product[];
  } catch (error) {
    console.error("Failed to fetch database products; using static catalog fallback.", error);
    return products;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const { getPrisma, hasDatabaseUrl } = await import("@/lib/prisma");
    if (!hasDatabaseUrl()) return products.find((p) => p.slug === slug);
    
    const product = await getPrisma().product.findUnique({
      where: { slug }
    });

    return product as unknown as Product | null;
  } catch (error) {
    console.error("Failed to fetch database product; using static catalog fallback.", error);
    return products.find((p) => p.slug === slug) ?? null;
  }
}

export async function getProductById(id: string) {
  try {
    const { getPrisma, hasDatabaseUrl } = await import("@/lib/prisma");
    if (!hasDatabaseUrl()) return products.find((p) => p.id === id);
    
    const product = await getPrisma().product.findUnique({
      where: { id }
    });

    return product as unknown as Product | null;
  } catch (error) {
    console.error("Failed to fetch database product by id; using static catalog fallback.", error);
    return products.find((p) => p.id === id) ?? null;
  }
}

export async function getCollections() {
  try {
    const { getPrisma, hasDatabaseUrl } = await import("@/lib/prisma");
    if (!hasDatabaseUrl()) return collections;
    
    const dbCollections = await getPrisma().collection.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });

    return (dbCollections || []) as unknown as Collection[];
  } catch (error) {
    console.error("Failed to fetch database collections; using static catalog fallback.", error);
    return collections;
  }
}
