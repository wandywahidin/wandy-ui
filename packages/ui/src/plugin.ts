import type { InjectionKey, Plugin } from 'vue'
import type { UIConfig } from './types'

export const UI_CONFIG_KEY: InjectionKey<UIConfig> = Symbol('wandy-ui-config')

/**
 * Install app-wide class defaults:
 * `app.use(createUI({ ui: { button: { root: 'rounded-full' } } }))`.
 */
export function createUI(config: UIConfig = {}): Plugin {
  return {
    install(app) {
      app.provide(UI_CONFIG_KEY, config)
    },
  }
}
