<script setup lang="ts">
import { useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import Button from './Button.vue'
import { iconButtonVariants } from './Button.variants'
import type { IconButtonProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<IconButtonProps>(), {
  variant: 'ghost',
  intent: 'neutral',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})
const emit = defineEmits<{ click: [e: MouseEvent] }>()
defineSlots<{ default?(): unknown }>()

const attrs = useAttrs()

// Square sizing, global `iconButton` defaults, `ui.root` and `class` merge here,
// then land last in Button's own merge so they beat Button's variant classes.
const classes = useUi(
  'iconButton',
  () => ({ root: iconButtonVariants({ size: props.size }), spinner: '' }),
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)
</script>

<template>
  <Button
    v-bind="{ ...attrs, class: undefined }"
    :variant="variant"
    :intent="intent"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :type="type"
    :ui="{ spinner: classes.spinner }"
    :class="classes.root"
    :aria-label="label"
    @click="emit('click', $event)"
  >
    <span v-if="!loading" aria-hidden="true" class="inline-flex shrink-0"><slot /></span>
  </Button>
</template>
