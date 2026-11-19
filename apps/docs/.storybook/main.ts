import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'
import remarkGfm from 'remark-gfm'
import vue from '@vitejs/plugin-vue'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    // Reads prop types straight from `defineProps<T>()` via Volar.
    options: { docgen: 'vue-component-meta' },
  },
  core: { disableTelemetry: true },
  stories: ['../src/**/*.mdx', '../../../packages/ui/src/**/*.stories.ts'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // GitHub-flavored markdown (tables) in MDX pages and component descriptions.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  async viteFinal(config) {
    // There is no vite.config in apps/docs, so add the Vue SFC compiler here
    // unless the framework already did.
    const hasVue = (config.plugins ?? [])
      .flat(Infinity as 1)
      .some((p) => p && typeof p === 'object' && 'name' in p && p.name === 'vite:vue')
    config.plugins = [...(config.plugins ?? []), ...(hasVue ? [] : [vue()]), tailwindcss()]
    return config
  },
}

export default config
