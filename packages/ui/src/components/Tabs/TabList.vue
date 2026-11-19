<script setup lang="ts">
import { inject, ref, useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import { useRovingFocus } from '../../composables/useRovingFocus'
import type { UiOverrides } from '../../types'
import { TABS_KEY } from './context'
import { tabListVariants } from './Tabs.variants'

defineOptions({ inheritAttrs: false })

export interface TabListProps {
  ui?: UiOverrides<'root'>
}

const props = defineProps<TabListProps>()
defineSlots<{ default?(): unknown }>()

const ctx = inject(TABS_KEY)
if (!ctx) throw new Error('<TabList> must be used inside <Tabs>.')

const attrs = useAttrs()
const root = ref<HTMLElement>()

const { onKeydown } = useRovingFocus({
  items: () => Array.from(root.value?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []),
  get orientation() {
    return ctx!.orientation.value
  },
  onMove: (el) => {
    const v = el.dataset.value
    if (ctx!.activation.value === 'automatic' && v !== undefined) ctx!.select(v)
  },
})

const classes = useUi(
  'tabList',
  () => ({ root: tabListVariants({ orientation: ctx!.orientation.value }) }),
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)
</script>

<template>
  <div
    ref="root"
    v-bind="{ ...attrs, class: undefined }"
    role="tablist"
    :aria-orientation="ctx.orientation.value"
    :class="classes.root"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
