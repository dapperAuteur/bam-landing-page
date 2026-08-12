import { describe, expect, it } from 'vitest'
import {
  filterCategories,
  findExactMatch,
  findNearDuplicates,
  isNearDuplicate,
  levenshtein,
  normalizeCategory,
  resolveCategoryInput,
  sortCategoryCounts,
  type CategoryOption,
} from '../blog/categories'

/**
 * The real category list from production (bam_portfolio.blog_posts), because the whole
 * point of the feature is behaving well against the drift that already exists there.
 */
const LIVE: CategoryOption[] = [
  { name: 'Uncategorized', count: 19 },
  { name: 'Athletics', count: 4 },
  { name: 'Software Development', count: 4 },
  { name: 'Health & Longevity', count: 4 },
  { name: 'Education', count: 3 },
  { name: 'Statistics', count: 2 },
  { name: 'Performance', count: 2 },
  { name: 'Spirituality', count: 1 },
  { name: 'Voiceover', count: 1 },
  { name: 'Community & Mentorship', count: 1 },
  { name: 'Science', count: 1 },
  { name: 'Centenarian', count: 1 },
  { name: 'Photography', count: 1 },
  { name: 'Biology', count: 1 },
  { name: 'Endocannabinoid System', count: 1 },
  { name: 'AI Engineering', count: 1 },
  { name: 'Health & Data', count: 1 },
  { name: 'Rituals', count: 1 },
  { name: 'Birds', count: 1 },
  { name: 'US History', count: 1 },
]

describe('filterCategories', () => {
  it('matches on substring, case-insensitively', () => {
    expect(filterCategories(LIVE, 'health').map(o => o.name)).toEqual([
      'Health & Longevity',
      'Health & Data',
    ])
    expect(filterCategories(LIVE, 'HEALTH').map(o => o.name)).toEqual([
      'Health & Longevity',
      'Health & Data',
    ])
  })

  it('matches mid-string, not only at the start', () => {
    expect(filterCategories(LIVE, 'graph').map(o => o.name)).toEqual(['Photography'])
  })

  it('returns everything for an empty or whitespace query', () => {
    expect(filterCategories(LIVE, '')).toHaveLength(LIVE.length)
    expect(filterCategories(LIVE, '   ')).toHaveLength(LIVE.length)
  })

  it('returns nothing when no name contains the query', () => {
    expect(filterCategories(LIVE, 'quantum')).toEqual([])
  })
})

describe('normalizeCategory', () => {
  it('treats "Software Dev" and "software-dev" as the same', () => {
    expect(normalizeCategory('Software Dev')).toBe(normalizeCategory('software-dev'))
    expect(normalizeCategory('Software Dev')).toBe('software dev')
  })

  it('collapses whitespace, strips punctuation, and drops ampersands', () => {
    expect(normalizeCategory('  Health   &   Longevity!  ')).toBe('health longevity')
  })

  it('drops joining words so "and" and "&" spellings meet', () => {
    expect(normalizeCategory('Health and Longevity')).toBe('health longevity')
    expect(normalizeCategory('Science of Sport')).toBe('science sport')
  })

  it('keeps joining words when they are the whole name', () => {
    expect(normalizeCategory('The')).toBe('the')
  })

  it('treats a trailing plural s as equal', () => {
    expect(normalizeCategory('Bird')).toBe(normalizeCategory('Birds'))
    expect(normalizeCategory('Ritual')).toBe(normalizeCategory('Rituals'))
  })

  it('leaves short tokens and double-s endings alone', () => {
    // "US History" must not normalize to "u history".
    expect(normalizeCategory('US History')).toBe('us history')
    expect(normalizeCategory('Fitness')).toBe('fitness')
  })

  it('returns an empty string for input with no letters or digits', () => {
    expect(normalizeCategory('   &  ')).toBe('')
  })
})

describe('findExactMatch', () => {
  it('matches across case, punctuation, and plural spelling', () => {
    expect(findExactMatch(LIVE, 'software development')?.name).toBe('Software Development')
    expect(findExactMatch(LIVE, 'Health & Longevity')?.name).toBe('Health & Longevity')
    expect(findExactMatch(LIVE, 'bird')?.name).toBe('Birds')
  })

  it('returns null for a name that is not in the list, and for empty input', () => {
    expect(findExactMatch(LIVE, 'Software Dev')).toBeNull()
    expect(findExactMatch(LIVE, '  ')).toBeNull()
  })
})

describe('levenshtein', () => {
  it('measures single-character edits', () => {
    expect(levenshtein('science', 'science')).toBe(0)
    expect(levenshtein('science', 'scienc')).toBe(1)
    expect(levenshtein('science', 'sciense')).toBe(1)
  })

  it('handles empty strings', () => {
    expect(levenshtein('', 'birds')).toBe(5)
    expect(levenshtein('birds', '')).toBe(5)
  })
})

