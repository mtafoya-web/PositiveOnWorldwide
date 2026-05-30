import { initAuth0 } from "@auth0/nextjs-auth0";
import { env } from "./env";
import { getConfiguredSiteUrl, isLocalUrl, normalizeUrl } from "@/lib/runtime-urls";

export const isAuth0Configured = Boolean(
  env.AUTH0_SECRET &&
    (env.AUTH0_BASE_URL || env.NEXT_PUBLIC_SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL) &&
    (env.AUTH0_ISSUER_BASE_URL || env.AUTH0_DOMAIN) &&
    env.AUTH0_CLIENT_ID &&
    env.AUTH0_CLIENT_SECRET,
);

export function getAuth0BaseUrl() {
  const configured = normalizeUrl(env.AUTH0_BASE_URL);
  if (configured && !(env.NODE_ENV === "production" && isLocalUrl(configured))) {
    return configured;
  }

  return getConfiguredSiteUrl();
}

export function getAuth0IssuerBaseUrl() {
  if (env.AUTH0_ISSUER_BASE_URL) return normalizeUrl(env.AUTH0_ISSUER_BASE_URL);
  if (env.AUTH0_DOMAIN) return normalizeUrl(env.AUTH0_DOMAIN);
  return null;
}

const baseURL = getAuth0BaseUrl();
const issuerBaseURL = getAuth0IssuerBaseUrl();

if (
  env.NODE_ENV === "production" &&
  env.USE_MOCK_DATA !== "true" &&
  process.env.NEXT_PHASE !== "phase-production-build" &&
  (!baseURL || !issuerBaseURL || !isAuth0Configured)
) {
  console.error(
    "Auth0 is not fully configured. Required: AUTH0_SECRET, AUTH0_BASE_URL or NEXT_PUBLIC_SITE_URL, AUTH0_ISSUER_BASE_URL or AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET.",
  );
}

export const auth0 = initAuth0({
  secret:
    env.AUTH0_SECRET ||
    "0000000000000000000000000000000000000000000000000000000000000000",
  baseURL: baseURL || "http://localhost:3000",
  issuerBaseURL: issuerBaseURL || "https://example.auth0.com",
  clientID: env.AUTH0_CLIENT_ID || "missing-auth0-client-id",
  clientSecret: env.AUTH0_CLIENT_SECRET || "missing-auth0-client-secret",
  authorizationParams: {
    scope: "openid profile email",
  },
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
    env.USE_MOCK_DATA === "true" &&
    env.ADMIN_DEV_BYPASS === "true" &&
    (env.NEXT_PUBLIC_SITE_URL?.includes("localhost") || env.NEXT_PUBLIC_SITE_URL?.includes("127.0.0.1"))
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
