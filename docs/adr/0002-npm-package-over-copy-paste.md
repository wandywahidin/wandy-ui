# ADR 0002: Distribute as an npm package, not copy-paste source

- **Status:** Accepted
- **Date:** 2026-11-19

## Context

There are two popular ways to distribute Vue components:

1. A versioned **npm package** that consumers install and upgrade.
2. A **copy-paste registry** (the shadcn-vue model), where a CLI copies component source into the consumer's repo and the consumer owns it from then on.

The library will be reused across several of the author's own projects, so fixes and improvements should reach every consumer. It also has to show disciplined API design and versioning.

## Decision

Ship `@wandy/ui` and `@wandy/tokens` as **npm packages**, versioned with semver and Changesets. Instead of editing copied source, consumers customize through five supported layers: tokens, variant `extend`, the `ui` prop and `class`, global defaults via `createUI`, and slots.

## Alternatives

| Option                             | Why not                                                                                                                                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Copy-paste registry with a CLI     | Total freedom for consumers, but component semver stops meaning anything once code is copied: bug and accessibility fixes don't propagate. It would also read as a clone of shadcn-vue rather than an original foundation. |
| Both (package plus an "eject" CLI) | Doubles the surface to maintain and document for v1. We can revisit after 1.0.                                                                                                                                             |

## Consequences

- The public API is a contract from day one: props, events, slots, `ui` part names, exported functions, and token names. Breaking changes need a changeset with a migration note (see the Versioning page).
- Customization has to be good enough that nobody needs to fork. That's why every component exposes named `ui` parts and why consumer classes merge through tailwind-merge. The anti-goal is any customization that needs `!important` or internal selectors.
- Internal logic can't be changed by consumers without forking. That's acceptable; slots cover markup changes.
- The package ships `src/` alongside `dist/` so consumers' Tailwind `@source` can find the class names.
