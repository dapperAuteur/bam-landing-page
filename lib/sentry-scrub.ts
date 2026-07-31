import type { ErrorEvent } from "@sentry/nextjs";

/**
 * Sentry `beforeSend` scrubber for brandanthonymcdonald.com.
 *
 * Why this file exists
 * --------------------
 * A crash report is a copy of whatever the process was holding at the moment it broke, shipped to a
 * third party. On this site that can include: a visitor's contact-form email, a client-gallery
 * access code, a client-portal JWT, a NextAuth session cookie, the Mongo connection string (which
 * carries its password inline), or any of the HMAC secrets used to sign Inbox/Outbox webhooks. None
 * of that belongs in an error tracker. This pass strips it and keeps the crash signal.
 *
 * It never returns null: we still want to know the app broke.
 *
 * Design constraints (learned the hard way, do not "simplify" these away)
 * ----------------------------------------------------------------------
 * 1. NO REGEX LOOKBEHIND. This module is imported by `instrumentation-client.ts`, so it is parsed in
 *    the browser as part of a client chunk. `(?<=...)` is a SyntaxError on iOS Safari below 16.4,
 *    which would break that chunk for those visitors EVEN WITH NO DSN CONFIGURED. Every pattern here
 *    is written with capture groups and a replace callback instead.
 * 2. Names are matched PER SEGMENT, never as a substring. Substring matching redacts `design`
 *    (contains "sig") and `keyboard` (contains "key"), and on this site it would also redact
 *    `authorName` on every blog-related event (contains "auth"). Segments are split on `_`, `-`, `.`
 *    and camelCase boundaries.
 * 3. Segment splitting is what makes underscores safe. `\b(secret)\b` does NOT match
 *    `NEXTAUTH_SECRET`, because `_` is a word character, so a word-boundary approach silently misses
 *    every env-var-shaped name. Splitting on `_` catches them.
 * 4. `request.query_string` is a SEPARATE field from `request.url`, and a bare query string is not a
 *    parseable URL, so a URL-only pass misses `?token=` / `?code=` entirely. It is handled on its own.
 * 5. Path context beats shape. A 24-hex Mongo ObjectId and a random token look identical, and this
 *    app puts ObjectIds in triage-relevant paths (`/portal/<projectId>`,
 *    `/client-gallery/<galleryId>`). Token-shaped path segments are only redacted under paths that
 *    are token-redemption endpoints by construction, and ObjectId-shaped segments are kept even
 *    there. Redacting every long segment would leave nothing useful to triage with.
 * 6. `state` is NOT a secret. It is an OAuth CSRF nonce and a hundred ordinary variables.
 *
 * Pure and dependency-free so it is directly unit-testable. See `lib/__tests__/sentry-scrub.test.ts`,
 * which asserts both directions: secrets gone, useful context kept.
 */

export const REDACTED = "[redacted]";
export const REDACTED_EMAIL = "[redacted email]";

/**
 * Name segments that mark a value as a bearer secret or as PII. Matched as WHOLE segments
 * (case-insensitive), so `key` hits `API_KEY` and `apiKey` but not `keyboard`.
 *
 * Deliberately absent: `state` (CSRF nonce, not a secret), `id` (ObjectIds are how we triage),
 * `author` (blog metadata), and bare `code` (see SECRET_QUERY_SEGMENTS for why that one is
 * query-only: `error.code` is triage gold, `?code=` is an OAuth grant).
 */
const SECRET_SEGMENTS = [
  "token",
  "tokens",
  "secret",
  "secrets",
  "password",
  "passwd",
  "pwd",
  "pass",
  "passphrase",
  "passcode",
  "pin",
  "otp",
  "apikey",
  "key",
  "keys",
  "auth",
  "authorization",
  "credential",
  "credentials",
  "cookie",
  "cookies",
  "session",
  "jwt",
  "bearer",
  "signature",
  "sig",
  "hmac",
  "hash",
  "salt",
  "nonce",
  "csrf",
  "dsn",
  "email",
  "emails",
];

/**
 * Segments that are secret ONLY as a query-param name. `code` is the whole reason this list exists:
 * as an object key it is almost always an error code (`code: "ENOTFOUND"`, Mongo `code: 8000`) and
 * redacting it would blind us during triage, but `?code=` in a URL is a one-time grant.
 */
const SECRET_QUERY_SEGMENTS = SECRET_SEGMENTS.concat(["code"]);

/**
 * Full names whose individual segments are each innocuous but whose combination is a secret.
 * `accessCode` splits to ["access", "code"], neither of which is in SECRET_SEGMENTS, yet it is the
 * credential that opens a client gallery. Compared against the name with all separators stripped.
 */
const SECRET_JOINED_NAMES = [
  "accesscode",
  "securitycode",
  "verificationcode",
  "confirmationcode",
  "resetcode",
  "logincode",
  "invitecode",
  "onetimecode",
  "downloadcode",
];

