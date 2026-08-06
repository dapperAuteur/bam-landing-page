// Featured-rail ordering. BAM picks the order of featured posts with the
// nullable `featuredOrder` int on blog_posts (set from the admin posts list
// or the post editor). Sort contract:
//
//   1. featuredOrder ascending
//   2. posts without an order come last ("nulls last")
//   3. ties (and the unordered tail) fall back to publishDate descending
//
// Back-compat: 999 was the legacy "no order chosen" sentinel written by the
// old admin forms and importer defaults, so existing rows carry it. Treat it
// exactly like null so those posts also land in the date-sorted tail instead
// of pinning at position 999.

const LEGACY_UNSET_SENTINEL = 999

export interface FeaturedSortable {
  featuredOrder?: number | null
  publishDate: string
}

function orderOf(post: FeaturedSortable): number | null {
  const o = post.featuredOrder
  if (o == null || o === LEGACY_UNSET_SENTINEL) return null
  return o
}

export function compareFeaturedOrder(a: FeaturedSortable, b: FeaturedSortable): number {
  const ao = orderOf(a)
  const bo = orderOf(b)
  if (ao != null && bo != null && ao !== bo) return ao - bo
  if (ao != null && bo == null) return -1
  if (ao == null && bo != null) return 1
  return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
}

/** Non-mutating convenience for featured rails. */
export function sortFeatured<T extends FeaturedSortable>(posts: T[]): T[] {
  return [...posts].sort(compareFeaturedOrder)
}
