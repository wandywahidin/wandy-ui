import { computed, inject, type ComputedRef } from 'vue'
import { UI_CONFIG_KEY } from '../plugin'
import type { ComponentName, UIConfig, UiOverrides } from '../types'
import { cn, type ClassValue } from '../utils/cn'

export interface UseUiOptions<S extends string> {
  /** Per-call slot overrides (the component's `ui` prop). */
  ui?: () => UiOverrides<NoInfer<S>> | undefined
  /** Consumer `class` attr; merged into the root slot last. */
  class?: () => unknown
  /** The slot that receives `class`. */
  root: NoInfer<S>
}

/**
 * Resolve each slot's classes in priority order:
 * component base < global default (createUI) < `ui` prop < `class` (root only).
 * Conflicts resolve through tailwind-merge, so later layers win.
 */
export function useUi<S extends string>(
  name: ComponentName,
  base: () => Record<S, string>,
  opts: UseUiOptions<S>,
): ComputedRef<Record<S, string>> {
  const config = inject(UI_CONFIG_KEY, {} as UIConfig)

  return computed(() => {
    const b = base()
    const global = (config.ui?.[name] ?? {}) as UiOverrides<S>
    const ui: UiOverrides<S> = opts.ui?.() ?? {}
    const out = {} as Record<S, string>
    for (const slot of Object.keys(b) as S[]) {
      out[slot] = cn(
        b[slot],
        global[slot],
        ui[slot],
        slot === opts.root ? (opts.class?.() as ClassValue) : undefined,
      )
    }
    return out
  })
}
