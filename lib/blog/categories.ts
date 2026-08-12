/**
 * Category helpers for the blog admin editor.
 *
 * The blog post model keeps `category` as a SINGLE string (tags cover multi-labeling),
 * and the field used to be a bare text input. Free text drifted: production carries 20
 * distinct category values across ~51 posts, 11 of them used exactly once, with
 * near-collisions already in the data ("Health & Longevity" next to "Health & Data").
 *
 * These functions exist so the editor can show what already exists, filter it as the
 * author types, and warn before "Software Dev" gets created next to "Software
 * Development". Everything here is pure so it can be unit tested without React or Mongo.
 *
 * Nothing here renames, merges, or migrates existing categories. It only informs the
 * choice at the moment a new one would be typed.
 */

export interface CategoryOption {
  name: string
  count: number
}

/**
 * Fold a category into the form used for comparison only. Never written to the database.
 *
 * Lowercase, punctuation and ampersands to spaces, whitespace collapsed, joining words
 * dropped, and a trailing plural "s" dropped per token. The plural strip skips short
 * tokens (so "US History" does not become "u history") and skips "ss" endings (so
 * "Fitness" does not become "Fitnes" in a way that reads as a typo when surfaced.)
 *
 * Dropping "and", "the", and "of" is what makes typing "Health and Longevity" resolve to
 * the existing "Health & Longevity" rather than creating a third health category. The
 * ampersand is already gone by then, so the two spellings have to meet somewhere.
 */
export function normalizeCategory(input: string): string {
  const tokens = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(stripPlural)

  const meaningful = tokens.filter(t => !JOINING_WORDS.has(t))
  // A name made of nothing but joining words keeps them, so it does not normalize to
  // the empty string and silently match every other empty-normalizing name.
  return (meaningful.length ? meaningful : tokens).join(' ')
}

const JOINING_WORDS = new Set(['and', 'the', 'of'])

function stripPlural(token: string): string {
  if (token.length <= 3) return token
  if (!token.endsWith('s')) return token
  if (token.endsWith('ss')) return token
  return token.slice(0, -1)
}

function tokensOf(normalized: string): string[] {
  return normalized ? normalized.split(' ') : []
}

/** Case-insensitive substring match on the raw display name. */
export function filterCategories(options: CategoryOption[], query: string): CategoryOption[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return options
  return options.filter(o => o.name.toLowerCase().includes(needle))
}

/** The option whose normalized form equals the typed text, if there is one. */
export function findExactMatch(options: CategoryOption[], query: string): CategoryOption | null {
  const target = normalizeCategory(query)
  if (!target) return null
  return options.find(o => normalizeCategory(o.name) === target) ?? null
}

/** Standard Levenshtein distance, two-row DP. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  let curr = new Array<number>(b.length + 1)

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    const swap = prev
    prev = curr
    curr = swap
  }

  return prev[b.length]
}

/**
 * True when `short` is an abbreviated token-prefix of `long`: every token but the last
 * matches exactly, and the last is a prefix of at least three characters.
 *
 * This is the rule that catches "Software Dev" against "Software Development", which
 * edit distance alone misses (that pair is 8 edits apart). The three-character floor
 * keeps a one- or two-letter fragment from matching everything it happens to start.
 */
function isTokenPrefix(short: string, long: string): boolean {
  const s = tokensOf(short)
  const l = tokensOf(long)
  if (!s.length || s.length > l.length) return false

  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] !== l[i]) return false
  }

  const last = s[s.length - 1]
  const against = l[s.length - 1]
  return last.length >= 3 && against.startsWith(last)
}

/** Same words, any order: "Longevity & Health" against "Health & Longevity". */
function sameTokenSet(a: string, b: string): boolean {
  const sa = tokensOf(a)
  const sb = tokensOf(b)
  if (!sa.length || sa.length !== sb.length) return false
  const sorted = (t: string[]) => [...t].sort().join(' ')
  return sorted(sa) === sorted(sb)
}

/**
 * The edit-distance budget, scaled to the longer string.
 *
 * Deliberately tight. An over-eager matcher is worse than the drift it is trying to
 * prevent: warning that "Birds" looks like "Biology" trains the author to click past
 * every warning, and then the one real catch gets clicked past too. Short names get no
 * budget at all, because at four or five characters almost anything is two edits from
 * anything else.
 */
function distanceBudget(maxLength: number): number {
  if (maxLength >= 9) return 2
  if (maxLength >= 5) return 1
  return 0
}

/**
 * Is `candidate` close enough to `existing` that the author probably meant the existing one?
 *
 * Exact normalized equality returns false on purpose: that is not a near-duplicate, it is
 * the same category, and the caller should offer the existing option instead of creating.
 */
export function isNearDuplicate(candidate: string, existing: string): boolean {
  const a = normalizeCategory(candidate)
  const b = normalizeCategory(existing)
  if (!a || !b) return false
  if (a === b) return false

  if (sameTokenSet(a, b)) return true
  if (isTokenPrefix(a, b) || isTokenPrefix(b, a)) return true

  return levenshtein(a, b) <= distanceBudget(Math.max(a.length, b.length))
}

/**
 * Existing categories that the typed text is suspiciously close to, most-used first.
 * Empty when the text is an exact match for something that already exists.
 */
export function findNearDuplicates(
  query: string,
  options: CategoryOption[],
  limit = 3,
): CategoryOption[] {
  if (!normalizeCategory(query)) return []
  return options
    .filter(o => isNearDuplicate(query, o.name))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit)
}

export type CategoryResolution =
  | { kind: 'empty' }
  | { kind: 'existing'; option: CategoryOption }
  | { kind: 'create'; value: string; nearDuplicates: CategoryOption[] }

/**
 * What the typed text means: nothing, an existing category, or a new one (with any
 * near-duplicate warnings attached). An exact match never offers creation.
 */
export function resolveCategoryInput(query: string, options: CategoryOption[]): CategoryResolution {
  const value = query.trim().replace(/\s+/g, ' ')
  if (!value) return { kind: 'empty' }

  const exact = findExactMatch(options, value)
  if (exact) return { kind: 'existing', option: exact }

  return { kind: 'create', value, nearDuplicates: findNearDuplicates(value, options) }
}

/** Count descending, then alphabetical. Used by the categories API route. */
export function sortCategoryCounts(entries: CategoryOption[]): CategoryOption[] {
  return [...entries].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
