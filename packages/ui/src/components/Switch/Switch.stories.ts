import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Switch } from './index'
import { Field } from '../Field'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `root` (wrapper), `track` (the `role="switch"` button, receives all non-class attrs), `thumb`, `label`.',
    },
  },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args, value: ref(false) }),
    template: '<Switch v-bind="args" v-model="value">Airplane mode</Switch>',
  }),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'Airplane mode' })
    await userEvent.tab()
    await expect(sw).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(sw).toBeChecked()
    await userEvent.keyboard('{Enter}')
    await expect(sw).not.toBeChecked()
  },
}

export const Small: Story = { args: { size: 'sm' } }
export const Disabled: Story = { args: { disabled: true } }

export const InField: Story = {
  render: () => ({
    components: { Switch, Field },
    setup: () => ({ value: ref(true) }),
    template: `<Field label="Email notifications" description="A daily digest, never more.">
      <Switch v-model="value" />
    </Field>`,
  }),
}

export const Customized: Story = {
  args: { ui: { track: 'aria-checked:bg-success', label: 'font-semibold' } },
}
