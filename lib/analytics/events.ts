/**
 * Event taxonomy for brandanthonymcdonald.com.
 *
 * The ecosystem shares ONE PostHog project, separated by the `app` property that
 * posthog-provider registers on load. Two rules keep that project readable, and both
 * are cheap now and expensive to retrofit once data has landed:
 *
 *   1. `snake_case`, object first, verb in past tense — `form_submitted`.
 *   2. NEVER put the app name in the event name. `bam_landing_form_submitted` is
 *      wrong: it makes the same action from two apps look like two events and kills
 *      the cross-app comparison that sharing a project exists to enable. The `app`
 *      property already carries that.
 *
 * Shared lifecycle events (the SHARED_EVENTS block) use identical names in every
 * ecosystem app, so "where do people fall out of sign-in" is answerable across all of
 * them at once. Do not rename these here without renaming them everywhere.
 *
 * See the witus repo's plans/26-posthog-ecosystem-rollout.md for the full contract and
 * lib/analytics/INTEGRATE.md for the integration playbook.
 */

/** This app's slug. Every event carries it. */
export const ANALYTICS_APP = "bam-landing";

/**
 * Events with identical names across every ecosystem app. Names are contractual.
 */
export const SHARED_EVENTS = {
  signinStarted: "signin_started",
  signinSucceeded: "signin_succeeded",
  signinFailed: "signin_failed",
} as const;

/**
 * Events specific to brandanthonymcdonald.com. This site is a portfolio whose entire
 * commercial purpose funnels into two intake forms — /hire and /partner — so the one
 * number worth having is how many people who reach a form actually complete it. That
 * is a ratio between `route_viewed` and `form_submitted`, which stays valid even though
 * `persistence: "memory"` distorts absolute visitor counts.
 */
export const EVENTS = {
  /** An explicit route view. capture_pageview is off — Next's client router would
   *  fire it once and then lie — so route changes are reported deliberately. */
  routeViewed: "route_viewed",
  /** An intake form was accepted by the API. Carries `form` ("hire" | "partner").
   *  Fired on the success branch only, so it counts completions and not attempts —
   *  a reCAPTCHA rejection or a validation failure is deliberately not a submission. */
  formSubmitted: "form_submitted",
  ...SHARED_EVENTS,
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
