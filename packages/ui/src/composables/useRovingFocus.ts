export type RovingOrientation = 'horizontal' | 'vertical' | 'both'

export interface RovingFocusOptions {
  /** The items, in DOM order. */
  items: () => HTMLElement[]
  orientation: RovingOrientation
  /** Wrap from last to first and back. Default true. */
  loop?: boolean
  /** Called after focus moves; e.g. to select the item. */
  onMove?: (el: HTMLElement, index: number) => void
}

const NEXT: Record<RovingOrientation, string[]> = {
  horizontal: ['ArrowRight'],
  vertical: ['ArrowDown'],
  both: ['ArrowRight', 'ArrowDown'],
}
const PREV: Record<RovingOrientation, string[]> = {
  horizontal: ['ArrowLeft'],
  vertical: ['ArrowUp'],
  both: ['ArrowLeft', 'ArrowUp'],
}

function isEnabled(el: HTMLElement): boolean {
  return !(el as HTMLButtonElement).disabled && el.getAttribute('aria-disabled') !== 'true'
}

/**
 * Keyboard movement for a roving-tabindex group (Arrow keys, Home, End).
 * Disabled and aria-disabled items are skipped; with no enabled item, keys do nothing.
 */
export function useRovingFocus(opts: RovingFocusOptions): {
  onKeydown: (e: KeyboardEvent) => void
} {
  const loop = opts.loop ?? true

  function find(items: HTMLElement[], from: number, step: 1 | -1): number {
    const n = items.length
    let i = from
    // At most n steps, so an all-disabled group terminates.
    for (let k = 0; k < n; k++) {
      i += step
      if (i < 0 || i >= n) {
        if (!loop) return -1
        i = (i + n) % n
      }
      if (isEnabled(items[i]!)) return i
    }
    return -1
  }

  function onKeydown(e: KeyboardEvent) {
    const items = opts.items()
    if (!items.length) return
    const current = items.indexOf(e.target as HTMLElement)

    let target: number
    if (NEXT[opts.orientation].includes(e.key)) target = find(items, current, 1)
    else if (PREV[opts.orientation].includes(e.key))
      target = find(items, current === -1 ? items.length : current, -1)
    else if (e.key === 'Home') target = find(items, -1, 1)
    else if (e.key === 'End') target = find(items, items.length, -1)
    else return

    e.preventDefault()
    if (target === -1 || target === current) return
    const el = items[target]!
    el.focus()
    opts.onMove?.(el, target)
  }

  return { onKeydown }
}
