# @wandy/ui

[![CI](https://github.com/wandywahidin/wandy-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/wandywahidin/wandy-ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@wandy/ui.svg)](https://www.npmjs.com/package/@wandy/ui)
[![tokens](https://img.shields.io/npm/v/@wandy/tokens.svg?label=%40wandy%2Ftokens)](https://www.npmjs.com/package/@wandy/tokens)

**Accessible, customizable Vue 3.5 components styled with Tailwind CSS v4.**

Every component ships with axe tests for every state, keyboard tests in a real browser, an Accessibility section in its docs, and named parts you can restyle without `!important`.

**Live docs and playground:** https://wandywahidin.github.io/wandy-ui/

|                   |                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Components**    | Button, IconButton, Field, Input, Textarea, Checkbox, RadioGroup, Switch, Tabs, Badge, Spinner, Dialog, Popover, Tooltip, Select |
| **Theming**       | typed tokens → `theme.css`, light/dark via `.dark`, WCAG AA contrast enforced by tests                                           |
| **Customization** | tokens → variant `extend` → `ui` prop / `class` → global defaults → slots                                                        |
| **Accessibility** | Vitest + vitest-axe per state, Storybook play functions in Chromium, addon-a11y fails CI on violations                           |
| **Releases**      | semver with Changesets, changelog and npm publish from CI                                                                        |

## Quick start

```sh
pnpm add @wandy/ui @wandy/tokens reka-ui
```

```css
/* src/style.css */
@import "tailwindcss";
@import "@wandy/tokens/theme.css";
@source "../node_modules/@wandy/ui/src";
```

```ts
// src/main.ts
import { createApp } from 'vue'
import { createUI } from '@wandy/ui'
import App from './App.vue'
import './style.css'

createApp(App).use(createUI()).mount('#app')
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Field, Input } from '@wandy/ui'
const email = ref('')
</script>

<template>
  <Field label="Email" description="We never share your email.">
    <Input v-model="email" type="email" />
  </Field>
  <Button type="submit">Subscribe</Button>
</template>
```

Requires Vue `^3.5`, Tailwind CSS `^4`, and Reka UI `^2.11`.

## Customize anything

```ts
// App-wide defaults
app.use(createUI({ ui: { button: { root: 'rounded-full' } } }))
```

```vue
<!-- One instance: per-part classes; consumer classes always win -->
<Dialog title="Invite" :ui="{ content: 'max-w-xl', title: 'text-primary' }" />
<Button class="bg-success text-success-foreground hover:bg-success/90">Saved</Button>
```

```css
/* Re-brand every component: set both themes, or :root also wins in dark mode */
:root {
  --wui-primary: #0f766e;
  --wui-ring: #0f766e;
}
.dark {
  --wui-primary: #5eead4;
  --wui-primary-foreground: #042f2e;
  --wui-ring: #5eead4;
}
```

Read the Customization page in the docs for all five layers.

## Repository

```
packages/tokens   typed design tokens → theme.css (+ contrast tests)
packages/ui       components, composables, plugin, variants
apps/docs         Storybook: component docs, guides, play-function tests
docs/adr          architecture decision records
```

```sh
pnpm install
pnpm test                          # unit + component tests (Vitest, jsdom, axe)
pnpm --filter docs storybook       # docs at http://localhost:6006
pnpm --filter docs test-storybook  # keyboard + a11y tests in Chromium
pnpm build                         # tokens + library
```

## Decisions

- [ADR 0001: Hybrid build vs. buy](docs/adr/0001-hybrid-build-vs-buy.md): which components are hand-built and which wrap Reka UI
- [ADR 0002: npm package over copy-paste](docs/adr/0002-npm-package-over-copy-paste.md)
- [ADR 0003: Tailwind v4 and tailwind-variants](docs/adr/0003-tailwind-v4-and-tailwind-variants.md)
- [ADR 0004: Vue 3.5, not the 3.6 RC](docs/adr/0004-vue-3-5-not-3-6-rc.md)

## License

MIT
