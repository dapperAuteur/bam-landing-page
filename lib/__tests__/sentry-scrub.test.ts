import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ErrorEvent } from "@sentry/nextjs";
import {
  isSecretName,
  scrubEvent,
  scrubQueryString,
  scrubText,
  REDACTED,
} from "../sentry-scrub";

/**
 * Every fixture secret is ASSEMBLED AT RUNTIME, never written as a string literal. A committed
 * literal that looks like a credential trips secret-scanning push protection, and "it is only a
 * test fixture" is not something a scanner can know. Deterministic so failures are reproducible.
 */
function fakeSecret(label: string, length = 32): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = label;
  for (let i = 0; i < length; i += 1) {
    out += alphabet[(i * 7 + label.length) % alphabet.length];
  }
  return out;
}

const SESSION_TOKEN = fakeSecret("st", 40);
const ACCESS_CODE = fakeSecret("ac", 14);
const ADMIN_API_KEY = fakeSecret("ak", 28);
const HMAC_SECRET = fakeSecret("hm", 48);
const MONGO_PASSWORD = fakeSecret("mp", 20);
const FAKE_JWT = ["eyJ" + fakeSecret("h", 18), fakeSecret("p", 24), fakeSecret("s", 20)].join(".");
const VISITOR_EMAIL = ["visitor", "@", "example", ".", "com"].join("");
const VISITOR_IP = "203.0.113.7";
/** A real Mongo ObjectId shape. Not a secret: it is how a report gets traced to a project. */
const OBJECT_ID = "6512c0ffee1234567890abcd";
const MONGO_URI = [
  "mongodb+srv://",
  "bam_app",
  ":",
  MONGO_PASSWORD,
  "@",
  "cluster0.example.mongodb.net/bam_portfolio?retryWrites=true",
].join("");

/** A representative worst-case event: every sensitive surface this site actually has, at once. */
function buildEvent(): ErrorEvent {
  return {
    message: `Contact form insert failed for ${VISITOR_EMAIL}`,
    transaction: "/api/client-gallery/[galleryId]/authenticate",
    exception: {
      values: [{ type: "MongoServerError", value: `bad auth connecting to ${MONGO_URI}` }],
    },
    user: { id: "u_1", email: VISITOR_EMAIL, ip_address: VISITOR_IP, username: "bam" },
    request: {
      url: `https://brandanthonymcdonald.com/api/auth/callback/credentials?callbackUrl=%2Fadmin&csrfToken=${SESSION_TOKEN}`,
      // Its own field. A bare query string is not a parseable URL, so a URL-only pass misses this.
      query_string: `code=${SESSION_TOKEN}&page=2&state=xyzzy`,
      cookies: { "next-auth.session-token": SESSION_TOKEN },
      headers: {
        authorization: `Bearer ${FAKE_JWT}`,
        cookie: `next-auth.session-token=${SESSION_TOKEN}`,
        "x-forwarded-for": VISITOR_IP,
        "x-admin-api-key": ADMIN_API_KEY,
        "user-agent": "Mozilla/5.0",
        referer: `https://brandanthonymcdonald.com/portal/${OBJECT_ID}`,
      },
      data: { accessCode: ACCESS_CODE, projectId: OBJECT_ID, name: "Sam Client", pin: 4821 },
    },
    extra: {
      NEXTAUTH_SECRET: SESSION_TOKEN,
      OUTBOX_INGEST_SECRET: HMAC_SECRET,
      SMTP_PASS: MONGO_PASSWORD,
      NEXT_PUBLIC_ADMIN_API_KEY: ADMIN_API_KEY,
      authorName: "Brand Anthony McDonald",
      design: "keyboard",
      keyboard: "design",
      state: "publishing",
      galleryId: OBJECT_ID,
      note: `Retry with token=${SESSION_TOKEN} failed`,
      nested: { level2: { apiKey: ADMIN_API_KEY, slug: "penn-relays-2026" } },
    },
    tags: { route: "/api/contact", jwt: FAKE_JWT },
    contexts: {
      trace: { trace_id: "abc1230000def4560000abc1230000de", span_id: "0123456789abcdef" },
      mongo: { code: 8000, codeName: "AtlasError" },
    },
    breadcrumbs: [
      {
        category: "fetch",
        message: `POST /api/client-gallery/x/authenticate accessCode=${ACCESS_CODE}`,
        data: {
          url: `https://brandanthonymcdonald.com/api/auth/session?token=${SESSION_TOKEN}`,
          status_code: 401,
        },
      },
    ],
  } as unknown as ErrorEvent;
}

