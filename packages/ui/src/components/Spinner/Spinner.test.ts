import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { render } from '../../test-utils'
import { Spinner } from './index'

describe('Spinner', () => {
  it('is a polite status with a visually hidden label and a hidden graphic', () => {
    const w = render(Spinner)
    expect(w.attributes('role')).toBe('status')
    expect(w.get('.sr-only').text()).toBe('Loading')
    expect(w.get('svg').attributes('aria-hidden')).toBe('true')
  })

  it('announces a custom label', () => {
    const w = render(Spinner, { props: { label: 'Loading invoices' } })
    expect(w.text()).toBe('Loading invoices')
  })

  it.each(['sm', 'md', 'lg'] as const)('has no axe violations (size %s)', async (size) => {
    const w = render(Spinner, { props: { size } })
    expect(await axe(w.element)).toHaveNoViolations()
  })
})
