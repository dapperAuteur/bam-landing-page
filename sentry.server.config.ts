import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "./lib/sentry-scrub";

/**
 * Server-runtime Sentry init, loaded by instrumentation.ts's register() on the Node runtime.
 *
 * GUARDED ON THE DSN: with no SENTRY_DSN set, init is skipped entirely and the SDK is inert, so the
 * site builds, deploys, and runs exactly as before until BAM provisions the Better Stack project and
 * sets the var (see plans/user-tasks). Better Stack speaks the Sentry protocol, so its ingest URL
 * goes in SENTRY_DSN unchanged.
 */
const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    // Errors only. No tracing spend on a portfolio site until there is a reason for it.
    tracesSampleRate: 0,
    // Never auto-attach IP, cookies, or the signed-in user. beforeSend is the second line of defense.
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}
