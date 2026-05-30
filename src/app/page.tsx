import Link from "next/link";
import dynamic from "next/dynamic";
import { formatCurrency } from "@/lib/utils";
import { getFeaturedProducts } from "@/lib/storefront-data";
import { getStoreContent } from "@/lib/content-store";
import { ArrowRight, Globe2, Instagram, ShieldCheck, Sparkles, Truck } from "lucide-react";

const Hero3D = dynamic(() => import("@/components/three/hero-3d"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black animate-pulse" />
});

export default async function Home() {
  const [featuredProducts, content] = await Promise.all([
    getFeaturedProducts(3),
    getStoreContent(),
  ]);
  const [heroLead, ...heroRest] = content.heroTitle.split(". ");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <Hero3D />
        
        <div className="relative z-10 max-w-4xl mx-auto pointer-events-none">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 drop-shadow-2xl italic leading-[0.9]">
            {heroLead}<br />
            <span className="text-transparent border-t-white border-b-white py-2" style={{ WebkitTextStroke: '1px white' }}>
              {heroRest.join(". ") || content.brandName}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 mx-auto font-medium tracking-tight px-4">
            {content.heroCopy}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pointer-events-auto">
            <Link 
              href={content.heroPrimaryCtaHref}
              className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-neutral-200 transition-all duration-500 hover:-translate-y-1 shadow-2xl shadow-white/10"
            >
              {content.heroPrimaryCtaLabel}
            </Link>
            <Link 
              href={content.heroSecondaryCtaHref}
              className="px-12 py-5 bg-transparent border border-white/20 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white/5 hover:border-white transition-all duration-500"
            >
              {content.heroSecondaryCtaLabel}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
          <span className="text-[9px] font-black uppercase tracking-[0.5em] -rotate-90 origin-center mb-8">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      <section className="border-y border-white/10 bg-white text-black">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
          {[
            { icon: Globe2, label: "Worldwide shipping", copy: "Built for a global community." },
            { icon: ShieldCheck, label: "Secure checkout", copy: "Stripe-powered payment flow." },
            { icon: Sparkles, label: "Limited drops", copy: "Focused capsules with premium materials." },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <item.icon className="h-6 w-6 flex-shrink-0" />
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.22em]">{item.label}</h2>
                <p className="text-sm font-medium text-black/60">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-4 container mx-auto">
        <div className="flex justify-between items-end mb-20">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 block mb-4">Latest Drop</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Featured Items</h2>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:gap-4 transition-all duration-500 group">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredProducts.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group relative">
              <div className="aspect-[4/5] bg-neutral-950 rounded-[2rem] overflow-hidden mb-8 border border-gray-900 group-hover:border-white transition-colors duration-700">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl font-black uppercase tracking-tight italic">{p.name}</h3>
                  <span className="font-bold text-gray-500 italic">{formatCurrency(p.priceCents, p.currency)}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">{p.description.slice(0, 40)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Statement / About Mini */}
      <section className="py-40 bg-neutral-950 border-y border-gray-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 italic leading-tight">
            {content.brandName} is more than clothing. It is a mindset: stay positive, move with purpose.
          </h2>
          <Link 
            href="/about" 
            className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] border-b-2 border-white pb-2 hover:gap-8 transition-all duration-500"
          >
            Read Our Story <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Instagram / Social CTA */}
      <section className="py-32 container mx-auto px-4">
        <div className="bg-white text-black rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none italic">
              Join the movement @positiveonworldwide
            </h2>
            <p className="text-black/60 font-bold uppercase tracking-widest text-xs">
              Tag us in your fits to be featured on our global gallery.
            </p>
          </div>
          <a 
            href={content.instagramUrl || "https://instagram.com"}
            target="_blank"
            className="flex-shrink-0 w-24 h-24 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-500"
          >
            <Instagram className="w-8 h-8" />
          </a>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {content.sections.map(({ title, copy }) => (
            <div key={title} className="border border-white/10 bg-neutral-950 p-8">
              <Truck className="mb-8 h-6 w-6 text-lime-300" />
              <h3 className="mb-4 text-xl font-black uppercase tracking-tight">{title}</h3>
              <p className="text-sm leading-6 text-gray-400">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-900 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24 mb-20">
          <div className="md:col-span-2">
            <div className="font-black text-3xl tracking-tighter uppercase italic mb-8">{content.brandName}</div>
            <p className="text-gray-500 max-w-sm font-medium tracking-tight text-sm">
              Premium streetwear for the purpose-driven individual. Designed to carry energy across borders.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8">Navigation</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8">Legal</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">
          <p>Copyright 2026 {content.brandName}. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href={content.instagramUrl || "#"} className="hover:text-white transition-colors">Instagram</a>
            <a href={content.twitterUrl || "#"} className="hover:text-white transition-colors">Twitter</a>
            <a href={content.tiktokUrl || "#"} className="hover:text-white transition-colors">TikTok</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
