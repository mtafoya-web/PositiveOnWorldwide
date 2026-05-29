import Image from "next/image";
import { Collection } from "@/lib/products";
import { cn } from "@/lib/utils";

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid auto-rows-[260px] gap-5 md:grid-cols-4">{children}</div>;
}

export function BentoGridItem({ item, featured }: { item: Collection; featured?: boolean }) {
  return (
    <article className={cn("group relative overflow-hidden border border-ink bg-white", featured && "md:col-span-2 md:row-span-2")}>
      <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-5 text-chalk">
        <h3 className="font-[var(--font-display)] text-3xl font-black uppercase leading-none">{item.title}</h3>
        <p className="mt-2 max-w-sm text-sm text-chalk/75">{item.description}</p>
      </div>
    </article>
  );
}
