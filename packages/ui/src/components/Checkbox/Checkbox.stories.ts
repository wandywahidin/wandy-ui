import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Checkbox } from './index'
import { Field } from '../Field'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `root` (the wrapping `<label>`), `control` (the native `<input type="checkbox">`), `indicator` (check/dash icon), `label` (slot text).',
    },
  },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args, value: ref<boolean | 'indeterminate'>(false) }),
    template: '<Checkbox v-bind="args" v-model="value">Email me product updates</Checkbox>',
  }),
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox', { name: 'Email me product updates' })
    await userEvent.tab()
    await expect(box).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(box).toBeChecked()
  },
}

export const Indeterminate: Story = {
  render: () => ({
    components: { Checkbox },
    setup: () => ({ value: ref<boolean | 'indeterminate'>('indeterminate') }),
    template: '<Checkbox v-model="value">Select all</Checkbox>',
  }),
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox')
    await expect(box).toBePartiallyChecked()
    await userEvent.click(box)
    await expect(box).toBeChecked()
  },
}

export const Disabled: Story = { args: { disabled: true } }

export const InField: Story = {
  render: () => ({
    components: { Checkbox, Field },
    setup: () => ({ value: ref(false) }),
    template: `<Field label="Terms" error="You must accept the terms.">
      <Checkbox v-model="value">I accept the terms</Checkbox>
    </Field>`,
  }),
}

export const Customized: Story = {
  args: { ui: { control: 'rounded-full', label: 'font-semibold' } },
}
