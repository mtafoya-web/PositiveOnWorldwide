import type { ConfigParameters } from "@auth0/nextjs-auth0";

function withProtocol(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

function getBaseUrl() {
  const url =
    process.env.AUTH0_BASE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;

  if (!url) {
    return undefined;
  }

  return withProtocol(url).replace(/\/$/, "");
}

export function getAuth0Config(): ConfigParameters {
  return {
    secret: process.env.AUTH0_SECRET,
    baseURL: getBaseUrl(),
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET
  };
}
