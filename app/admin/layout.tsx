import AdminShell from '@/components/admin/AdminShell'
import { witusEndSessionUrl } from '@/lib/auth/witus-config'

/**
 * A thin SERVER Component wrapper around the admin shell.
 *
 * The shell itself is unchanged and still `'use client'` (it uses `useSession`,
 * `usePathname`, and the redirect effects) — it just moved to
 * components/admin/AdminShell.tsx. This wrapper exists for one reason: `witusEndSessionUrl`
 * is read from `process.env` on the server and passed down, because a client component
 * reading it gets `undefined` (Next only inlines `NEXT_PUBLIC_*` into the browser bundle).
 * Same pattern app/layout.tsx already uses for the PostHog key.
 *
 * `null` when this deploy is not a configured WitUS OIDC client, which keeps Logout purely
 * local — exactly today's behaviour. The admin gate is untouched by any of this: it is still
 * `session.user?.role !== 'admin'` in the shell, backed by the middleware's
 * `token.role === 'admin'` check in lib/auth/authorize.ts.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell witusEndSessionUrl={witusEndSessionUrl}>{children}</AdminShell>
}
