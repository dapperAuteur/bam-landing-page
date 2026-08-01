import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));

/**
 * Vitest covers the things that are invisible when they break: the Sentry scrubber removing
 * credentials while keeping the context that makes a crash report worth reading, and `/api/health`
 * never letting a Mongo error (which carries the connection password inline) reach a monitor or a
 * log line. Node environment, no DOM, no setup file needed.
 *
 * The aliases mirror `tsconfig.json` paths so a test can import a route handler by the same
 * specifier the app uses. Order matters: the specific prefixes must come before the bare `@/`.
 */
export default defineConfig({
  resolve: {
    alias: [
      // `server-only` is a build-time guard with no Node-resolvable entry point.
      { find: /^server-only$/, replacement: `${repoRoot}lib/__tests__/stubs/server-only.ts` },
      { find: /^@\/lib\//, replacement: `${repoRoot}lib/` },
      { find: /^@\/components\//, replacement: `${repoRoot}components/` },
      { find: /^@\/models\//, replacement: `${repoRoot}models/` },
      { find: /^@\/types\//, replacement: `${repoRoot}types/` },
      { find: /^@\/app\//, replacement: `${repoRoot}app/` },
      { find: /^@\//, replacement: `${repoRoot}app/` },
    ],
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
});
