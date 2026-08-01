/**
 * Stub for the `server-only` package.
 *
 * That package exists to make a build fail if server code is imported into a
 * client bundle; it has no runtime behavior and no resolvable entry point under
 * plain Node. Vitest aliases it here so server-only modules (the form rate
 * limiter, the reCAPTCHA verifier) can be unit-tested directly.
 */
export {};
