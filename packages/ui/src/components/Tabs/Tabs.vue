<script setup lang="ts">
import { onMounted, provide, shallowReactive, toRef, useAttrs, useId } from 'vue'
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
const tabs = shallowReactive<Array<{ value: string; disabled: () => boolean }>>([])

provide(TABS_KEY, {
  baseId,
  selected: model,
  activation: toRef(props, 'activation'),
  orientation: toRef(props, 'orientation'),
  select: (v) => (model.value = v),
  register(value, disabled) {
    const entry = { value, disabled }
    tabs.push(entry)
    return () => tabs.splice(tabs.indexOf(entry), 1)
  },
})

// Without a value, select the first enabled tab so one tab is always reachable.
onMounted(() => {
  if (model.value === undefined) {
    const first = tabs.find((t) => !t.disabled())
    if (first) model.value = first.value
  }
})

const classes = useUi('tabs', () => ({ root: tabsVariants({ orientation: props.orientation }) }), {
  ui: () => props.ui,
  class: () => attrs.class,
  root: 'root',
})
</script>

<template>
  <div v-bind="{ ...attrs, class: undefined }" :class="classes.root"><slot /></div>
</template>
