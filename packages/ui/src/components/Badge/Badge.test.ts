import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { render } from '../../test-utils'
import { Badge } from './index'

describe('Badge', () => {
  it('renders a span with default neutral soft classes', () => {
    const w = render(Badge, { slots: { default: 'New' } })
    expect(w.element.tagName).toBe('SPAN')
    expect(w.classes()).toContain('bg-muted')
    expect(w.text()).toBe('New')
  })

  it.each([
    ['primary', 'solid', 'bg-primary'],
    ['danger', 'solid', 'bg-danger'],
    ['success', 'solid', 'bg-success'],
    ['warning', 'solid', 'bg-warning'],
    ['danger', 'outline', 'border-danger'],
    ['success', 'soft', 'bg-success/15'],
  ])('intent=%s variant=%s renders %s', (intent, variant, cls) => {
    const w = render(Badge, { props: { intent, variant }, slots: { default: 'x' } })
    expect(w.classes()).toContain(cls)
  })

  it('lets consumer class win', () => {
    const w = render(Badge, {
      props: { intent: 'primary', variant: 'solid' },
      attrs: { class: 'bg-red-500' },
      slots: { default: 'x' },
    })
    expect(w.classes().filter((c) => c.startsWith('bg-'))).toEqual(['bg-red-500'])
  })

  it('has no axe violations', async () => {
    const w = render(Badge, { slots: { default: 'New' } })
    expect(await axe(w.element)).toHaveNoViolations()
  })
})
