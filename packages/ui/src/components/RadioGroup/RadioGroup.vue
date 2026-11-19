<script setup lang="ts">
import { computed, provide, ref, shallowReactive, useAttrs, useId } from 'vue'
import { useUi } from '../../composables/useUi'
import { useFieldContext, useFieldControl } from '../../composables/useField'
import { useRovingFocus } from '../../composables/useRovingFocus'
import type { UiOverrides } from '../../types'
import { RADIO_GROUP_KEY } from './context'
import { radioGroupVariants } from './RadioGroup.variants'

defineOptions({ inheritAttrs: false })

export interface RadioGroupProps {
  /** Group label, rendered visually hidden. Not needed inside a Field. */
  label?: string
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  ui?: UiOverrides<'root'>
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  orientation: 'vertical',
  disabled: false,
})
const model = defineModel<string>()
defineSlots<{ default?(): unknown }>()

const attrs = useAttrs()
const field = useFieldContext()
const control = useFieldControl({ disabled: props.disabled })
const ownLabelId = useId()
const labelledBy = computed(() => (field ? field.labelId : props.label ? ownLabelId : undefined))
const groupDisabled = computed(() => props.disabled || !!control.value.disabled)

const root = ref<HTMLElement>()
const radios = shallowReactive<Array<{ value: string; disabled: () => boolean }>>([])

const tabbable = computed(() => {
  const enabled = radios.filter((r) => !r.disabled())
  return enabled.find((r) => r.value === model.value)?.value ?? enabled[0]?.value
})

function select(value: string) {
  model.value = value
}

provide(RADIO_GROUP_KEY, {
  selected: model,
  disabled: groupDisabled,
  tabbable,
  select,
  register(value, disabled) {
    const entry = { value, disabled }
    radios.push(entry)
    return () => radios.splice(radios.indexOf(entry), 1)
  },
})

// APG radio group: arrows in both axes move focus and select.
const { onKeydown } = useRovingFocus({
  items: () => Array.from(root.value?.querySelectorAll<HTMLElement>('[role="radio"]') ?? []),
  orientation: 'both',
  onMove: (el) => {
    const v = el.dataset.value
    if (v !== undefined) select(v)
  },
})

const classes = useUi(
  'radioGroup',
  () => ({ root: radioGroupVariants({ orientation: props.orientation }) }),
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)
</script>

<template>
  <div
    :id="control.id"
    ref="root"
    v-bind="{ ...attrs, class: undefined }"
    role="radiogroup"
    :aria-labelledby="labelledBy"
    :aria-describedby="control['aria-describedby']"
    :aria-invalid="control['aria-invalid']"
    :aria-required="control.required || undefined"
    :aria-disabled="groupDisabled || undefined"
    :aria-orientation="orientation"
    :class="classes.root"
    @keydown="onKeydown"
  >
    <span v-if="!field && label" :id="ownLabelId" class="sr-only">{{ label }}</span>
    <slot />
  </div>
</template>
