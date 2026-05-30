import { SubmitButton } from "@/components/admin/submit-button";
import { getStoreContent } from "@/lib/content-store";
import { updateStoreSettings } from "@/server/actions/content";

export default async function AdminSettingsPage({ searchParams }: { searchParams?: { saved?: string } }) {
  const content = await getStoreContent();

  return (
    <div className="mx-auto max-w-5xl p-8 md:p-12">
      <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Store Settings</h1>
          <p className="mt-3 text-sm text-gray-500">Edit branding, theme colors, SEO, contact, social links, shipping, and tax notes.</p>
        </div>
        {searchParams?.saved && <div className="border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-200">Saved</div>}
      </header>

      <form action={updateStoreSettings} className="grid grid-cols-1 gap-5 border border-gray-800 bg-neutral-900/50 p-6 md:grid-cols-2 md:p-8">
        {[
          ["brandName", "Brand name", content.brandName],
          ["logoUrl", "Logo URL", content.logoUrl],
          ["faviconUrl", "Favicon/app icon URL", content.faviconUrl],
          ["seoTitle", "SEO title", content.seoTitle],
          ["seoDescription", "SEO description", content.seoDescription],
          ["contactEmail", "Contact email", content.contactEmail],
          ["instagramUrl", "Instagram URL", content.instagramUrl],
          ["tiktokUrl", "TikTok URL", content.tiktokUrl],
          ["twitterUrl", "Twitter/X URL", content.twitterUrl],
          ["taxNote", "Tax note", content.taxNote],
        ].map(([name, label, value]) => (
          <label key={name} className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">{label}</span>
            <input name={name} required={name !== "instagramUrl" && name !== "tiktokUrl" && name !== "twitterUrl"} defaultValue={value} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
          </label>
        ))}
        <label className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Primary color</span>
          <input name="primaryColor" type="color" defaultValue={content.primaryColor} className="h-12 w-full border border-gray-800 bg-black" />
        </label>
        <label className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Background color</span>
          <input name="backgroundColor" type="color" defaultValue={content.backgroundColor} className="h-12 w-full border border-gray-800 bg-black" />
        </label>
        <label className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Free shipping threshold, cents</span>
          <input name="freeShippingThresholdCents" type="number" min="0" defaultValue={content.freeShippingThresholdCents} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
        </label>
        <label className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Flat shipping, cents</span>
          <input name="flatShippingCents" type="number" min="0" defaultValue={content.flatShippingCents} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
        </label>
        <div className="md:col-span-2">
          <SubmitButton>Save Settings</SubmitButton>
        </div>
      </form>
    </div>
  );
}
