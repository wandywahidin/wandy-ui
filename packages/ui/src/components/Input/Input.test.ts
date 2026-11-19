import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { render, renderTemplate } from '../../test-utils'
import { Input } from './index'
import { Textarea } from '../Textarea'

describe('Input', () => {
  it('standalone: has an id and no aria-describedby', () => {
    const w = render(Input)
    const input = w.get('input')
    expect(input.attributes('id')).toBeTruthy()
    expect(input.attributes()).not.toHaveProperty('aria-describedby')
  })

  it('standalone: uses a given id', () => {
    const w = render(Input, { props: { id: 'email' } })
    expect(w.get('input').attributes('id')).toBe('email')
  })

  it('standalone invalid: sets aria-invalid', () => {
    const w = render(Input, { props: { invalid: true } })
    expect(w.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('round-trips v-model', async () => {
    const value = ref('hello')
    const w = renderTemplate('<Input v-model="value" />', { Input }, () => ({ value }))
    const input = w.get('input')
    expect((input.element as HTMLInputElement).value).toBe('hello')
    await input.setValue('world')
    expect(value.value).toBe('world')
  })

  it('puts non-class attrs on <input> and class on the wrapper', () => {
    const w = render(Input, { attrs: { placeholder: 'x', class: 'w-64' } })
    expect(w.get('input').attributes('placeholder')).toBe('x')
    expect(w.element.getAttribute('placeholder')).toBeNull()
    expect(w.element.classList).toContain('w-64')
    expect(w.get('input').classes()).not.toContain('w-64')
  })

  it('renders prefix and suffix slots', () => {
    const w = render(Input, { slots: { prefix: '<i data-p />', suffix: '<i data-s />' } })
    expect(w.find('[data-p]').exists()).toBe(true)
    expect(w.find('[data-s]').exists()).toBe(true)
  })
})

describe('Textarea', () => {
  it('round-trips v-model and defaults rows to 3', async () => {
    const value = ref('a')
    const w = renderTemplate('<Textarea v-model="value" />', { Textarea }, () => ({ value }))
    const ta = w.get('textarea')
    expect(ta.attributes('rows')).toBe('3')
    await ta.setValue('b')
    expect(value.value).toBe('b')
  })

  it('standalone: has an id and no aria-describedby', () => {
    const w = render(Textarea)
    expect(w.get('textarea').attributes('id')).toBeTruthy()
    expect(w.get('textarea').attributes()).not.toHaveProperty('aria-describedby')
  })
})
