import { describe, expect, it } from "vitest";
import { isAdminPath, isAuthorized } from "../auth/authorize";

/**
 * These tests exist because of a real bug: the middleware matcher covered
 * `/api/admin/:path*`, but the authorization callback only checked
 * `pathname.startsWith("/admin")`. `/api/admin/...` does not start with
 * `/admin`, so every admin API route fell through to "any authenticated token
 * passes". It was masked only by the login flow rejecting non-admin users --
 * one non-admin account would have opened the whole admin API.
 */

const admin = { role: "admin" };
const nonAdmin = { role: "user" };
const roleless = {};

describe("isAdminPath", () => {
  it("matches the admin UI surface", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/blog/posts")).toBe(true);
  });

  it("matches the admin API surface (the regression this guards)", () => {
    expect(isAdminPath("/api/admin")).toBe(true);
    expect(isAdminPath("/api/admin/guest-speaker/logs")).toBe(true);
    expect(isAdminPath("/api/admin/education/submissions")).toBe(true);
  });

  it("does not match lookalike public paths", () => {
    expect(isAdminPath("/administrator")).toBe(false);
    expect(isAdminPath("/api/administrivia")).toBe(false);
    expect(isAdminPath("/blog/admin-tips")).toBe(false);
    expect(isAdminPath("/")).toBe(false);
  });
});

describe("isAuthorized", () => {
  const adminPaths = [
    "/admin",
    "/admin/photos",
    "/api/admin",
    "/api/admin/workout-feedback/submissions",
  ];

  it.each(adminPaths)("allows an admin token on %s", (path) => {
    expect(isAuthorized(admin, path)).toBe(true);
  });

  it.each(adminPaths)("rejects a non-admin token on %s", (path) => {
    expect(isAuthorized(nonAdmin, path)).toBe(false);
  });

  it.each(adminPaths)("rejects a token with no role on %s", (path) => {
    expect(isAuthorized(roleless, path)).toBe(false);
  });

  it.each(adminPaths)("rejects an anonymous request on %s", (path) => {
    expect(isAuthorized(null, path)).toBe(false);
  });

  it("requires only a session on non-admin matched paths", () => {
    expect(isAuthorized(nonAdmin, "/portal/abc")).toBe(true);
    expect(isAuthorized(null, "/portal/abc")).toBe(false);
  });
});
