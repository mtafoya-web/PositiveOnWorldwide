import type { NextRequest } from "next/server";
import { isProtectedPath, requireAuth } from "@/lib/auth";

export function middleware(request: NextRequest) {
  if (isProtectedPath(request.nextUrl.pathname)) {
    return requireAuth(request);
  }
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*"]
};
