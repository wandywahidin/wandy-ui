<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import { RADIO_GROUP_KEY } from './context'
import { radioVariants } from './RadioGroup.variants'

defineOptions({ inheritAttrs: false })

export interface RadioProps {
  value: string
  disabled?: boolean
  ui?: UiOverrides<'root' | 'control' | 'indicator' | 'label'>
}

const props = withDefaults(defineProps<RadioProps>(), { disabled: false })
defineSlots<{ default?(): unknown }>()

const group = inject(RADIO_GROUP_KEY)
if (!group) throw new Error('<Radio> must be used inside <RadioGroup>.')

const attrs = useAttrs()
const isDisabled = computed(() => props.disabled || group.disabled.value)
const checked = computed(() => group.selected.value === props.value)
const el = ref<HTMLElement>()
onBeforeUnmount(
  group.register({
    value: () => props.value,
    disabled: () => isDisabled.value,
    el: () => el.value,
  }),
)

const classes = useUi(
  'radio',
  () => {
    const s = radioVariants()
    return { root: s.root(), control: s.control(), indicator: s.indicator(), label: s.label() }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)

function onClick() {
  if (!isDisabled.value) group!.select(props.value)
}
</script>

<template>
  <button
    ref="el"
    v-bind="{ ...attrs, class: undefined }"
    type="button"
    role="radio"
    :aria-checked="checked"
    :data-value="value"
    :tabindex="group.tabbable.value === value ? 0 : -1"
    :disabled="isDisabled || undefined"
    :class="classes.root"
    @click="onClick"
  >
    <span :class="classes.control" aria-hidden="true"><span :class="classes.indicator" /></span>
    <span :class="classes.label"><slot /></span>
  </button>
</template>
