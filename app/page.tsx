import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Sparkles, Globe, Zap, Shield } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/magicui/bento-grid";
import { ProductCard } from "@/components/store/product-card";
import { Hero3DLoader } from "@/components/store/hero-3d-loader";
import { brandLinks } from "@/lib/brand";
import { getCollections, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const productsList = (await getProducts()) || [];
  const collectionsList = (await getCollections()) || [];
  const featured = Array.isArray(productsList) ? productsList.slice(0, 6) : [];

  return (
    <div className="bg-ink text-chalk">
      {/* 3D Hero Section */}
      <Hero3DLoader />

      {/* Brand Ethos / About Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-black uppercase leading-none md:text-7xl lg:text-8xl">
                More Than <br />
                <span className="text-limeflash">A Brand.</span>
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-chalk/80 md:text-xl">
                Positive On Worldwide represents a mindset: stay positive, move with purpose, and make your presence felt wherever you are. Every piece is designed to carry that energy into the world.
              </p>
              <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3">
                <div className="flex flex-col gap-3">
                  <Globe className="h-8 w-8 text-limeflash" />
                  <span className="text-sm font-bold uppercase tracking-wider">Global Movement</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Zap className="h-8 w-8 text-limeflash" />
                  <span className="text-sm font-bold uppercase tracking-wider">High Energy</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Shield className="h-8 w-8 text-limeflash" />
                  <span className="text-sm font-bold uppercase tracking-wider">Premium Quality</span>
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden border border-chalk/10">
              <Image 
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85" 
                alt="Brand movement" 
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:px-10">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-4xl font-black uppercase md:text-6xl">Collections</h2>
            <p className="mt-4 max-w-2xl text-chalk/60 text-sm uppercase tracking-widest">Bento-built edits for the global community.</p>
          </div>
          <Link href="#shop" className="group flex items-center gap-2 font-bold uppercase tracking-wider text-limeflash">
            View All Drops <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <BentoGrid>
          {collectionsList?.map((item, index) => (
            <BentoGridItem key={item?.title || index} item={item} featured={index === 0} />
          ))}
        </BentoGrid>
      </section>

      {/* Featured Products / Shop Section */}
      <section id="shop" className="bg-graphite py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-display text-5xl font-black uppercase md:text-7xl">Latest Drops</h2>
            <p className="mx-auto mt-4 max-w-2xl text-chalk/60 text-sm uppercase tracking-[0.2em]">Limited pieces. Endless energy.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
          <div className="mt-20 flex justify-center">
             <Link
                href={brandLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center border border-chalk/20 px-10 text-sm font-bold uppercase tracking-[0.2em] transition hover:bg-chalk hover:text-ink"
              >
                <Instagram className="mr-3 h-5 w-5" />
                Join the Movement on Instagram
              </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter / Community Section */}
      <section className="border-t border-chalk/5 py-24 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <Sparkles className="mx-auto mb-8 h-12 w-12 text-limeflash" />
          <h2 className="font-display text-4xl font-black uppercase md:text-6xl">Stay Positive.</h2>
          <p className="mt-6 text-chalk/70 md:text-lg">
            Be the first to know about new drops, community events, and global movements.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="h-14 flex-1 border border-chalk/10 bg-graphite px-6 text-sm font-bold uppercase tracking-wider outline-none focus:border-limeflash"
            />
            <button 
              aria-label="Subscribe to newsletter"
              className="h-14 bg-limeflash px-10 text-sm font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
