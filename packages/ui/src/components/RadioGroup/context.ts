import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface RadioGroupContext {
  selected: Ref<string | undefined>
  disabled: ComputedRef<boolean>
  /** Value of the one radio with tabindex=0. */
  tabbable: ComputedRef<string | undefined>
  select(value: string): void
  register(value: string, disabled: () => boolean): () => void
}

export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol('wandy-radio-group')
