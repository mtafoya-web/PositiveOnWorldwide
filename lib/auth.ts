import { NextRequest, NextResponse } from "next/server";

export const auth0Env = {
  secret: process.env.AUTH0_SECRET,
  baseUrl: process.env.AUTH0_BASE_URL,
  issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  publicDomain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  publicClientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
};

export function hasAuth0Configuration() {
  return Boolean(auth0Env.secret && auth0Env.baseUrl && auth0Env.issuerBaseUrl && auth0Env.clientId && auth0Env.clientSecret);
}

export function isProtectedPath(pathname: string) {
  return (
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/orders" ||
    pathname.startsWith("/orders/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}

export function isAdmin(userEmail: string | null | undefined) {
  if (!userEmail) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase());
  return adminEmails.includes(userEmail.toLowerCase());
}

export function requireAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get("appSession") ?? request.cookies.get("auth0_session");
  if (sessionCookie?.value.trim()) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/api/auth/login", request.url);
  loginUrl.searchParams.set("returnTo", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export function getAuthSetupMessage() {
  if (hasAuth0Configuration()) {
    return "Auth0 configuration detected. Replace the lightweight cookie guard with @auth0/nextjs-auth0 session helpers during credential wiring.";
  }
  return "Auth0 placeholders are ready. Fill .env values before enabling hosted sign-in.";
}
