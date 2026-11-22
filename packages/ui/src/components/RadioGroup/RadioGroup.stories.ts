import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Radio, RadioGroup } from './index'
import { Field } from '../Field'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Pick exactly one option from a set.\n\n## Accessibility\n\n**Pattern:** [WAI-ARIA radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/): `role="radiogroup"` with `role="radio"` buttons and `aria-checked`. Roving tabindex: only the checked radio (or the first enabled one, when none is checked) is in the tab order. Arrow keys move focus **and** select, skip disabled radios, and wrap. Pass `name` and the selected value is submitted with its form. The group is labelled by the surrounding Field\'s label or by the visually hidden `label` prop.\n\n**Keyboard**\n\n| Key | Action |\n| --- | --- |\n| Tab | Moves focus into the group (to the checked radio) and out again |\n| ↓ / → | Selects the next enabled radio |\n| ↑ / ← | Selects the previous enabled radio |\n| Home / End | Selects the first / last enabled radio |\n| Space | Selects the focused radio |\n\n**Your responsibility**\n\n- Label the group: put it in a Field or pass `label`.\n- Keep radio labels short and distinct; they\'re read as "Free, radio, 1 of 3".',
      },
    },
  },
  subcomponents: { Radio },
  args: { label: 'Plan', orientation: 'vertical' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    ui: {
      control: 'object',
      description:
        'RadioGroup slots: `root`. Each `Radio` also takes `ui` with slots `root` (the `role="radio"` button), `control` (circle), `indicator` (dot), `label`.',
    },
  },
  render: (args) => ({
    components: { RadioGroup, Radio },
    setup: () => ({ args, value: ref('free') }),
    template: `<RadioGroup v-bind="args" v-model="value">
      <Radio value="free">Free</Radio>
      <Radio value="pro" disabled>Pro (sold out)</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>`,
  }),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const free = canvas.getByRole('radio', { name: 'Free' })
    const team = canvas.getByRole('radio', { name: 'Team' })
    await userEvent.tab()
    await expect(free).toHaveFocus()
    // ArrowDown skips the disabled "Pro" and selects "Team".
    await userEvent.keyboard('{ArrowDown}')
    await expect(team).toHaveFocus()
    await expect(team).toBeChecked()
    // Wraps back to the first radio.
    await userEvent.keyboard('{ArrowDown}')
    await expect(free).toBeChecked()
  },
}

export const Horizontal: Story = { args: { orientation: 'horizontal' } }

export const InField: Story = {
  render: () => ({
    components: { RadioGroup, Radio, Field },
    setup: () => ({ value: ref<string>() }),
    template: `<Field label="Shipping" description="Pick a delivery speed.">
      <RadioGroup v-model="value">
        <Radio value="standard">Standard</Radio>
        <Radio value="express">Express</Radio>
      </RadioGroup>
    </Field>`,
  }),
}

export const Customized: Story = { args: { ui: { root: 'gap-6' } } }
