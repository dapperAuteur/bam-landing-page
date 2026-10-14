import 'server-only'

import {
  WITUS_OIDC_DISCOVERY_FALLBACK,
  endSessionEndpointFromDiscovery,
  silentSsoEndpointFromDiscovery,
} from './witus-sso'

/**
 * The SERVER half of ecosystem SSO: the two URLs the client components need, resolved here
 * from env and handed down as props.
 *
 * WHY THIS FILE EXISTS AT ALL. Every layout on this site is `'use client'`
 * (components/layout/PublicLayout.tsx, the admin shell, the nav), and a client component
 * reading `process.env.WITUS_OIDC_CLIENT_ID` gets `undefined` — Next only inlines
 * `NEXT_PUBLIC_*` into the browser bundle. So the values are read HERE, in server
 * components, and passed down as props. That is already this repo's convention: see
 * app/layout.tsx, which reads `NEXT_PUBLIC_POSTHOG_KEY` in the Server Component and passes
 * it to `<PostHogProvider>` for exactly this reason.
 *
 * THE GATE IS `WITUS_OIDC_CLIENT_ID`, AND IT IS THE WHOLE GATE. Both values are `null`
 * without it, both features go completely dark, and the site behaves exactly as it does
 * today: an email + password form and a local sign-out. An affordance the visitor cannot
 * complete is worse than no affordance. This site is single-tenant on one host, so there is
 * no white-label surface to additionally gate on the way learn.witus.online has.
 *
 * NOTHING HERE CAN LOCK BAM OUT. These are display/redirect URLs only. Admin authorization
 * is decided in lib/auth/authOptions.ts against this site's own Mongo `users` collection,
 * and the credentials provider is untouched by any of it.
 */

function discoveryUrl(): string {
  return process.env.WITUS_OIDC_DISCOVERY_URL ?? WITUS_OIDC_DISCOVERY_FALLBACK
}

/** True when this deployment is a configured WitUS OIDC client. */
export const witusSsoConfigured: boolean = Boolean(process.env.WITUS_OIDC_CLIENT_ID)

/** Where the login page's silent "Continue as ..." probe asks the IdP who the browser is. */
export const witusSilentSsoEndpoint: string | null = witusSsoConfigured
  ? silentSsoEndpointFromDiscovery(discoveryUrl())
  : null

/**
 * Where sign-out ends the SHARED WitUS session, with `client_id` already attached.
 *
 * `client_id` IS REQUIRED, not optional: better-auth's endsession endpoint rejects a
 * `post_logout_redirect_uri` with `invalid_request` unless the request carries either a
 * verifiable `id_token_hint` or an explicit `client_id`, and we have no id_token
 * client-side. It is baked in HERE, on the server, because the sign-out button is a client
 * component and must not be handed the raw env. (`client_id` is not a secret — it travels
 * in every authorize URL the browser navigates to — but it is also not readable from a
 * client bundle, which is the actual constraint.)
 *
 * The `post_logout_redirect_uri` itself is NOT baked in here: it is derived from
 * `window.location.origin` at click time, because this site serves on two registered hosts
 * (www + apex) and each must send its own. See components/auth/SignOutButton.tsx.
 */
export const witusEndSessionUrl: string | null = (() => {
  const clientId = process.env.WITUS_OIDC_CLIENT_ID
  if (!clientId) return null
  const base = endSessionEndpointFromDiscovery(discoveryUrl())
  if (!base) return null
  return `${base}?client_id=${encodeURIComponent(clientId)}`
})()
