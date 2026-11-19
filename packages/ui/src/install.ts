import type { App, Component, Plugin } from 'vue'
import { createUI } from './plugin'
import type { UIConfig } from './types'
import { Badge } from './components/Badge'
import { Button, IconButton } from './components/Button'
import { Checkbox } from './components/Checkbox'
import { Dialog } from './components/Dialog'
import { Field } from './components/Field'
import { Input } from './components/Input'
import { Popover } from './components/Popover'
import { Radio, RadioGroup } from './components/RadioGroup'
import { Select } from './components/Select'
import { Spinner } from './components/Spinner'
import { Switch } from './components/Switch'
import { Tab, TabList, TabPanel, Tabs } from './components/Tabs'
import { Textarea } from './components/Textarea'
import { Tooltip } from './components/Tooltip'

export const components: Record<string, Component> = {
  Badge,
  Button,
  IconButton,
  Checkbox,
  Dialog,
  Field,
  Input,
  Popover,
  RadioGroup,
  Radio,
  Select,
  Spinner,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Textarea,
  Tooltip,
}

export interface WandyUIOptions extends UIConfig {
  /** Prefix for global names, e.g. `'W'` registers `<WButton>`. Default: none. */
  prefix?: string
}

/**
 * Registers every component globally and installs config (like `createUI`).
 * Opt-in: importing only named components (and `createUI`) keeps tree-shaking.
 *
 * `app.use(WandyUI, { ui: { button: { root: 'rounded-full' } } })`
 */
export const WandyUI: Plugin<[WandyUIOptions?]> = {
  install(app: App, options: WandyUIOptions = {}) {
    const { prefix = '', ...config } = options
    app.use(createUI(config))
    for (const [name, component] of Object.entries(components)) {
      app.component(`${prefix}${name}`, component)
    }
  },
}
