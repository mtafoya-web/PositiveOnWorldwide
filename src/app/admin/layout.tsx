import { redirect } from "next/navigation";
import Link from "next/link";
import { auth0, isAdmin, isAuth0Configured } from "@/lib/auth0";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = isAuth0Configured ? await auth0.getSession() : null;
  
  if (isAuth0Configured && !session) {
    redirect("/api/auth/login");
  }

  const isUserAdmin = await isAdmin();
  
  if (!isUserAdmin) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">Unauthorized</h1>
        <p className="text-gray-400 mb-8">You do not have administrative access to this area.</p>
        <Link href="/" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-lg">Return Home</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full border-b border-gray-800 p-6 flex flex-col gap-6 md:w-64 md:border-b-0 md:border-r md:gap-8">
        <div className="font-black text-xl tracking-tighter italic">ADMIN PANEL</div>
        <nav className="flex flex-wrap gap-4 md:flex-col">
          <Link href="/admin" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Overview</Link>
          <Link href="/admin/analytics" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Analytics</Link>
          <Link href="/admin/content" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Content</Link>
          <Link href="/admin/settings" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Settings</Link>
          <Link href="/admin/catalog" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Catalog</Link>
          <Link href="/admin/products" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Products</Link>
          <Link href="/admin/orders" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs">Orders</Link>
          <Link href="/" className="text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs mt-8">Storefront</Link>
        </nav>
      </aside>
      
      {/* Admin Content */}
      <main className="flex-1 overflow-auto bg-neutral-950">
        {children}
      </main>
    </div>
  );
}
