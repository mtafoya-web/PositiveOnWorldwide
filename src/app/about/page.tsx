import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
          About Positive On Worldwide
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
          Positive On Worldwide is more than clothing. It is a mindset — stay positive, move with purpose, and make your presence felt wherever you are. Every piece is designed to carry that energy into the world.
        </p>
        <Link href="/shop" className="inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors">
          Explore the Collection
        </Link>
      </div>
    </main>
  );
}
