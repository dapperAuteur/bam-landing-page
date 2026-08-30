import { describe, expect, it } from 'vitest'
import { describePhotoUsage, diffPhotoUsage, photoIdsForPost } from '../photos/usage'

describe('photoIdsForPost', () => {
  it('collects the featured image id and the inline photo ids', () => {
    expect(
      photoIdsForPost({
        featuredImage: { id: 'hero', url: 'https://cdn/x.jpg' },
        photoIds: ['a', 'b'],
      }),
    ).toEqual(['hero', 'a', 'b'])
  })

  it('dedupes a photo used as both the hero and an inline image', () => {
    expect(
      photoIdsForPost({ featuredImage: { id: 'hero' }, photoIds: ['a', 'hero', 'a'] }),
    ).toEqual(['hero', 'a'])
  })

  // Back-compat: the three shapes that predate the library all still exist in
  // blog_posts and must contribute nothing rather than throw.
  it('ignores a post with no image fields at all', () => {
    expect(photoIdsForPost({})).toEqual([])
    expect(photoIdsForPost(null)).toEqual([])
    expect(photoIdsForPost(undefined)).toEqual([])
  })

  it('ignores a featured image that is a bare URL string', () => {
    expect(photoIdsForPost({ featuredImage: 'https://cdn/legacy.jpg' })).toEqual([])
  })

  it('ignores a featured image object carrying no library id', () => {
    expect(
      photoIdsForPost({ featuredImage: { url: 'https://cdn/legacy.jpg', alt: 'a photo' } }),
    ).toEqual([])
  })

  it('ignores a null featured image and a non-array photoIds', () => {
    expect(photoIdsForPost({ featuredImage: null, photoIds: 'nope' })).toEqual([])
  })

  it('drops blank and non-string ids and trims the rest', () => {
    expect(
      photoIdsForPost({ featuredImage: { id: '  hero  ' }, photoIds: ['', '   ', 7, null, 'b'] }),
    ).toEqual(['hero', 'b'])
  })
})

describe('diffPhotoUsage', () => {
  it('reports added and removed ids', () => {
    expect(diffPhotoUsage(['a', 'b'], ['b', 'c'])).toEqual({ added: ['c'], removed: ['a'] })
  })

  it('reports nothing when the references are unchanged, regardless of order', () => {
    expect(diffPhotoUsage(['a', 'b'], ['b', 'a'])).toEqual({ added: [], removed: [] })
  })

  it('treats a first-time reference as purely additive', () => {
    expect(diffPhotoUsage([], ['a'])).toEqual({ added: ['a'], removed: [] })
  })

  it('releases every photo when a post drops its images', () => {
    expect(diffPhotoUsage(['a', 'b'], [])).toEqual({ added: [], removed: ['a', 'b'] })
  })
})

describe('describePhotoUsage', () => {
  it('says so plainly when nothing references the photo', () => {
    const usage = describePhotoUsage({ galleries: [], blogs: [], portfolio: false })
    expect(usage.total).toBe(0)
    expect(usage.summary).toBe('Not used anywhere')
  })

  it('counts blogs and galleries separately and singularises correctly', () => {
    const usage = describePhotoUsage({ galleries: ['g1'], blogs: ['post-a'], portfolio: false })
    expect(usage.total).toBe(2)
    expect(usage.summary).toBe('Used in 1 blog post, 1 gallery')
  })

  it('pluralises galleries as "galleries", not "gallerys"', () => {
    const usage = describePhotoUsage({ galleries: ['g1', 'g2'], blogs: ['a', 'b'], portfolio: false })
    expect(usage.summary).toBe('Used in 2 blog posts, 2 galleries')
  })

  it('mentions the portfolio but does not count it as a blocking reference', () => {
    const usage = describePhotoUsage({ galleries: [], blogs: [], portfolio: true })
    expect(usage.total).toBe(0)
    expect(usage.summary).toBe('Used in the public portfolio')
  })

  it('survives a photo document written before usedIn existed', () => {
    expect(describePhotoUsage(undefined).total).toBe(0)
    expect(describePhotoUsage(null).summary).toBe('Not used anywhere')
    expect(describePhotoUsage({}).total).toBe(0)
  })
})
