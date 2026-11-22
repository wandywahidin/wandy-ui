import { computed, inject, useId, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export interface FieldContext {
  /** id of the form control; the label's `for`. */
  id: string
  /** id of the visible label; for controls that use `aria-labelledby` (RadioGroup). */
  labelId: string
  descriptionId: string
  errorId: string
  hasDescription: Ref<boolean>
  hasError: Ref<boolean>
  invalid: Ref<boolean>
  disabled: Ref<boolean>
  required: Ref<boolean>
}

export const FIELD_KEY: InjectionKey<FieldContext> = Symbol('wandy-field')

export interface FieldControlProps {
  id?: string
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export interface FieldControlAttrs {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: 'true'
  disabled?: boolean
  required?: boolean
}

/** Read the surrounding Field, if any. */
export function useFieldContext(): FieldContext | null {
  return inject(FIELD_KEY, null)
}

/**
 * ARIA and state attrs for a form control. Inside a Field, the control takes
 * the Field's ids; standalone it uses `props.id` or a generated one. Only ids
 * of rendered elements go into `aria-describedby`, so it never dangles.
 *
 * Pass the component's `useAttrs()` as `attrs` so a consumer's own
 * `aria-describedby` is kept and merged ahead of the Field's ids.
 */
export function useFieldControl(
  props: FieldControlProps,
  attrs?: Record<string, unknown>,
): ComputedRef<FieldControlAttrs> {
  const field = useFieldContext()
  const fallbackId = useId()

  return computed(() => {
    const own = attrs?.['aria-describedby']
    const describedBy = [
      typeof own === 'string' && own.trim(),
      field?.hasDescription.value && field.descriptionId,
      field?.hasError.value && field.errorId,
    ].filter(Boolean)
    const invalid = props.invalid || field?.invalid.value
    const disabled = props.disabled || field?.disabled.value
    const required = props.required || field?.required.value

    const out: FieldControlAttrs = { id: field?.id ?? props.id ?? fallbackId }
    if (describedBy.length) out['aria-describedby'] = describedBy.join(' ')
    if (invalid) out['aria-invalid'] = 'true'
    if (disabled) out.disabled = true
    if (required) out.required = true
    return out
  })
}
