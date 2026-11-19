<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import Spinner from '../Spinner/Spinner.vue'
import { buttonVariants } from './Button.variants'
import type { ButtonProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  intent: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})
const emit = defineEmits<{ click: [e: MouseEvent] }>()
defineSlots<{ default?(): unknown; leading?(): unknown; trailing?(): unknown }>()

const attrs = useAttrs()
const rest = computed(() => ({ ...attrs, class: undefined }))

const classes = useUi(
  'button',
  () => {
    const s = buttonVariants({ variant: props.variant, intent: props.intent, size: props.size })
    return { root: s.root(), spinner: s.spinner() }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)

function onClick(e: MouseEvent) {
  if (props.loading || props.disabled) {
    // Loading keeps the button focusable (no native `disabled`), so block the
    // default action (form submit) and the click event here instead.
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <button
    v-bind="rest"
    :type="type"
    :class="classes.root"
    :disabled="disabled || undefined"
    :aria-disabled="loading || undefined"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <Spinner v-if="loading" size="sm" :class="classes.spinner" />
    <slot v-else name="leading" />
    <slot />
    <slot name="trailing" />
  </button>
</template>
