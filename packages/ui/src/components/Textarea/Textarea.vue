<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import { useFieldControl } from '../../composables/useField'
import type { UiOverrides } from '../../types'
import { textareaVariants } from './Textarea.variants'

defineOptions({ inheritAttrs: false })

export interface TextareaProps {
  id?: string
  invalid?: boolean
  disabled?: boolean
  required?: boolean
  rows?: number
  ui?: UiOverrides<'root'>
}

const props = withDefaults(defineProps<TextareaProps>(), {
  invalid: false,
  disabled: false,
  required: false,
  rows: 3,
})
const model = defineModel<string>()

const attrs = useAttrs()
const control = useFieldControl(props)
const rest = computed(() => ({ ...attrs, class: undefined }))

const classes = useUi('textarea', () => ({ root: textareaVariants().root() }), {
  ui: () => props.ui,
  class: () => attrs.class,
  root: 'root',
})
</script>

<template>
  <textarea
    v-model="model"
    v-bind="{ ...rest, ...control }"
    :rows="rows"
    :class="classes.root"
  ></textarea>
</template>
