import Link from "next/link";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("@/components/three/hero-3d"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col relative bg-brand-dark overflow-hidden">
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 z-10">
        <Hero3D />
        
        <div className="relative z-20 pointer-events-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 uppercase text-white drop-shadow-lg">
            Wear the Energy. <br/> Spread the Movement.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 mx-auto drop-shadow-md">
            Positive On Worldwide is built for people who move with purpose, confidence, and positive energy everywhere they go.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/shop" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-xl">
              Shop the Drop
            </Link>
            <Link href="/about" className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
              Explore the Brand
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
