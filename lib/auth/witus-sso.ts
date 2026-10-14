/**
 * "Sign in with WitUS" — the pure, testable half of the ecosystem-SSO client.
 *
 * WHAT THIS SITE DOES AND DOES NOT USE SSO FOR. brandanthonymcdonald.com has exactly one
 * gated surface: `/admin/*` and `/api/admin/*`, both of which require `role === "admin"`
 * (lib/auth/authorize.ts). WitUS SSO is a SECOND WAY IN, not a replacement for the email +
 * password form. BAM's decision, 2026-09-02: this is his own site, and an IdP outage, a
 * rotated secret, or a revoked client must never be able to lock him out of his own admin.
 * The credentials provider stays exactly as it was; the WitUS button sits beside it.
 *
 * WHY A CROSS-ORIGIN PROBE AND NOT OIDC `prompt=none`. `prompt=none` is a NAVIGATION — you
 * leave the login page to ask the question, and the only way to ask without leaving is a
 * hidden iframe, which Safari's ITP blocks anyway. So the login page renders immediately,
 * exactly as it does today, and asks a dedicated IdP endpoint over CORS in parallel. If the
 * answer arrives, the button's label becomes "Continue as <name>".
 *
 * WHAT THE PROBE BUYS AND WHAT IT DOES NOT. It carries the IdP's cookie as a THIRD-PARTY
 * cookie, so it answers on Chrome/Edge and answers nothing under Safari ITP or Firefox
 * Total Cookie Protection. That is the design, not a bug: a probe that answers nothing
 * renders nothing and the visitor keeps the login page they already had.
 *
 * THE NAME IS DISPLAY COPY, NEVER A CREDENTIAL. It crosses an origin boundary, so it is
 * client-supplied by definition. It never gates access, never populates a session, and is
 * never sent anywhere. Clicking the button runs the real OIDC code flow, which is the only
 * thing in this repo that establishes a WitUS identity — and even that only produces an
 * admin session if the email is already an admin in Mongo (see lib/auth/authOptions.ts).
 *
 * Pure helpers ONLY: no `server-only`, no next/headers, no `window` at module scope. The
 * vitest suite (lib/__tests__/witus-sso.test.ts) imports these directly, and the client
 * component imports them too. Server-resolved values live in lib/auth/witus-config.ts.
 */

/**
 * The IdP's discovery document. A LABELED FALLBACK, not an asserted value: the authoritative
 * source is `WITUS_OIDC_DISCOVERY_URL`, and everything else in this file derives from
 * whichever of the two is in play, so accounts.witus.online is named in exactly one place.
 */
export const WITUS_OIDC_DISCOVERY_FALLBACK =
  'https://accounts.witus.online/api/idp/.well-known/openid-configuration'

/** Query param marking "this browser already tried the ecosystem flow on this page". */
export const SSO_ATTEMPT_PARAM = 'sso'
export const SSO_ATTEMPT_VALUE = 'tried'

/**
 * sessionStorage key for the same marker. Written IMMEDIATELY BEFORE we send the browser to
 * the IdP, never after we come back: a marker written on return is a marker that does not
 * exist when the return is the thing that failed.
 */
export const SSO_ATTEMPT_STORAGE_KEY = 'witus.sso.attempted'

/** How long to wait for the probe before giving up. A silent check that hangs is a broken page. */
export const SILENT_SSO_TIMEOUT_MS = 4000

/** Longest display name we will render, so a hostile or absurd value cannot blow up the button. */
const MAX_LABEL_LENGTH = 48

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

/** Identity shown on the button. Display only, never a credential. */
export interface SsoIdentity {
  /** What "Continue as ___" says. Already trimmed, de-controlled, and length-capped. */
  label: string
}

export type SilentSsoSkip = 'not-configured' | 'already-attempted' | 'already-signed-in'

export type SilentSsoDecision = { attempt: true } | { attempt: false; skip: SilentSsoSkip }

/**
 * Should this browser ask the IdP who it is?
 *
 * `endpoint` is the SERVER-RESOLVED gate: it is null unless `WITUS_OIDC_CLIENT_ID` is set on
 * this deployment, and an affordance the visitor cannot complete is worse than no affordance.
 * This site is single-tenant on one host, so unlike learn.witus.online there is no
 * white-label host to additionally gate on — being a configured OIDC client is the whole gate.
 */
export function silentSsoDecision(input: {
  endpoint: string | null | undefined
  search?: string | null
  attempted?: boolean
  signedIn?: boolean
}): SilentSsoDecision {
  if (!input.endpoint) return { attempt: false, skip: 'not-configured' }
  if (input.signedIn) return { attempt: false, skip: 'already-signed-in' }
  if (input.attempted || hasAttemptMarker(input.search)) {
    return { attempt: false, skip: 'already-attempted' }
  }
  return { attempt: true }
}

/** Does this query string carry the one-shot marker? Accepts "?a=b" or "a=b". */
export function hasAttemptMarker(search: string | null | undefined): boolean {
  if (typeof search !== 'string' || search === '') return false
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  return params.get(SSO_ATTEMPT_PARAM) === SSO_ATTEMPT_VALUE
}

