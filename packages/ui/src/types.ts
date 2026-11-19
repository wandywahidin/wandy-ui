export type ComponentName =
  | 'button'
  | 'iconButton'
  | 'field'
  | 'input'
  | 'textarea'
  | 'checkbox'
  | 'radioGroup'
  | 'radio'
  | 'switch'
  | 'tabs'
  | 'tabList'
  | 'tab'
  | 'tabPanel'
  | 'badge'
  | 'spinner'
  | 'dialog'
  | 'popover'
  | 'tooltip'
  | 'select'

/** Per-slot class overrides for a component, e.g. `{ root: 'rounded-none' }`. */
export type UiOverrides<S extends string> = Partial<Record<S, string>>

/** App-wide defaults installed with `app.use(createUI(config))`. */
export interface UIConfig {
  ui?: Partial<Record<ComponentName, Record<string, string>>>
}
