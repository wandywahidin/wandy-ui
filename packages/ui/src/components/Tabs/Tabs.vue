<script setup lang="ts">
import { computed, provide, shallowReactive, toRef, useAttrs, useId, watch } from 'vue'
import { useUi } from '../../composables/useUi'
import type { UiOverrides } from '../../types'
import { TABS_KEY } from './context'
import { tabsVariants } from './Tabs.variants'

defineOptions({ inheritAttrs: false })

export interface TabsProps {
  /** `automatic`: arrows select. `manual`: arrows move focus, Enter/Space select. */
  activation?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  ui?: UiOverrides<'root'>
}

const props = withDefaults(defineProps<TabsProps>(), {
  activation: 'automatic',
  orientation: 'horizontal',
})
const model = defineModel<string>()
defineSlots<{ default?(): unknown }>()

const attrs = useAttrs()
const baseId = useId()
const tabs = shallowReactive<Array<{ value: () => string; disabled: () => boolean }>>([])

const firstEnabled = computed(() => tabs.find((t) => !t.disabled())?.value())
const active = computed(() =>
  tabs.some((t) => t.value() === model.value) ? model.value : firstEnabled.value,
)
const tabbable = computed(() => {
  const current = tabs.find((t) => t.value() === active.value)
  return current && !current.disabled() ? active.value : firstEnabled.value
})

provide(TABS_KEY, {
  baseId,
  selected: model,
  active,
  tabbable,
  activation: toRef(props, 'activation'),
  orientation: toRef(props, 'orientation'),
  select: (v) => (model.value = v),
  register(value, disabled) {
    const entry = { value, disabled }
    tabs.push(entry)
    return () => tabs.splice(tabs.indexOf(entry), 1)
  },
})

// Without a value, select the first enabled tab, also when tabs arrive after
// mount, so a tab is always selected and reachable by keyboard.
watch(
  firstEnabled,
  (first) => {
    if (model.value === undefined && first !== undefined) model.value = first
  },
  { immediate: true, flush: 'post' },
)

const classes = useUi('tabs', () => ({ root: tabsVariants({ orientation: props.orientation }) }), {
  ui: () => props.ui,
  class: () => attrs.class,
  root: 'root',
})
</script>

<template>
  <div v-bind="{ ...attrs, class: undefined }" :class="classes.root"><slot /></div>
</template>
