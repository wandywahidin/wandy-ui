import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Input } from './index'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          "A single-line text input with optional prefix and suffix.\n\n## Accessibility\n\n**Pattern:** native `<input>`. All non-class attributes (`type`, `placeholder`, `autocomplete`, `name`, …) go to the `<input>`; `class` goes to the wrapper. Standalone, it gets a generated `id` and no `aria-describedby`. Inside a Field it takes the Field's ids and state.\n\n**Keyboard**\n\n| Key | Action |\n| --- | --- |\n| Tab | Moves focus to the input |\n\n**Your responsibility**\n\n- Label it: wrap it in `Field`, or pass `aria-label` when the label is visible elsewhere. A placeholder is not a label.\n- Prefix/suffix content is visual. If it carries meaning (a currency), include it in the label or description too.\n- Set `autocomplete` and `type` for personal data (email, name, tel).",
      },
    },
  },
  argTypes: {
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `root` (wrapper, receives `class`), `input` (the native `<input>`, receives all other attrs), `prefix`, `suffix`.',
    },
  },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args, value: ref('') }),
    template:
      '<Input v-bind="args" v-model="value" aria-label="Search" placeholder="Search…" class="max-w-sm" />',
  }),
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Search' })
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.keyboard('vue')
    await expect(input).toHaveValue('vue')
  },
}

export const Invalid: Story = { args: { invalid: true } }
export const Disabled: Story = { args: { disabled: true } }

export const WithAffixes: Story = {
  render: (args) => ({
    components: { Input },
    setup: () => ({ args, value: ref('') }),
    template: `<Input v-bind="args" v-model="value" aria-label="Price" class="max-w-xs">
      <template #prefix>$</template>
      <template #suffix>USD</template>
    </Input>`,
  }),
}

export const Customized: Story = {
  args: { ui: { root: 'rounded-full bg-muted border-transparent', input: 'font-mono' } },
}
