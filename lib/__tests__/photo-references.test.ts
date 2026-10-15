import { describe, expect, it } from 'vitest'
import type { Db } from 'mongodb'
import { describeReferences, findPhotoReferences } from '../photos/references'

// A Db stand-in that records each collection's filter and returns canned rows.
function fakeDb(rows: Record<string, Record<string, unknown>[]>) {
  const filters: Record<string, unknown> = {}
  const db = {
    collection: (name: string) => ({
      find: (filter: unknown) => {
        filters[name] = filter
        return { toArray: async () => rows[name] ?? [] }
      },
    }),
  } as unknown as Db
  return { db, filters }
}

const photo = {
  _id: { toString: () => 'abc123' },
  cloudinaryId: 'bam-photography/library/sports/x',
  originalUrl: 'https://res.cloudinary.com/demo/image/upload/v1/x.jpg?w=1',
}

describe('findPhotoReferences', () => {
  it('matches posts by hero id, hero URL, photoIds and body URL, and galleries by id or file', async () => {
    const { db, filters } = fakeDb({})
    await findPhotoReferences(db, photo)

    expect(filters.blog_posts).toEqual({
      $or: [
        { 'featuredImage.id': 'abc123' },
        { photoIds: 'abc123' },
        { 'featuredImage.url': photo.originalUrl },
        { content: { $regex: 'https://res\\.cloudinary\\.com/demo/image/upload/v1/x\\.jpg\\?w=1' } },
      ],
    })
    expect(filters.client_galleries).toEqual({
      $or: [{ 'photos.id': 'abc123' }, { 'photos.cloudinaryId': photo.cloudinaryId }],
    })
  })

  it('names posts by slug and galleries by event, then client, then id', async () => {
    const { db } = fakeDb({
      blog_posts: [{ slug: 'post-a' }],
      client_galleries: [
        { galleryId: 'g1', eventName: 'Penn Relays' },
        { galleryId: 'g2', clientName: 'Acme' },
        { galleryId: 'g3' },
      ],
    })
    expect(await findPhotoReferences(db, photo)).toEqual({
      blogs: ['post-a'],
      galleries: ['Penn Relays', 'Acme', 'g3'],
    })
  })

  it('skips the URL and file clauses for a photo without them', async () => {
    const { db, filters } = fakeDb({})
    await findPhotoReferences(db, { _id: { toString: () => 'abc123' } })
    expect(filters.blog_posts).toEqual({ $or: [{ 'featuredImage.id': 'abc123' }, { photoIds: 'abc123' }] })
    expect(filters.client_galleries).toEqual({ $or: [{ 'photos.id': 'abc123' }] })
  })
})

describe('describeReferences', () => {
  it('names what blocks the delete, with correct plurals', () => {
    expect(describeReferences({ blogs: ['a'], galleries: [] })).toBe(
      'This photo is still used in 1 blog post (a). Remove it there first.',
    )
    expect(describeReferences({ blogs: ['a', 'b'], galleries: ['G1', 'G2'] })).toBe(
      'This photo is still used in 2 blog posts (a, b) and 2 galleries (G1, G2). Remove it there first.',
    )
  })
})
