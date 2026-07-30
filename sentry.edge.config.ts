import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "./lib/sentry-scrub";

/**
 * Edge-runtime Sentry init. This one matters here: `middleware.ts` runs the NextAuth admin guard on
 * the edge, so an error thrown while deciding whether a request may reach /admin lands in this
 * runtime and nowhere else. Same DSN guard as the server config: inert with no SENTRY_DSN.
 */
const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
  });
}
