import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  await prisma.product.upsert({
    where: { slug: "classic-tee" },
    update: {},
    create: {
      name: "Classic Positive Tee",
      slug: "classic-tee",
      category: "T-Shirts",
      priceCents: 3500,
      description: "The classic Positive On Worldwide tee.",
      sizes: ["S", "M", "L", "XL"],
      stock: 100,
      image: "https://via.placeholder.com/600",
      active: true,
      featured: true
    }
  });

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