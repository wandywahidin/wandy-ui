import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button, IconButton } from './index'

const closeIcon =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { onClick: fn(), variant: 'solid', intent: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    intent: { control: 'inline-radio', options: ['primary', 'neutral', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    ui: {
      control: 'object',
      description:
        'Per-slot class overrides, merged with tailwind-merge. Slots: `root` (the `<button>`), `spinner` (the loading Spinner).',
    },
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Save changes</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Save changes' })
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const Variants: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<div class="flex gap-3">
      <Button v-bind="args" variant="solid">Solid</Button>
      <Button v-bind="args" variant="outline">Outline</Button>
      <Button v-bind="args" variant="ghost">Ghost</Button>
    </div>`,
  }),
}

export const Intents: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<div class="flex flex-col gap-3">
      <div v-for="v in ['solid', 'outline', 'ghost']" :key="v" class="flex gap-3">
        <Button v-bind="args" :variant="v" intent="primary">Primary</Button>
        <Button v-bind="args" :variant="v" intent="neutral">Neutral</Button>
        <Button v-bind="args" :variant="v" intent="danger">Danger</Button>
      </div>
    </div>`,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<div class="flex items-center gap-3">
      <Button v-bind="args" size="sm">Small</Button>
      <Button v-bind="args" size="md">Medium</Button>
      <Button v-bind="args" size="lg">Large</Button>
    </div>`,
  }),
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button')
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const IconOnly: Story = {
  name: 'IconButton',
  render: (args) => ({
    components: { IconButton },
    setup: () => ({ args, closeIcon }),
    template: `<div class="flex gap-3">
      <IconButton label="Close" @click="args.onClick"><span v-html="closeIcon" /></IconButton>
      <IconButton label="Close" variant="outline"><span v-html="closeIcon" /></IconButton>
      <IconButton label="Delete" variant="solid" intent="danger"><span v-html="closeIcon" /></IconButton>
    </div>`,
  }),
}

export const Customized: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<div class="flex gap-3">
      <Button v-bind="args" :ui="{ root: 'rounded-full px-8' }">ui.root = rounded-full</Button>
      <Button v-bind="args" class="bg-success hover:bg-success/90 text-success-foreground">class wins over variant</Button>
    </div>`,
  }),
}
