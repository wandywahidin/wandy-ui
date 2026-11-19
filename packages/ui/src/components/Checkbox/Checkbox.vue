<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import { useUi } from '../../composables/useUi'
import { useFieldControl } from '../../composables/useField'
import type { UiOverrides } from '../../types'
import { checkboxVariants } from './Checkbox.variants'

defineOptions({ inheritAttrs: false })

export interface CheckboxProps {
  id?: string
  disabled?: boolean
  invalid?: boolean
  ui?: UiOverrides<'root' | 'control' | 'indicator' | 'label'>
}

const props = withDefaults(defineProps<CheckboxProps>(), { disabled: false, invalid: false })
const model = defineModel<boolean | 'indeterminate'>({ default: false })
const slots = defineSlots<{ default?(): unknown }>()

const attrs = useAttrs()
const control = useFieldControl(props)
const rest = computed(() => ({ ...attrs, class: undefined }))
const input = ref<HTMLInputElement>()

const classes = useUi(
  'checkbox',
  () => {
    const s = checkboxVariants()
    return {
      root: s.root(),
      box: s.box(),
      control: s.control(),
      indicator: s.indicator(),
      label: s.label(),
    }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)

// `indeterminate` is a DOM property only (no HTML attribute); it is what makes
// the accessibility tree report "mixed".
function syncIndeterminate() {
  if (input.value) input.value.indeterminate = model.value === 'indeterminate'
}
onMounted(syncIndeterminate)
watch(model, syncIndeterminate, { flush: 'post' })

function onChange(e: Event) {
  model.value = (e.target as HTMLInputElement).checked
  syncIndeterminate()
}
</script>

<template>
  <label :class="classes.root">
    <span :class="classes.box">
      <input
        ref="input"
        type="checkbox"
        v-bind="{ ...rest, ...control }"
        :checked="model === true"
        :class="classes.control"
        @change="onChange"
      />
      <svg :class="classes.indicator" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          v-if="model === 'indeterminate'"
          d="M4 8h8"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <path
          v-else
          d="M4 8.5l2.5 2.5L12 5.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span v-if="slots.default" :class="classes.label"><slot /></span>
  </label>
</template>
