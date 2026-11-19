import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { Popover } from './index'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'

const meta = {
  title: 'Components/Popover',
  component: Popover,
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
