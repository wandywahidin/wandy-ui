import { afterEach, describe, expect, it, vi } from 'vitest'
import { useRovingFocus } from './useRovingFocus'

function setup(disabled: number[] = [], opts: { loop?: boolean } = {}) {
  document.body.innerHTML = ''
  const items = [0, 1, 2].map((i) => {
    const b = document.createElement('button')
    b.textContent = `#${i + 1}`
    if (disabled.includes(i)) b.disabled = true
    document.body.append(b)
    return b
  })
  const onMove = vi.fn()
  const { onKeydown } = useRovingFocus({
    items: () => items,
    orientation: 'vertical',
    loop: opts.loop,
    onMove,
  })
  const press = (from: HTMLElement, key: string) => {
    from.focus()
    const e = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    Object.defineProperty(e, 'target', { value: from })
    onKeydown(e)
    return e
  }
  return { items, press, onMove }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useRovingFocus', () => {
  it('skips a disabled item', () => {
    const { items, press, onMove } = setup([1])
    const e = press(items[0]!, 'ArrowDown')
    expect(document.activeElement).toBe(items[2])
    expect(onMove).toHaveBeenCalledWith(items[2], 2)
    expect(e.defaultPrevented).toBe(true)
  })

  it('skips aria-disabled items', () => {
    const { items, press } = setup()
    items[1]!.setAttribute('aria-disabled', 'true')
    press(items[0]!, 'ArrowDown')
    expect(document.activeElement).toBe(items[2])
  })

  it('loops from last to first by default', () => {
    const { items, press } = setup()
    press(items[2]!, 'ArrowDown')
    expect(document.activeElement).toBe(items[0])
  })

  it('loops backwards from first to last', () => {
    const { items, press } = setup()
    press(items[0]!, 'ArrowUp')
    expect(document.activeElement).toBe(items[2])
  })

  it('stops at the edge when loop is false', () => {
    const { items, press, onMove } = setup([], { loop: false })
    press(items[2]!, 'ArrowDown')
    expect(document.activeElement).toBe(items[2])
    expect(onMove).not.toHaveBeenCalled()
  })

  it('Home and End go to the first and last enabled items', () => {
    const { items, press } = setup([0])
    press(items[2]!, 'Home')
    expect(document.activeElement).toBe(items[1])
    press(items[1]!, 'End')
    expect(document.activeElement).toBe(items[2])
  })

  it('ignores keys of the other orientation', () => {
    const { items, press } = setup()
    const e = press(items[0]!, 'ArrowRight')
    expect(document.activeElement).toBe(items[0])
    expect(e.defaultPrevented).toBe(false)
  })

  it('does nothing and does not throw when every item is disabled', () => {
    const { items, press, onMove } = setup([0, 1, 2])
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    const e = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true })
    Object.defineProperty(e, 'target', { value: items[0] })
    expect(() =>
      useRovingFocus({ items: () => items, orientation: 'vertical' }).onKeydown(e),
    ).not.toThrow()
    expect(document.activeElement).toBe(outside)
    expect(() => press(items[0]!, 'End')).not.toThrow()
    expect(onMove).not.toHaveBeenCalled()
  })
})
