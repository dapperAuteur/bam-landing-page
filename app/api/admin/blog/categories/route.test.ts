import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The gate, verified by behavior rather than by reading the file.
 *
 * A route handler does NOT inherit any layout's auth check, and `middleware.ts` covering
 * `/api/admin/:path*` is one config line away from not covering it. So the handler carries
 * its own `requireAdmin()`, and these tests prove it: no session and a non-admin session
 * both get 401, and neither one is allowed to touch the database.
 */

const SESSION_MODULE = 'next-auth/next'
const DB_MODULE = '@/lib/db/mongodb'
const AUTH_OPTIONS_MODULE = '@/lib/auth/authOptions'

type Grouped = { _id: unknown; count: number }

let session: unknown = null
let aggregateCalls = 0
let grouped: Grouped[] = []

function mockModules() {
  vi.doMock(AUTH_OPTIONS_MODULE, () => ({ authOptions: {} }))
  vi.doMock(SESSION_MODULE, () => ({ getServerSession: async () => session }))
  vi.doMock(DB_MODULE, () => ({
    default: Promise.resolve({
      db: () => ({
        collection: () => ({
          aggregate: () => {
            aggregateCalls += 1
            return { toArray: async () => grouped }
          },
        }),
      }),
    }),
  }))
}

async function callGet(): Promise<Response> {
  mockModules()
  const { GET } = await import('./route')
  return GET()
}

beforeEach(() => {
  vi.resetModules()
  session = null
  aggregateCalls = 0
  grouped = []
})

describe('GET /api/admin/blog/categories authorization', () => {
  it('returns 401 with no session, and never queries the database', async () => {
    session = null
    const response = await callGet()
    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ error: 'Unauthorized' })
    expect(aggregateCalls).toBe(0)
  })

  it('returns 401 for a signed-in NON-admin', async () => {
    session = { user: { id: 'user-1', role: 'user' } }
    const response = await callGet()
    expect(response.status).toBe(401)
    expect(aggregateCalls).toBe(0)
  })

  it('returns 401 for an admin role with no user id', async () => {
    session = { user: { role: 'admin' } }
    const response = await callGet()
    expect(response.status).toBe(401)
    expect(aggregateCalls).toBe(0)
  })

  it('returns 200 for an admin', async () => {
    session = { user: { id: 'admin-1', role: 'admin' } }
    grouped = [{ _id: 'Athletics', count: 4 }]
    const response = await callGet()
    expect(response.status).toBe(200)
    expect(aggregateCalls).toBe(1)
  })
})

describe('GET /api/admin/blog/categories payload', () => {
  beforeEach(() => {
    session = { user: { id: 'admin-1', role: 'admin' } }
  })

  it('sorts by count descending, then alphabetically', async () => {
    grouped = [
      { _id: 'Science', count: 1 },
      { _id: 'Uncategorized', count: 19 },
      { _id: 'Software Development', count: 4 },
      { _id: 'Athletics', count: 4 },
      { _id: 'Biology', count: 1 },
    ]
    const { categories } = await (await callGet()).json()
    expect(categories.map((c: { name: string }) => c.name)).toEqual([
      'Uncategorized',
      'Athletics',
      'Software Development',
      'Biology',
      'Science',
    ])
  })

  it('drops null, missing, and blank categories instead of offering an empty option', async () => {
    grouped = [
      { _id: null, count: 3 },
      { _id: '', count: 2 },
      { _id: '   ', count: 1 },
      { _id: 'Athletics', count: 4 },
    ]
    const { categories } = await (await callGet()).json()
    expect(categories).toEqual([{ name: 'Athletics', count: 4 }])
  })

  it('merges values that differ only by surrounding whitespace', async () => {
    grouped = [
      { _id: 'Athletics', count: 4 },
      { _id: ' Athletics ', count: 2 },
    ]
    const { categories } = await (await callGet()).json()
    expect(categories).toEqual([{ name: 'Athletics', count: 6 }])
  })
})
