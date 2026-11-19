import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    // Tests compose components with template strings; use the build that
    // includes the runtime compiler (tests only — the library ships runtime-only).
    alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' }],
  },
})
