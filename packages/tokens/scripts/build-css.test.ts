import { describe, expect, it } from 'vitest'
import { buildCss } from './build-css'
import { tokens, colorKeys } from '../src/tokens'

function block(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`)
  expect(start, `missing ${selector} block`).toBeGreaterThanOrEqual(0)
  return css.slice(start, css.indexOf('}', start))
}

describe('buildCss', () => {
  const css = buildCss(tokens)

  it('maps Tailwind theme colors to the runtime variables', () => {
    expect(css).toContain('--color-primary: var(--wui-primary)')
    expect(css).toContain('.dark {')
    expect(css).toContain('@theme inline {')
  })

  it('emits every color key in both :root and .dark', () => {
    const root = block(css, ':root')
    const dark = block(css, '.dark')
    for (const key of colorKeys) {
      expect(root).toContain(`--wui-${key}: ${tokens.light[key]};`)
      expect(dark).toContain(`--wui-${key}: ${tokens.dark[key]};`)
    }
  })

  it('emits radius and font theme variables', () => {
    const theme = block(css, '@theme inline')
    expect(theme).toContain(`--radius-md: ${tokens.radius.md};`)
    expect(theme).toContain(`--font-sans: ${tokens.font.sans};`)
  })

  it('emits shadow theme variables', () => {
    const theme = block(css, '@theme inline')
    for (const size of ['sm', 'md', 'lg'] as const) {
      expect(theme).toContain(`--shadow-${size}: ${tokens.shadow[size]};`)
    }
  })
})
