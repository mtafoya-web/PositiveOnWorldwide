import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/checkout", "/profile", "/orders", "/admin"];

function auth0IsConfigured() {
  return Boolean(
    process.env.AUTH0_SECRET &&
      (process.env.AUTH0_BASE_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.VERCEL_PROJECT_PRODUCTION_URL ||
        process.env.VERCEL_URL) &&
      (process.env.AUTH0_ISSUER_BASE_URL || process.env.AUTH0_DOMAIN) &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET,
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected || !auth0IsConfigured()) {
    return NextResponse.next();
  }

  const hasAuth0Session =
    request.cookies.has("appSession") ||
    request.cookies.getAll().some((cookie) => cookie.name.startsWith("appSession."));

  if (!hasAuth0Session) {
    const loginUrl = new URL("/api/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/profile/:path*", "/orders/:path*", "/admin/:path*"],
};
