import { defineConfig } from "vitest/config";

/**
 * Vitest is here for one job so far: proving the Sentry scrubber removes credentials AND keeps the
 * context that makes a crash report worth reading. Node environment, no DOM, no setup file needed.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
});
