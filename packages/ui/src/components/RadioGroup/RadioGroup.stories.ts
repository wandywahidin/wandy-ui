import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Radio, RadioGroup } from './index'
import { Field } from '../Field'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
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
