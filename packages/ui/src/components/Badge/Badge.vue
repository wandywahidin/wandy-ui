<script setup lang="ts">
import { useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import { badgeVariants } from './Badge.variants'

defineOptions({ inheritAttrs: false })

export interface BadgeProps {
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
  variant?: 'solid' | 'soft' | 'outline'
  ui?: UiOverrides<'root'>
}

const props = withDefaults(defineProps<BadgeProps>(), { intent: 'neutral', variant: 'soft' })
defineSlots<{ default?(): unknown }>()
const attrs = useAttrs()

const classes = useUi(
  'badge',
  () => ({ root: badgeVariants({ intent: props.intent, variant: props.variant }) }),
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)
</script>

<template>
  <span v-bind="{ ...attrs, class: undefined }" :class="classes.root"><slot /></span>
</template>
