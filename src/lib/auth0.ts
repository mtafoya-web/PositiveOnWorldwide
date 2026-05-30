import { initAuth0 } from "@auth0/nextjs-auth0";
import { env } from "./env";

export const isAuth0Configured = Boolean(
  env.AUTH0_SECRET &&
    env.AUTH0_BASE_URL &&
    env.AUTH0_ISSUER_BASE_URL &&
    env.AUTH0_CLIENT_ID &&
    env.AUTH0_CLIENT_SECRET,
);

const baseURL = env.AUTH0_BASE_URL || env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const auth0 = initAuth0({
  secret:
    env.AUTH0_SECRET ||
    "0000000000000000000000000000000000000000000000000000000000000000",
  baseURL,
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL || "https://example.auth0.com",
  clientID: env.AUTH0_CLIENT_ID || "missing-auth0-client-id",
  clientSecret: env.AUTH0_CLIENT_SECRET || "missing-auth0-client-secret",
});

export async function getCurrentUser() {
  if (!isAuth0Configured) return null;

  try {
    const session = await auth0.getSession();
    return session?.user || null;
  } catch {
    return null;
  }
}

export async function isAdmin() {
  if (
    env.NODE_ENV === "development" &&
    env.USE_MOCK_DATA === "true" &&
    env.ADMIN_DEV_BYPASS === "true"
  ) {
    return true;
  }

  const user = await getCurrentUser();
  if (!user || !user.email) return false;

  const adminEmails = (env.ADMIN_EMAILS || "").split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(user.email.toLowerCase());
}

export async function requireAdmin() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }
}
