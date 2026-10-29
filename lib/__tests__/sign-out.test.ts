import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  SIGN_OUT_EVERYWHERE_HELP,
  SIGN_OUT_EVERYWHERE_LABEL,
  SIGN_OUT_LABEL,
  endSessionRedirectUrl,
  signOutEverywhere,
  type SignOutEffects,
} from "../auth/witus-sso";

/**
 * Sign-out semantics (BAM, 2026-10-29, witus task 128 option (b)):
 *   - "Sign out" ends only this site's session and never visits the IdP.
 *   - "Sign out of WitUS everywhere" is separate, renders only when an end-session URL was
 *     resolved, and ends the local session BEFORE navigating to the IdP.
 * Vitest runs in `node` here with no DOM, so the everywhere flow is tested through its pure,
 * injectable helper and the component wiring through its source.
 */

const END_SESSION =
  "https://accounts.witus.online/api/idp/oauth2/endsession?client_id=bam-landing-page";
const ORIGIN = "https://www.brandanthonymcdonald.com";

const ROOT = join(__dirname, "..", "..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf-8");
/** Assertions about what the CODE does must not be satisfied by a comment. */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const component = stripComments(read("components/auth/SignOutButton.tsx"));
const plain = component.slice(
  component.indexOf("export default function SignOutButton"),
  component.indexOf("const browserEffects")
);
const everywhere = component.slice(component.indexOf("export function SignOutEverywhereButton"));

function recorder(opts: { localFails?: boolean } = {}) {
  const calls: string[] = [];
  const effects: SignOutEffects = {
    endLocalSession: async () => {
      calls.push("endLocalSession");
      if (opts.localFails) throw new Error("network");
    },
    navigate: (url) => {
      calls.push(`navigate:${url}`);
    },
  };
  return { calls, effects };
}

describe('"Sign out" is this site only', () => {
  it('is named exactly "Sign out" (not "Logout", not "Sign out of WitUS")', () => {
    expect(SIGN_OUT_LABEL).toBe("Sign out");
    expect(plain).toContain("{pending ? SIGNING_OUT_LABEL : SIGN_OUT_LABEL}");
    expect(component).not.toContain("'Logout'");
    expect(component).not.toContain("'Sign out of WitUS'");
  });

  it("never sees the end-session URL and never navigates itself", () => {
    expect(plain).not.toContain("endSessionUrl");
    expect(plain).not.toContain("signOutEverywhere");
    expect(plain).not.toContain("window.location");
    // NextAuth's local sign-out, landing where the caller asked (or NextAuth's default).
    expect(plain).toContain("await signOut(callbackUrl ? { callbackUrl } : undefined)");
  });

  it("every call site passes the end-session URL only to the everywhere control", () => {
    for (const rel of ["components/ui/Navigation.tsx", "components/admin/AdminShell.tsx"]) {
      const src = stripComments(read(rel));
      const plainUses = src.split("<SignOutButton").slice(1);
      expect(plainUses.length).toBeGreaterThan(0);
      for (const use of plainUses) {
        expect(use.slice(0, use.indexOf("/>"))).not.toContain("endSessionUrl");
      }
      // Every Sign out has an everywhere control beside it (desktop + mobile in the nav).
      expect(src.split("<SignOutEverywhereButton").length).toBe(plainUses.length + 1);
    }
  });
});

describe('"Sign out of WitUS everywhere"', () => {
  it("uses the exact accessible name and help text", () => {
    expect(SIGN_OUT_EVERYWHERE_LABEL).toBe("Sign out of WitUS everywhere");
    expect(SIGN_OUT_EVERYWHERE_HELP).toBe(
      "Also signs you out of WitUS. Other WitUS apps you are signed in to stay signed in until you sign out of them."
    );
  });

  it("renders nothing when no end-session URL was resolved", () => {
    expect(everywhere).toContain("if (!endSessionUrl) return null");
    expect(everywhere.indexOf("return null")).toBeLessThan(everywhere.indexOf("<button"));
  });

  it("references its visible help text with aria-describedby", () => {
    expect(everywhere).toContain("const helpId = useId()");
    expect(everywhere).toContain("aria-describedby={helpId}");
    expect(everywhere).toMatch(/<p id=\{helpId\}[^>]*>\s*\{SIGN_OUT_EVERYWHERE_HELP\}/);
  });

  it("ends the local session BEFORE navigating to the IdP endsession URL", async () => {
    const { calls, effects } = recorder();
    await signOutEverywhere(END_SESSION, ORIGIN, effects);
    expect(calls).toEqual([
      "endLocalSession",
      "navigate:https://accounts.witus.online/api/idp/oauth2/endsession?client_id=bam-landing-page" +
        "&post_logout_redirect_uri=https%3A%2F%2Fwww.brandanthonymcdonald.com%2F",
    ]);
  });

  it("still hands off to the IdP when ending the local session throws", async () => {
    const { calls, effects } = recorder({ localFails: true });
    await signOutEverywhere(END_SESSION, ORIGIN, effects);
    expect(calls[0]).toBe("endLocalSession");
    expect(calls[1]).toContain("/oauth2/endsession?client_id=bam-landing-page&post_logout_redirect_uri=");
  });

  it("sends whichever registered host served the page, with the trailing slash", () => {
    const apex = endSessionRedirectUrl(END_SESSION, "https://brandanthonymcdonald.com");
    expect(new URL(apex).searchParams.get("post_logout_redirect_uri")).toBe(
      "https://brandanthonymcdonald.com/"
    );
    expect(new URL(apex).searchParams.get("client_id")).toBe("bam-landing-page");
  });

  it("uses signOut({ redirect: false }) and a full navigation", () => {
    expect(component).toContain("signOut({ redirect: false })");
    expect(component).toContain("window.location.assign(url)");
    expect(component).not.toContain("router.push");
  });

  it("the server-resolved URL carries client_id", () => {
    expect(stripComments(read("lib/auth/witus-config.ts"))).toContain(
      "?client_id=${encodeURIComponent(clientId)}"
    );
  });
});
