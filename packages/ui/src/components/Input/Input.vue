<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import { useFieldControl } from '../../composables/useField'
import type { UiOverrides } from '../../types'
import { inputVariants } from './Input.variants'

defineOptions({ inheritAttrs: false })

export interface InputProps {
  id?: string
  invalid?: boolean
  disabled?: boolean
  required?: boolean
  ui?: UiOverrides<'root' | 'input' | 'prefix' | 'suffix'>
}

const props = withDefaults(defineProps<InputProps>(), {
  invalid: false,
  disabled: false,
  required: false,
})
const model = defineModel<string>()
const slots = defineSlots<{ prefix?(): unknown; suffix?(): unknown }>()

const attrs = useAttrs()
const control = useFieldControl(props)
const rest = computed(() => ({ ...attrs, class: undefined }))

const classes = useUi(
  'input',
  () => {
    const s = inputVariants()
    return { root: s.root(), input: s.input(), prefix: s.prefix(), suffix: s.suffix() }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)
</script>

<template>
  <div :class="classes.root">
    <span v-if="slots.prefix" :class="classes.prefix"><slot name="prefix" /></span>
    <input v-model="model" v-bind="{ ...rest, ...control }" :class="classes.input" />
    <span v-if="slots.suffix" :class="classes.suffix"><slot name="suffix" /></span>
  </div>
</template>
