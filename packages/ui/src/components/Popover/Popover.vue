<script setup lang="ts">
import { useAttrs, warn, watch } from 'vue'
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import { popoverVariants } from './Popover.variants'

defineOptions({ inheritAttrs: false })

export interface PopoverProps {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  /** Accessible name for the popover panel (it has role="dialog"). */
  label?: string
  ui?: UiOverrides<'content' | 'arrow'>
}

const props = withDefaults(defineProps<PopoverProps>(), { side: 'bottom', align: 'center' })
const open = defineModel<boolean>('open', { default: false })
defineSlots<{ trigger?(): unknown; default?(): unknown }>()

const attrs = useAttrs()

// The panel is role=dialog and needs a name. Vue's warn is a no-op in production builds.
watch(
  open,
  (isOpen) => {
    if (isOpen && !props.label && !attrs['aria-label'] && !attrs['aria-labelledby'])
      warn('Popover: pass `label` (or aria-label / aria-labelledby) to name the panel.')
  },
  { immediate: true },
)
const classes = useUi(
  'popover',
  () => {
    const s = popoverVariants()
    return { content: s.content(), arrow: s.arrow() }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'content' },
)
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child><slot name="trigger" /></PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        v-bind="{ ...attrs, class: undefined }"
        data-wui-popover
        :side="side"
        :align="align"
        :side-offset="8"
        :collision-padding="8"
        :aria-label="label ?? (attrs['aria-label'] as string | undefined)"
        :class="classes.content"
      >
        <slot />
        <PopoverArrow :class="classes.arrow" :width="12" :height="6" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
