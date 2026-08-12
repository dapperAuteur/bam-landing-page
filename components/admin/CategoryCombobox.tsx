'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  filterCategories,
  findExactMatch,
  resolveCategoryInput,
  type CategoryOption,
} from '@/lib/blog/categories'

interface CategoryComboboxProps {
  /** The current category. A post has exactly one; tags cover multi-labeling. */
  value: string
  onChange: (value: string) => void
  /** Existing categories with post counts, from /api/admin/blog/categories. */
  options: CategoryOption[]
  loading?: boolean
  className?: string
  inputClassName?: string
  labelId?: string
}

type Item =
  | { kind: 'option'; option: CategoryOption }
  | { kind: 'create'; value: string }

/**
 * Single-select category picker for the blog editor.
 *
 * Three jobs, in order of importance:
 *   1. Show what already exists, so a category gets reused instead of reinvented.
 *   2. Filter it as the author types.
 *   3. Warn before a near-duplicate gets created, without forbidding it.
 *
 * Creating a category is always a deliberate act: a click on the create row, or Enter
 * while that row is highlighted. Typing alone never creates anything, and the create row
 * is never auto-highlighted, so Enter can never create by reflex.
 */
export default function CategoryCombobox({
  value,
  onChange,
  options,
  loading = false,
  className = '',
  inputClassName = '',
  labelId,
}: CategoryComboboxProps) {
  const baseId = useId()
  const listboxId = `${baseId}-listbox`
  const warningId = `${baseId}-warning`

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // While closed the input mirrors the committed value, so an abandoned edit reverts
  // rather than leaving stale text that looks saved.
  useEffect(() => {
    if (!open) setQuery(value)
  }, [value, open])

  /**
   * The current value counts as an option even when the server has never seen it, so a
   * category created a moment ago reads as chosen rather than being offered for creation
   * a second time. Count 0 marks it as not yet saved to any post.
   */
  const allOptions = useMemo<CategoryOption[]>(() => {
    const current = value.trim()
    if (!current) return options
    if (findExactMatch(options, current)) return options
    return [...options, { name: current, count: 0 }]
  }, [options, value])

  const resolution = useMemo(() => resolveCategoryInput(query, allOptions), [query, allOptions])

  const items = useMemo<Item[]>(() => {
    const matches = filterCategories(allOptions, query).map<Item>(option => ({
      kind: 'option',
      option,
    }))
    if (resolution.kind === 'create') {
      return [...matches, { kind: 'create', value: resolution.value }]
    }
    return matches
  }, [allOptions, query, resolution])

  const nearDuplicates = resolution.kind === 'create' ? resolution.nearDuplicates : []
  const showWarning = open && nearDuplicates.length > 0

  // Highlight the first real option so Enter picks something existing. When the only row
  // is "Create", nothing is highlighted: creation has to be asked for.
  useEffect(() => {
    setActiveIndex(items.length > 0 && items[0].kind === 'option' ? 0 : -1)
  }, [items])

  // Close on an outside click. Blur alone is not enough: a click on an option blurs the
  // input before the click lands.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  function commit(next: string) {
    onChange(next)
    setQuery(next)
    setOpen(false)
    setActiveIndex(-1)
  }

  function chooseItem(item: Item) {
    commit(item.kind === 'option' ? item.option.name : item.value)
  }

  function moveActive(delta: number) {
    if (!open) {
      setOpen(true)
      return
    }
    if (items.length === 0) return
    const start = activeIndex === -1 ? (delta > 0 ? -1 : items.length) : activeIndex
    const next = (start + delta + items.length) % items.length
    setActiveIndex(next)
    scrollIntoView(next)
  }

  function scrollIntoView(index: number) {
    const el = listRef.current?.children[index] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveActive(-1)
        break
      case 'Home':
        if (open && items.length > 0) {
          event.preventDefault()
          setActiveIndex(0)
          scrollIntoView(0)
        }
        break
      case 'End':
        if (open && items.length > 0) {
          event.preventDefault()
          setActiveIndex(items.length - 1)
          scrollIntoView(items.length - 1)
        }
        break
      case 'Enter':
        if (open && activeIndex >= 0 && activeIndex < items.length) {
          event.preventDefault()
          chooseItem(items[activeIndex])
        } else if (open && resolution.kind === 'existing') {
          // Typed text that exactly matches an existing category resolves to it,
          // rather than creating a second copy under different capitalization.
          event.preventDefault()
          commit(resolution.option.name)
        }
        break
      case 'Escape':
        if (open) {
          event.preventDefault()
          setOpen(false)
          setQuery(value)
          setActiveIndex(-1)
        }
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }

  const activeId = activeIndex >= 0 ? `${baseId}-item-${activeIndex}` : undefined

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-activedescendant={activeId}
        aria-describedby={showWarning ? warningId : undefined}
        aria-labelledby={labelId}
        autoComplete="off"
        className={inputClassName}
        placeholder={loading ? 'Loading categories...' : 'Search or add a category'}
        value={query}
        onChange={event => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-300 bg-white text-sm shadow-lg">
          {/*
            The near-duplicate warning sits outside the listbox on purpose: a button inside
            a listbox is invalid ARIA and assistive tech skips it. role=status announces the
            suggestion as it appears, and aria-describedby ties it back to the input.
          */}
          {showWarning && (
            <div
              id={warningId}
              role="status"
              aria-live="polite"
              className="rounded-t-md border-b border-amber-300 bg-amber-50 px-3 py-2 text-amber-900"
            >
              <p className="mb-1">
                {nearDuplicates.length === 1 ? 'Did you mean ' : 'Close to existing categories: '}
                {nearDuplicates.map((option, i) => (
                  <span key={option.name}>
                    {i > 0 && ', '}
                    <strong>{option.name}</strong>
                  </span>
                ))}
                {nearDuplicates.length === 1 ? '?' : '.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {nearDuplicates.map(option => (
                  <button
                    key={option.name}
                    type="button"
                    className="rounded border border-amber-400 bg-white px-2 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
                    onMouseDown={event => {
                      event.preventDefault()
                      commit(option.name)
                    }}
                  >
                    Use {option.name}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-amber-800">
                Creating a new one is still allowed. Pick the create row if that is what you want.
              </p>
            </div>
          )}

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Categories"
            className="max-h-64 overflow-auto py-1"
          >
            {items.length === 0 && (
              <li className="px-3 py-2 text-gray-500">
                {loading ? 'Loading categories...' : 'No categories yet'}
              </li>
            )}

            {items.map((item, index) => {
              const active = index === activeIndex
              const isCreate = item.kind === 'create'
              const selected = item.kind === 'option' && item.option.name === value
              return (
                <li
                  key={isCreate ? '__create__' : item.option.name}
                  id={`${baseId}-item-${index}`}
                  role="option"
                  aria-selected={active}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2 ${
                    active ? 'bg-blue-50 text-blue-900' : 'text-gray-800'
                  }`}
                  // mousedown, not click: click fires after blur, and blur can close the list.
                  onMouseDown={event => {
                    event.preventDefault()
                    chooseItem(item)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {isCreate ? (
                    <span className="font-medium text-blue-700">
                      Create &ldquo;{item.value}&rdquo;
                    </span>
                  ) : (
                    <>
                      <span className={selected ? 'font-semibold' : undefined}>
                        {item.option.name}
                      </span>
                      <span className="shrink-0 text-xs text-gray-500">
                        {item.option.count === 0
                          ? 'not saved yet'
                          : `${item.option.count} ${item.option.count === 1 ? 'post' : 'posts'}`}
                      </span>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
