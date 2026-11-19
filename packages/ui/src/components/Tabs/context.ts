import type { InjectionKey, Ref } from 'vue'

export interface TabsContext {
  baseId: string
  selected: Ref<string | undefined>
  activation: Ref<'automatic' | 'manual'>
  orientation: Ref<'horizontal' | 'vertical'>
  select(value: string): void
  register(value: string, disabled: () => boolean): () => void
}

export const TABS_KEY: InjectionKey<TabsContext> = Symbol('wandy-tabs')

export function tabId(baseId: string, value: string) {
  return `${baseId}-tab-${value}`
}
export function panelId(baseId: string, value: string) {
  return `${baseId}-panel-${value}`
}
