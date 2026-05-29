"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Instagram, ShieldCheck, Truck } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ProductCard } from "@/components/store/product-card";
import { useCart } from "@/components/store/cart-provider";
import { brandLinks, Product, Size } from "@/lib/products";

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const [size, setSize] = useState<Size>(product.sizes[0]);
  const [image, setImage] = useState(product.gallery[0]);
  const { addItem } = useCart();

  return (
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-28 md:px-8 lg:px-10">
      <Link href="/#shop" className="mb-8 inline-flex items-center gap-2 text-sm font-black uppercase">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden border border-ink bg-white">
            <Image src={image} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.gallery.map((item) => (
              <button
                key={item}
                type="button"
                aria-label={`View ${product.name} image ${product.gallery.indexOf(item) + 1}`}
                aria-pressed={image === item}
                className={`relative aspect-square overflow-hidden border ${image === item ? "border-ink ring-2 ring-ink ring-offset-2" : "border-ink/40"}`}
                onClick={() => setImage(item)}
              >
                <Image src={item} alt={`${product.name} thumbnail`} fill sizes="25vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-black uppercase text-graphite/60">{product.category}</p>
          <h1 className="mt-2 font-[var(--font-display)] text-5xl font-black uppercase leading-none md:text-7xl">{product.name}</h1>
          <p className="mt-5 text-3xl font-black">${product.price}</p>
          <p className="mt-5 max-w-xl text-lg leading-8 text-graphite/75">{product.description}</p>
          <div className="mt-8">
            <p className="mb-3 text-sm font-black uppercase">Select size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={`Select ${option} size`}
                  aria-pressed={size === option}
                  className={`h-12 min-w-12 border px-3 text-sm font-black ${size === option ? "border-ink bg-ink text-chalk" : "border-ink bg-white"}`}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <ShimmerButton className="mt-8 w-full" onClick={() => addItem(product, size)}>
            Add to cart
          </ShimmerButton>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="border border-ink/20 bg-white p-4">
              <Truck className="mb-4 h-5 w-5" />
              <p className="font-bold">Worldwide shipping</p>
              <p className="text-sm text-graphite/65">Tracked fulfillment on every order.</p>
            </div>
            <div className="border border-ink/20 bg-white p-4">
              <ShieldCheck className="mb-4 h-5 w-5" />
              <p className="font-bold">Secure checkout</p>
              <p className="text-sm text-graphite/65">Stripe-backed payment flow.</p>
            </div>
          </div>
          <Link
            href={brandLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-between border border-ink bg-limeflash p-4 font-black uppercase transition hover:bg-ink hover:text-chalk"
          >
            <span className="inline-flex items-center gap-3">
              <Instagram className="h-5 w-5" />
              Follow PositiveOnWorldwide
            </span>
            <ArrowLeft className="h-4 w-4 rotate-[135deg]" />
          </Link>
        </div>
      </section>
      <section className="mt-20">
        <h2 className="mb-8 font-[var(--font-display)] text-4xl font-black uppercase">Complete the fit</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
