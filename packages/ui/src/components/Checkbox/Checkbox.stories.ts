import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Checkbox } from './index'
import { Field } from '../Field'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'A binary choice with an optional indeterminate ("mixed") state.\n\n## Accessibility\n\n**Pattern:** native `<input type="checkbox">` ([WAI-ARIA checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)), visually restyled. The default slot is the label, and the whole row is a `<label>`, so clicking the text toggles it. `v-model="\'indeterminate\'"` sets the DOM `indeterminate` property, which assistive tech reports as "mixed"; activating it makes it checked.\n\n**Keyboard**\n\n| Key | Action |\n| --- | --- |\n| Tab | Moves focus to the checkbox |\n| Space | Toggles it |\n\n**Your responsibility**\n\n- Give each checkbox a label via the default slot.\n- For a group of checkboxes, wrap them in a `<fieldset>` with a `<legend>`.\n- You own the logic that sets a "select all" parent to indeterminate.',
      },
    },
  },
  argTypes: {
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `root` (the wrapping `<label>`), `box` (the box wrapper), `control` (the native `<input type="checkbox">`), `indicator` (check/dash icon), `label` (slot text).',
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
