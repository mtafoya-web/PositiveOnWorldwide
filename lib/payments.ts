import type Stripe from "stripe";
import type { Size } from "@/lib/products";
import { getProductById } from "@/lib/products";

export type CheckoutLineItem = {
  productId: string;
  size: Size;
  quantity: number;
};

export type CheckoutPayload = {
  customerEmail?: string;
  items: CheckoutLineItem[];
};

export const supportedPaymentMethods = ["card", "klarna", "afterpay_clearpay"] as const;

export type SupportedPaymentMethod = (typeof supportedPaymentMethods)[number];

const supportedPaymentMethodSet = new Set<string>(supportedPaymentMethods);
const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const satisfies readonly Size[];
const sizeSet = new Set<string>(sizes);

export function normalizeCheckoutPayload(payload: unknown): CheckoutPayload {
  if (!isRecord(payload)) {
    throw new Error("Invalid checkout payload.");
  }

  const input = payload;
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("Checkout requires at least one line item.");
  }

  return {
    customerEmail: normalizeEmail(input.customerEmail),
    items: input.items.map((item) => {
      if (!isRecord(item)) {
        throw new Error("Invalid checkout line item.");
      }

      const productId = typeof item.productId === "string" ? item.productId : "";
      const size = typeof item.size === "string" && sizeSet.has(item.size) ? (item.size as Size) : undefined;
      const quantity = typeof item.quantity === "number" ? item.quantity : Number.NaN;
      if (!productId || !size || !Number.isFinite(quantity)) {
        throw new Error("Invalid checkout line item.");
      }

      const product = getProductById(productId);
      if (!product || !product.sizes.includes(size) || quantity < 1) {
        throw new Error("Checkout line item is unavailable.");
      }

      return {
        productId,
        size,
        quantity: Math.min(Math.floor(quantity), 10)
      };
    })
  };
}

export function getConfiguredPaymentMethods(): SupportedPaymentMethod[] {
  const configured = process.env.STRIPE_CHECKOUT_PAYMENT_METHODS?.split(",")
    .map((method) => method.trim())
    .filter(Boolean);

  if (!configured?.length) {
    return [...supportedPaymentMethods];
  }

  const invalid = configured.filter((method) => !supportedPaymentMethodSet.has(method));
  if (invalid.length > 0) {
    throw new Error(`Unsupported Stripe payment method: ${invalid.join(", ")}.`);
  }

  return configured as SupportedPaymentMethod[];
}

export function toStripeLineItems(items: CheckoutLineItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return items.map((item) => {
    const product = getProductById(item.productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    return {
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: `${product.name} / ${item.size}`,
          description: product.description,
          images: [product.image],
          metadata: {
            productId: product.id,
            size: item.size
          }
        }
      }
    };
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const email = value.trim();
  if (!email) {
    return undefined;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Customer email is invalid.");
  }

  return email;
}
