import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
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
      description: "Low-profile cotton cap with electric lime embroidery and metal back clasp.",
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

  const collections = [
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

  console.log("Seeding products...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log("Seeding collections...");
  for (const c of collections) {
    await prisma.collection.create({
      data: c,
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