/** Request headers dropped outright: bearer credentials, plus the ones that carry a visitor's IP. */
const DROPPED_HEADERS = [
  "cookie",
  "set-cookie",
  "authorization",
  "proxy-authorization",
  "x-api-key",
  "x-admin-api-key",
  "x-forwarded-for",
  "x-real-ip",
  "x-vercel-forwarded-for",
  "cf-connecting-ip",
  "true-client-ip",
];

/**
 * Paths that are token-redemption endpoints by construction. Only under these is a token-shaped path
 * segment redacted. Note what is NOT here: `/portal/`, `/client-gallery/`, `/galleries/`, `/blog/`,
 * `/api/photos/`. Those carry ids, and keeping them is the difference between a triageable report
 * and "something broke somewhere".
 */
const SECRET_PATH_RE =
  /^\/(api\/auth|auth|login|logout|reset|reset-password|set-password|verify|verify-email|confirm|activate|magic|magic-link|invite|unsubscribe)(\/|$)/i;

/** Long, random-alphabet segment: hex, base64url, or nanoid. */
const TOKENISH_SEGMENT_RE = /^[A-Za-z0-9_-]{20,}$/;

/** A bare Mongo ObjectId. Shares its shape with a token, so path context decides (see note 5). */
const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

/** Any `scheme://...` run, including `mongodb+srv://` and `postgres://`, not just http(s). */
const URI_RE = /[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s<>"'`)\]}]+/g;

/** Splits `scheme://` + authority + path + query + fragment without throwing on odd schemes. */
const URI_PARTS_RE = /^([a-zA-Z][a-zA-Z0-9+.-]*:\/\/)([^/?#]*)([^?#]*)(\?[^#]*)?(#.*)?$/;

/** A JWT. The client portal issues these, so one appearing in a message is always a credential. */
const JWT_RE = /\beyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{4,}/g;

/** `Authorization: Bearer <token>`, where the secret sits after the scheme word, not after the colon. */
const BEARER_RE = /\b(bearer|basic)\s+([A-Za-z0-9._~+/=-]{8,})/gi;

/**
 * `NAME: value`, `NAME=value`, `NAME is value`. The name is captured and then tested with
 * `isSecretName`, which is how this stays lookbehind-free AND avoids mangling ordinary prose: a
 * non-secret name returns the match untouched. The value group is LAST so the callback can rebuild
 * the prefix by length and preserve whichever separator was actually used.
 */
const LABELLED_VALUE_RE =
  /([A-Za-z][A-Za-z0-9_.-]{0,60})["']?(?:\s*[:=]+\s*|\s+is\s+)["']?([^\s"'`,;:)}\]&]{3,})/g;

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/** Deepest object level walked. Sentry normalizes events before `beforeSend`, so this is a cost cap. */
const MAX_DEPTH = 8;

/** Split a name into lowercase segments on separators and camelCase boundaries. */
function nameSegments(name: string): string[] {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());
}

/** Does this key/param/label name a secret? Segment-exact, never substring (see note 2). */
export function isSecretName(name: string, queryParam = false): boolean {
  if (!name) return false;
  const joined = name.replace(/[^A-Za-z0-9]+/g, "").toLowerCase();
  if (SECRET_JOINED_NAMES.indexOf(joined) !== -1) return true;
  const vocabulary = queryParam ? SECRET_QUERY_SEGMENTS : SECRET_SEGMENTS;
  const segments = nameSegments(name);
  for (let i = 0; i < segments.length; i += 1) {
    if (vocabulary.indexOf(segments[i]) !== -1) return true;
  }
  return false;
}

/** Redact the values of secret-named pairs in a bare `a=1&b=2` string (see note 4). */
export function scrubQueryString(query: string): string {
  return query
    .split("&")
    .map((pair) => {
      const eq = pair.indexOf("=");
      if (eq === -1) return pair;
      const name = pair.slice(0, eq);
      return isSecretName(name, true) ? `${name}=${REDACTED}` : pair;
    })
    .join("&");
}

/**
 * Scrub one URI: inline credentials, secret query params, secret fragment params, and token-shaped
 * path segments under redemption paths. The host and route survive, because that is the triage value.
 */
export function scrubUri(raw: string): string {
  const parts = URI_PARTS_RE.exec(raw);
  if (!parts) return raw;

  const scheme = parts[1];
  let authority = parts[2] || "";
  let path = parts[3] || "";
  let query = parts[4] || "";
  let fragment = parts[5] || "";

  // `mongodb+srv://user:pass@cluster/db` and `https://token@host` both hide a credential here.
  const at = authority.lastIndexOf("@");
  if (at !== -1) {
    const userInfo = authority.slice(0, at);
    const hostPort = authority.slice(at + 1);
    const colon = userInfo.indexOf(":");
    const maskedUser = colon === -1 ? REDACTED : `${userInfo.slice(0, colon)}:${REDACTED}`;
    authority = `${maskedUser}@${hostPort}`;
  }

  if (query) query = `?${scrubQueryString(query.slice(1))}`;
  if (fragment && fragment.indexOf("=") !== -1) {
    fragment = `#${scrubQueryString(fragment.slice(1))}`;
  }

  if (SECRET_PATH_RE.test(path)) {
    path = path
      .split("/")
      .map((segment) =>
        TOKENISH_SEGMENT_RE.test(segment) && !OBJECT_ID_RE.test(segment) ? REDACTED : segment
      )
      .join("/");
  }

  return `${scheme}${authority}${path}${query}${fragment}`;
}

/**
 * Scrub free text: an exception message, a breadcrumb, a log line.
 *
 * URIs are pulled out to placeholders first so the later passes cannot chew through a URL they only
 * half understand (without this, the email pass turns `user:pass@cluster.mongodb.net` into nonsense
 * because `pass@cluster.mongodb.net` looks exactly like an address).
 */
export function scrubText(input: string): string {
  if (!input) return input;

  const uris: string[] = [];
  // Control-char delimiters, never spaces or letters: a placeholder has to be something that cannot
  // occur in a real message, or restoring it would corrupt text that merely looked like one.
  let out = input.replace(URI_RE, (match) => {
    const trailing = /[.,;:!?]+$/.exec(match);
    const suffix = trailing ? trailing[0] : "";
    const core = suffix ? match.slice(0, match.length - suffix.length) : match;
    uris.push(scrubUri(core));
    return `\u0000u${uris.length - 1}\u0000${suffix}`;
  });

  out = out.replace(JWT_RE, REDACTED);
  out = out.replace(BEARER_RE, (_match, scheme: string) => `${scheme} ${REDACTED}`);
  out = out.replace(LABELLED_VALUE_RE, (match, name: string, value: string) =>
    isSecretName(name) ? match.slice(0, match.length - value.length) + REDACTED : match
  );
  out = out.replace(EMAIL_RE, REDACTED_EMAIL);

  return out.replace(/\u0000u(\d+)\u0000/g, (_match, index: string) => uris[Number(index)]);
}

/**
 * Key-aware recursive scrub. The key decides first: a secret-named key is replaced whatever its type
 * (a numeric PIN is still a PIN), and only then do we recurse or scrub the string.
 */
function deepScrub(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) return value;
  if (typeof value === "string") return scrubText(value);
  if (Array.isArray(value)) return value.map((item) => deepScrub(item, depth + 1));
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      result[key] = isSecretName(key) ? REDACTED : deepScrub(source[key], depth + 1);
    }
    return result;
  }
  return value;
}

