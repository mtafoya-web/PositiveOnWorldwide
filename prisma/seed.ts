import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Create Categories
  const teeCategory = await prisma.category.upsert({
    where: { slug: "tees" },
    update: {},
    create: {
      name: "T-Shirts",
      slug: "tees",
      description: "Essential heavy cotton tees.",
    },
  });

  const fleeceCategory = await prisma.category.upsert({
    where: { slug: "fleece" },
    update: {},
    create: {
      name: "Fleece",
      slug: "fleece",
      description: "Heavyweight hoodies and crewnecks.",
    },
  });

  // Create Collections
  const essentialsCollection = await prisma.collection.upsert({
    where: { slug: "essentials" },
    update: {},
    create: {
      name: "Essentials",
      slug: "essentials",
      description: "Daily pieces with a premium hand feel.",
    },
  });

  // Create Products
  const hoodie = await prisma.product.upsert({
    where: { slug: "core-black-hoodie" },
    update: {},
    create: {
      name: "Core Black Hoodie",
      slug: "core-black-hoodie",
      description: "Heavyweight brushed fleece with a structured hood and clean tonal mark.",
      priceCents: 8800,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=85"
      ],
      active: true,
      featured: true,
      categoryId: fleeceCategory.id,
      collectionId: essentialsCollection.id,
      sizes: ["S", "M", "L", "XL", "XXL"],
      stock: 24,
    },
  });

  // Create Variants for the hoodie
  const sizes = ["S", "M", "L", "XL", "XXL"];
  for (const size of sizes) {
    await prisma.productVariant.upsert({
      where: {
        productId_size: {
          productId: hoodie.id,
          size: size,
        },
      },
      update: {},
      create: {
        productId: hoodie.id,
        size: size,
        stock: 5,
      },
    });
  }

  const tee = await prisma.product.upsert({
    where: { slug: "worldwide-white-tee" },
    update: {},
    create: {
      name: "Worldwide White Tee",
      slug: "worldwide-white-tee",
      description: "Dense cotton jersey tee with a relaxed shoulder and crisp screen print.",
      priceCents: 4200,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85"
      ],
      active: true,
      featured: true,
      categoryId: teeCategory.id,
      collectionId: essentialsCollection.id,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      stock: 40,
    },
  });

  // Create Variants for the tee
  const teeSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  for (const size of teeSizes) {
    await prisma.productVariant.upsert({
      where: {
        productId_size: {
          productId: tee.id,
          size: size,
        },
      },
      update: {},
      create: {
        productId: tee.id,
        size: size,
        stock: 10,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
