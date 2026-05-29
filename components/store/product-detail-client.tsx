"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, Instagram, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { useCart } from "@/components/store/cart-provider";
import { brandLinks } from "@/lib/brand";
import type { Product, Size } from "@/lib/products";

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const [size, setSize] = useState<Size>(product?.sizes?.[0]);
  const [image, setImage] = useState(product?.gallery?.[0] || product?.image || "");
  const [isMounted, setIsMounted] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!product) return null;

  if (!isMounted) {
    return (
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-32 md:px-8 lg:px-10 bg-ink text-chalk">
        <div className="h-8 w-32 animate-pulse bg-chalk/10" />
        <section className="mt-8 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="aspect-[4/5] animate-pulse bg-graphite" />
          <div className="space-y-6">
            <div className="h-4 w-24 animate-pulse bg-chalk/10" />
            <div className="h-20 w-full animate-pulse bg-chalk/10" />
            <div className="h-10 w-32 animate-pulse bg-chalk/10" />
            <div className="h-40 w-full animate-pulse bg-chalk/5" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-32 md:px-8 lg:px-10 bg-ink text-chalk">
      <Link href="/#shop" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-chalk/60 hover:text-limeflash transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>
      <section className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="relative aspect-[4/5] overflow-hidden border border-chalk/10 bg-graphite">
            <Image src={image} alt={product.name || "Product"} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          {product.gallery && product.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.gallery.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-label={`View ${product.name} image ${product.gallery.indexOf(item) + 1}`}
                  aria-pressed={image === item}
                  className={`relative aspect-square overflow-hidden border transition-all ${image === item ? "border-limeflash ring-1 ring-limeflash" : "border-chalk/10 opacity-60 hover:opacity-100"}`}
                  onClick={() => setImage(item)}
                >
                  <Image src={item} alt={`${product.name} thumbnail`} fill sizes="15vw" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-limeflash">{product.category}</p>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-none md:text-7xl tracking-tighter text-chalk">{product.name}</h1>
          <p className="mt-6 font-display text-3xl font-black text-chalk">${product.price}</p>
          <p className="mt-8 text-lg leading-relaxed text-chalk/70">{product.description}</p>
          
          <div className="mt-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-chalk/40">Select size</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={`Select ${option} size`}
                  aria-pressed={size === option}
                  className={`h-14 min-w-[56px] border px-4 text-sm font-bold uppercase tracking-widest transition-all ${
                    size === option 
                      ? "bg-limeflash text-ink border-limeflash" 
                      : "border-chalk/10 text-chalk hover:border-chalk/40"
                  }`}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="mt-10 w-full bg-chalk py-5 font-display text-sm font-black uppercase tracking-[0.2em] text-ink transition-all hover:bg-limeflash hover:scale-[1.02] active:scale-100" 
            onClick={() => addItem(product, size)}
          >
            Add to cart
          </button>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="border border-chalk/5 bg-graphite p-6">
              <Truck className="mb-4 h-6 w-6 text-limeflash" />
              <p className="text-xs font-bold uppercase tracking-widest text-chalk">Worldwide shipping</p>
              <p className="mt-2 text-xs text-chalk/40 leading-relaxed uppercase">Tracked fulfillment on every drop.</p>
            </div>
            <div className="border border-chalk/5 bg-graphite p-6">
              <ShieldCheck className="mb-4 h-6 w-6 text-limeflash" />
              <p className="text-xs font-bold uppercase tracking-widest text-chalk">Secure checkout</p>
              <p className="mt-2 text-xs text-chalk/40 leading-relaxed uppercase">Stripe-backed payment flow.</p>
            </div>
          </div>
          
          <Link
            href={brandLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center justify-between border border-chalk/10 p-5 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-chalk/5 text-chalk"
          >
            <span className="inline-flex items-center gap-3">
              <Instagram className="h-5 w-5" />
              Join the movement
            </span>
            <ArrowLeft className="h-4 w-4 rotate-[135deg]" />
          </Link>
        </div>
      </section>
      
      <section className="mt-32">
        <h2 className="mb-12 font-display text-4xl font-black uppercase tracking-tighter text-chalk">Complete the fit</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related?.map((item) => (
            <ProductCard key={item?.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
