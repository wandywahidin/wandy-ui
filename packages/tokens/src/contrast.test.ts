import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrast'
import { tokens, type ColorTokens } from './tokens'

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
  })

  it('returns ~4.48 for #777777 on white', () => {
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 1)
  })

  it('is symmetric', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1)
  })
})

const pairs: Array<[keyof ColorTokens, keyof ColorTokens]> = [
  ['foreground', 'background'],
  ['foreground', 'surface'],
  ['muted-foreground', 'surface'],
  ['primary-foreground', 'primary'],
  ['danger-foreground', 'danger'],
  ['success-foreground', 'success'],
  ['warning-foreground', 'warning'],
]

describe.each(['light', 'dark'] as const)('%s theme contrast', (mode) => {
  it.each(pairs)('%s on %s is at least 4.5:1', (fg, bg) => {
    const ratio = contrastRatio(tokens[mode][fg], tokens[mode][bg])
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
})
