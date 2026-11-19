import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { Spinner } from './index'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  args: { label: 'Loading', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `root` (the `role="status"` wrapper), `indicator` (the spinning SVG).',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A loading indicator that announces itself politely.

## Accessibility

**Pattern:** live region with \`role="status"\` (implicit \`aria-live="polite"\`). The SVG is \`aria-hidden\`; the \`label\` is visually hidden text, so screen readers announce "Loading" without interrupting.

**Keyboard:** none. The spinner isn't focusable.

**Your responsibility:**
- Give \`label\` a specific message when the context is ambiguous ("Loading invoices").
- Render the spinner only while loading. Inserting it is what triggers the announcement.
- The animation slows down under \`prefers-reduced-motion\`.`,
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Loading')
  },
}

export const Sizes: Story = {
  render: () => ({
    components: { Spinner },
    template: `<div class="flex items-center gap-4 text-primary">
      <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
    </div>`,
  }),
}

export const Customized: Story = { args: { ui: { indicator: 'text-danger size-8' } } }
