import { NextRequest, NextResponse } from "next/server";
import { hasAuth0Configuration } from "@/lib/auth";

export function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("returnTo") || "/profile";
  const redirectUrl = new URL(returnTo, request.url);

  if (hasAuth0Configuration()) {
    return NextResponse.json(
      {
        error: "Auth0 SDK route not wired",
        message: "Configure @auth0/nextjs-auth0 route handlers before enabling hosted sign-in."
      },
      { status: 501 }
    );
  }

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("appSession", "local-dev-session", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return response;
}
