import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import { Tab, TabList, TabPanel, Tabs } from './index'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Switch between related panels without leaving the page.\n\n## Accessibility\n\n**Pattern:** [WAI-ARIA tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): `role="tablist"`, `role="tab"` with `aria-selected` and `aria-controls`, and `role="tabpanel"` with `aria-labelledby`. Ids come from `useId()`, so several Tabs on one page never collide. Roving tabindex: only the selected tab is tabbable. **Automatic** activation selects on arrow; **manual** only moves focus, and Enter/Space selects. Inactive panels stay in the DOM but are hidden (`v-show`). With no value, the first enabled tab is selected.\n\n**Keyboard**\n\n| Key | Action |\n| --- | --- |\n| Tab | Moves focus to the selected tab, then into the active panel |\n| → / ← (horizontal), ↓ / ↑ (vertical) | Next / previous enabled tab (wraps); selects it in automatic mode |\n| Home / End | First / last enabled tab |\n| Enter / Space | Selects the focused tab (manual mode) |\n\n**Your responsibility**\n\n- Label the tablist with `aria-label` or `aria-labelledby` on `TabList`.\n- Use manual activation when showing a panel is slow (it fetches data).',
      },
    },
  },
  subcomponents: { TabList, Tab, TabPanel },
  args: { activation: 'automatic', orientation: 'horizontal' },
  argTypes: {
    activation: { control: 'inline-radio', options: ['automatic', 'manual'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    ui: {
      control: 'object',
      description:
        'Each part takes its own `ui` with one slot, `root`: `Tabs` (wrapper), `TabList` (`role="tablist"`), `Tab` (`role="tab"` button), `TabPanel` (`role="tabpanel"`).',
    },
  },
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel },
    setup: () => ({ args, value: ref('account') }),
    template: `<Tabs v-bind="args" v-model="value">
      <TabList aria-label="Settings">
        <Tab value="account">Account</Tab>
        <Tab value="billing" disabled>Billing</Tab>
        <Tab value="security">Security</Tab>
        <Tab value="team">Team</Tab>
      </TabList>
      <TabPanel value="account">Update your name and avatar.</TabPanel>
      <TabPanel value="billing">Billing is unavailable on this plan.</TabPanel>
      <TabPanel value="security">Change your password and 2FA.</TabPanel>
      <TabPanel value="team">Invite teammates.</TabPanel>
    </Tabs>`,
  }),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Automatic: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const account = canvas.getByRole('tab', { name: 'Account' })
    const security = canvas.getByRole('tab', { name: 'Security' })
    await userEvent.tab()
    await expect(account).toHaveFocus()
    // Skips the disabled Billing tab and selects Security.
    await userEvent.keyboard('{ArrowRight}')
    await expect(security).toHaveFocus()
    await expect(security).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Change your password')
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('tab', { name: 'Team' })).toHaveAttribute('aria-selected', 'true')
    // Tab moves from the tablist into the active panel.
    await userEvent.tab()
    await expect(canvas.getByRole('tabpanel')).toHaveFocus()
  },
}

export const Manual: Story = {
  args: { activation: 'manual' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    const security = canvas.getByRole('tab', { name: 'Security' })
    await expect(security).toHaveFocus()
    await expect(security).toHaveAttribute('aria-selected', 'false')
    await userEvent.keyboard('{Enter}')
    await expect(security).toHaveAttribute('aria-selected', 'true')
  },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    await expect(canvas.getByRole('tab', { name: 'Security' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  },
}

export const Customized: Story = {
  render: () => ({
    components: { Tabs, TabList, Tab, TabPanel },
    setup: () => ({ value: ref('one') }),
    template: `<Tabs v-model="value">
      <TabList aria-label="Pills" :ui="{ root: 'border-none gap-2' }">
        <Tab v-for="t in ['one', 'two']" :key="t" :value="t"
          :ui="{ root: 'rounded-full border-none aria-selected:bg-primary aria-selected:text-primary-foreground' }">
          Tab {{ t }}
        </Tab>
      </TabList>
      <TabPanel value="one">First</TabPanel>
      <TabPanel value="two">Second</TabPanel>
    </Tabs>`,
  }),
}
