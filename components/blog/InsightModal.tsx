'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { Insight, InsightBlock } from '@/lib/blog/insights/types'

/**
 * Shared modal for the precomputed insight demos.
 *
 * Replaces several hand-rolled modals that were a bare `fixed inset-0` div with
 * a click-outside handler: no role, no aria-modal, no Escape key, no focus
 * management, so keyboard and screen-reader users could not open, read, or
 * close them. This one is a real dialog.
 */

function Block({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case 'heading':
      return <h4 className="text-lg font-bold text-gray-900 mt-5 mb-2 first:mt-0">{block.text}</h4>
    case 'list':
      return (
        <ul className="list-disc pl-5 space-y-1.5 my-3 text-gray-700">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    case 'note':
      return (
        <p className="my-3 border-l-4 border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {block.text}
        </p>
      )
    case 'paragraph':
    default:
      return <p className="my-3 leading-relaxed text-gray-700">{block.text}</p>
  }
}

export default function InsightModal({
  insight,
  onClose,
  /** Shown under the title so readers know why this never changes. */
  footnote = 'Written for this article, so it reads the same every time you come back.',
}: {
  insight: Insight | null
  onClose: () => void
  footnote?: string
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const isOpen = insight !== null

  // Escape to close, and keep Tab inside the dialog while it is open.
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeyDown)

    // Move focus into the dialog so a keyboard user lands on the content.
    dialogRef.current?.focus()

    // Stop the page behind the dialog from scrolling.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onKeyDown])

  if (!insight) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl outline-none md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 id="insight-modal-title" className="pr-10 text-2xl font-bold text-gray-900">
          {insight.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">{footnote}</p>

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {insight.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>
    </div>
  )
}
