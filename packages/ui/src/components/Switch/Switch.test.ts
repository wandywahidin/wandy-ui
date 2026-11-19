import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { axe } from 'vitest-axe'
import { render, renderTemplate } from '../../test-utils'
import { Switch } from './index'
import { Field } from '../Field'

function setup(initial = false, extra = '') {
  const value = ref(initial)
  const w = renderTemplate(`<Switch v-model="value" ${extra}>Wi-Fi</Switch>`, { Switch }, () => ({
    value,
  }))
  return { w, value, btn: w.get('[role="switch"]') }
}

describe('Switch', () => {
  it('is a button with role=switch reflecting the model in aria-checked', async () => {
    const { btn, value } = setup(true)
    expect(btn.element.tagName).toBe('BUTTON')
    expect(btn.attributes('type')).toBe('button')
    expect(btn.attributes('aria-checked')).toBe('true')
    value.value = false
    await nextTick()
    expect(btn.attributes('aria-checked')).toBe('false')
  })

  it('toggles on activation (Space/Enter fire a native button click)', async () => {
    const { btn, value } = setup()
    ;(btn.element as HTMLButtonElement).click()
    expect(value.value).toBe(true)
    await nextTick()
    ;(btn.element as HTMLButtonElement).click()
    expect(value.value).toBe(false)
  })

  it('disabled: does not toggle', () => {
    const { btn, value } = setup(false, 'disabled')
    expect(btn.attributes('disabled')).toBeDefined()
    ;(btn.element as HTMLButtonElement).click()
    expect(value.value).toBe(false)
  })

  it('gets its accessible name from the slot via aria-labelledby', () => {
    const { btn } = setup()
    const id = btn.attributes('aria-labelledby')!
    expect(document.getElementById(id)?.textContent).toBe('Wi-Fi')
  })

  it('clicking the label toggles', async () => {
    const { w, value } = setup()
    await w.get('[role="switch"] + span').trigger('click')
    expect(value.value).toBe(true)
  })

  it('works inside a Field', () => {
    const w = renderTemplate(
      '<Field label="Notifications" description="Daily digest"><Switch /></Field>',
      {
        Field,
        Switch,
      },
    )
    const btn = w.get('[role="switch"]')
    expect(w.get('label').attributes('for')).toBe(btn.attributes('id'))
    expect(btn.attributes('aria-describedby')).toBeTruthy()
    expect(btn.attributes('aria-labelledby')).toBeUndefined()
  })

  it.each([
    ['off', ''],
    ['on', ':model-value="true"'],
    ['disabled', 'disabled'],
  ])('has no axe violations (%s)', async (_n, extra) => {
    const w = render({ components: { Switch }, template: `<Switch ${extra}>Wi-Fi</Switch>` })
    expect(await axe(w.element)).toHaveNoViolations()
  })
})
