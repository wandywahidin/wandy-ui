import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { render, renderTemplate } from '../../test-utils'
import { Field } from './index'
import { Input } from '../Input'
import { Textarea } from '../Textarea'

const C = { Field, Input, Textarea }

describe('Field', () => {
  it('links label for, input id, and description', () => {
    const w = renderTemplate(
      '<Field label="Email" description="We never share it"><Input /></Field>',
      C,
    )
    const input = w.get('input')
    const label = w.get('label')
    const description = w.get('p')
    expect(input.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
    expect(description.text()).toBe('We never share it')
    expect(input.attributes('aria-describedby')).toBe(description.attributes('id'))
  })

  it('error: marks the control invalid and describes it with description and error', () => {
    const w = renderTemplate(
      '<Field label="Email" description="We never share it" error="Required"><Input /></Field>',
      C,
    )
    const input = w.get('input')
    const [desc, err] = w.findAll('p')
    expect(input.attributes('aria-invalid')).toBe('true')
    const ids = input.attributes('aria-describedby')!.split(' ')
    expect(ids).toContain(desc!.attributes('id'))
    expect(ids).toContain(err!.attributes('id'))
    expect(err!.attributes('role')).toBeUndefined()
  })

  it('describes only with the error when there is no description', () => {
    const w = renderTemplate('<Field label="Email" error="Required"><Input /></Field>', C)
    const err = w.get('p')
    expect(w.get('input').attributes('aria-describedby')).toBe(err.attributes('id'))
  })

  it('required: shows an aria-hidden marker and sets required on the control', () => {
    const w = renderTemplate('<Field label="Email" required><Input /></Field>', C)
    expect(w.get('label [aria-hidden="true"]').text()).toBe('*')
    expect(w.get('input').attributes('required')).toBeDefined()
  })

  it('disabled: disables the control', () => {
    const w = renderTemplate('<Field label="Email" disabled><Input /></Field>', C)
    expect(w.get('input').attributes('disabled')).toBeDefined()
  })

  it('gives two Fields distinct ids', () => {
    const w = renderTemplate(
      '<div><Field label="A" description="a"><Input /></Field><Field label="B" description="b"><Input /></Field></div>',
      C,
    )
    const [a, b] = w.findAll('input')
    expect(a!.attributes('id')).not.toBe(b!.attributes('id'))
    expect(a!.attributes('aria-describedby')).not.toBe(b!.attributes('aria-describedby'))
    const [la, lb] = w.findAll('label')
    expect(la!.attributes('for')).toBe(a!.attributes('id'))
    expect(lb!.attributes('for')).toBe(b!.attributes('id'))
  })

  it('wires a Textarea the same way', () => {
    const w = renderTemplate('<Field label="Bio" description="Short"><Textarea /></Field>', C)
    const ta = w.get('textarea')
    expect(w.get('label').attributes('for')).toBe(ta.attributes('id'))
    expect(ta.attributes('aria-describedby')).toBe(w.get('p').attributes('id'))
  })

  it.each([
    ['default', '<Field label="Email" description="Hint"><Input /></Field>'],
    ['error', '<Field label="Email" error="Required"><Input /></Field>'],
    ['disabled', '<Field label="Email" disabled><Input /></Field>'],
    ['textarea', '<Field label="Bio"><Textarea /></Field>'],
  ])('has no axe violations (%s)', async (_n, template) => {
    const w = render({ components: C, template })
    expect(await axe(w.element)).toHaveNoViolations()
  })
})
