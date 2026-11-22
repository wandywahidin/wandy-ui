import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { Button } from './components/Button'
import { WandyUI } from './install'

describe('WandyUI plugin', () => {
  it('registers every component globally and installs config', async () => {
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp({ render: () => h('div', [h(app.component('Button')!, () => 'Hi')]) })
    app.use(WandyUI, { ui: { button: { root: 'rounded-none' } } })
    for (const name of ['Button', 'Dialog', 'Select', 'Tabs', 'Tab', 'Radio', 'Field']) {
      expect(app.component(name), name).toBeDefined()
    }
    app.mount(el)
    await nextTick()
    expect(el.querySelector('button')!.classList).toContain('rounded-none')
    expect(app.component('Button')).toBe(Button)
    app.unmount()
  })

  it('supports a name prefix', () => {
    const app = createApp({ render: () => null })
    app.use(WandyUI, { prefix: 'W' })
    expect(app.component('WButton')).toBeDefined()
    expect(app.component('Button')).toBeUndefined()
  })
})
