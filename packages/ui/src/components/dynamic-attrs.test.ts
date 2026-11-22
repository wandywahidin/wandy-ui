// Attributes and classes that change after mount must reach the rendered element.
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { renderTemplate } from '../test-utils'
import { Button } from './Button'
import { Input } from './Input'
import { Field } from './Field'

describe('dynamic fallthrough attrs', () => {
  it('Button picks up a class that changes after mount', async () => {
    const cls = ref('bg-red-500')
    const w = renderTemplate('<Button :class="cls">B</Button>', { Button }, () => ({ cls }))
    cls.value = 'bg-green-500'
    await nextTick()
    expect(w.get('button').classes()).toContain('bg-green-500')
    expect(w.get('button').classes()).not.toContain('bg-red-500')
  })

  it('Input picks up a placeholder that changes after mount', async () => {
    const ph = ref('one')
    const w = renderTemplate('<Input :placeholder="ph" />', { Input }, () => ({ ph }))
    ph.value = 'two'
    await nextTick()
    expect(w.get('input').attributes('placeholder')).toBe('two')
  })

  it('a consumer aria-describedby that changes inside a Field stays merged', async () => {
    const hint = ref('h1')
    const w = renderTemplate(
      '<Field label="L" description="D"><Input :aria-describedby="hint" /></Field>',
      { Field, Input },
      () => ({ hint }),
    )
    hint.value = 'h2'
    await nextTick()
    const ids = w.get('input').attributes('aria-describedby')!.split(' ')
    expect(ids).toContain('h2')
    expect(ids).not.toContain('h1')
  })
})
