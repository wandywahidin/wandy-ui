import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { RegisteredItem } from '../../composables/useItemRegistry'

export interface TabsContext {
  baseId: string
  selected: Ref<string | undefined>
  /** The tab shown as selected: the model if it names a tab, else the first enabled tab. */
  active: ComputedRef<string | undefined>
  /** The one tab with tabindex=0: `active` if enabled, else the first enabled tab. */
  tabbable: ComputedRef<string | undefined>
  activation: Ref<'automatic' | 'manual'>
  orientation: Ref<'horizontal' | 'vertical'>
  select(value: string): void
  register(item: RegisteredItem): () => void
}

export const TABS_KEY: InjectionKey<TabsContext> = Symbol('wandy-tabs')

// Values become part of ids, and ids are referenced from space-separated
// IDREF lists (aria-labelledby/aria-controls), so encode anything outside
// [A-Za-z0-9_-] — reversibly, so distinct values never collide.
function encode(value: string) {
  return value.replace(/[^A-Za-z0-9_-]/g, (c) => `_${c.codePointAt(0)!.toString(16)}_`)
}

export function tabId(baseId: string, value: string) {
  return `${baseId}-tab-${encode(value)}`
}
export function panelId(baseId: string, value: string) {
  return `${baseId}-panel-${encode(value)}`
}
