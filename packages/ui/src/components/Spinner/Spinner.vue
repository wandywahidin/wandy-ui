<script setup lang="ts">
import { useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import { spinnerVariants } from './Spinner.variants'

defineOptions({ inheritAttrs: false })

export interface SpinnerProps {
  /** Text announced to assistive technology. */
  label?: string
  size?: 'sm' | 'md' | 'lg'
  ui?: UiOverrides<'root' | 'indicator'>
}

const props = withDefaults(defineProps<SpinnerProps>(), { label: 'Loading', size: 'md' })
const attrs = useAttrs()

const classes = useUi(
  'spinner',
  () => {
    const s = spinnerVariants({ size: props.size })
    return { root: s.root(), indicator: s.indicator() }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)
</script>

<template>
  <span v-bind="{ ...attrs, class: undefined }" role="status" :class="classes.root">
    <svg :class="classes.indicator" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
