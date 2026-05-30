import { requireAdmin, getCurrentUser } from "@/lib/auth0";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/auth/login?returnTo=/admin");
  }

  try {
    await requireAdmin();
  } catch (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="mt-2 text-gray-400">You do not have admin access.</p>
          <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-dark">
      <aside className="w-full md:w-64 border-r border-gray-800 p-6 flex flex-col gap-6">
        <div className="font-bold text-xl tracking-tight">Admin Dashboard</div>
        <nav className="flex flex-col gap-3 text-sm text-gray-300">
          <Link href="/admin" className="hover:text-white">Overview</Link>
          <Link href="/admin/products" className="hover:text-white">Products</Link>
          <Link href="/admin/orders" className="hover:text-white">Orders</Link>
        </nav>
        <div className="mt-auto">
          <a href="/api/auth/logout" className="text-sm text-red-500 hover:underline">
            Logout Admin
          </a>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-auto">
        {children}
      </main>
    </div>
  );
}
