import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Tooltip } from './index'
import { IconButton } from '../Button'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: { content: 'Copy link', side: 'top' },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `content` (the tooltip bubble, receives `class` and attrs), `arrow`.',
    },
  },
  render: (args) => ({
    components: { Tooltip, IconButton },
    setup: () => ({ args }),
    template: `<div class="flex justify-center py-16">
      <Tooltip v-bind="args">
        <IconButton label="Copy" variant="outline">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
        </IconButton>
      </Tooltip>
    </div>`,
  }),
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Copy' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    const tip = await screen.findByRole('tooltip')
    await expect(tip).toHaveTextContent('Copy link')
    await expect(trigger).toHaveAccessibleDescription('Copy link')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
  },
}

export const Bottom: Story = { args: { side: 'bottom' } }
export const Customized: Story = { args: { ui: { content: 'bg-primary text-primary-foreground' } } }
