"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartDrawer } from "@/components/store/cart-drawer";
import type { Product, Size } from "@/lib/products";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: Size;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  count: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: Size) => void;
  updateQuantity: (productId: string, size: Size, quantity: number) => void;
  removeItem: (productId: string, size: Size) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Persistence: Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("positive_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
    }
  }, []);

  // Persistence: Save to localStorage when items change
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("positive_cart", JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to storage:", error);
      }
    }
  }, [items, isMounted]);

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return {
      items,
      isOpen,
      total,
      count,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (product, size) => {
        if (!product || !size) return;
        setItems((current) => {
          const existing = current.find((item) => item.productId === product.id && item.size === size);
          if (existing) {
            return current.map((item) =>
              item.productId === product.id && item.size === size ? { ...item, quantity: (item.quantity || 0) + 1 } : item
            );
          }

          return [
            ...current,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
              size,
              quantity: 1
            }
          ];
        });
        setIsOpen(true);
      },
      updateQuantity: (productId, size, quantity) => {
        setItems((current) =>
          current
            .map((item) => (item.productId === productId && item.size === size ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (productId, size) => {
        setItems((current) => current.filter((item) => !(item.productId === productId && item.size === size)));
      }
    };
  }, [items, isOpen]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {isMounted && <CartDrawer />}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
