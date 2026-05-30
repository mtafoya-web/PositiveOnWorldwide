import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isAuth0Configured } from "@/lib/auth0";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (isAuth0Configured && !user) {
    redirect("/api/auth/login?returnTo=/profile");
  }

  if (!isAuth0Configured) {
    return (
      <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white">
        <div className="mx-auto max-w-2xl border border-amber-400/30 bg-amber-400/10 p-10 text-center">
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter">Login Not Configured</h1>
          <p className="mb-8 text-sm font-medium leading-6 text-amber-100">
            Profile is protected by Auth0. Add the Auth0 environment variables to enable account access.
          </p>
          <Link href="/" className="inline-flex bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-black">
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Profile</h1>
          <p className="mt-3 text-sm font-medium text-gray-400">Manage account details and order access.</p>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[0.7fr_1.3fr]">
          <div className="border border-white/10 bg-neutral-950 p-8">
            {user?.picture && (
              <img src={user.picture} alt="" className="mb-6 h-20 w-20 rounded-full object-cover" />
            )}
            <h2 className="text-2xl font-black uppercase tracking-tight">{user?.name || "Positive Member"}</h2>
            <p className="mt-2 text-sm text-gray-400">{user?.email}</p>
          </div>
          <div className="border border-white/10 bg-neutral-950 p-8">
            <h2 className="mb-6 text-xl font-black uppercase tracking-tight">Account Status</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {["Authenticated", "Stripe ready", "Order history enabled"].map((label) => (
                <div key={label} className="border border-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <Link href="/orders" className="bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-black">
                View Orders
              </Link>
              <Link href="/api/auth/logout" className="border border-white/20 px-6 py-3 text-xs font-black uppercase tracking-[0.2em]">
                Logout
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
