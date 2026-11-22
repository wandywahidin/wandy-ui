// Compile-time checks, enforced by `pnpm typecheck` (vue-tsc). The runtime assertion is incidental.
import { describe, expect, it } from 'vitest'
import { createUI } from './plugin'
import type { UIConfig } from './types'

describe('UIConfig typing', () => {
  it('accepts known parts and rejects typos', () => {
    const ok: UIConfig = {
      ui: {
        button: { root: 'rounded-full', spinner: 'size-3' },
        checkbox: { box: 'size-5' },
        field: { required: 'text-primary' },
        dialog: { overlay: 'backdrop-blur-sm' },
      },
    }
    // @ts-expect-error `rot` is not a Button part
    const typo: UIConfig = { ui: { button: { rot: 'x' } } }
    // @ts-expect-error `buton` is not a component name
    const badName: UIConfig = { ui: { buton: { root: 'x' } } }
    expect([ok, typo, badName]).toHaveLength(3)
    expect(createUI(ok)).toBeDefined()
  })
})
