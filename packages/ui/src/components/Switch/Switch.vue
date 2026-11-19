<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import { useUi } from '../../composables/useUi'
import { useFieldControl } from '../../composables/useField'
import type { UiOverrides } from '../../types'
import { switchVariants } from './Switch.variants'

defineOptions({ inheritAttrs: false })

export interface SwitchProps {
  id?: string
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md'
  ui?: UiOverrides<'root' | 'track' | 'thumb' | 'label'>
}

const props = withDefaults(defineProps<SwitchProps>(), {
  disabled: false,
  invalid: false,
  size: 'md',
})
const model = defineModel<boolean>({ default: false })
const slots = defineSlots<{ default?(): unknown }>()

const attrs = useAttrs()
const control = useFieldControl(props)
const labelId = useId()
const rest = computed(() => ({ ...attrs, class: undefined }))

const classes = useUi(
  'switch',
  () => {
    const s = switchVariants({ size: props.size })
    return { root: s.root(), track: s.track(), thumb: s.thumb(), label: s.label() }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)

function toggle() {
  if (!control.value.disabled) model.value = !model.value
}
</script>

<template>
  <span :class="classes.root">
    <button
      v-bind="{ ...rest, ...control }"
      type="button"
      role="switch"
      :aria-checked="model"
      :aria-labelledby="slots.default ? labelId : (attrs['aria-labelledby'] as string | undefined)"
      :class="classes.track"
      @click="toggle"
    >
      <span :class="classes.thumb" aria-hidden="true" />
    </button>
    <span v-if="slots.default" :id="labelId" :class="classes.label" @click="toggle"><slot /></span>
  </span>
</template>
