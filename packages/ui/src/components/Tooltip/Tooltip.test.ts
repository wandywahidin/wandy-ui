import { describe, expect, it } from 'vitest'
import { configureAxe } from 'vitest-axe'
import { renderTemplate, settle } from '../../test-utils'
import { Tooltip } from './index'
import { IconButton } from '../Button'

// The portalled tooltip sits outside any landmark here; `region` is a page-level
// rule that a component fixture can't satisfy (Storybook checks it in context).
const axe = configureAxe({ rules: { region: { enabled: false } } })

function setup() {
  renderTemplate(
    `<Tooltip content="Copy link"><IconButton label="Copy"><svg /></IconButton></Tooltip>`,
    { Tooltip, IconButton },
  )
  return { trigger: () => document.querySelector<HTMLButtonElement>('button')! }
}

describe('Tooltip', () => {
  it('needs no provider and shows on focus, described by the tooltip', async () => {
    const { trigger } = setup()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    trigger().focus()
    trigger().dispatchEvent(new FocusEvent('focus'))
    await settle(50)
    const tip = document.querySelector<HTMLElement>('[role="tooltip"]')!
    expect(tip).not.toBeNull()
    expect(tip.textContent).toContain('Copy link')
    const describedBy = trigger().getAttribute('aria-describedby')!
    expect(describedBy.split(' ')).toContain(tip.id)
  })

  it('Escape hides it', async () => {
    const { trigger } = setup()
    trigger().focus()
    trigger().dispatchEvent(new FocusEvent('focus'))
    await settle(50)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle(50)
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })

  it('has no axe violations while shown', async () => {
    const { trigger } = setup()
    trigger().focus()
    trigger().dispatchEvent(new FocusEvent('focus'))
    await settle(50)
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
