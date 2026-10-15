import { describe, expect, it } from 'vitest'
import { computePhotoUsage, describePhotoUsage, libraryPhotoIdsInPost, photoIdsForPost } from '../photos/usage'

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

const LIB = [
  { id: 'p1', originalUrl: 'https://res.cloudinary.com/demo/image/upload/v1/one.jpg', cloudinaryId: 'lib/one' },
  { id: 'p2', originalUrl: 'https://res.cloudinary.com/demo/image/upload/v1/two.jpg', cloudinaryId: 'lib/two' },
  { id: 'p3' }, // no URL: can only be found by id
]

describe('libraryPhotoIdsInPost', () => {
  it('finds a photo inserted in the body by URL, as the editor does', () => {
    const content = `Intro\n\n![a runner](${LIB[0].originalUrl})\n`
    expect(libraryPhotoIdsInPost({ content }, LIB)).toEqual(['p1'])
  })

  it('finds every photo in a carousel', () => {
    const content = `<Carousel images={[\n  { url: "${LIB[0].originalUrl}", alt: "" },\n  { url: "${LIB[1].originalUrl}", alt: "" }\n]} />`
    expect(libraryPhotoIdsInPost({ content }, LIB)).toEqual(['p1', 'p2'])
  })

  it('finds an id-less hero by its URL, in both the object and bare-string shapes', () => {
    expect(libraryPhotoIdsInPost({ featuredImage: { url: LIB[1].originalUrl } }, LIB)).toEqual(['p2'])
    expect(libraryPhotoIdsInPost({ featuredImage: LIB[1].originalUrl }, LIB)).toEqual(['p2'])
  })

  it('keeps named ids first and does not count a photo twice', () => {
    expect(
      libraryPhotoIdsInPost({ featuredImage: { id: 'p1', url: LIB[0].originalUrl }, content: LIB[0].originalUrl }, LIB),
    ).toEqual(['p1'])
  })

  it('finds nothing in a post with no library photos', () => {
    expect(libraryPhotoIdsInPost({ content: 'no images', featuredImage: null }, LIB)).toEqual([])
    expect(libraryPhotoIdsInPost(null, LIB)).toEqual([])
  })
})

describe('computePhotoUsage', () => {
  it('lists posts by slug and galleries by id, matching gallery media by id or by file', () => {
    const usage = computePhotoUsage(
      LIB,
      [
        { slug: 'hero-post', featuredImage: { id: 'p1' } },
        { slug: 'body-post', content: LIB[0].originalUrl },
        { slug: 'other', content: 'nothing' },
        { content: LIB[1].originalUrl }, // no slug: cannot be named, so not counted
      ],
      [
        { galleryId: 'g-by-id', photos: [{ id: 'p2' }] },
        { galleryId: 'g-by-file', photos: [{ id: 'gallery-own-id', cloudinaryId: 'lib/two' }] },
        { galleryId: 'g-unrelated', photos: [{ id: 'x', cloudinaryId: 'galleries/x' }] },
        { galleryId: 'g-empty' },
      ],
    )
    expect(usage.get('p1')).toEqual({ blogs: ['hero-post', 'body-post'], galleries: [] })
    expect(usage.get('p2')).toEqual({ blogs: [], galleries: ['g-by-id', 'g-by-file'] })
    expect(usage.get('p3')).toEqual({ blogs: [], galleries: [] })
  })

  it('does not match a gallery item to a URL-less, file-less photo by an undefined file', () => {
    const usage = computePhotoUsage([{ id: 'p3' }], [], [{ galleryId: 'g', photos: [{ id: 'other' }] }])
    expect(usage.get('p3')).toEqual({ blogs: [], galleries: [] })
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
