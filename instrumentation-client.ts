import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "./lib/sentry-scrub";

/**
 * Client-runtime Sentry init. Reads the PUBLIC DSN, which is inlined into the browser bundle at
 * build time. Guarded: with no NEXT_PUBLIC_SENTRY_DSN the SDK is inert, so nothing is sent and
 * nothing changes for visitors.
 *
 * This file is why lib/sentry-scrub.ts must stay browser-parseable. It ends up in a client chunk,
 * so a modern-only regex feature in the scrubber (lookbehind, for instance) would throw a
 * SyntaxError on older iOS Safari and break the chunk EVEN WITH NO DSN SET. See that file's notes.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    // Errors only: no tracing, and no session replay. Replay would record a visitor's session on a
    // site with client galleries and a client portal, which is not a trade we are making.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}

/** Instruments App Router client navigations for Sentry. A no-op when init was skipped. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
