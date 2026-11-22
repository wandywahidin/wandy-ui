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
  // Colored text on the page: outline/ghost buttons, Field errors, links.
  ['primary', 'background'],
  ['primary', 'surface'],
  ['danger', 'background'],
  ['danger', 'surface'],
]

describe.each(['light', 'dark'] as const)('%s theme contrast', (mode) => {
  it.each(pairs)('%s on %s is at least 4.5:1', (fg, bg) => {
    const ratio = contrastRatio(tokens[mode][fg], tokens[mode][bg])
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  // WCAG 1.4.11 non-text contrast: control boundaries (checkbox, radio, input,
  // switch track) are drawn with `border`, so it must reach 3:1 on its backgrounds.
  it.each([
    ['border', 'background'],
    ['border', 'surface'],
  ] as Array<[keyof ColorTokens, keyof ColorTokens]>)('%s on %s is at least 3:1', (fg, bg) => {
    expect(contrastRatio(tokens[mode][fg], tokens[mode][bg])).toBeGreaterThanOrEqual(3)
  })
})
