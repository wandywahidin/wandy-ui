<script setup lang="ts">
import { computed, provide, ref, toRef, useAttrs, useId, watch } from 'vue'
import { useItemRegistry } from '../../composables/useItemRegistry'
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
const root = ref<HTMLElement>()
const { ordered: tabs, register } = useItemRegistry(root)

const firstEnabled = computed(() => tabs.value.find((t) => !t.disabled())?.value())
const active = computed(() =>
  tabs.value.some((t) => t.value() === model.value) ? model.value : firstEnabled.value,
)
const tabbable = computed(() => {
  const current = tabs.value.find((t) => t.value() === active.value)
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
  register,
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
  <div ref="root" v-bind="{ ...attrs, class: undefined }" :class="classes.root"><slot /></div>
</template>
