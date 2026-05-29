"use client";

import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("@/components/store/hero-3d").then((mod) => mod.Hero3D), {
  ssr: false,
  loading: () => (
    <section className="relative flex h-[70vh] w-full items-center justify-center bg-ink">
      <div className="text-center">
        <h1 className="font-display text-6xl font-black uppercase tracking-tighter text-chalk md:text-8xl">
          POSITIVE
          <br />
          <span className="text-chalk/60">ON WORLDWIDE</span>
        </h1>
      </div>
    </section>
  )
});

export function Hero3DLoader() {
  return <Hero3D />;
}
