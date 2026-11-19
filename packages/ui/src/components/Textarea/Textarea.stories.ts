import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Textarea } from './index'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'A multi-line text input.\n\n## Accessibility\n\n**Pattern:** native `<textarea>`. Every attribute, `class` included, goes to the `<textarea>`. It wires into Field exactly like Input.\n\n**Keyboard**\n\n| Key | Action |\n| --- | --- |\n| Tab | Moves focus to the textarea |\n| Enter | Inserts a new line |\n\n**Your responsibility**\n\n- Label it via `Field` or `aria-label`.\n- If you enforce a length limit, say so in the description.',
      },
    },
  },
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
