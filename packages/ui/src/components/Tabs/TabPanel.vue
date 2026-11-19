<script setup lang="ts">
import { inject, useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import { panelId, tabId, TABS_KEY } from './context'
import { tabPanelVariants } from './Tabs.variants'

defineOptions({ inheritAttrs: false })

export interface TabPanelProps {
  value: string
  ui?: UiOverrides<'root'>
}

const props = defineProps<TabPanelProps>()
defineSlots<{ default?(): unknown }>()

const ctx = inject(TABS_KEY)
if (!ctx) throw new Error('<TabPanel> must be used inside <Tabs>.')

const attrs = useAttrs()
const classes = useUi('tabPanel', () => ({ root: tabPanelVariants() }), {
  ui: () => props.ui,
  class: () => attrs.class,
  root: 'root',
})
</script>

<template>
  <div
    v-show="ctx.active.value === value"
    :id="panelId(ctx.baseId, value)"
    v-bind="{ ...attrs, class: undefined }"
    role="tabpanel"
    :aria-labelledby="tabId(ctx.baseId, value)"
    tabindex="0"
    :class="classes.root"
  >
    <slot />
  </div>
</template>
