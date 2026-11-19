import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const dist = resolve(__dirname, '../dist')

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? files(p) : [p]
  })
}

// Runs against the built package: `pnpm --filter @wandy/ui build && pnpm --filter @wandy/ui test:dist`.
describe('dist', () => {
  it('exists with a type entry', () => {
    expect(existsSync(join(dist, 'index.js'))).toBe(true)
    expect(existsSync(join(dist, 'index.d.ts'))).toBe(true)
  })

  // Loading reka-ui through the test transformer is slow on a cold cache.
  it('exports the public API', { timeout: 60_000 }, async () => {
    const mod = await import(/* @vite-ignore */ join(dist, 'index.js'))
    for (const name of ['Button', 'Dialog', 'createUI', 'buttonVariants', 'useUi', 'cn']) {
      expect(mod[name], name).toBeDefined()
    }
  })

  it('declares types for components', () => {
    const dts = readFileSync(join(dist, 'index.d.ts'), 'utf8')
    expect(dts).toMatch(/Button/)
    expect(dts).toMatch(/createUI/)
  })

  it('does not bundle Vue or Reka UI', () => {
    for (const f of files(dist).filter((f) => f.endsWith('.js'))) {
      const src = readFileSync(f, 'utf8')
      expect(src.includes('createRenderer('), f).toBe(false)
      expect(src.includes('node_modules'), f).toBe(false)
    }
  })

  it('preserves modules for tree-shaking', () => {
    expect(files(dist).filter((f) => f.endsWith('.js')).length).toBeGreaterThan(10)
  })
})
