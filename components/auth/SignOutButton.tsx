'use client'

import { useId, useState } from 'react'
import { signOut } from 'next-auth/react'
import {
  SIGN_OUT_EVERYWHERE_HELP,
  SIGN_OUT_EVERYWHERE_LABEL,
  SIGN_OUT_LABEL,
  SIGNING_OUT_LABEL,
  signOutEverywhere,
  type SignOutEffects,
} from '@/lib/auth/witus-sso'

/**
 * Sign-out controls (BAM, 2026-10-29, witus task 128 option (b)).
 *
 * - `SignOutButton` ("Sign out") ends ONLY this site's session. It never navigates to the
 *   IdP, even on a deploy that is a WitUS OIDC client, and its label never changes (shared
 *   UI rule: the header Sign out control is never renamed or removed; it was "Logout" here
 *   before and is now the shared "Sign out").
 * - `SignOutEverywhereButton` ("Sign out of WitUS everywhere") is a secondary control that
 *   also ends the shared accounts.witus.online session. It renders only when the
 *   server-resolved `endSessionUrl` (lib/auth/witus-config.ts) is non-null. Its help text is
 *   visible and linked with aria-describedby.
 *
 * `className` lets these render as the admin bar's buttons and as the nav dropdown's menu
 * rows without either of them re-implementing the flows.
 */
export default function SignOutButton({
  className,
  callbackUrl,
  onSignedOut,
}: {
  className?: string
  /**
   * Where the sign-out lands. Omit to keep NextAuth's default (reload the current page),
   * which is what the public nav's sign-out has always done; the admin bar passes "/"
   * because its page is gated.
   */
  callbackUrl?: string
  /** Fired before sign-out runs — used by the mobile nav to close its menu. */
  onSignedOut?: () => void
}) {
  const [pending, setPending] = useState(false)

  const handleClick = async () => {
    setPending(true)
    onSignedOut?.()
    // Local-only. `callbackUrl` is forwarded only when a caller set one, so an omitted value
    // keeps NextAuth's own default rather than silently redirecting somewhere new.
    await signOut(callbackUrl ? { callbackUrl } : undefined)
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} className={className}>
      {pending ? SIGNING_OUT_LABEL : SIGN_OUT_LABEL}
    </button>
  )
}

// `redirect: false` so the local session is provably gone before we leave this origin.
const browserEffects: SignOutEffects = {
  endLocalSession: () => signOut({ redirect: false }),
  navigate: (url) => {
    // A full navigation, not router.push: this leaves our origin for the IdP, which then
    // returns to `<origin>/`. RP-initiated OIDC logout IS a browser redirect to the IdP.
    window.location.assign(url)
  },
}

export function SignOutEverywhereButton({
  endSessionUrl = null,
  className,
  helpClassName,
  onSignedOut,
}: {
  /** Server-resolved IdP endsession URL (with client_id), or null to render nothing. */
  endSessionUrl?: string | null
  className?: string
  helpClassName?: string
  /** Fired before sign-out runs — used by the mobile nav to close its menu. */
  onSignedOut?: () => void
}) {
  const [pending, setPending] = useState(false)
  const helpId = useId()

  if (!endSessionUrl) return null
  const url = endSessionUrl

  const handleClick = async () => {
    setPending(true)
    onSignedOut?.()
    // ORDER IS THE SAFETY PROPERTY: signOutEverywhere destroys the LOCAL session first, then
    // hands off to the IdP (see lib/auth/witus-sso.ts). The origin is read at click time
    // because this site serves on two registered hosts (www + apex).
    await signOutEverywhere(url, window.location.origin, browserEffects)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-describedby={helpId}
        className={className}
      >
        {pending ? SIGNING_OUT_LABEL : SIGN_OUT_EVERYWHERE_LABEL}
      </button>
      <p id={helpId} className={helpClassName}>
        {SIGN_OUT_EVERYWHERE_HELP}
      </p>
    </>
  )
}
