import Image from "next/image";
import { Collection } from "@/lib/products";
import { cn } from "@/lib/utils";

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid auto-rows-[280px] gap-6 md:grid-cols-4">{children}</div>;
}

export function BentoGridItem({ item, featured }: { item: Collection; featured?: boolean }) {
  return (
    <article className={cn("group relative overflow-hidden border border-chalk/10 bg-ink", featured && "md:col-span-2 md:row-span-2")}>
      <Image 
        src={item.image} 
        alt={item.title} 
        fill 
        sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"} 
        className="object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-60" 
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-6 text-chalk">
        <h3 className="font-display text-3xl font-black uppercase leading-none tracking-tighter md:text-4xl">{item.title}</h3>
        <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-chalk/60">{item.description}</p>
        <div className="mt-6 inline-flex h-1 w-12 bg-limeflash transition-all duration-500 group-hover:w-full" />
      </div>
    </article>
  );
}
