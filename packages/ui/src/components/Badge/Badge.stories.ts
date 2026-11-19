import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Badge } from './index'

const intents = ['neutral', 'primary', 'success', 'warning', 'danger'] as const

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'A small status or count label.\n\n## Accessibility\n\n**Pattern:** static `<span>`, with no role or interaction. Soft and outline variants use foreground text on a tinted background so every intent meets 4.5:1 contrast.\n\n**Keyboard**\n\n| Key | Action |\n| --- | --- |\n| n/a | Not focusable |\n\n**Your responsibility**\n\n- Don\'t rely on color alone: the text has to carry the meaning ("Failed", not just red).\n- If a badge updates live (a count), announce changes yourself with a live region.',
      },
    },
  },
  args: { intent: 'neutral', variant: 'soft' },
  argTypes: {
    intent: { control: 'inline-radio', options: intents },
    variant: { control: 'inline-radio', options: ['solid', 'soft', 'outline'] },
    ui: {
      control: 'object',
      description: 'Per-slot class overrides. Slots: `root` (the `<span>`).',
    },
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: '<Badge v-bind="args">Beta</Badge>',
  }),
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const All: Story = {
  render: () => ({
    components: { Badge },
    setup: () => ({ intents, variants: ['solid', 'soft', 'outline'] }),
    template: `<div class="flex flex-col gap-3">
      <div v-for="v in variants" :key="v" class="flex gap-2">
        <Badge v-for="i in intents" :key="i" :intent="i" :variant="v">{{ i }}</Badge>
      </div>
    </div>`,
  }),
}

export const Customized: Story = { args: { ui: { root: 'rounded-full px-3' } } }
