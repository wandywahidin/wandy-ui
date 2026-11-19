import type { Preview } from '@storybook/vue3-vite'
import './preview.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, context) => {
      const dark = context.globals.theme === 'dark'
      document.documentElement.classList.toggle('dark', dark)
      return {
        components: { story },
        template: '<div class="bg-background p-4 text-foreground"><story /></div>',
      }
    },
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    // Fail Storybook tests on accessibility violations, not just warn.
    a11y: { test: 'error' },
  },
  tags: ['autodocs'],
}

export default preview
