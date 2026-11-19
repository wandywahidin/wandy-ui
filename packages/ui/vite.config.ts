import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import pkg from './package.json' with { type: 'json' }

// Never bundle runtime deps or peers; match subpaths too (e.g. `vue/dist/...`).
const externals = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]
const isExternal = (id: string) => externals.some((d) => id === d || id.startsWith(`${d}/`))

export default defineConfig({
  plugins: [
    vue(),
    dts({
      processor: 'vue',
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      exclude: ['**/*.test.ts', '**/*.stories.ts', 'src/test-utils.ts', 'scripts/**'],
    }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
    },
    minify: false,
    sourcemap: true,
    rolldownOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.ts'],
          // Tests compose components with template strings; use the build that
          // includes the runtime compiler (tests only — the library ships runtime-only).
          alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' }],
        },
      },
      {
        extends: true,
        test: { name: 'dist', environment: 'node', include: ['scripts/**/*.test.ts'] },
      },
    ],
  },
})