/** The `beforeSend` hook. Strips credentials and PII, keeps the crash. Never returns null. */
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (event.message) event.message = scrubText(event.message);
  if (event.transaction) event.transaction = scrubText(event.transaction);
  if (event.logentry && event.logentry.message) {
    event.logentry.message = scrubText(event.logentry.message);
  }

  const values = (event.exception && event.exception.values) || [];
  for (let i = 0; i < values.length; i += 1) {
    if (values[i].value) values[i].value = scrubText(values[i].value as string);
  }

  // Account identity and network origin never travel, regardless of `sendDefaultPii`.
  if (event.user) {
    delete event.user.email;
    delete event.user.ip_address;
    delete event.user.username;
  }

  if (event.request) {
    if (typeof event.request.url === "string") event.request.url = scrubUri(event.request.url);
    // Its own field, and not a parseable URL on its own (see note 4).
    if (typeof event.request.query_string === "string") {
      event.request.query_string = scrubQueryString(event.request.query_string);
    } else if (event.request.query_string) {
      event.request.query_string = deepScrub(event.request.query_string) as typeof event.request.query_string;
    }
    delete event.request.cookies;
    const headers = event.request.headers as Record<string, string> | undefined;
    if (headers) {
      const names = Object.keys(headers);
      for (let i = 0; i < names.length; i += 1) {
        const name = names[i];
        if (DROPPED_HEADERS.indexOf(name.toLowerCase()) !== -1) {
          delete headers[name];
        } else if (isSecretName(name)) {
          headers[name] = REDACTED;
        } else if (typeof headers[name] === "string") {
          headers[name] = scrubText(headers[name]);
        }
      }
    }
    // Form bodies land here: the contact form, the gallery access-code POST.
    if (event.request.data !== undefined) event.request.data = deepScrub(event.request.data);
  }

  if (event.extra) event.extra = deepScrub(event.extra) as typeof event.extra;
  if (event.tags) event.tags = deepScrub(event.tags) as typeof event.tags;

  if (event.contexts) {
    const contexts = event.contexts as Record<string, unknown>;
    const names = Object.keys(contexts);
    for (let i = 0; i < names.length; i += 1) {
      // `trace` holds ids Sentry needs to stitch the event together; scrubbing it breaks linking.
      if (names[i] === "trace") continue;
      contexts[names[i]] = deepScrub(contexts[names[i]]);
    }
  }

  if (event.breadcrumbs) {
    for (let i = 0; i < event.breadcrumbs.length; i += 1) {
      const crumb = event.breadcrumbs[i];
      if (crumb.message) crumb.message = scrubText(crumb.message);
      if (crumb.data) crumb.data = deepScrub(crumb.data) as typeof crumb.data;
    }
  }

  return event;
}
