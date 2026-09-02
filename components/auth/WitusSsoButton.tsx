'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  SILENT_SSO_TIMEOUT_MS,
  SSO_ATTEMPT_STORAGE_KEY,
  continueAsLabel,
  parseSilentSsoIdentity,
  silentSsoDecision,
  ssoErrorMessage,
  type SsoIdentity,
} from '@/lib/auth/witus-sso'

/**
 * "Sign in with WitUS", plus the silent "Continue as <name>" check on top of it.
 *
 * A SECOND OPTION, NOT A REPLACEMENT. This renders BELOW the email + password form on
 * /login and never in place of it. If the IdP is down, the client is revoked, or
 * WITUS_OIDC_CLIENT_ID is unset, this component is absent and the login page is exactly the
 * page it has always been. That is the point: BAM must never be locked out of his own admin
 * by someone else's outage.
 *
 * WHAT THE VISITOR SEES. The form is already on screen; nothing here delays it. The button
 * reads "Sign in with WitUS" from the first paint. If the probe comes back with a live WitUS
 * session it becomes "Continue as <name>". If the probe fails, times out, is blocked by the
 * browser's third-party-cookie rules, or the IdP does not answer, NOTHING changes and NOTHING
 * is said — a failed silent check is invisible, with no error, no spinner, no layout shift.
 */
export default function WitusSsoButton({
  silentCheckUrl,
  callbackUrl = '/admin/contact',
}: {
  /** Server-resolved IdP probe endpoint, or null when SSO is not configured on this deploy. */
  silentCheckUrl: string | null
  /** Same-origin path to land on after a successful sign-in. */
  callbackUrl?: string
}) {
  const [pending, setPending] = useState(false)
  const [identity, setIdentity] = useState<SsoIdentity | null>(null)

  // `useSearchParams` rather than reading `window.location.search` into state from an effect:
  // the notice is derived from the URL, so it is computed during render instead of set
  // afterwards (setState in an effect body triggers a cascading render, and the linter is
  // right to reject it). The caller wraps this component in <Suspense> because this hook
  // opts the subtree into client-side rendering of the query string.
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const notice = ssoErrorMessage(errorParam)
  const search = searchParams.toString()

  useEffect(() => {
    const endpoint = silentCheckUrl
    const decision = silentSsoDecision({
      endpoint,
      search,
      // THIRD HALF OF THE LOOP GUARD. An `?error=` on /login can only have come from the
      // WitUS flow (the password form signs in with `redirect: false` and never redirects
      // here), so it is proof this browser just tried and failed. Probing again would
      // re-offer "Continue as X" for the session that just could not complete — the exact
      // loop the marker exists to stop, and the one case where sessionStorage may be gone
      // because the IdP bounced the visitor into a different tab.
      attempted: readAttempted() || Boolean(errorParam),
    })
    // `!endpoint` is implied by decision.attempt; repeating it keeps the narrowing the
    // compiler's rather than a cast that could outlive the invariant.
    if (!decision.attempt || !endpoint) return

    // Abort rather than hang. A probe still in flight when the visitor has moved on is a
    // leak of attention, not just of a socket.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), SILENT_SSO_TIMEOUT_MS)
    let live = true

    // `credentials: "include"` is the whole mechanism: the answer depends on the IdP's OWN
    // cookie, which is third-party from here. Browsers that partition or block third-party
    // cookies (Safari ITP, Firefox Total Cookie Protection) answer "nobody", and that is a
    // supported outcome, not a bug to work around — the visitor keeps the ordinary button.
    fetch(endpoint, {
      credentials: 'include',
      mode: 'cors',
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!live) return
        const found = parseSilentSsoIdentity(payload)
        // NEVER A CREDENTIAL. This name is display copy on a button whose click runs the real
        // OIDC code flow; it grants nothing on its own, and even that flow only produces an
        // admin session if the email is an admin in this site's own users collection.
        if (found) setIdentity(found)
      })
      .catch(() => {
        // Invisible on purpose: network error, CORS refusal, abort, non-JSON body — all the same.
      })
      .finally(() => clearTimeout(timer))

    return () => {
      live = false
      clearTimeout(timer)
      controller.abort()
    }
  }, [silentCheckUrl, search, errorParam])

  const start = useCallback(() => {
    setPending(true)
    // THE LOOP GUARD, written BEFORE the redirect, never after the return. Without it a
    // visitor whose IdP session has gone stale gets: probe says "Continue as X" -> click ->
    // the IdP cannot finish -> back to /login -> probe says "Continue as X" -> forever. With
    // it, one attempt per tab; the second render offers the plain button and the password
    // form, which always works.
    writeAttempted()
    void signIn('witus', { callbackUrl }).finally(() => setPending(false))
  }, [callbackUrl])

  return (
    <div className="space-y-3">
      {notice && (
        <div role="alert" className="rounded-md bg-amber-50 p-4">
          <p className="text-sm text-amber-800">{notice}</p>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-2 text-sm text-gray-500">or</span>
        </div>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={start}
        className={`w-full flex justify-center py-3 px-4 border rounded-md text-sm font-medium transition-colors ${
          pending
            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {pending ? 'Redirecting…' : continueAsLabel(identity)}
      </button>

      {/* Always in the DOM so the label change is announced when it happens, and silent (and
          invisible) when the probe found nothing. */}
      <p
        role="status"
        aria-live="polite"
        className={identity ? 'text-center text-xs text-gray-500' : 'sr-only'}
      >
        {identity ? 'Not you? Sign in with your email and password above.' : ''}
      </p>
    </div>
  )
}

/**
 * sessionStorage throws outright in some privacy modes, so both halves are wrapped. A browser
 * that cannot remember the attempt still gets the other half of the guard: the `?sso=tried`
 * marker, and the `?error=` NextAuth puts on the URL when the flow fails.
 */
function readAttempted(): boolean {
  try {
    return window.sessionStorage.getItem(SSO_ATTEMPT_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeAttempted(): void {
  try {
    window.sessionStorage.setItem(SSO_ATTEMPT_STORAGE_KEY, '1')
  } catch {
    // No storage, no marker. The query-param half still applies.
  }
}
