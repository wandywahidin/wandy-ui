import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Input } from './index'

const meta = {
  title: 'Components/Input',
  component: Input,
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
