import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    // Reads prop types straight from `defineProps<T>()` via Volar.
    options: { docgen: 'vue-component-meta' },
  },
  core: { disableTelemetry: true },
  stories: ['../src/**/*.mdx', '../../../packages/ui/src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    return config
  },
}

export default config
