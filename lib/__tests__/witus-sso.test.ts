import { describe, expect, it } from "vitest";
import {
  WITUS_OIDC_DISCOVERY_FALLBACK,
  continueAsLabel,
  endSessionEndpointFromDiscovery,
  hasAttemptMarker,
  parseSilentSsoIdentity,
  silentSsoDecision,
  silentSsoEndpointFromDiscovery,
  ssoErrorMessage,
  withAttemptMarker,
} from "../auth/witus-sso";

/**
 * These pin the parts of ecosystem SSO that fail SILENTLY when they are wrong: a probe that
 * points at the wrong host answers nothing and looks exactly like a browser blocking
 * third-party cookies; a loop guard that does not fire produces an infinite sign-in bounce
 * that only reproduces with a stale IdP session; a label that is not sanitised is rendered
 * cross-origin text.
 *
 * The React components are not covered here — vitest runs in the `node` environment in this
 * repo with no DOM, which is why the whole decision surface lives in pure functions.
 */

const DISCOVERY = "https://accounts.witus.online/api/idp/.well-known/openid-configuration";

describe("endpoint derivation", () => {
  it("derives the endsession endpoint from the discovery URL's basePath", () => {
    expect(endSessionEndpointFromDiscovery(DISCOVERY)).toBe(
      "https://accounts.witus.online/api/idp/oauth2/endsession",
    );
  });

  it("derives the probe from the IdP ORIGIN, not the better-auth basePath", () => {
    // /api/ecosystem/session is a purpose-built app route, not a better-auth route: it must
    // NOT pick up the /api/idp prefix.
    expect(silentSsoEndpointFromDiscovery(DISCOVERY)).toBe(
      "https://accounts.witus.online/api/ecosystem/session",
    );
  });

  it("honours a non-default IdP host and basePath", () => {
    const local = "http://localhost:3001/auth/.well-known/openid-configuration";
    expect(endSessionEndpointFromDiscovery(local)).toBe(
      "http://localhost:3001/auth/oauth2/endsession",
    );
    expect(silentSsoEndpointFromDiscovery(local)).toBe(
      "http://localhost:3001/api/ecosystem/session",
    );
  });

  it("returns null rather than guessing when the URL is missing or unusable", () => {
    for (const bad of [null, undefined, "", "not a url", "https://x.example/no-wellknown"]) {
      expect(endSessionEndpointFromDiscovery(bad)).toBeNull();
      expect(silentSsoEndpointFromDiscovery(bad)).toBeNull();
    }
  });

  it("ships the documented fallback discovery URL", () => {
    expect(WITUS_OIDC_DISCOVERY_FALLBACK).toBe(DISCOVERY);
  });
});

describe("silentSsoDecision", () => {
  const endpoint = "https://accounts.witus.online/api/ecosystem/session";

  it("probes when configured, signed out, and not yet attempted", () => {
    expect(silentSsoDecision({ endpoint })).toEqual({ attempt: true });
  });

  it("stays dark when the app is not a configured OIDC client", () => {
    // The whole gate: no WITUS_OIDC_CLIENT_ID means no endpoint means not one request to
    // accounts.witus.online.
    expect(silentSsoDecision({ endpoint: null })).toEqual({
      attempt: false,
      skip: "not-configured",
    });
  });

  it("skips when already signed in locally", () => {
    expect(silentSsoDecision({ endpoint, signedIn: true })).toEqual({
      attempt: false,
      skip: "already-signed-in",
    });
  });

  it("skips on the sessionStorage half of the loop guard", () => {
    expect(silentSsoDecision({ endpoint, attempted: true })).toEqual({
      attempt: false,
      skip: "already-attempted",
    });
  });

  it("skips on the query-param half of the loop guard", () => {
    expect(silentSsoDecision({ endpoint, search: "?sso=tried" })).toEqual({
      attempt: false,
      skip: "already-attempted",
    });
  });
});

