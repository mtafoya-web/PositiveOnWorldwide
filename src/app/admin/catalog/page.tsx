import { SubmitButton } from "@/components/admin/submit-button";
import { getCatalogItems } from "@/lib/content-store";
import { createCatalogItem } from "@/server/actions/catalog";

export default async function AdminCatalogPage({ searchParams }: { searchParams?: { saved?: string } }) {
  const [categories, collections] = await Promise.all([
    getCatalogItems("categories"),
    getCatalogItems("collections"),
  ]);
  const createCategory = createCatalogItem.bind(null, "categories");
  const createCollection = createCatalogItem.bind(null, "collections");

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-8 md:p-12">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Catalog</h1>
          <p className="mt-3 text-sm text-gray-500">Manage categories and collections used by products.</p>
        </div>
        {searchParams?.saved && <div className="border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-200">Saved</div>}
      </header>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CatalogPanel title="Categories" items={categories} action={createCategory} kind="category" />
        <CatalogPanel title="Collections" items={collections} action={createCollection} kind="collection" />
      </section>
    </div>
  );
}

function CatalogPanel({
  title,
  items,
  action,
  kind,
}: {
  title: string;
  items: any[];
  action: (formData: FormData) => void | Promise<void>;
  kind: string;
}) {
  return (
    <div className="border border-gray-800 bg-neutral-900/50 p-6">
      <h2 className="mb-6 text-xl font-black uppercase tracking-tight">{title}</h2>
      <div className="mb-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No {title.toLowerCase()} yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border border-gray-800 bg-black p-4">
              <div>
                <p className="text-sm font-black uppercase">{item.name}</p>
                <p className="text-xs text-gray-500">{item.slug}</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-300">{item.active ? "Active" : "Hidden"}</span>
            </div>
          ))
        )}
      </div>
      <form action={action} className="space-y-4 border-t border-gray-800 pt-6">
        <input type="hidden" name="kind" value={kind} />
        <input name="name" required placeholder={`${kind} name`} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
        <input name="slug" required placeholder={`${kind}-slug`} className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
        <input name="description" placeholder="Description" className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
        <input name="image" placeholder="Optional image URL" className="w-full border border-gray-800 bg-black px-4 py-3 text-sm text-white" />
        <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-300">
          <input name="active" type="checkbox" defaultChecked />
          Active
        </label>
        <SubmitButton>Add {kind}</SubmitButton>
      </form>
    </div>
  );
}
