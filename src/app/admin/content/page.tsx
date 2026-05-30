import { SubmitButton } from "@/components/admin/submit-button";
import { getStoreContent } from "@/lib/content-store";
import { updateStoreContent } from "@/server/actions/content";

export default async function AdminContentPage({ searchParams }: { searchParams?: { saved?: string } }) {
  const content = await getStoreContent();
  const sectionSlots = [...content.sections, ...Array.from({ length: 6 - content.sections.length }, () => ({ title: "", copy: "" }))];

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 md:p-12">
      <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter sm:text-4xl">Homepage Content</h1>
          <p className="mt-3 text-sm text-gray-500">Edit announcement, hero copy, CTAs, and homepage sections.</p>
        </div>
        {searchParams?.saved && <div className="border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-200">Saved</div>}
      </header>

      <form action={updateStoreContent} className="space-y-8 border border-gray-800 bg-neutral-900/50 p-4 sm:p-6 md:p-8">
        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Announcement banner</span>
          <input name="announcement" defaultValue={content.announcement} className="min-h-12 w-full border border-gray-800 bg-black px-4 py-3 text-base text-white sm:text-sm" />
        </label>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Hero title</span>
            <input name="heroTitle" required defaultValue={content.heroTitle} className="min-h-12 w-full border border-gray-800 bg-black px-4 py-3 text-base text-white sm:text-sm" />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Hero copy</span>
            <textarea name="heroCopy" required defaultValue={content.heroCopy} className="min-h-24 w-full border border-gray-800 bg-black px-4 py-3 text-base text-white sm:text-sm" />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Primary CTA label</span>
            <input name="heroPrimaryCtaLabel" required defaultValue={content.heroPrimaryCtaLabel} className="min-h-12 w-full border border-gray-800 bg-black px-4 py-3 text-base text-white sm:text-sm" />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Primary CTA URL</span>
            <input name="heroPrimaryCtaHref" required defaultValue={content.heroPrimaryCtaHref} className="min-h-12 w-full border border-gray-800 bg-black px-4 py-3 text-base text-white sm:text-sm" />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Secondary CTA label</span>
            <input name="heroSecondaryCtaLabel" required defaultValue={content.heroSecondaryCtaLabel} className="min-h-12 w-full border border-gray-800 bg-black px-4 py-3 text-base text-white sm:text-sm" />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Secondary CTA URL</span>
            <input name="heroSecondaryCtaHref" required defaultValue={content.heroSecondaryCtaHref} className="min-h-12 w-full border border-gray-800 bg-black px-4 py-3 text-base text-white sm:text-sm" />
          </label>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight">Homepage Sections</h2>
          {sectionSlots.map((section, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 border border-gray-800 bg-black p-4 md:grid-cols-[0.7fr_1.3fr]">
              <input name={`sectionTitle${index}`} placeholder="Section title" defaultValue={section.title} className="min-h-12 border border-gray-800 bg-neutral-950 px-4 py-3 text-base text-white sm:text-sm" />
              <input name={`sectionCopy${index}`} placeholder="Section copy" defaultValue={section.copy} className="min-h-12 border border-gray-800 bg-neutral-950 px-4 py-3 text-base text-white sm:text-sm" />
            </div>
          ))}
        </section>
        <SubmitButton>Save Content</SubmitButton>
      </form>
    </div>
  );
}
