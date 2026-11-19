<script setup lang="ts">
import { useAttrs } from 'vue'
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import { tooltipVariants } from './Tooltip.variants'

defineOptions({ inheritAttrs: false })

export interface TooltipProps {
  /** Tooltip text. Supplementary only: the trigger still needs its own accessible name. */
  content: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Hover delay in ms. Defaults to Reka UI's delay. */
  delay?: number
  ui?: UiOverrides<'content' | 'arrow'>
}

const props = withDefaults(defineProps<TooltipProps>(), { side: 'top' })
defineSlots<{ default?(): unknown }>()

const attrs = useAttrs()
const classes = useUi(
  'tooltip',
  () => {
    const s = tooltipVariants()
    return { content: s.content(), arrow: s.arrow() }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'content' },
)
</script>

<template>
  <TooltipProvider>
    <TooltipRoot :delay-duration="delay">
      <TooltipTrigger as-child><slot /></TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          v-bind="{ ...attrs, class: undefined }"
          :side="side"
          :side-offset="6"
          :collision-padding="8"
          :class="classes.content"
        >
          {{ content }}
          <TooltipArrow :class="classes.arrow" :width="10" :height="5" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
