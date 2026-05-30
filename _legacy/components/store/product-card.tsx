"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import type { Product, Size } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const [size, setSize] = useState<Size>(product?.sizes?.[0]);
  const [isMounted, setIsMounted] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!product) return null;

  if (!isMounted) {
    return (
      <article className="group border border-chalk/10 bg-graphite transition-all">
        <div className="relative aspect-[4/5] animate-pulse bg-ink" />
        <div className="p-6 space-y-4">
          <div className="h-4 w-24 animate-pulse bg-chalk/10" />
          <div className="h-8 w-48 animate-pulse bg-chalk/10" />
          <div className="h-6 w-16 animate-pulse bg-chalk/10" />
        </div>
      </article>
    );
  }

  return (
    <article className="group border border-chalk/10 bg-graphite transition-all hover:border-limeflash/30">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-ink">
        <Image 
          src={product.image || ""} 
          alt={product.name || "Product"} 
          fill 
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" 
          className="object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-limeflash">{product.category}</p>
            <h3 className="mt-2 font-display text-2xl font-black uppercase leading-none tracking-tight text-chalk">{product.name}</h3>
          </div>
          <p className="font-display text-xl font-black text-chalk">${product.price}</p>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-2">
          {product.sizes?.map((option) => (
            <button
              key={option}
              type="button"
              aria-label={`Select ${option} size for ${product.name}`}
              aria-pressed={size === option}
              className={`h-8 min-w-[32px] px-2 text-[10px] font-bold uppercase tracking-tighter transition-all ${
                size === option 
                  ? "bg-limeflash text-ink" 
                  : "border border-chalk/20 text-chalk/60 hover:border-chalk/40"
              }`}
              onClick={() => setSize(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
          <button
            type="button"
            className="h-12 bg-chalk text-xs font-bold uppercase tracking-widest text-ink transition-all hover:bg-limeflash"
            onClick={() => addItem(product, size)}
            aria-label={`Add ${product.name} in size ${size} to cart`}
          >
            Add to cart
          </button>
          <Link 
            href={`/product/${product.slug}`} 
            className="flex h-12 w-12 items-center justify-center border border-chalk/20 text-chalk transition-all hover:border-limeflash hover:text-limeflash" 
            aria-label={`View ${product.name} details`}
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