describe("scrubEvent: secrets never leave the process", () => {
  const json = JSON.stringify(scrubEvent(buildEvent()));

  it("strips every credential, wherever it was hiding", () => {
    expect(json).not.toContain(SESSION_TOKEN);
    expect(json).not.toContain(ACCESS_CODE);
    expect(json).not.toContain(ADMIN_API_KEY);
    expect(json).not.toContain(HMAC_SECRET);
    expect(json).not.toContain(MONGO_PASSWORD);
    expect(json).not.toContain(FAKE_JWT);
  });

  it("strips visitor PII: email addresses and IPs", () => {
    expect(json).not.toContain(VISITOR_EMAIL);
    expect(json).not.toContain(VISITOR_IP);
  });

  it("redacts a secret-named key even when its value is a number (a PIN is still a PIN)", () => {
    expect(json).not.toContain("4821");
  });

  it("drops the cookie jar and the credential headers entirely", () => {
    const event = scrubEvent(buildEvent());
    expect(event.request?.cookies).toBeUndefined();
    const headers = event.request?.headers as Record<string, string>;
    expect(headers.authorization).toBeUndefined();
    expect(headers.cookie).toBeUndefined();
    expect(headers["x-forwarded-for"]).toBeUndefined();
    expect(headers["x-admin-api-key"]).toBeUndefined();
  });

  it("never returns null: the crash signal survives the scrub", () => {
    const event = scrubEvent(buildEvent());
    expect(event).toBeTruthy();
    expect(event.exception?.values?.[0].type).toBe("MongoServerError");
  });
});

describe("scrubEvent: the report is still worth reading (over-redaction guards)", () => {
  const event = scrubEvent(buildEvent());
  const json = JSON.stringify(event);

  it("keeps names whose segments merely CONTAIN a secret word", () => {
    // Substring matching would redact all three: `keyboard` (key), `design` (sig), `authorName` (auth).
    expect((event.extra as Record<string, unknown>).keyboard).toBe("design");
    expect((event.extra as Record<string, unknown>).design).toBe("keyboard");
    expect((event.extra as Record<string, unknown>).authorName).toBe("Brand Anthony McDonald");
  });

  it("keeps `state`, which is a CSRF nonce and a hundred ordinary variables, not a secret", () => {
    expect((event.extra as Record<string, unknown>).state).toBe("publishing");
    expect(json).toContain("state=xyzzy");
  });

  it("keeps `code` as an object key (error codes are triage gold) while redacting `?code=`", () => {
    const mongo = (event.contexts as Record<string, Record<string, unknown>>).mongo;
    expect(mongo.code).toBe(8000);
    expect(mongo.codeName).toBe("AtlasError");
    expect(event.request?.query_string).toContain(`code=${REDACTED}`);
  });

  it("keeps ObjectIds, which share a shape with tokens but are how a report is traced", () => {
    expect((event.extra as Record<string, unknown>).galleryId).toBe(OBJECT_ID);
    expect(json).toContain(`/portal/${OBJECT_ID}`);
  });

  it("exempts contexts.trace, which Sentry needs to stitch the event together", () => {
    const trace = (event.contexts as Record<string, Record<string, unknown>>).trace;
    expect(trace.trace_id).toBe("abc1230000def4560000abc1230000de");
    expect(trace.span_id).toBe("0123456789abcdef");
  });

  it("keeps the route, the host, and the non-secret query params", () => {
    expect(json).toContain("/api/auth/callback/credentials");
    expect(json).toContain("callbackUrl=%2Fadmin");
    expect(json).toContain("page=2");
    expect(json).toContain("cluster0.example.mongodb.net");
    expect(json).toContain("Mozilla/5.0");
    expect(json).toContain("status_code");
  });

  it("keeps non-secret values nested below the top level", () => {
    expect(json).toContain("penn-relays-2026");
  });

  it("keeps a non-identifying user id", () => {
    expect(event.user?.id).toBe("u_1");
  });
});

