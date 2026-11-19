import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Textarea } from './index'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  argTypes: {
    ui: {
      control: 'object',
      description: 'Per-slot class overrides. Slots: `root` (the `<textarea>`).',
    },
  },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args, value: ref('') }),
    template: '<Textarea v-bind="args" v-model="value" aria-label="Notes" class="max-w-sm" />',
  }),
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const ta = within(canvasElement).getByRole('textbox', { name: 'Notes' })
    await userEvent.tab()
    await expect(ta).toHaveFocus()
    await userEvent.keyboard('Hello')
    await expect(ta).toHaveValue('Hello')
  },
}

export const Invalid: Story = { args: { invalid: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Customized: Story = { args: { rows: 6, ui: { root: 'resize-none font-mono' } } }
