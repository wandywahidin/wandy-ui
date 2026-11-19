import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { configureAxe } from 'vitest-axe'
import { renderTemplate, settle } from '../../test-utils'
import { Select } from './index'
import { Field } from '../Field'

// Portalled listbox sits outside any landmark in this fixture; `region` is page-level.
const axe = configureAxe({ rules: { region: { enabled: false } } })

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
]

function setup(fieldAttrs = '') {
  const value = ref<string>()
  const w = renderTemplate(
    `<Field label="Fruit" ${fieldAttrs}><Select v-model="value" :options="options" /></Field>`,
    { Field, Select },
    () => ({ value, options }),
  )
  const trigger = () => document.querySelector<HTMLButtonElement>('[role="combobox"]')!
  const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]')
  const option = (name: string) =>
    [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((o) =>
      o.textContent?.includes(name),
    )!
  const open = async () => {
    trigger().focus()
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle()
  }
  return { w, value, trigger, listbox, option, open }
}

describe('Select', () => {
  it('inside Field: the label targets the trigger and errors mark it invalid', () => {
    const { w, trigger } = setup('error="Pick one" description="Seasonal"')
    expect(w.get('label').attributes('for')).toBe(trigger().id)
    expect(trigger().getAttribute('aria-invalid')).toBe('true')
    expect(trigger().getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
  })

  it('shows the placeholder until a value is chosen', () => {
    const { trigger } = setup()
    expect(trigger().textContent).toContain('Select…')
  })

  it('opens the list and choosing an option updates the model', async () => {
    const { value, listbox, option, open, trigger } = setup()
    await open()
    expect(listbox()).not.toBeNull()
    option('Cherry').dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    option('Cherry')?.click()
    await settle()
    expect(value.value).toBe('cherry')
    expect(trigger().textContent).toContain('Cherry')
  })

  it('a disabled option cannot be chosen', async () => {
    const { value, option, open } = setup()
    await open()
    const banana = option('Banana')
    expect(banana.getAttribute('aria-disabled')).toBe('true')
    banana.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    banana.click()
    await settle()
    expect(value.value).toBeUndefined()
  })

  it('has no axe violations closed', async () => {
    const { w } = setup()
    expect(await axe(w.element)).toHaveNoViolations()
  })

  it('has no axe violations open', async () => {
    const { open } = setup()
    await open()
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
