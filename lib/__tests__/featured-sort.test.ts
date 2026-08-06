import { describe, expect, it } from 'vitest'
import { compareFeaturedOrder, sortFeatured } from '../blog/featuredSort'

const post = (slug: string, featuredOrder: number | null | undefined, publishDate: string) => ({
  slug,
  featuredOrder,
  publishDate,
})

describe('compareFeaturedOrder', () => {
  it('sorts by featuredOrder ascending', () => {
    const sorted = sortFeatured([
      post('c', 3, '2026-01-01'),
      post('a', 1, '2026-01-01'),
      post('b', 2, '2026-01-01'),
    ])
    expect(sorted.map(p => p.slug)).toEqual(['a', 'b', 'c'])
  })

  it('puts posts without an order after every ordered post (nulls last)', () => {
    const sorted = sortFeatured([
      post('unset-null', null, '2026-07-01'),
      post('ordered-late', 5, '2020-01-01'),
      post('unset-undefined', undefined, '2026-06-01'),
      post('ordered-early', 1, '2019-01-01'),
    ])
    expect(sorted.map(p => p.slug)).toEqual([
      'ordered-early',
      'ordered-late',
      'unset-null',
      'unset-undefined',
    ])
  })

  it('treats the legacy 999 sentinel exactly like null', () => {
    const sorted = sortFeatured([
      post('legacy-sentinel', 999, '2026-07-01'),
      post('ordered', 2, '2020-01-01'),
      post('unset', null, '2026-01-01'),
    ])
    expect(sorted.map(p => p.slug)).toEqual(['ordered', 'legacy-sentinel', 'unset'])
  })

  it('breaks order ties and sorts the unordered tail by publishDate descending', () => {
    const sorted = sortFeatured([
      post('tie-old', 1, '2025-01-01'),
      post('unset-old', null, '2025-06-01'),
      post('tie-new', 1, '2026-01-01'),
      post('unset-new', null, '2026-06-01'),
    ])
    expect(sorted.map(p => p.slug)).toEqual(['tie-new', 'tie-old', 'unset-new', 'unset-old'])
  })

  it('is a proper comparator: antisymmetric for a mixed pair', () => {
    const a = post('a', 1, '2026-01-01')
    const b = post('b', null, '2026-02-01')
    expect(compareFeaturedOrder(a, b)).toBeLessThan(0)
    expect(compareFeaturedOrder(b, a)).toBeGreaterThan(0)
  })

  it('does not mutate its input', () => {
    const input = [post('b', 2, '2026-01-01'), post('a', 1, '2026-01-01')]
    sortFeatured(input)
    expect(input.map(p => p.slug)).toEqual(['b', 'a'])
  })
})
