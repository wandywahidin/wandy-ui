# ADR 0003: Tailwind CSS v4 and tailwind-variants for styling

- **Status:** Accepted
- **Date:** 2026-11-19

## Context

Components need a styling approach that:

- themes through tokens (light/dark, brand swap) without a rebuild,
- exposes variants (`size`, `intent`, `variant`) in a form consumers can extend,
- lets consumer classes reliably override defaults with no specificity fights.

## Decision

- **Tailwind CSS v4** with CSS-first configuration. `@wandy29/tokens` emits runtime variables (`--wui-*`) for `:root` and `.dark`, plus a `@theme inline` block that maps Tailwind utilities onto them (`--color-primary: var(--wui-primary)`).
- **[tailwind-variants](https://www.tailwind-variants.org)** (`tv()`) for variant and slot definitions. Each component exports its definition (`buttonVariants`, …) so consumers can `extend` it.
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** in a single `useUi` composable. It merges classes in a fixed order (component default < global default < `ui` prop / `class`), so later layers _replace_ conflicting utilities instead of depending on CSS order.

Consumers must use Tailwind v4. This is a deliberate, documented requirement.

## Alternatives

| Option                                      | Why not                                                                                                                                                    |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tailwind v3 support                         | v3's JS config can't consume our CSS `@theme` tokens without a second token pipeline. Supporting both doubles the testing matrix for a shrinking audience. |
| Precompiled CSS (no Tailwind for consumers) | Removes the Tailwind requirement, but consumer overrides become specificity battles: the anti-goal.                                                        |
| CSS Modules / scoped styles                 | Same override problem, and no shared variant vocabulary.                                                                                                   |
| CVA (class-variance-authority)              | Fine for single-element variants; tailwind-variants adds first-class **slots** (multi-part components such as Dialog) and `extend`.                        |

## Consequences

- Consumers add three lines of CSS (`@import "tailwindcss"`, the theme import, and a `@source` pointing at the package source). Getting Started documents them.
- Because merging is centralized in `useUi`, every component gets the same priority rules, and one test suite covers them.
- tailwind-merge resolves conflicts by utility group. A consumer `bg-*` replaces the default `bg-*` but not `hover:bg-*`. The Customization page documents this.
- The `dark` variant is declared in `theme.css` (`@custom-variant dark`), so consumer `dark:` utilities follow the same `.dark` switch.
