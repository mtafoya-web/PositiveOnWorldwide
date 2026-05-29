import { getAuthSetupMessage } from "@/lib/auth";

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-[var(--font-display)] text-5xl font-black uppercase md:text-7xl">Profile</h1>
      <div className="mt-8 border border-ink bg-white p-6">
        <p className="font-bold">Protected account surface</p>
        <p className="mt-3 text-graphite/70">{getAuthSetupMessage()}</p>
      </div>
    </main>
  );
}
