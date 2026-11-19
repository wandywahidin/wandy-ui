# ADR 0001: Hybrid build vs. buy for accessibility logic

- **Status:** Accepted
- **Date:** 2026-11-19

## Context

Every interactive component needs correct keyboard behavior, focus management, and ARIA semantics. We can write that logic ourselves, wrap a headless library, or mix the two.

Two forces pull in opposite directions:

- The library exists partly to show we can build frontend foundations, so owning the ARIA logic is valuable.
- Some patterns (modal focus trapping, scroll locking, collision-aware positioning, listbox typeahead, portals) are large, subtle, and full of browser edge cases. Getting them wrong ships real accessibility bugs.

## Decision

Use a **hybrid** approach:

- **Hand-build** the components whose WAI-ARIA pattern is small enough to own and test completely: Button/IconButton, Field, Input, Textarea, Checkbox, RadioGroup, Switch, Tabs, Badge, Spinner. Shared behavior lives in our own composables (`useFieldControl`, `useRovingFocus`).
- **Wrap [Reka UI](https://reka-ui.com)** for Dialog, Popover, Tooltip, and Select, which need focus traps, portals, floating positioning, or typeahead.

Both kinds of component present the same API: `ui` parts, `class`, global defaults, and `*Variants` exports. Consumers can't tell which kind they're using.

## Alternatives

| Option                        | Why not                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Wrap Reka UI for everything   | Fast and solid, but leaves almost nothing of our own to show or own; every bug fix waits on upstream.                                                  |
| Build everything from scratch | Strongest ownership, but weeks of work, and a high risk of focus-trap and positioning bugs in exactly the components where those bugs hurt users most. |

## Consequences

- `reka-ui` is a peer dependency, even for apps that only use hand-built components. It tree-shakes, so unused parts cost nothing at runtime.
- Hand-built components carry their own test burden: each has axe tests per state and keyboard play functions. Review Focus items (disabled roving items, multiple instances, dangling `aria-describedby`) have dedicated tests.
- Reka UI major upgrades are now our concern. They're isolated to four wrapper components.
- If a hand-built component grows a pattern we can't keep correct, such as a combobox, we can move it to the "wrap" column without changing its public API.
