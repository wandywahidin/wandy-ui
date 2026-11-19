import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'
import { Select } from './index'
import { Field } from '../Field'

const options = [
  { value: 'ams', label: 'Amsterdam' },
  { value: 'ber', label: 'Berlin', disabled: true },
  { value: 'cgk', label: 'Jakarta' },
  { value: 'nrt', label: 'Tokyo' },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { options, placeholder: 'Select…' },
  argTypes: {
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `trigger` (the `role="combobox"` button, receives `class` and attrs), `value`, `icon`, `content` (floating listbox panel), `viewport`, `item` (each option), `itemIndicator` (check mark).',
    },
  },
  render: (args) => ({
    components: { Select, Field },
    setup: () => ({ args, value: ref<string>() }),
    template: `<Field label="Region" description="Where your data is stored." class="max-w-xs">
      <Select v-bind="args" v-model="value" />
    </Field>`,
  }),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Region' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await screen.findByRole('listbox')
    // Highlight moves Amsterdam → (skips disabled Berlin) → Jakarta.
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(trigger).toHaveTextContent('Jakarta')
    await expect(trigger).toHaveFocus()
  },
}

export const WithError: Story = {
  render: (args) => ({
    components: { Select, Field },
    setup: () => ({ args, value: ref<string>() }),
    template: `<Field label="Region" error="Choose a region." class="max-w-xs">
      <Select v-bind="args" v-model="value" />
    </Field>`,
  }),
}

export const Disabled: Story = { args: { disabled: true } }

export const Customized: Story = {
  args: { ui: { trigger: 'rounded-full bg-muted', item: 'data-highlighted:bg-primary/15' } },
}