describe("scrubText", () => {
  it("catches env-var-shaped names, where a word-boundary regex silently fails", () => {
    // `\b(secret)\b` does NOT match NEXTAUTH_SECRET: `_` is a word character.
    expect(scrubText(`NEXTAUTH_SECRET=${SESSION_TOKEN}`)).toBe(`NEXTAUTH_SECRET=${REDACTED}`);
    expect(scrubText(`OUTBOX_INGEST_SECRET: ${HMAC_SECRET}`)).not.toContain(HMAC_SECRET);
    expect(scrubText(`SMTP_PASS = ${MONGO_PASSWORD}`)).not.toContain(MONGO_PASSWORD);
  });

  it("strips inline URI credentials but keeps the host and database", () => {
    const out = scrubText(`bad auth connecting to ${MONGO_URI}`);
    expect(out).not.toContain(MONGO_PASSWORD);
    expect(out).toContain("cluster0.example.mongodb.net/bam_portfolio");
    expect(out).toContain("bam_app");
  });

  it("strips a bare JWT and a Bearer credential", () => {
    expect(scrubText(`verify failed for ${FAKE_JWT}`)).not.toContain(FAKE_JWT);
    expect(scrubText(`Authorization: Bearer ${SESSION_TOKEN}`)).not.toContain(SESSION_TOKEN);
  });

  it("redacts token-shaped path segments under redemption paths only", () => {
    const secretPath = scrubText(`GET https://bam.test/api/auth/verify/${SESSION_TOKEN} 500`);
    expect(secretPath).not.toContain(SESSION_TOKEN);
    expect(secretPath).toContain("/api/auth/verify/");

    const idPath = scrubText(`GET https://bam.test/client-gallery/${OBJECT_ID} 500`);
    expect(idPath).toContain(OBJECT_ID);
  });

  it("leaves ordinary prose alone", () => {
    // The bare word with no separator after it: no value is being labelled here.
    expect(scrubText("Failed to send email notification")).toBe("Failed to send email notification");
    expect(scrubText("state is dirty")).toBe("state is dirty");
    expect(scrubText("Reference: 8f2c1a")).toBe("Reference: 8f2c1a");
    expect(scrubText("Rendered 12 posts in 84ms")).toBe("Rendered 12 posts in 84ms");
  });

  it("restores URLs without mangling the text around them", () => {
    expect(scrubText("see https://bam.test/blog/a-post here")).toBe(
      "see https://bam.test/blog/a-post here"
    );
    expect(scrubText("(https://bam.test/galleries)")).toBe("(https://bam.test/galleries)");
    expect(scrubText("ends at https://bam.test/hire.")).toBe("ends at https://bam.test/hire.");
  });
});

describe("isSecretName", () => {
  it("matches secret names across separator styles", () => {
    const secret = [
      "NEXTAUTH_SECRET",
      "JWT_SECRET",
      "ADMIN_API_KEY",
      "NEXT_PUBLIC_ADMIN_API_KEY",
      "apiKey",
      "accessCode",
      "session_token",
      "X-Admin-Api-Key",
      "csrfToken",
      "Authorization",
      "smtp.pass",
    ];
    for (const name of secret) expect(isSecretName(name), name).toBe(true);
  });

  it("does not match innocuous names that merely contain a secret word", () => {
    const safe = [
      "keyboard",
      "design",
      "designer",
      "authorName",
      "author",
      "authenticated",
      "galleryId",
      "projectId",
      "slug",
      "state",
      "codeName",
      "passing",
      "keynote",
      "code",
    ];
    for (const name of safe) expect(isSecretName(name), name).toBe(false);
  });

  it("treats `code` as secret only in a query string", () => {
    expect(isSecretName("code")).toBe(false);
    expect(isSecretName("code", true)).toBe(true);
  });
});

describe("scrubQueryString", () => {
  it("redacts secret params and keeps the rest", () => {
    expect(scrubQueryString(`token=${SESSION_TOKEN}&page=2`)).toBe(`token=${REDACTED}&page=2`);
    expect(scrubQueryString("state=xyzzy&limit=10")).toBe("state=xyzzy&limit=10");
  });
});

describe("browser safety", () => {
  it("uses no regex lookbehind anywhere in the scrubber", () => {
    // This module is imported by instrumentation-client.ts, so it is parsed in the browser as part
    // of a client chunk. `(?<=...)` is a SyntaxError on iOS Safari below 16.4, which would break
    // that chunk for those visitors even with no DSN configured.
    const source = readFileSync(join(process.cwd(), "lib/sentry-scrub.ts"), "utf8");
    // Comments are stripped first: that file documents the ban in prose, and the prose necessarily
    // quotes the syntax it is banning. Only real code is checked.
    const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    expect(code).not.toContain("(?<");
    // Unicode property escapes are the other ES2018-only regex feature that would break the chunk.
    expect(code).not.toContain("\\p{");
  });
});
