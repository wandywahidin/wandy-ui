import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { Dialog } from './index'
import { Button } from '../Button'
import { Field } from '../Field'
import { Input } from '../Input'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    title: 'Rename project',
    description: 'Project names appear in URLs.',
    size: 'md',
    closeLabel: 'Close',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `overlay`, `content` (the `role="dialog"` panel, receives `class` and attrs), `header`, `title`, `description`, `body`, `footer`, `close` (the close IconButton).',
    },
  },
  render: (args) => ({
    components: { Dialog, Button, Field, Input },
    setup: () => ({ args, open: ref(false), name: ref('wandy-ui') }),
    template: `<Dialog v-bind="args" v-model:open="open">
      <template #trigger><Button>Rename…</Button></template>
      <Field label="Name"><Input v-model="name" /></Field>
      <template #footer>
        <Button variant="outline" intent="neutral" @click="open = false">Cancel</Button>
        <Button @click="open = false">Save</Button>
      </template>
    </Dialog>`,
  }),
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Rename…' })
    await userEvent.click(trigger)
    const dialog = await screen.findByRole('dialog', { name: 'Rename project' })
    await expect(dialog).toHaveAccessibleDescription('Project names appear in URLs.')

    // Focus stays inside the dialog while tabbing around.
    for (let i = 0; i < 6; i++) {
      await userEvent.tab()
      await expect(dialog.contains(document.activeElement)).toBe(true)
    }

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}

export const Small: Story = { args: { size: 'sm' } }

export const Customized: Story = {
  args: { ui: { content: 'max-w-xl rounded-none', title: 'text-primary' } },
}
