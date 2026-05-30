export const MOCK_DATA_NOTICE =
  "Mock ecommerce data. Replace with durable database-backed records before production launch.";

export const mockCategories = [
  {
    id: "cat-fleece",
    slug: "fleece",
    name: "Fleece",
    description: "Heavyweight hoodies and crews.",
    image: null,
    active: true,
    createdAt: new Date("2026-01-08T10:00:00Z"),
    updatedAt: new Date("2026-01-08T10:00:00Z"),
  },
  {
    id: "cat-tees",
    slug: "tees",
    name: "Tees",
    description: "Structured cotton essentials.",
    image: null,
    active: true,
    createdAt: new Date("2026-01-08T10:00:00Z"),
    updatedAt: new Date("2026-01-08T10:00:00Z"),
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Daily carry brand pieces.",
    image: null,
    active: true,
    createdAt: new Date("2026-01-08T10:00:00Z"),
    updatedAt: new Date("2026-01-08T10:00:00Z"),
  },
];

export const mockProducts = [
  {
    id: "prod-core-black-hoodie",
    slug: "core-black-hoodie",
    name: "Core Black Hoodie",
    description:
      "Heavyweight brushed fleece with a structured hood, relaxed body, and tonal Positive On Worldwide mark.",
    priceCents: 8800,
    currency: "USD",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85",
    ],
    active: true,
    featured: true,
    categoryId: "cat-fleece",
    collectionId: "col-worldwide",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 24,
    createdAt: new Date("2026-01-12T10:00:00Z"),
    updatedAt: new Date("2026-01-12T10:00:00Z"),
  },
  {
    id: "prod-worldwide-white-tee",
    slug: "worldwide-white-tee",
    name: "Worldwide White Tee",
    description:
      "Dense cotton jersey tee with a relaxed shoulder, crisp screen print, and all-day structure.",
    priceCents: 4200,
    currency: "USD",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=85",
    ],
    active: true,
    featured: true,
    categoryId: "cat-tees",
    collectionId: "col-worldwide",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: 40,
    createdAt: new Date("2026-01-14T10:00:00Z"),
    updatedAt: new Date("2026-01-14T10:00:00Z"),
  },
  {
    id: "prod-motion-overshirt",
    slug: "motion-overshirt",
    name: "Motion Overshirt",
    description:
      "A clean layered overshirt with utility pockets, matte snaps, and an easy worldwide fit.",
    priceCents: 11200,
    currency: "USD",
    image:
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    ],
    active: true,
    featured: true,
    categoryId: "cat-fleece",
    collectionId: "col-worldwide",
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    createdAt: new Date("2026-01-16T10:00:00Z"),
    updatedAt: new Date("2026-01-16T10:00:00Z"),
  },
  {
    id: "prod-positive-cap",
    slug: "positive-cap",
    name: "Positive Cap",
    description:
      "Low-profile six-panel cap with embroidered brand mark and adjustable metal closure.",
    priceCents: 3600,
    currency: "USD",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85",
    ],
    active: true,
    featured: false,
    categoryId: "cat-accessories",
    collectionId: "col-worldwide",
    sizes: ["OS"],
    stock: 55,
    createdAt: new Date("2026-01-18T10:00:00Z"),
    updatedAt: new Date("2026-01-18T10:00:00Z"),
  },
];

export const mockVariants = mockProducts.flatMap((product) =>
  product.sizes.map((size, index) => ({
    id: `${product.id}-${size}`,
    productId: product.id,
    size,
    stock: Math.max(2, Math.floor(product.stock / product.sizes.length) - index),
    sku: `${product.slug}-${size}`.toUpperCase(),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  })),
);

