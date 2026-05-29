import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { ProfileClient } from "@/components/store/profile-client";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/api/auth/login?returnTo=/profile");
  }

  return <ProfileClient user={session.user} />;
}
