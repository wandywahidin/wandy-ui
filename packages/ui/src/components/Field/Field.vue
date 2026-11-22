<script setup lang="ts">
import { computed, provide, toRef, useAttrs, useId } from 'vue'
import { useUi } from '../../composables/useUi'
import { FIELD_KEY } from '../../composables/useField'
import type { UiOverrides } from '../../types'
import { fieldVariants } from './Field.variants'

defineOptions({ inheritAttrs: false })

export interface FieldProps {
  label: string
  description?: string
  /** Error message. Setting it marks the control invalid. */
  error?: string
  required?: boolean
  disabled?: boolean
  ui?: UiOverrides<'root' | 'label' | 'required' | 'description' | 'error'>
}

const props = withDefaults(defineProps<FieldProps>(), { required: false, disabled: false })
defineSlots<{ default?(): unknown }>()
const attrs = useAttrs()

const base = useId()
const ids = {
  id: `${base}-control`,
  labelId: `${base}-label`,
  descriptionId: `${base}-description`,
  errorId: `${base}-error`,
}

const hasError = computed(() => !!props.error)
provide(FIELD_KEY, {
  ...ids,
  hasDescription: computed(() => !!props.description),
  hasError,
  invalid: hasError,
  disabled: toRef(props, 'disabled'),
  required: toRef(props, 'required'),
})

const classes = useUi(
  'field',
  () => {
    const s = fieldVariants({ disabled: props.disabled })
    return {
      root: s.root(),
      label: s.label(),
      description: s.description(),
      error: s.error(),
      required: s.required(),
    }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)
</script>

<template>
  <div v-bind="{ ...attrs, class: undefined }" :class="classes.root">
    <label :id="ids.labelId" :for="ids.id" :class="classes.label">
      {{ label }}<span v-if="required" aria-hidden="true" :class="classes.required">*</span>
    </label>
    <slot />
    <p v-if="description" :id="ids.descriptionId" :class="classes.description">
      {{ description }}
    </p>
    <p v-if="error" :id="ids.errorId" :class="classes.error">{{ error }}</p>
  </div>
</template>
