import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `/api/health` exists so an uptime monitor can tell "the page rendered from cache" apart from "the
 * database is alive". The dangerous half is the failure path: a Mongo error carries the connection
 * string, and that string has the password inline. These tests assert both directions, and assert
 * the failure path leaks nothing into EITHER the response or the log sink.
 *
 * Every fixture secret is ASSEMBLED AT RUNTIME, never written as a string literal, matching
 * `lib/__tests__/sentry-scrub.test.ts`: a committed literal that looks like a credential trips
 * secret-scanning push protection, and "it is only a test fixture" is not something a scanner knows.
 */
function fakeSecret(label: string, length = 32): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = label;
  for (let i = 0; i < length; i += 1) {
    out += alphabet[(i * 7 + label.length) % alphabet.length];
  }
  return out;
}

const MONGO_PASSWORD = fakeSecret("hp", 24);
const MONGO_URI = [
  "mongodb+srv://",
  "bam_app",
  ":",
  MONGO_PASSWORD,
  "@",
  "cluster0.example.mongodb.net/bam_portfolio?retryWrites=true",
].join("");

const DB_MODULE = "@/lib/db/mongodb";

/** A stand-in for the driver surface the route touches: `client.db().admin().command()`. */
function fakeClient(command: () => Promise<unknown>) {
  return { db: () => ({ admin: () => ({ command }) }) };
}

async function loadRoute() {
  return import("./route");
}

/** Response body + every header value, so one assertion can prove nothing escaped anywhere. */
async function fullResponseText(response: Response): Promise<string> {
  const headers: string[] = [];
  response.headers.forEach((value, key) => headers.push(`${key}: ${value}`));
  return `${headers.join("\n")}\n${await response.text()}`;
}

let errorLogs: string[] = [];

beforeEach(() => {
  vi.resetModules();
  errorLogs = [];
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errorLogs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock(DB_MODULE);
});

describe("GET /api/health when the database answers", () => {
  it("returns 200 with the db check marked ok", async () => {
    const command = vi.fn().mockResolvedValue({ ok: 1 });
    vi.doMock(DB_MODULE, () => ({ default: Promise.resolve(fakeClient(command)) }));

    const { GET } = await loadRoute();
    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, checks: { db: "ok" } });
    expect(command).toHaveBeenCalledWith({ ping: 1 });
  });

  it("forbids caching, so a monitor cannot be shown a stale green", async () => {
    vi.doMock(DB_MODULE, () => ({
      default: Promise.resolve(fakeClient(vi.fn().mockResolvedValue({ ok: 1 }))),
    }));

    const { GET } = await loadRoute();
    const response = await GET();

    expect(response.headers.get("cache-control")).toContain("no-store");
  });
});

describe("GET /api/health when the database is unreachable", () => {
  it("returns a fixed 503 that never echoes the credential-bearing error", async () => {
    // The ping itself fails the way the driver really fails: the message quotes the whole URI.
    vi.doMock(DB_MODULE, () => ({
      default: Promise.resolve(
        fakeClient(() => Promise.reject(new Error(`bad auth connecting to ${MONGO_URI}`)))
      ),
    }));

    const { GET } = await loadRoute();
    const response = await GET();

    expect(response.status).toBe(503);
    expect(await response.clone().json()).toEqual({ ok: false, error: "database_unreachable" });

    const text = await fullResponseText(response);
    expect(text).not.toContain(MONGO_PASSWORD);
    expect(text).not.toContain(MONGO_URI);
    expect(text).not.toContain("mongodb+srv");
    expect(text).not.toContain("bad auth");
  });

  it("keeps the credential out of the logs too, not just the response", async () => {
    vi.doMock(DB_MODULE, () => ({
      default: Promise.resolve(
        fakeClient(() => Promise.reject(new Error(`bad auth connecting to ${MONGO_URI}`)))
      ),
    }));

    const { GET } = await loadRoute();
    await GET();

    expect(errorLogs.length).toBeGreaterThan(0);
    const logged = errorLogs.join("\n");
    expect(logged).not.toContain(MONGO_PASSWORD);
    expect(logged).not.toContain(MONGO_URI);
    expect(logged).not.toContain("mongodb+srv");
    expect(logged).toContain("database unreachable");
  });

  it("survives a module-level throw from the db helper as a 503, not a 500", async () => {
    // `lib/db/mongodb.ts` throws at import time when MONGODB_URI is missing. The route imports it
    // dynamically precisely so that throw lands in the catch instead of crashing the module.
    vi.doMock(DB_MODULE, () => {
      throw new Error(`Please add your MongoDB URI to .env.local (was ${MONGO_URI})`);
    });

    const { GET } = await loadRoute();
    const response = await GET();

    expect(response.status).toBe(503);
    expect(await response.clone().json()).toEqual({ ok: false, error: "database_unreachable" });
    expect(await fullResponseText(response)).not.toContain(MONGO_PASSWORD);
    expect(errorLogs.join("\n")).not.toContain(MONGO_PASSWORD);
  });
});

describe("HEAD /api/health", () => {
  it("mirrors the GET status with no body", async () => {
    vi.doMock(DB_MODULE, () => ({
      default: Promise.resolve(fakeClient(vi.fn().mockResolvedValue({ ok: 1 }))),
    }));

    const { HEAD } = await loadRoute();
    const response = await HEAD();

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });

  it("reports 503 when the ping fails, without leaking the connection string", async () => {
    vi.doMock(DB_MODULE, () => ({
      default: Promise.resolve(
        fakeClient(() => Promise.reject(new Error(`bad auth connecting to ${MONGO_URI}`)))
      ),
    }));

    const { HEAD } = await loadRoute();
    const response = await HEAD();

    expect(response.status).toBe(503);
    expect(await fullResponseText(response)).not.toContain(MONGO_PASSWORD);
  });
});
