import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { auth0 } from "@/lib/auth0";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();
  
  if (!session || !session.user || !isAdmin(session.user.email)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-ink pt-24 text-chalk">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <header className="mb-10 border-b border-chalk/10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-black uppercase">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-chalk/40 uppercase tracking-widest">Inventory Management</p>
            </div>
            <div className="flex gap-4">
              <a 
                href="/admin/products/new" 
                className="bg-limeflash px-6 py-2 text-sm font-bold uppercase text-ink transition hover:scale-105"
              >
                New Product
              </a>
            </div>
          </div>
          <nav className="mt-8 flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-chalk/40">
            <a href="/admin" className="hover:text-limeflash">Products</a>
            <a href="/admin/orders" className="hover:text-chalk/60 cursor-not-allowed">Orders (Soon)</a>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
