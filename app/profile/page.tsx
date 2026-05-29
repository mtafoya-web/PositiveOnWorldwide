import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function getInitials(name?: string | null, email?: string | null) {
  const source = name || email || "Account";
  return source
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login?returnTo=/profile");
  }

  const { user } = session;
  const displayName = user.name || user.nickname || "PositiveOnWorldwide member";
  const email = user.email || "No email on file";

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-[var(--font-display)] text-5xl font-black uppercase md:text-7xl">Profile</h1>
      <section className="mt-8 grid gap-6 border border-ink bg-white p-6 md:grid-cols-[auto,1fr] md:items-center">
        <div className="grid h-24 w-24 place-items-center rounded-full border border-ink bg-limeflash font-[var(--font-display)] text-3xl font-black text-ink">
          {getInitials(displayName, user.email)}
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-graphite/60">Signed in</p>
          <h2 className="mt-2 text-3xl font-black">{displayName}</h2>
          <p className="mt-1 text-graphite/70">{email}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/orders" className="border border-ink bg-ink px-4 py-3 text-sm font-black uppercase text-chalk">
              View Orders
            </a>
            <a href="/api/auth/logout" className="border border-ink px-4 py-3 text-sm font-black uppercase">
              Log Out
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
