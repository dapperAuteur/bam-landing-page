'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

/**
 * Sign out — globally when this deploy is a WitUS OIDC client, locally when it is not.
 *
 * GLOBAL SIGN-OUT (BAM's decision, 2026-08-30: "signout signs out of every app"). When
 * `endSessionUrl` is present, signing out here also ends the shared session at
 * accounts.witus.online, so it signs you out of every WitUS app in this browser. Without it
 * the IdP session survives, and with "Continue as ..." live on /login that reads as a broken
 * logout: sign out, come back, and the button offers to sign you straight back in.
 *
 * ORDER IS THE SAFETY PROPERTY. The LOCAL session is destroyed FIRST, then we hand off. If
 * the IdP is unreachable, refuses the request, or the redirect never completes, the person is
 * still signed out HERE. Handing off first would turn any IdP failure into "I clicked sign
 * out and I am still signed in".
 *
 * `className` lets this render as the admin bar’s red Logout button and as the nav
 * dropdown’s menu row without either of them re-implementing the ordering above.
 */
export default function SignOutButton({
  endSessionUrl = null,
  className,
  callbackUrl,
  onSignedOut,
}: {
  /** Server-resolved IdP endsession URL (with client_id), or null for local-only sign-out. */
  endSessionUrl?: string | null
  className?: string
  /**
   * Where the LOCAL sign-out lands when there is no global hand-off. Omit to keep NextAuth's
   * default (reload the current page), which is what the public nav's Logout did before this
   * button existed; the admin bar passes "/" because its page is gated.
   */
  callbackUrl?: string
  /** Fired before sign-out runs — used by the mobile nav to close its menu. */
  onSignedOut?: () => void
}) {
  const [pending, setPending] = useState(false)

  const handleClick = async () => {
    setPending(true)
    onSignedOut?.()

    if (!endSessionUrl) {
      // Local-only: exactly today's behaviour, and the behaviour on any deploy where
      // WITUS_OIDC_CLIENT_ID is unset. `callbackUrl` is forwarded only when a caller set
      // one, so an omitted value keeps NextAuth's own default rather than silently
      // redirecting somewhere the previous button did not.
      await signOut(callbackUrl ? { callbackUrl } : undefined)
      return
    }

    // `redirect: false` so the local session is provably gone before we leave this origin.
    // Errors are swallowed deliberately: a failure here must never trap someone in a session
    // they asked to leave, and the IdP hand-off below still ends the shared session.
    await signOut({ redirect: false }).catch(() => {})

    // The trailing slash is REQUIRED. better-auth exact-matches `post_logout_redirect_uri`
    // against the client's registered redirectUrls, and gemini/witus registers `origin + "/"`.
    // Drop the slash and the IdP returns invalid_request.
    //
    // DERIVED FROM `window.location.origin` AT CLICK TIME, not baked in on the server: this
    // site serves on two registered hosts (https://www.brandanthonymcdonald.com and the
    // apex, which 30x's to www), and BOTH are registered post-logout targets. Sending
    // whichever host actually served this page is correct for either one; hardcoding one
    // would 400 whenever the other served the page.
    const back = `${window.location.origin}/`
    // A full navigation, not router.push: this leaves our origin for the IdP, which then
    // returns to `back`. `&`, not `?` — endSessionUrl already carries client_id.
    //
    // The lint rule below assumes an internal Next route. It is wrong here and cannot know
    // it: `endSessionUrl` is absolute (accounts.witus.online) but built at runtime, so
    // eslint sees only a template string. router.push() cannot leave this origin, and a full
    // navigation is exactly the point — RP-initiated OIDC logout IS a browser redirect to the
    // IdP, which then sends the visitor back to `back`.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(
      `${endSessionUrl}&post_logout_redirect_uri=${encodeURIComponent(back)}`
    )
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} className={className}>
      {pending ? 'Signing out…' : endSessionUrl ? 'Sign out of WitUS' : 'Logout'}
    </button>
  )
}
