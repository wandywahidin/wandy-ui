// Regression tests for findings from the final whole-branch review.
import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { renderTemplate, settle } from './test-utils'
import { Radio, RadioGroup } from './components/RadioGroup'
import { Switch } from './components/Switch'
import { Popover } from './components/Popover'
import { Dialog } from './components/Dialog'
import { Select } from './components/Select'
import { Button } from './components/Button'
import { WandyUI } from './install'

describe('consumer ARIA naming attrs are not wiped', () => {
  it('RadioGroup keeps a consumer aria-labelledby', () => {
    const w = renderTemplate(
      '<div><h2 id="plan-h">Plan</h2><RadioGroup aria-labelledby="plan-h"><Radio value="a">A</Radio></RadioGroup></div>',
      { RadioGroup, Radio },
    )
    expect(w.get('[role="radiogroup"]').attributes('aria-labelledby')).toBe('plan-h')
  })

  it('RadioGroup keeps a consumer aria-describedby outside a Field', () => {
    const w = renderTemplate(
      '<RadioGroup label="P" aria-describedby="hint"><Radio value="a">A</Radio></RadioGroup>',
      { RadioGroup, Radio },
    )
    expect(w.get('[role="radiogroup"]').attributes('aria-describedby')).toBe('hint')
  })

  it('Switch without a slot keeps a consumer aria-labelledby', () => {
    const w = renderTemplate('<Switch aria-labelledby="wifi-h" />', { Switch })
    expect(w.get('[role="switch"]').attributes('aria-labelledby')).toBe('wifi-h')
  })

  it('Popover without a label prop keeps a consumer aria-label', async () => {
    renderTemplate(
      `<Popover aria-label="Filters" :open="true"><template #trigger><button>F</button></template>x</Popover>`,
      { Popover },
    )
    await settle()
    expect(document.querySelector('[role="dialog"]')!.getAttribute('aria-label')).toBe('Filters')
  })

  it('Dialog without a description keeps a consumer aria-describedby', async () => {
    renderTemplate(
      '<div><p id="ext">More</p><Dialog title="T" :open="true" aria-describedby="ext" /></div>',
      { Dialog },
    )
    await settle()
    expect(document.querySelector('[role="dialog"]')!.getAttribute('aria-describedby')).toBe('ext')
  })
})

describe('Select form participation', () => {
  it('submits its value under `name`', async () => {
    const value = ref<string>('cherry')
    const w = renderTemplate(
      '<form><Select name="fruit" v-model="value" :options="options" /></form>',
      { Select },
      () => ({
        value,
        options: [
          { value: 'apple', label: 'Apple' },
          { value: 'cherry', label: 'Cherry' },
        ],
      }),
    )
    await settle()
    const form = w.element as HTMLFormElement
    expect(new FormData(form).get('fruit')).toBe('cherry')
  })
})

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
