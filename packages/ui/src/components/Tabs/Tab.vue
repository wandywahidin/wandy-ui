<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useAttrs } from 'vue'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import { panelId, tabId, TABS_KEY } from './context'
import { tabVariants } from './Tabs.variants'

defineOptions({ inheritAttrs: false })

export interface TabProps {
  value: string
  disabled?: boolean
  ui?: UiOverrides<'root'>
}

const props = withDefaults(defineProps<TabProps>(), { disabled: false })
defineSlots<{ default?(): unknown }>()

const ctx = inject(TABS_KEY)
if (!ctx) throw new Error('<Tab> must be used inside <Tabs>.')

const attrs = useAttrs()
const selected = computed(() => ctx.selected.value === props.value)
onBeforeUnmount(ctx.register(props.value, () => props.disabled))

const classes = useUi(
  'tab',
  () => ({ root: tabVariants({ orientation: ctx.orientation.value }) }),
  { ui: () => props.ui, class: () => attrs.class, root: 'root' },
)
</script>

<template>
  <button
    :id="tabId(ctx.baseId, value)"
    v-bind="{ ...attrs, class: undefined }"
    type="button"
    role="tab"
    :data-value="value"
    :aria-selected="selected"
    :aria-controls="panelId(ctx.baseId, value)"
    :tabindex="selected ? 0 : -1"
    :disabled="disabled || undefined"
    :class="classes.root"
    @click="ctx.select(value)"
  >
    <slot />
  </button>
</template>
