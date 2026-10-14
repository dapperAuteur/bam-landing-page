import type { AuthOptions } from "next-auth"
import type { OAuthConfig } from "next-auth/providers/oauth"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/lib/db/mongodb"
import bcrypt from "bcryptjs"
import { WITUS_OIDC_DISCOVERY_FALLBACK } from "@/lib/auth/witus-sso"

/**
 * Claims we read off the WitUS id_token. `sub` is the IdP's stable user id; it is NOT this
 * site's user id and is deliberately never used as one (see resolveAdminByEmail).
 */
interface WitusProfile {
  sub: string
  email?: string | null
  name?: string | null
}

/**
 * "Sign in with WitUS" — the ecosystem IdP (accounts.witus.online) as a second way into this
 * site's admin, ALONGSIDE the email + password form above it. BAM's decision, 2026-09-02:
 * brandanthonymcdonald.com is his own site, and an IdP outage, a rotated secret, or a revoked
 * client must never be able to lock him out of his own admin. The credentials provider below
 * is unchanged and stays the primary path.
 *
 * REGISTERED AS `witus-bam` WITH CALLBACK `/api/auth/callback/witus` — the NextAuth v4 shape,
 * exact-matched by the IdP (gemini/witus lib/identity/clients.ts, slug "bam"). Both
 * `https://www.brandanthonymcdonald.com` and the apex are registered redirect URIs, which
 * matters because NextAuth v4 on Vercel builds the redirect_uri from `x-forwarded-host` and
 * IGNORES `NEXTAUTH_URL`: the app sends whichever host actually served the request.
 *
 * ONLY REGISTERED WHEN `WITUS_OIDC_CLIENT_ID` IS SET, so a missing secret can never break the
 * build, the login page, or the password path — it just means the WitUS button is not there.
 *
 * The discovery URL is owned by the IdP. The literal is a LABELED FALLBACK (it lives in
 * lib/auth/witus-sso.ts so the host is named once), overridable with
 * WITUS_OIDC_DISCOVERY_URL — per the authoritative-values rule, this app does not assert
 * another app's URLs.
 */
function witusProvider(): OAuthConfig<WitusProfile> {
  return {
    id: "witus",
    name: "WitUS",
    type: "oauth",
    wellKnown: process.env.WITUS_OIDC_DISCOVERY_URL ?? WITUS_OIDC_DISCOVERY_FALLBACK,
    clientId: process.env.WITUS_OIDC_CLIENT_ID,
    clientSecret: process.env.WITUS_OIDC_CLIENT_SECRET,
    authorization: { params: { scope: "openid email profile" } },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      // DELIBERATELY NO `role`. Whatever the IdP says about this person, it does not get to
      // say they are an admin here; the jwt callback resolves role from this site's own
      // database and overwrites anything that arrived from outside.
      return {
        id: profile.sub,
        email: profile.email ?? null,
        name: profile.name ?? null,
        image: null,
      }
    },
  }
}

/**
 * THE ADMIN RULE, APPLIED TO THE SSO PATH.
 *
 * The credentials provider decides admin by one rule: look the email up in
 * `bam_portfolio.users` and require `role === "admin"` (an account without it is rejected
 * before the password is even compared). `lib/auth/authorize.ts` then gates `/admin/*` and
 * `/api/admin/*` on `token.role === "admin"`.
 *
 * This is the SAME rule for WitUS sign-ins: the IdP proves WHO you are, this collection
 * decides WHETHER you are an admin here. Signing in with any WitUS account grants nothing —
 * an email with no `role: "admin"` record is refused outright by the signIn callback, and
 * would in any case produce a token with no role, which authorize.ts already rejects.
 *
 * WHY THE EMAIL CLAIM IS SAFE TO KEY ON. Verified in gemini/witus lib/identity/auth.ts: the
 * WitUS IdP issues sessions by MAGIC LINK only — there is no password signup — so holding a
 * WitUS session for an address means having received mail at it. An attacker cannot register
 * `bam@awews.com` at the IdP without controlling that inbox. If the IdP ever adds a signup
 * method that does not verify the address, this lookup must additionally bind the IdP `sub`
 * to the admin record.
 *
 * FAILS CLOSED. A Mongo outage throws, and the caller denies the sign-in rather than
 * defaulting to allow. The password path is unaffected by that: it needs the same database,
 * so if Mongo is down neither path can sign anyone in regardless.
 */
async function resolveAdminByEmail(
  email: string | null | undefined
): Promise<{ id: string; name: string; email: string } | null> {
  if (!email) return null
  const client = await clientPromise
  const db = client.db("bam_portfolio")
  const user = await db.collection("users").findOne({ email: email.toLowerCase() })
  if (!user || user.role !== "admin") return null
  return {
    id: user._id.toString(),
    name: user.name || user.email,
    email: user.email,
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db("bam_portfolio")

          const user = await db.collection("users").findOne({
            email: credentials.email.toLowerCase(),
          })

          if (!user || user.role !== 'admin') {
            return null
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!isPasswordCorrect) {
            return null
          }

          return {
            id: user._id.toString(),
            name: user.name || user.email,
            email: user.email,
            role: user.role,
          }

        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
    // Appended, never substituted: the credentials provider above stays first and stays the
    // path that works when the IdP does not.
    ...(process.env.WITUS_OIDC_CLIENT_ID ? [witusProvider()] : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    /**
     * Only the WitUS path is inspected here. The credentials provider has already done its
     * own admin check inside `authorize()` and returns null when it fails, so it never
     * reaches this callback with a non-admin user — returning true for it preserves today's
     * behaviour exactly.
     */
    async signIn({ user, account }) {
      if (account?.provider !== "witus") return true

      try {
        const admin = await resolveAdminByEmail(user?.email)
        if (!admin) {
          // No email, or no `role: "admin"` record for it. NextAuth turns `false` into
          // /login?error=AccessDenied, which the login page explains in words.
          console.warn('[auth] rejected WitUS sign-in for a non-admin account')
          return false
        }
        return true
      } catch (error) {
        console.error('WitUS sign-in check failed:', error)
        return false
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.name = user.name
        token.email = user.email
      }

      // SECOND, INDEPENDENT ENFORCEMENT. `user.role` above is whatever the provider handed
      // back; for WitUS that is `undefined` by construction (the profile() mapper returns no
      // role), so a token minted here would already fail authorize.ts. This block does not
      // rely on that: at WitUS sign-in it re-reads the admin record and sets role, id and
      // name from THIS SITE'S database, so nothing a compromised or misconfigured IdP could
      // put in a claim can become `role: "admin"`. It also makes `session.user.id` the Mongo
      // `_id` that admin routes expect, not the IdP's `sub`.
      if (account?.provider === "witus") {
        try {
          const admin = await resolveAdminByEmail(token.email as string | undefined)
          if (!admin) {
            delete token.role
          } else {
            token.id = admin.id
            token.role = "admin"
            token.name = admin.name
            token.email = admin.email
          }
        } catch (error) {
          console.error('WitUS role resolution failed:', error)
          delete token.role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }

      return session
    },
  },
  pages: {
    signIn: "/login",
    // Redirect-based failures land back on the login form instead of NextAuth's bare
    // /api/auth/error page. This only affects the WitUS flow: the credentials form signs in
    // with `redirect: false` and surfaces its own errors inline, so it never routes here.
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
