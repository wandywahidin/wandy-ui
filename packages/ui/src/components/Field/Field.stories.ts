import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Field } from './index'
import { Input } from '../Input'
import { Textarea } from '../Textarea'

const meta = {
  title: 'Components/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'Labels a form control and links its description and error message.\n\n## Accessibility\n\n**Pattern:** native `<label for>` plus `aria-describedby`. Field provides ids to the control inside it (Input, Textarea, Checkbox, Switch, RadioGroup, Select). `aria-describedby` lists only the description and error that are actually rendered, so it never points at missing ids. Setting `error` sets `aria-invalid="true"` on the control. The error is plain text, not `role="alert"`, so it\'s read once on focus instead of announced twice. The required `*` is `aria-hidden`; the control gets the native `required` attribute.\n\n**Keyboard**\n\n| Key | Action |\n| --- | --- |\n| Tab | Moves focus to the control (clicking the label also focuses it) |\n\n**Your responsibility**\n\n- Put exactly one control inside a Field.\n- Write error messages that say how to fix the problem ("Enter an email like name@example.com").\n- If you show errors only after submit, move focus to the first invalid field yourself.',
      },
    },
  },
  args: { label: 'Email', description: 'We never share your email.' },
  argTypes: {
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides. Slots: `root` (wrapper), `label`, `required` (the `*` marker), `description`, `error`.',
    },
  },
  render: (args) => ({
    components: { Field, Input },
    setup: () => ({ args, value: ref('') }),
    template:
      '<Field v-bind="args" class="max-w-sm"><Input v-model="value" type="email" /></Field>',
  }),
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const WithInput: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Email')
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.keyboard('ada@example.com')
    await expect(input).toHaveValue('ada@example.com')
    await expect(input).toHaveAccessibleDescription('We never share your email.')
  },
}

export const WithError: Story = {
  args: { error: 'Enter a valid email address.', required: true },
  play: async ({ canvasElement }) => {
    // Accessible name excludes the aria-hidden "*" marker.
    const input = within(canvasElement).getByRole('textbox', { name: 'Email' })
    await expect(input).toBeInvalid()
    await expect(input).toBeRequired()
  },
}

export const WithTextarea: Story = {
  args: { label: 'Bio', description: 'A sentence or two.' },
  render: (args) => ({
    components: { Field, Textarea },
    setup: () => ({ args, value: ref('') }),
    template: '<Field v-bind="args" class="max-w-sm"><Textarea v-model="value" /></Field>',
  }),
}

export const Disabled: Story = { args: { disabled: true } }

export const Customized: Story = {
  args: {
    ui: { label: 'uppercase tracking-wide text-xs', description: 'italic' },
  },
}
