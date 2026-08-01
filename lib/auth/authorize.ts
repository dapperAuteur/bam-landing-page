/**
 * The pathname-based authorization rule shared by `middleware.ts`.
 *
 * Lives in lib/ (not inline in middleware.ts) so it can be unit-tested without
 * importing next-auth's middleware wrapper, which runs at module load.
 */

/**
 * Both surfaces matched by the middleware require role=admin.
 *
 * The API prefix has to be listed explicitly: `/api/admin/...` does NOT start
 * with `/admin`, so a rule that checks only the latter silently downgrades every
 * admin API route to "any authenticated session".
 */
export function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/api/admin' ||
    pathname.startsWith('/api/admin/')
}

/** Shape of the next-auth JWT the middleware callback receives. */
type AuthToken = { role?: unknown } | null

export function isAuthorized(token: AuthToken, pathname: string): boolean {
  if (isAdminPath(pathname)) {
    return token?.role === 'admin'
  }
  return !!token
}