describe("attempt marker", () => {
  it("reads the marker with or without a leading ?", () => {
    expect(hasAttemptMarker("?sso=tried")).toBe(true);
    expect(hasAttemptMarker("sso=tried")).toBe(true);
    expect(hasAttemptMarker("?next=%2Fadmin&sso=tried")).toBe(true);
  });

  it("does not fire on absent, empty, or lookalike values", () => {
    expect(hasAttemptMarker(null)).toBe(false);
    expect(hasAttemptMarker("")).toBe(false);
    expect(hasAttemptMarker("?sso=1")).toBe(false);
    expect(hasAttemptMarker("?ssotried=1")).toBe(false);
  });

  it("adds the marker while preserving existing query and hash", () => {
    expect(withAttemptMarker("/login")).toBe("/login?sso=tried");
    expect(withAttemptMarker("/login?next=%2Fadmin")).toBe("/login?next=%2Fadmin&sso=tried");
    expect(withAttemptMarker("/login#form")).toBe("/login?sso=tried#form");
  });
});

describe("parseSilentSsoIdentity", () => {
  it("reads the ecosystem endpoint's shape", () => {
    expect(parseSilentSsoIdentity({ signedIn: true, user: { name: "Brand" } })).toEqual({
      label: "Brand",
    });
  });

  it("treats the signed-out answer as nobody", () => {
    expect(parseSilentSsoIdentity({ signedIn: false })).toBeNull();
    expect(parseSilentSsoIdentity({ signedIn: false, user: { name: "Brand" } })).toBeNull();
    expect(parseSilentSsoIdentity(null)).toBeNull();
    expect(parseSilentSsoIdentity("Brand")).toBeNull();
    expect(parseSilentSsoIdentity({})).toBeNull();
  });

  it("falls back to email when there is no name", () => {
    expect(parseSilentSsoIdentity({ user: { email: "bam@awews.com" } })).toEqual({
      label: "bam@awews.com",
    });
  });

  it("strips control characters from the cross-origin label", () => {
    // This string arrives from another origin. It is display copy, never a credential, but it
    // still must not be able to smuggle control characters into the button.
    expect(parseSilentSsoIdentity({ user: { name: "  Br\u0007and\u001b[31m  " } })).toEqual({
      label: "Brand[31m",
    });
  });

  it("caps an absurd label at 48 characters with an ellipsis", () => {
    const found = parseSilentSsoIdentity({ user: { name: "x".repeat(200) } });
    expect(found?.label).toHaveLength(48);
    expect(found?.label.endsWith("…")).toBe(true);
  });

  it("renders nothing for a whitespace-only or non-string name", () => {
    expect(parseSilentSsoIdentity({ user: { name: "   " } })).toBeNull();
    expect(parseSilentSsoIdentity({ user: { name: 42 } })).toBeNull();
  });
});

describe("continueAsLabel", () => {
  it("is the ordinary label until the probe answers", () => {
    expect(continueAsLabel(null)).toBe("Sign in with WitUS");
  });

  it("becomes the continue label once it does", () => {
    expect(continueAsLabel({ label: "Brand" })).toBe("Continue as Brand");
  });
});

describe("ssoErrorMessage", () => {
  it("explains AccessDenied as a wrong-account problem, not a fault", () => {
    // This is what a WitUS account with no `role: "admin"` record in bam_portfolio.users
    // gets. It must point at the password form, which still works.
    const message = ssoErrorMessage("AccessDenied");
    expect(message).toContain("does not have admin access");
    expect(message).toContain("email and password");
  });

  it("is silent for no error and for the credentials path's own error code", () => {
    expect(ssoErrorMessage(null)).toBeNull();
    expect(ssoErrorMessage("")).toBeNull();
    expect(ssoErrorMessage("CredentialsSignin")).toBeNull();
  });

  it("gives a generic recoverable message for anything else", () => {
    expect(ssoErrorMessage("OAuthCallback")).toContain("did not complete");
  });
});
