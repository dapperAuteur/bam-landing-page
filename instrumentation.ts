import * as Sentry from "@sentry/nextjs";
import type { Instrumentation } from "next";

/**
 * Next.js instrumentation hook. Loads the right Sentry config per runtime and reports server-side
 * App Router errors through onRequestError. Everything here is inert without a SENTRY_DSN, because
 * the configs themselves are guarded, so this file is safe to ship before the DSN is provisioned.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");
  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

/**
 * A coarse area label for the failing request. Coarse on purpose: it must never carry a path
 * segment, because those can be tokens, so it is a fixed vocabulary rather than the real path.
 * `captureRequestError` still records the route itself, scrubbed by `beforeSend`.
 */
function requestArea(path: string): string {
  if (path.startsWith("/api/admin") || path.startsWith("/admin")) return "admin";
  if (path.startsWith("/api/auth")) return "auth";
  if (path.startsWith("/api")) return "api";
  if (path.startsWith("/portal") || path.startsWith("/client-gallery")) return "client";
  if (path.startsWith("/blog")) return "blog";
  return "site";
}

/**
 * Captures errors thrown while rendering or serving a request. The area tag lets BAM separate an
 * admin-only breakage from something every visitor is hitting without opening each event.
 */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  Sentry.withScope((scope) => {
    if (typeof request.path === "string") scope.setTag("route.area", requestArea(request.path));
    Sentry.captureRequestError(err, request, context);
  });
};
