import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { axe } from 'vitest-axe'
import { renderTemplate, settle } from '../../test-utils'
import { Popover } from './index'
import { Button } from '../Button'

function setup() {
  const open = ref(false)
  renderTemplate(
    `<Popover v-model:open="open" label="Filters">
      <template #trigger><Button>Filters</Button></template>
      <p>Only show active projects.</p>
      <button type="button">Apply</button>
    </Popover>`,
    { Popover, Button },
    () => ({ open }),
  )
  const trigger = () => document.querySelector<HTMLButtonElement>('button')!
  const content = () => document.querySelector<HTMLElement>('[data-wui-popover]')
  return { open, trigger, content }
}

describe('Popover', () => {
  it('opens on trigger click and wires aria-expanded/controls', async () => {
    const { open, trigger, content } = setup()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    trigger().click()
    await settle()
    expect(open.value).toBe(true)
    const c = content()!
    expect(c).not.toBeNull()
    expect(c.textContent).toContain('Only show active projects.')
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(trigger().getAttribute('aria-controls')).toBe(c.id)
  })

  it('Escape closes and returns focus to the trigger', async () => {
    const { open, trigger, content } = setup()
    trigger().focus()
    trigger().click()
    await settle()
    content()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    expect(open.value).toBe(false)
    expect(content()).toBeNull()
    expect(document.activeElement).toBe(trigger())
  })

  it('has no axe violations while open', async () => {
    const { trigger } = setup()
    trigger().click()
    await settle()
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
