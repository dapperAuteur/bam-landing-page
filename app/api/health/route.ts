import { NextResponse } from 'next/server'

/**
 * Uptime probe for brandanthonymcdonald.com.
 *
 * Why this exists
 * ---------------
 * Better Stack monitors used to point at `/`, which can answer 200 straight out of the CDN cache
 * while MongoDB is unreachable. A green check that cannot go red is not a monitor. This route does
 * the cheapest real liveness call against the database and refuses to be cached, so a green check
 * means the app can actually serve data.
 *
 * Design constraints (do not "simplify" these away)
 * ------------------------------------------------
 * 1. NEVER ECHO THE ERROR. A Mongo failure carries the connection string, and that string has the
 *    password inline. The catch is bare (no binding at all, so there is no variable to leak), the
 *    response body is a fixed literal, and the log line is a bare constant with no error object
 *    interpolated. Passing the error to `console.error` would just move the leak to the log sink.
 * 2. THE DB HELPER IS IMPORTED DYNAMICALLY. `lib/db/mongodb.ts` throws at module scope when
 *    `MONGODB_URI` is missing. A static import would make that throw crash the module before the
 *    handler runs, which surfaces as a 500 with a stack trace instead of the intended 503.
 * 3. DATABASE ONLY. No Cloudinary, Gemini, SMTP, or the WitUS Inbox/Outbox. A vendor outage must not
 *    turn the uptime monitor red for a site that is still serving every page it owns.
 * 4. PUBLIC AND EMPTY. No auth (a monitor holds no credentials) and therefore nothing sensitive in
 *    the payload: no version, no env values, no counts, no portal or client-gallery data. The only
 *    bit of information it gives away is whether the database answered.
 */

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

/** Below Better Stack's usual 10s request timeout, so we return a real 503 instead of timing out. */
const TIMEOUT_MS = 4000

/** Belt and braces with `force-dynamic`: also keeps the CDN and any proxy from holding the answer. */
const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
} as const

/**
 * Returns true only if the database answered a `ping` within the timeout. Never throws, never
 * returns a reason: the caller has exactly one bit to work with, by design.
 */
async function isDatabaseReachable(): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined

  try {
    const ping = (async () => {
      // Dynamic on purpose: see constraint 2 above.
      const { default: clientPromise } = await import('@/lib/db/mongodb')
      const client = await clientPromise
      // The cheapest liveness command the driver has. No collection read, no index, no auth beyond
      // the connection itself.
      await client.db().admin().command({ ping: 1 })
    })()

    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('health check timed out')), TIMEOUT_MS)
    })

    await Promise.race([ping, timeout])
    return true
  } catch {
    // Bare catch, no binding. See constraint 1: there is deliberately nothing here to log.
    console.error('health check failed: database unreachable')
    return false
  } finally {
    // Cleared on every path, including success, so the function never holds the process open.
    if (timer !== undefined) clearTimeout(timer)
  }
}

export async function GET() {
  if (!(await isDatabaseReachable())) {
    return NextResponse.json(
      { ok: false, error: 'database_unreachable' },
      { status: 503, headers: NO_STORE_HEADERS }
    )
  }

  return NextResponse.json(
    { ok: true, checks: { db: 'ok' } },
    { status: 200, headers: NO_STORE_HEADERS }
  )
}

/** Same check, no body, for monitors configured to probe with HEAD. */
export async function HEAD() {
  const reachable = await isDatabaseReachable()
  return new NextResponse(null, {
    status: reachable ? 200 : 503,
    headers: NO_STORE_HEADERS,
  })
}
