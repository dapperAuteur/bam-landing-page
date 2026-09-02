import { Suspense } from 'react'

import AdminLoginForm from '@/components/auth/AdminLoginForm'
import WitusSsoButton from '@/components/auth/WitusSsoButton'
import { witusSilentSsoEndpoint, witusSsoConfigured } from '@/lib/auth/witus-config'

/**
 * Admin login. A SERVER Component now, purely so it can read the WITUS_OIDC_* env and hand
 * the resolved probe endpoint down as a prop — a client component reading that env gets
 * `undefined`, because Next only inlines `NEXT_PUBLIC_*` into the browser bundle. Same
 * pattern app/layout.tsx already uses for the PostHog key.
 *
 * TWO WAYS IN, AND THE ORDER MATTERS. The email + password form comes first and is the
 * primary (blue) action; "Sign in with WitUS" sits under an "or" divider as the secondary
 * one, and is absent entirely unless WITUS_OIDC_CLIENT_ID is set on this deploy. BAM's
 * decision, 2026-09-02: this is his own site, and an IdP outage, a rotated secret, or a
 * revoked client must never be able to lock him out of his own admin. The password path is
 * the fallback that always works, so it stays visually and structurally first.
 *
 * Either path lands in the same place: `lib/auth/authorize.ts` gates /admin/* on
 * `token.role === "admin"`, and both providers resolve that role from this site's own
 * `bam_portfolio.users` collection. A WitUS account that is not an admin here gets nothing.
 */
export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the BAM administration panel
          </p>
        </div>

        <AdminLoginForm />

        {witusSsoConfigured && (
          // <Suspense> is REQUIRED, not decorative: WitusSsoButton reads the query string via
          // useSearchParams (for the `?error=` notice and the loop guard), and without a
          // boundary that opts this whole page out of static rendering. The fallback is null
          // because the button is the secondary action — the password form above has already
          // rendered and is fully usable while this resolves.
          <Suspense fallback={null}>
            <WitusSsoButton silentCheckUrl={witusSilentSsoEndpoint} />
          </Suspense>
        )}
      </div>
    </main>
  )
}
