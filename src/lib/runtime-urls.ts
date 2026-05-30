import { env } from "@/lib/env";

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function normalizeUrl(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(withProtocol(trimmed));
    return url.origin;
  } catch {
    return null;
  }
}

export function isLocalUrl(value?: string | null) {
  const normalized = normalizeUrl(value);
  if (!normalized) return false;
  const { hostname } = new URL(normalized);
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function getConfiguredSiteUrl() {
  const candidates = [
    env.NEXT_PUBLIC_SITE_URL,
    env.AUTH0_BASE_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL,
    env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (!normalized) continue;
    if (env.NODE_ENV === "production" && env.USE_MOCK_DATA !== "true" && isLocalUrl(normalized)) continue;
    return normalized;
  }

  return env.NODE_ENV === "production" ? null : "http://localhost:3000";
}

export function getRequestOrigin(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedHost) {
    return normalizeUrl(`${forwardedProto || "https"}://${forwardedHost}`);
  }

  return normalizeUrl(request.url);
}

export function getRuntimeSiteUrl(request?: Request) {
  const fromRequest = request ? getRequestOrigin(request) : null;
  if (
    fromRequest &&
    !(env.NODE_ENV === "production" && env.USE_MOCK_DATA !== "true" && isLocalUrl(fromRequest))
  ) {
    return fromRequest;
  }

  return getConfiguredSiteUrl();
}

export function getStripeRedirectUrl(kind: "success" | "cancel", request: Request) {
  const configured = kind === "success" ? env.STRIPE_SUCCESS_URL : env.STRIPE_CANCEL_URL;
  const normalizedConfigured = normalizeUrl(configured);

  if (configured && normalizedConfigured && !(env.NODE_ENV === "production" && isLocalUrl(configured))) {
    return `${normalizedConfigured}/${kind}`;
  }

  const siteUrl = getRuntimeSiteUrl(request);
  if (!siteUrl) {
    throw new Error(
      `Unable to determine ${kind} URL. Set NEXT_PUBLIC_SITE_URL to your production domain in Vercel.`,
    );
  }

  return `${siteUrl}/${kind}`;
}