/** Add the one-shot marker to a same-origin path, preserving any query it already carries. */
export function withAttemptMarker(path: string): string {
  const [beforeHash, ...hashRest] = path.split('#')
  const hash = hashRest.length > 0 ? `#${hashRest.join('#')}` : ''
  const [pathname, ...queryRest] = beforeHash.split('?')
  const params = new URLSearchParams(queryRest.join('?'))
  params.set(SSO_ATTEMPT_PARAM, SSO_ATTEMPT_VALUE)
  return `${pathname}?${params.toString()}${hash}`
}

/**
 * Split a discovery URL into the IdP's origin and its better-auth basePath.
 *
 *   https://accounts.witus.online/api/idp/.well-known/openid-configuration
 *     -> { origin: "https://accounts.witus.online", basePath: "/api/idp" }
 */
function splitDiscoveryUrl(
  discoveryUrl: string | null | undefined
): { origin: string; basePath: string } | null {
  if (!discoveryUrl) return null
  let parsed: URL
  try {
    parsed = new URL(discoveryUrl)
  } catch {
    return null
  }
  const cut = parsed.pathname.indexOf('/.well-known/')
  if (cut < 0) return null
  return { origin: parsed.origin, basePath: parsed.pathname.slice(0, cut) }
}

/**
 * The IdP's RP-initiated logout endpoint: `<basePath>/oauth2/endsession`, which is the
 * `end_session_endpoint` the discovery document advertises.
 *
 * BAM chose GLOBAL sign-out on 2026-08-30: signing out of one WitUS app signs you out of all
 * of them. Ending only the local session would leave the IdP session alive, and with
 * "Continue as ..." live that reads as a broken logout — sign out, come back, and the button
 * offers to sign you straight back in.
 */
export function endSessionEndpointFromDiscovery(
  discoveryUrl: string | null | undefined
): string | null {
  const parts = splitDiscoveryUrl(discoveryUrl)
  if (!parts) return null
  return `${parts.origin}${parts.basePath}/oauth2/endsession`
}

/**
 * The ecosystem session probe: `<idp-origin>/api/ecosystem/session`.
 *
 * NOT better-auth's `<basePath>/get-session`, for two reasons verified in gemini/witus rather
 * than reasoned about: better-auth's core emits no CORS headers at all, so every browser
 * discards the response; and `/get-session` returns the full `{ session, user }` including the
 * SESSION TOKEN, so a credentialed allow-origin on it would let any ecosystem origin — or an
 * XSS on any one of them — lift a live IdP session. `/api/ecosystem/session` is the
 * purpose-built replacement: same cookie, but it answers with a display label and nothing else.
 */
export function silentSsoEndpointFromDiscovery(
  discoveryUrl: string | null | undefined
): string | null {
  const parts = splitDiscoveryUrl(discoveryUrl)
  if (!parts) return null
  return `${parts.origin}/api/ecosystem/session`
}

/**
 * Read a display name out of the probe response.
 *
 * Handles `{ signedIn, user: { name } }`, a bare user object, and the signed-out answer
 * (a 200 with a null/false body). Anything else yields null, which renders nothing.
 */
export function parseSilentSsoIdentity(payload: unknown): SsoIdentity | null {
  if (!payload || typeof payload !== 'object') return null
  const root = payload as Record<string, unknown>
  if (root.signedIn === false) return null
  const candidate =
    root.user && typeof root.user === 'object' ? (root.user as Record<string, unknown>) : root
  const label = cleanLabel(candidate.name) ?? cleanLabel(candidate.email)
  return label ? { label } : null
}

function cleanLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const cleaned = value.replace(CONTROL_CHARS, '').trim()
  if (!cleaned) return null
  return cleaned.length > MAX_LABEL_LENGTH
    ? `${cleaned.slice(0, MAX_LABEL_LENGTH - 1).trimEnd()}…`
    : cleaned
}

/** Button copy. Kept here so the test pins the exact string the visitor reads. */
export function continueAsLabel(identity: SsoIdentity | null): string {
  return identity ? `Continue as ${identity.label}` : 'Sign in with WitUS'
}

/**
 * What to tell the visitor when NextAuth bounced them back to /login with `?error=`.
 *
 * `AccessDenied` is the one that matters here and it is NOT a fault: it is what the signIn
 * callback returns when a WitUS account signs in that is not an admin in this site's own
 * users collection. Saying so plainly is the difference between "this is broken" and "wrong
 * account" — and the email + password form directly above still works either way.
 *
 * Returns null for no error and for the codes NextAuth raises on the credentials path, which
 * that form already surfaces inline (it signs in with `redirect: false` and never lands here).
 */
export function ssoErrorMessage(error: string | null | undefined): string | null {
  if (typeof error !== 'string' || error === '') return null
  if (error === 'AccessDenied') {
    return 'That WitUS account does not have admin access to this site. Sign in with your email and password below.'
  }
  if (error === 'CredentialsSignin') return null
  return 'Signing in with WitUS did not complete. Try again, or use your email and password below.'
}
