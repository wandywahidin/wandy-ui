import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { Popover } from './index'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          'Non-modal floating content anchored to a trigger. Built on Reka UI.\n\n## Accessibility\n\n**Pattern:** disclosure-style popover: the trigger gets `aria-expanded`, `aria-haspopup="dialog"`, and `aria-controls`; the panel is `role="dialog"`, named by the `label` prop. Focus moves into the panel on open and returns to the trigger on Escape. Positioning flips and shifts to stay in view.\n\n**Keyboard**\n\n| Key | Action |\n| --- | --- |\n| Enter / Space on the trigger | Opens or closes the popover |\n| Tab | Moves through the panel content |\n| Escape | Closes it and returns focus to the trigger |\n\n**Your responsibility**\n\n- Pass `label` so the panel has an accessible name.\n- For pure hint text, use Tooltip. For blocking tasks, use Dialog.',
      },
    },
  },
  args: { side: 'bottom', align: 'center', label: 'Filters' },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `content` (the floating panel, receives `class` and attrs), `arrow`.',
    },
  },
  render: (args) => ({
    components: { Popover, Button, Checkbox },
    setup: () => ({ args, open: ref(false), active: ref(true) }),
    template: `<div class="flex justify-center py-24">
      <Popover v-bind="args" v-model:open="open">
        <template #trigger><Button variant="outline" intent="neutral">Filters</Button></template>
        <div class="flex flex-col gap-3">
          <Checkbox v-model="active">Only active projects</Checkbox>
          <Button size="sm" @click="open = false">Apply</Button>
        </div>
      </Popover>
    </div>`,
  }),
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Filters' })
    await userEvent.click(trigger)
    const panel = await screen.findByRole('dialog', { name: 'Filters' })
    // Focus moves into the panel.
    await waitFor(() => expect(panel.contains(document.activeElement)).toBe(true))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}

export const Top: Story = { args: { side: 'top' } }
export const Customized: Story = { args: { ui: { content: 'w-96 bg-muted' } } }