export const mockOrders = [
  {
    id: "order-1001",
    orderNumber: 1001,
    stripeCheckoutSessionId: "cs_mock_1001",
    stripePaymentIntentId: "pi_mock_1001",
    customerEmail: "maya@example.com",
    userId: null,
    user: null,
    totalCents: 13000,
    subtotalCents: 13000,
    taxCents: 0,
    shippingCents: 0,
    currency: "USD",
    status: "paid",
    items: [],
    shippingAddress: null,
    createdAt: new Date("2026-05-22T13:00:00Z"),
    updatedAt: new Date("2026-05-22T13:00:00Z"),
    orderItems: [
      {
        id: "item-1001-a",
        orderId: "order-1001",
        productId: "prod-core-black-hoodie",
        product: mockProducts[0],
        quantity: 1,
        size: "L",
        priceCents: 8800,
        createdAt: new Date("2026-05-22T13:00:00Z"),
      },
      {
        id: "item-1001-b",
        orderId: "order-1001",
        productId: "prod-worldwide-white-tee",
        product: mockProducts[1],
        quantity: 1,
        size: "M",
        priceCents: 4200,
        createdAt: new Date("2026-05-22T13:00:00Z"),
      },
    ],
  },
  {
    id: "order-1002",
    orderNumber: 1002,
    stripeCheckoutSessionId: "cs_mock_1002",
    stripePaymentIntentId: "pi_mock_1002",
    customerEmail: "alex@example.com",
    userId: null,
    user: null,
    totalCents: 11200,
    subtotalCents: 11200,
    taxCents: 0,
    shippingCents: 0,
    currency: "USD",
    status: "processing",
    items: [],
    shippingAddress: null,
    createdAt: new Date("2026-05-24T16:30:00Z"),
    updatedAt: new Date("2026-05-24T16:30:00Z"),
    orderItems: [
      {
        id: "item-1002-a",
        orderId: "order-1002",
        productId: "prod-motion-overshirt",
        product: mockProducts[2],
        quantity: 1,
        size: "M",
        priceCents: 11200,
        createdAt: new Date("2026-05-24T16:30:00Z"),
      },
    ],
  },
];

export function withProductRelations(product: (typeof mockProducts)[number]) {
  return {
    ...product,
    category: mockCategories.find((category) => category.id === product.categoryId) ?? null,
    variants: mockVariants.filter((variant) => variant.productId === product.id),
  };
}

function matchesWhere<T extends Record<string, any>>(item: T, where?: Record<string, any>) {
  if (!where) return true;
  return Object.entries(where).every(([key, value]) => {
    if (value && typeof value === "object" && "in" in value) {
      return value.in.includes(item[key]);
    }

    return item[key] === value;
  });
}

function orderByCreatedAt<T extends { createdAt: Date }>(items: T[], direction?: "asc" | "desc") {
  if (!direction) return items;
  return [...items].sort((a, b) =>
    direction === "asc"
      ? a.createdAt.getTime() - b.createdAt.getTime()
      : b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export const mockPrisma = {
  product: {
    async findMany(args: any = {}) {
      let products = mockProducts.filter((product) => matchesWhere(product, args.where));
      products = orderByCreatedAt(products, args.orderBy?.createdAt);
      if (typeof args.take === "number") products = products.slice(0, args.take);
      return args.include ? products.map(withProductRelations) : products;
    },
    async findUnique(args: any) {
      const product = mockProducts.find(
        (item) => item.slug === args.where?.slug || item.id === args.where?.id,
      );
      if (!product) return null;
      return args.include ? withProductRelations(product) : product;
    },
    async count() {
      return mockProducts.length;
    },
  },
  order: {
    async findMany(args: any = {}) {
      return orderByCreatedAt(mockOrders, args.orderBy?.createdAt);
    },
    async count() {
      return mockOrders.length;
    },
    async create() {
      throw new Error("Mock order persistence is read-only. Configure DATABASE_URL for production writes.");
    },
  },
  productVariant: {
    async update() {
      throw new Error("Mock inventory persistence is read-only. Configure DATABASE_URL for production writes.");
    },
  },
  stripeEvent: {
    async findUnique() {
      return null;
    },
    async create(args: any) {
      return { id: "mock-stripe-event", ...args.data, processed: false, createdAt: new Date() };
    },
    async update(args: any) {
      return { id: "mock-stripe-event", ...args.data };
    },
  },
};
