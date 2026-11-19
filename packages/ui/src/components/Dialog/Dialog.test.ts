import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { axe } from 'vitest-axe'
import { renderTemplate } from '../../test-utils'
import { Dialog } from './index'
import { Button } from '../Button'

const C = { Dialog, Button }

async function settle() {
  await flushPromises()
  await nextTick()
  await new Promise((r) => setTimeout(r, 20))
}

function setup(props = '') {
  const open = ref(false)
  const w = renderTemplate(
    `<Dialog v-model:open="open" title="Delete project" description="This cannot be undone." ${props}>
      <template #trigger><Button>Delete…</Button></template>
      <p>All deployments will stop.</p>
      <template #footer><Button intent="danger">Delete</Button></template>
    </Dialog>`,
    C,
    () => ({ open }),
  )
  const trigger = () => document.querySelector<HTMLButtonElement>('button')!
  const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]')
  return { w, open, trigger, dialog }
}

describe('Dialog', () => {
  it('opens from the trigger and is labelled by its title', async () => {
    const { trigger, dialog, open } = setup()
    expect(dialog()).toBeNull()
    trigger().click()
    await settle()
    expect(open.value).toBe(true)
    const d = dialog()!
    expect(d).not.toBeNull()
    const title = document.getElementById(d.getAttribute('aria-labelledby')!)
    expect(title?.textContent).toBe('Delete project')
    const desc = document.getElementById(d.getAttribute('aria-describedby')!)
    expect(desc?.textContent).toBe('This cannot be undone.')
  })

  it('Escape closes and returns focus to the trigger', async () => {
    const { trigger, dialog, open } = setup()
    trigger().focus()
    trigger().click()
    await settle()
    const d = dialog()!
    d.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    expect(open.value).toBe(false)
    expect(dialog()).toBeNull()
    expect(document.activeElement).toBe(trigger())
  })

  it('has a labelled close button that closes', async () => {
    const { trigger, dialog, open } = setup('close-label="Dismiss"')
    trigger().click()
    await settle()
    const close = dialog()!.querySelector<HTMLButtonElement>('button[aria-label="Dismiss"]')!
    expect(close).not.toBeNull()
    close.click()
    await settle()
    expect(open.value).toBe(false)
  })

  it('ui.content overrides the size class', async () => {
    const { trigger, dialog } = setup(`size="sm" :ui="{ content: 'max-w-xl' }"`)
    trigger().click()
    await settle()
    const cls = dialog()!.className.split(/\s+/)
    expect(cls).toContain('max-w-xl')
    expect(cls).not.toContain('max-w-sm')
  })

  it('without a description, aria-describedby never dangles', async () => {
    const open = ref(true)
    renderTemplate('<Dialog v-model:open="open" title="Rename" />', C, () => ({ open }))
    await settle()
    const ref_ = document.querySelector('[role="dialog"]')!.getAttribute('aria-describedby')
    expect(ref_ === null || document.getElementById(ref_) !== null).toBe(true)
  })

  it('has no axe violations while open', async () => {
    const { trigger } = setup()
    trigger().click()
    await settle()
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
