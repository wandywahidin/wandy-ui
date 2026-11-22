/** The named parts (`ui` slots) of each component. */
export interface ComponentParts {
  button: 'root' | 'spinner'
  iconButton: 'root' | 'spinner'
  field: 'root' | 'label' | 'required' | 'description' | 'error'
  input: 'root' | 'input' | 'prefix' | 'suffix'
  textarea: 'root'
  checkbox: 'root' | 'box' | 'control' | 'indicator' | 'label'
  radioGroup: 'root'
  radio: 'root' | 'control' | 'indicator' | 'label'
  switch: 'root' | 'track' | 'thumb' | 'label'
  tabs: 'root'
  tabList: 'root'
  tab: 'root'
  tabPanel: 'root'
  badge: 'root'
  spinner: 'root' | 'indicator'
  dialog: 'overlay' | 'content' | 'header' | 'title' | 'description' | 'body' | 'footer' | 'close'
  popover: 'content' | 'arrow'
  tooltip: 'content' | 'arrow'
  select: 'trigger' | 'value' | 'icon' | 'content' | 'viewport' | 'item' | 'itemIndicator'
}

export type ComponentName = keyof ComponentParts

/** Per-slot class overrides for a component, e.g. `{ root: 'rounded-none' }`. */
export type UiOverrides<S extends string> = Partial<Record<S, string>>

/** App-wide defaults installed with `app.use(createUI(config))`. Part names are type-checked. */
export interface UIConfig {
  ui?: { [K in ComponentName]?: UiOverrides<ComponentParts[K]> }
}
