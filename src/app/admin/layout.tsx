import { redirect } from "next/navigation";
import { auth0, isAdmin } from "@/lib/auth0";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect("/api/auth/login");
  }

  const isUserAdmin = await isAdmin();
  
  if (!isUserAdmin) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">Unauthorized</h1>
        <p className="text-gray-400 mb-8">You do not have administrative access to this area.</p>
        <a href="/" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-lg">Return Home</a>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-6 flex flex-col gap-8">
        <div className="font-black text-xl tracking-tighter italic">ADMIN PANEL</div>
        <nav className="flex flex-col gap-4">
          <a href="/admin/products" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Products</a>
          <a href="/admin/orders" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Orders</a>
          <a href="/" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs mt-8">Storefront</a>
        </nav>
      </aside>
      
      {/* Admin Content */}
      <main className="flex-1 overflow-auto bg-neutral-950">
        {children}
      </main>
    </div>
  );
}
