import { describe, expect, it } from 'vitest'
import { defineComponent, h, type ComputedRef } from 'vue'
import { mount } from '@vue/test-utils'
import { useUi } from './useUi'
import { createUI } from '../plugin'
import type { UIConfig, UiOverrides } from '../types'

type Slot = 'root' | 'icon'
const base = { root: 'rounded-md bg-primary px-4', icon: 'size-4' }

function run(opts: { ui?: UiOverrides<Slot>; class?: unknown; config?: UIConfig | false }) {
  let result!: ComputedRef<Record<Slot, string>>
  const Probe = defineComponent({
    setup() {
      result = useUi<Slot>('button', () => base, {
        ui: () => opts.ui,
        class: () => opts.class,
        root: 'root',
      })
      return () => h('div')
    },
  })
  const plugins = opts.config === false ? [] : [createUI(opts.config ?? {})]
  mount(Probe, { global: { plugins } })
  return result.value
}

const classes = (s: string) => s.split(/\s+/).filter(Boolean)

describe('useUi', () => {
  it('returns base classes when nothing overrides them', () => {
    expect(run({})).toEqual(base)
  })

  it('lets a global default replace a conflicting base class', () => {
    const r = run({ config: { ui: { button: { root: 'rounded-none' } } } })
    expect(classes(r.root)).toContain('rounded-none')
    expect(classes(r.root)).not.toContain('rounded-md')
  })

  it('lets the ui prop beat the global default', () => {
    const r = run({
      ui: { root: 'rounded-full' },
      config: { ui: { button: { root: 'rounded-none' } } },
    })
    expect(classes(r.root)).toContain('rounded-full')
    expect(classes(r.root)).not.toContain('rounded-none')
    expect(classes(r.root)).not.toContain('rounded-md')
  })

  it('applies consumer class to the root slot only and lets it win', () => {
    const r = run({ class: 'bg-red-500' })
    expect(classes(r.root).filter((c) => c.startsWith('bg-'))).toEqual(['bg-red-500'])
    expect(r.icon).toBe('size-4')
  })

  it('works without the plugin installed', () => {
    expect(() => run({ config: false })).not.toThrow()
    expect(run({ config: false })).toEqual(base)
  })
})