describe('isNearDuplicate', () => {
  it('flags "Software Dev" against "Software Development"', () => {
    expect(isNearDuplicate('Software Dev', 'Software Development')).toBe(true)
  })

  it('does NOT flag "Birds" against "Biology"', () => {
    // Over-eager matching is worse than the drift it is trying to prevent: an author who
    // learns to click past the warning clicks past the real one too.
    expect(isNearDuplicate('Birds', 'Biology')).toBe(false)
    expect(isNearDuplicate('Biology', 'Birds')).toBe(false)
  })

  it('does not flag the genuinely distinct pairs already in production', () => {
    expect(isNearDuplicate('Health & Data', 'Health & Longevity')).toBe(false)
    expect(isNearDuplicate('Science', 'Statistics')).toBe(false)
    expect(isNearDuplicate('Centenarian', 'Health & Longevity')).toBe(false)
    expect(isNearDuplicate('Performance', 'Photography')).toBe(false)
    expect(isNearDuplicate('Education', 'AI Engineering')).toBe(false)
  })

  it('flags plural and punctuation restatements', () => {
    expect(isNearDuplicate('software development', 'Software Development')).toBe(false)
    expect(isNearDuplicate('Statistic', 'Statistics')).toBe(false)
    expect(isNearDuplicate('Longevity & Health', 'Health & Longevity')).toBe(true)
  })

  it('flags a one-character typo on a long name', () => {
    expect(isNearDuplicate('Photograpy', 'Photography')).toBe(true)
  })

  it('gives short names no edit budget', () => {
    // Four letters apart by one edit is coincidence, not a typo worth warning about.
    expect(isNearDuplicate('Bird', 'Bard')).toBe(false)
  })

  it('requires at least three characters before treating a fragment as a prefix', () => {
    expect(isNearDuplicate('So', 'Software Development')).toBe(false)
    expect(isNearDuplicate('Soft', 'Software Development')).toBe(true)
  })

  it('is false for empty input on either side', () => {
    expect(isNearDuplicate('', 'Biology')).toBe(false)
    expect(isNearDuplicate('Biology', '  ')).toBe(false)
  })
})

describe('findNearDuplicates', () => {
  it('surfaces "Software Development" for "Software Dev"', () => {
    expect(findNearDuplicates('Software Dev', LIVE).map(o => o.name)).toEqual([
      'Software Development',
    ])
  })

  it('surfaces nothing for "Birds"', () => {
    // "Birds" is already an existing category, so it is an exact match, not a near one.
    expect(findNearDuplicates('Birds', LIVE)).toEqual([])
  })

  it('surfaces nothing for a genuinely new name', () => {
    expect(findNearDuplicates('Urban Planning', LIVE)).toEqual([])
  })

  it('sorts suggestions by post count, most used first', () => {
    const options: CategoryOption[] = [
      { name: 'Health & Longevity', count: 4 },
      { name: 'Health Longevity Notes', count: 9 },
    ]
    expect(findNearDuplicates('Health', options).map(o => o.name)).toEqual([
      'Health Longevity Notes',
      'Health & Longevity',
    ])
  })
})

describe('resolveCategoryInput', () => {
  it('returns the existing option on an exact match rather than offering creation', () => {
    const result = resolveCategoryInput('Software Development', LIVE)
    expect(result.kind).toBe('existing')
    if (result.kind === 'existing') expect(result.option.name).toBe('Software Development')
  })

  it('returns the existing option for a differently-cased or punctuated exact match', () => {
    const result = resolveCategoryInput('software development', LIVE)
    expect(result.kind).toBe('existing')
    if (result.kind === 'existing') expect(result.option.name).toBe('Software Development')

    // "and" spelled out resolves to the "&" spelling that already exists.
    const amp = resolveCategoryInput('Health and Longevity', LIVE)
    expect(amp.kind).toBe('existing')
    if (amp.kind === 'existing') expect(amp.option.name).toBe('Health & Longevity')
  })

  it('offers creation with a warning for a near-duplicate', () => {
    const result = resolveCategoryInput('Software Dev', LIVE)
    expect(result.kind).toBe('create')
    if (result.kind === 'create') {
      expect(result.value).toBe('Software Dev')
      expect(result.nearDuplicates.map(o => o.name)).toEqual(['Software Development'])
    }
  })

  it('offers creation with no warning for a genuinely new name', () => {
    const result = resolveCategoryInput('Urban Planning', LIVE)
    expect(result.kind).toBe('create')
    if (result.kind === 'create') expect(result.nearDuplicates).toEqual([])
  })

  it('reports empty input as empty, never as a creation', () => {
    expect(resolveCategoryInput('', LIVE).kind).toBe('empty')
    expect(resolveCategoryInput('   ', LIVE).kind).toBe('empty')
  })

  it('trims and collapses the value it would create', () => {
    const result = resolveCategoryInput('  Urban   Planning  ', LIVE)
    expect(result.kind).toBe('create')
    if (result.kind === 'create') expect(result.value).toBe('Urban Planning')
  })
})

describe('sortCategoryCounts', () => {
  it('sorts by count descending, then alphabetically', () => {
    const sorted = sortCategoryCounts([
      { name: 'Science', count: 1 },
      { name: 'Athletics', count: 4 },
      { name: 'Uncategorized', count: 19 },
      { name: 'Biology', count: 1 },
      { name: 'Software Development', count: 4 },
    ])
    expect(sorted.map(o => o.name)).toEqual([
      'Uncategorized',
      'Athletics',
      'Software Development',
      'Biology',
      'Science',
    ])
  })

  it('does not mutate the input', () => {
    const input: CategoryOption[] = [
      { name: 'Science', count: 1 },
      { name: 'Athletics', count: 4 },
    ]
    sortCategoryCounts(input)
    expect(input.map(o => o.name)).toEqual(['Science', 'Athletics'])
  })
})
