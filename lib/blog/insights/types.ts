/**
 * Precomputed "what the AI would say" content for the interactive blog demos.
 *
 * These widgets used to call a live model on every click. That made the same
 * demo say something different to every reader (and to the same reader twice),
 * which is the wrong behavior for reference content sitting inside an article --
 * a reader who returns to check a detail should find the same words. It also
 * meant latency, spinners, error states, and per-click cost on a static page.
 *
 * So the responses are authored once and stored. Content is structured blocks
 * rather than an HTML string on purpose:
 *   - no dangerouslySetInnerHTML, so no sanitization question
 *   - typed, so a malformed entry fails the build rather than the page
 *   - portable: this shape maps cleanly onto a DB row if the content ever moves
 *     into the CMS and gets edited from the admin instead of from the repo
 */

export type InsightBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string }

export interface Insight {
  /** Modal heading. */
  title: string
  blocks: InsightBlock[]
}

/**
 * One selectable option in a demo: the label a reader clicks and the response
 * they get. `id` is the stable key used by the page's own data (a species name,
 * a topic key, a persona command).
 */
export interface InsightOption {
  id: string
  /** Button/select label. */
  label: string
  /** Short hint shown under the label where the layout has room. */
  hint?: string
  insight: Insight
}

/** Look an option up by id, tolerating an unknown id from stale page state. */
export function findInsight(
  options: readonly InsightOption[],
  id: string | null | undefined
): InsightOption | undefined {
  if (!id) return undefined
  return options.find((option) => option.id === id)
}
