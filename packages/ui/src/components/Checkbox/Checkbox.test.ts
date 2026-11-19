import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { axe } from 'vitest-axe'
import { renderTemplate } from '../../test-utils'
import { Checkbox } from './index'
import { Field } from '../Field'

describe('Checkbox', () => {
  it('is a native checkbox named by its slot', () => {
    const w = renderTemplate('<Checkbox>Accept terms</Checkbox>', { Checkbox })
    const input = w.get('input')
    expect(input.attributes('type')).toBe('checkbox')
    expect(w.get('label').text()).toContain('Accept terms')
  })

  it('click toggles the model', async () => {
    const value = ref<boolean | 'indeterminate'>(false)
    const w = renderTemplate('<Checkbox v-model="value">A</Checkbox>', { Checkbox }, () => ({
      value,
    }))
    const input = w.get('input').element as HTMLInputElement
    input.click()
    await w.vm.$nextTick()
    expect(value.value).toBe(true)
    input.click()
    await w.vm.$nextTick()
    expect(value.value).toBe(false)
  })

  it("'indeterminate' sets the DOM indeterminate property", async () => {
    const value = ref<boolean | 'indeterminate'>('indeterminate')
    const w = renderTemplate('<Checkbox v-model="value">A</Checkbox>', { Checkbox }, () => ({
      value,
    }))
    const input = w.get('input').element as HTMLInputElement
    expect(input.indeterminate).toBe(true)
    value.value = false
    await w.vm.$nextTick()
    expect(input.indeterminate).toBe(false)
    value.value = 'indeterminate'
    await w.vm.$nextTick()
    expect(input.indeterminate).toBe(true)
    input.click()
    await w.vm.$nextTick()
    expect(value.value).toBe(true)
    expect(input.indeterminate).toBe(false)
  })

  it('disabled: native disabled, does not toggle', async () => {
    const value = ref(false)
    const w = renderTemplate(
      '<Checkbox v-model="value" disabled>A</Checkbox>',
      { Checkbox },
      () => ({
        value,
      }),
    )
    const input = w.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    ;(input.element as HTMLInputElement).click()
    await w.vm.$nextTick()
    expect(value.value).toBe(false)
  })

  it('takes ids and state from a surrounding Field', () => {
    const w = renderTemplate(
      '<Field label="Terms" error="You must accept"><Checkbox>I accept</Checkbox></Field>',
      { Checkbox, Field },
    )
    const input = w.get('input')
    expect(w.get('label[for]').attributes('for')).toBe(input.attributes('id'))
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBeTruthy()
  })

  it.each([
    ['unchecked', '<Checkbox>A</Checkbox>'],
    ['checked', '<Checkbox :model-value="true">A</Checkbox>'],
    ['indeterminate', '<Checkbox model-value="indeterminate">A</Checkbox>'],
    ['disabled', '<Checkbox disabled>A</Checkbox>'],
  ])('has no axe violations (%s)', async (_n, template) => {
    const w = renderTemplate(template, { Checkbox })
    expect(await axe(w.element)).toHaveNoViolations()
  })
})
