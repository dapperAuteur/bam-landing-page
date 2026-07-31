import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as Sentry from "@sentry/nextjs";

/**
 * The whole reason this branch is safe to merge before the Better Stack DSN exists: with no DSN, the
 * SDK must never initialize. If that guard is ever removed, the site starts trying to ship events to
 * nowhere, and worse, it starts collecting them. These tests fail loudly if that happens.
 */
describe("Sentry is inert without a DSN", () => {
  it("skips init on the server runtime when SENTRY_DSN is unset", async () => {
    delete process.env.SENTRY_DSN;
    await import("../../sentry.server.config");
    expect(Sentry.getClient()).toBeUndefined();
  });

  it("guards every runtime config on a DSN", () => {
    const configs = ["sentry.server.config.ts", "sentry.edge.config.ts", "instrumentation-client.ts"];
    for (const file of configs) {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      expect(source, file).toContain("if (dsn) {");
    }
  });

  it("keeps PII off and tracing at zero in every runtime config", () => {
    const configs = ["sentry.server.config.ts", "sentry.edge.config.ts", "instrumentation-client.ts"];
    for (const file of configs) {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      expect(source, file).toContain("sendDefaultPii: false");
      expect(source, file).toContain("tracesSampleRate: 0");
      expect(source, file).toContain("beforeSend: scrubEvent");
    }
  });

  it("keeps session replay at zero in the browser config", () => {
    const source = readFileSync(join(process.cwd(), "instrumentation-client.ts"), "utf8");
    expect(source).toContain("replaysSessionSampleRate: 0");
    expect(source).toContain("replaysOnErrorSampleRate: 0");
  });
});
