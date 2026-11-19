<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { useUi } from '../../composables/useUi'
import { useFieldControl } from '../../composables/useField'
import type { UiOverrides } from '../../types'
import { selectVariants } from './Select.variants'

defineOptions({ inheritAttrs: false })

type SelectSlot = 'trigger' | 'value' | 'icon' | 'content' | 'viewport' | 'item' | 'itemIndicator'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  id?: string
  disabled?: boolean
  invalid?: boolean
  ui?: UiOverrides<SelectSlot>
}

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select…',
  disabled: false,
  invalid: false,
})
const model = defineModel<string>()

const attrs = useAttrs()
const control = useFieldControl(props)
// Reka owns `disabled` on the root; the trigger gets ids and ARIA.
const triggerAttrs = computed(() => {
  const { disabled: _disabled, ...rest } = control.value
  return { ...attrs, class: undefined, ...rest }
})

const classes = useUi<SelectSlot>(
  'select',
  () => {
    const s = selectVariants()
    return {
      trigger: s.trigger(),
      value: s.value(),
      icon: s.icon(),
      content: s.content(),
      viewport: s.viewport(),
      item: s.item(),
      itemIndicator: s.itemIndicator(),
    }
  },
  { ui: () => props.ui, class: () => attrs.class, root: 'trigger' },
)
</script>

<template>
  <SelectRoot v-model="model" :disabled="!!control.disabled" :required="!!control.required">
    <SelectTrigger v-bind="triggerAttrs" :class="classes.trigger">
      <SelectValue :placeholder="placeholder" :class="classes.value" />
      <SelectIcon as-child>
        <svg
          :class="classes.icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent position="popper" :side-offset="4" :class="classes.content">
        <SelectViewport :class="classes.viewport">
          <SelectItem
            v-for="opt in options"
            :key="opt.value"
            :value="opt.value"
            :disabled="opt.disabled"
            :class="classes.item"
          >
            <SelectItemIndicator :class="classes.itemIndicator">
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            </SelectItemIndicator>
            <SelectItemText>{{ opt.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
