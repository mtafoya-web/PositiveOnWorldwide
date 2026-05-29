import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Instagram, Sparkles } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/magicui/bento-grid";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ProductCard } from "@/components/store/product-card";
import { brandLinks, collections, products } from "@/lib/products";

export default function HomePage() {
  const featured = products.slice(0, 6);

  return (
    <main>
      <section className="relative isolate min-h-[92vh] overflow-hidden border-b border-ink/10 bg-chalk">
        <InteractiveGridPattern />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:px-10">
          <div className="relative z-10 flex flex-col justify-center">
            <h1 className="max-w-4xl font-[var(--font-display)] text-6xl font-black uppercase leading-[0.86] tracking-normal text-ink md:text-8xl lg:text-[8.5rem]">
              Positive On Worldwide
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-graphite/80 md:text-xl">
              Premium streetwear, movement-ready essentials, and limited drops built for everyday confidence.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ShimmerButton asChild>
                <Link href="#shop">
                  Shop the drop <ArrowRight className="h-4 w-4" />
                </Link>
              </ShimmerButton>
              <Link
                href="#collections"
                className="inline-flex h-12 items-center justify-center rounded-none border border-ink px-6 text-sm font-bold uppercase tracking-normal transition hover:bg-ink hover:text-chalk"
              >
                View collections
              </Link>
              <Link
                href={brandLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-none border border-ink px-6 text-sm font-bold uppercase tracking-normal transition hover:bg-ink hover:text-chalk"
              >
                <Instagram className="mr-2 h-4 w-4" />
                Follow Instagram
              </Link>
            </div>
          </div>
          <div className="relative z-10 min-h-[520px]">
            <div className="absolute left-1/2 top-6 h-[520px] w-[74%] -translate-x-1/2 rotate-2 overflow-hidden border border-ink bg-white shadow-lift">
              <Image
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85"
                alt="Model wearing PositiveOnWorldwide streetwear"
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-12 left-0 w-56 border border-ink bg-limeflash p-5 shadow-lift animate-float">
              <Sparkles className="mb-8 h-7 w-7" />
              <p className="font-[var(--font-display)] text-2xl font-black uppercase leading-none">
                Limited seasonal stock
              </p>
            </div>
            <div className="absolute right-0 top-32 w-44 border border-ink bg-ink p-4 text-chalk shadow-lift">
              <p className="text-xs font-bold uppercase">Worldwide shipping</p>
              <p className="mt-2 text-sm text-chalk/70">Fast fulfillment for every drop.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h2 className="font-[var(--font-display)] text-4xl font-black uppercase md:text-6xl">Collections</h2>
            <p className="mt-3 max-w-2xl text-graphite/70">Bento-built edits for travel days, late nights, and clean everyday fits.</p>
          </div>
        </div>
        <BentoGrid>
          {collections.map((item, index) => (
            <BentoGridItem key={item.title} item={item} featured={index === 0} />
          ))}
        </BentoGrid>
      </section>

      <section id="shop" className="border-y border-ink/10 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="font-[var(--font-display)] text-4xl font-black uppercase md:text-6xl">Latest Apparel</h2>
              <p className="mt-3 max-w-2xl text-graphite/70">Structured outerwear, heavyweight fleece, and elevated essentials.</p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Link href="/checkout" className="text-sm font-black uppercase underline underline-offset-8">
                Checkout cart
              </Link>
              <Link
                href={brandLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black uppercase underline underline-offset-8"
              >
                <Instagram className="h-4 w-4" />
                Instagram drops
              </Link>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
