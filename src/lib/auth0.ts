import { initAuth0 } from "@auth0/nextjs-auth0";
import { env } from "./env";

// Ensure we pick up Vercel prod URLs dynamically if they exist, but fallback to our explicit env URL
const baseURL = env.AUTH0_BASE_URL;

export const auth0 = initAuth0({
  secret: env.AUTH0_SECRET,
  baseURL: baseURL,
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
  clientID: env.AUTH0_CLIENT_ID,
  clientSecret: env.AUTH0_CLIENT_SECRET,
});

export async function getCurrentUser() {
  const session = await auth0.getSession();
  return session?.user || null;
}

export async function isAdmin() {
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
