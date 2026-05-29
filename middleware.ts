import { auth0 } from "@/lib/auth0-edge";

export default auth0.withMiddlewareAuthRequired();

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/admin/:path*"]
};
