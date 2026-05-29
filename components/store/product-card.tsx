"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Instagram } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { brandLinks, Product, Size } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const [size, setSize] = useState<Size>(product.sizes[0]);
  const { addItem } = useCart();

  return (
    <article className="group border border-ink bg-chalk">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-fog">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-graphite/60">{product.category}</p>
            <h3 className="mt-1 font-[var(--font-display)] text-2xl font-black uppercase leading-none">{product.name}</h3>
          </div>
          <p className="font-black">${product.price}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              aria-label={`Select ${option} size for ${product.name}`}
              aria-pressed={size === option}
              className={`h-9 min-w-9 border px-2 text-xs font-black ${size === option ? "border-ink bg-ink text-chalk" : "border-ink/30 bg-white"}`}
              onClick={() => setSize(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            className="h-11 bg-ink text-sm font-black uppercase text-chalk"
            onClick={() => addItem(product, size)}
            aria-label={`Add ${product.name} in size ${size} to cart`}
          >
            Add to cart
          </button>
          <Link href={`/product/${product.slug}`} className="grid h-11 w-11 place-items-center border border-ink" aria-label={`View ${product.name} details`}>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Link
          href={brandLinks.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase text-graphite/70 transition hover:text-ink"
        >
          <Instagram className="h-4 w-4" />
          Follow the drop
        </Link>
      </div>
    </article>
  );
}
