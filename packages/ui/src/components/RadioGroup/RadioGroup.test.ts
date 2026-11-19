import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { axe } from 'vitest-axe'
import { renderTemplate } from '../../test-utils'
import { Radio, RadioGroup } from './index'
import { Field } from '../Field'

const C = { RadioGroup, Radio, Field }

async function group(initial?: string, bDisabled = false) {
  const value = ref<string | undefined>(initial)
  const w = renderTemplate(
    `<RadioGroup v-model="value" label="Plan">
      <Radio value="a">A</Radio>
      <Radio value="b" :disabled="${bDisabled}">B</Radio>
      <Radio value="c">C</Radio>
    </RadioGroup>`,
    C,
    () => ({ value }),
  )
  // Radios register on setup; tabindex settles after the registry update flushes.
  await nextTick()
  const radios = w.findAll('[role="radio"]')
  const key = async (i: number, k: string) => {
    ;(radios[i]!.element as HTMLElement).focus()
    await radios[i]!.trigger('keydown', { key: k })
  }
  return { w, value, radios, key }
}

const tabbable = (radios: Awaited<ReturnType<typeof group>>['radios']) =>
  radios.filter((r) => r.attributes('tabindex') === '0')

describe('RadioGroup', () => {
  it('is a labelled radiogroup', async () => {
    const { w } = await group()
    const root = w.get('[role="radiogroup"]')
    const labelId = root.attributes('aria-labelledby')!
    expect(document.getElementById(labelId)?.textContent).toBe('Plan')
  })

  it('makes only the checked radio tabbable', async () => {
    const { radios } = await group('b')
    expect(tabbable(radios)).toHaveLength(1)
    expect(tabbable(radios)[0]!.attributes('aria-checked')).toBe('true')
    expect(tabbable(radios)[0]!.text()).toBe('B')
  })

  it('makes the first enabled radio tabbable when none is checked', async () => {
    const { radios } = await group()
    expect(tabbable(radios).map((r) => r.text())).toEqual(['A'])
  })

  it('ArrowDown selects and focuses the next radio', async () => {
    const { value, radios, key } = await group('a')
    await key(0, 'ArrowDown')
    expect(value.value).toBe('b')
    expect(document.activeElement).toBe(radios[1]!.element)
    expect(radios[1]!.attributes('aria-checked')).toBe('true')
    expect(tabbable(radios).map((r) => r.text())).toEqual(['B'])
  })

  it('arrow navigation skips a disabled radio', async () => {
    const { value, radios, key } = await group('a', true)
    await key(0, 'ArrowDown')
    expect(value.value).toBe('c')
    expect(document.activeElement).toBe(radios[2]!.element)
  })

  it('clicking selects; a disabled radio cannot be selected', async () => {
    const { value, radios } = await group('a', true)
    await radios[2]!.trigger('click')
    expect(value.value).toBe('c')
    await radios[1]!.trigger('click')
    expect(value.value).toBe('c')
  })

  it('takes aria-labelledby from a surrounding Field', () => {
    const w = renderTemplate(
      `<Field label="Size"><RadioGroup><Radio value="s">S</Radio></RadioGroup></Field>`,
      C,
    )
    const labelId = w.get('[role="radiogroup"]').attributes('aria-labelledby')!
    expect(document.getElementById(labelId)?.textContent?.trim()).toBe('Size')
  })

  it('a group where every radio is disabled does not throw on arrows', async () => {
    const w = renderTemplate(
      `<RadioGroup label="X" disabled><Radio value="a">A</Radio><Radio value="b">B</Radio></RadioGroup>`,
      C,
    )
    const r = w.findAll('[role="radio"]')
    await expect(r[0]!.trigger('keydown', { key: 'ArrowDown' })).resolves.not.toThrow()
  })

  it('has no axe violations', async () => {
    const { w } = await group('a', true)
    expect(await axe(w.element)).toHaveNoViolations()
  })
})
