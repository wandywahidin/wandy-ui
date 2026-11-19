// Components
export * from './components/Badge'
export * from './components/Button'
export * from './components/Checkbox'
export * from './components/Dialog'
export * from './components/Field'
export * from './components/Input'
export * from './components/Popover'
export * from './components/RadioGroup'
export * from './components/Select'
export * from './components/Spinner'
export * from './components/Switch'
export * from './components/Tabs'
export * from './components/Textarea'
export * from './components/Tooltip'

// Customization core
export { createUI, UI_CONFIG_KEY } from './plugin'
export { WandyUI, components, type WandyUIOptions } from './install'
export { useUi, type UseUiOptions } from './composables/useUi'
export { cn, type ClassValue } from './utils/cn'
export type { ComponentName, UiOverrides, UIConfig } from './types'

// Composables for building custom controls
export {
  FIELD_KEY,
  useFieldContext,
  useFieldControl,
  type FieldContext,
  type FieldControlAttrs,
  type FieldControlProps,
} from './composables/useField'
export {
  useRovingFocus,
  type RovingFocusOptions,
  type RovingOrientation,
} from './composables/useRovingFocus'
