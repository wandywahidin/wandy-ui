<script setup lang="ts">
import { computed, provide, ref, useAttrs, useId } from 'vue'
import { useUi } from '../../composables/useUi'
import { useFieldContext, useFieldControl } from '../../composables/useField'
import { useItemRegistry } from '../../composables/useItemRegistry'
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
  /** Form field name. When set, the selected value is submitted with its form. */
  name?: string
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
// Getters keep `disabled` reactive and let a consumer `id` apply when standalone.
const control = useFieldControl(
  {
    get disabled() {
      return props.disabled
    },
    get id() {
      return attrs.id as string | undefined
    },
  },
  attrs,
)
const ownLabelId = useId()
// Explicit bindings below override `v-bind="attrs"` even when undefined, so
// fall back to the consumer's own attribute instead of wiping it.
const labelledBy = computed(
  () =>
    (field ? field.labelId : props.label ? ownLabelId : undefined) ??
    (attrs['aria-labelledby'] as string | undefined),
)
const groupDisabled = computed(() => props.disabled || !!control.value.disabled)

const root = ref<HTMLElement>()
const { ordered, register } = useItemRegistry(root)

const tabbable = computed(() => {
  const enabled = ordered.value.filter((r) => !r.disabled())
  return (enabled.find((r) => r.value() === model.value) ?? enabled[0])?.value()
})

function select(value: string) {
  model.value = value
}

provide(RADIO_GROUP_KEY, {
  selected: model,
  disabled: groupDisabled,
  tabbable,
  select,
  register,
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
    ref="root"
    v-bind="{ ...attrs, class: undefined, id: control.id }"
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
    <input
      v-if="name && model !== undefined && !groupDisabled"
      type="hidden"
      :name="name"
      :value="model"
    />
  </div>
</template>
