// Consumer-supplied ARIA attributes must survive the attributes components set themselves.
import { describe, expect, it } from 'vitest'
import { renderTemplate, settle } from '../test-utils'
import { Radio, RadioGroup } from './RadioGroup'
import { Switch } from './Switch'
import { Popover } from './Popover'
import { Dialog } from './Dialog'
import { Field } from './Field'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Checkbox } from './Checkbox'
import { Select } from './Select'

describe('consumer naming attrs are kept', () => {
  it('RadioGroup keeps aria-labelledby', () => {
    const w = renderTemplate(
      '<div><h2 id="plan-h">Plan</h2><RadioGroup aria-labelledby="plan-h"><Radio value="a">A</Radio></RadioGroup></div>',
      { RadioGroup, Radio },
    )
    expect(w.get('[role="radiogroup"]').attributes('aria-labelledby')).toBe('plan-h')
  })

  it('RadioGroup keeps aria-describedby outside a Field', () => {
    const w = renderTemplate(
      '<RadioGroup label="P" aria-describedby="hint"><Radio value="a">A</Radio></RadioGroup>',
      { RadioGroup, Radio },
    )
    expect(w.get('[role="radiogroup"]').attributes('aria-describedby')).toBe('hint')
  })

  it('Switch without a slot keeps aria-labelledby', () => {
    const w = renderTemplate('<Switch aria-labelledby="wifi-h" />', { Switch })
    expect(w.get('[role="switch"]').attributes('aria-labelledby')).toBe('wifi-h')
  })

  it('Popover without a label prop keeps aria-label', async () => {
    renderTemplate(
      `<Popover aria-label="Filters" :open="true"><template #trigger><button>F</button></template>x</Popover>`,
      { Popover },
    )
    await settle()
    expect(document.querySelector('[role="dialog"]')!.getAttribute('aria-label')).toBe('Filters')
  })

  it('Dialog without a description keeps aria-describedby', async () => {
    renderTemplate(
      '<div><p id="ext">More</p><Dialog title="T" :open="true" aria-describedby="ext" /></div>',
      { Dialog },
    )
    await settle()
    expect(document.querySelector('[role="dialog"]')!.getAttribute('aria-describedby')).toBe('ext')
  })
})

describe('inside a Field, consumer aria-describedby is merged, not replaced', () => {
  const opts = [{ value: 'a', label: 'A' }]
  it.each([
    ['Input', '<Input aria-describedby="hint" />', 'input'],
    ['Textarea', '<Textarea aria-describedby="hint" />', 'textarea'],
    ['Checkbox', '<Checkbox aria-describedby="hint">C</Checkbox>', 'input'],
    ['Switch', '<Switch aria-describedby="hint" />', '[role="switch"]'],
    ['Select', '<Select aria-describedby="hint" :options="opts" />', '[role="combobox"]'],
    [
      'RadioGroup',
      '<RadioGroup aria-describedby="hint"><Radio value="a">A</Radio></RadioGroup>',
      '[role="radiogroup"]',
    ],
  ])('%s', (_n, control, selector) => {
    const w = renderTemplate(
      `<div><p id="hint">Hint</p><Field label="L" description="D">${control}</Field></div>`,
      { Field, Input, Textarea, Checkbox, Switch, Select, RadioGroup, Radio },
      () => ({ opts }),
    )
    const ids = w.get(selector).attributes('aria-describedby')!.split(' ')
    const descId = w
      .findAll('p')
      .find((p) => p.text() === 'D')!
      .attributes('id')
    expect(ids).toContain('hint')
    expect(ids).toContain(descId)
  })
})

describe('consumer id', () => {
  it('standalone RadioGroup uses a given id', () => {
    const w = renderTemplate(
      '<RadioGroup id="plan" label="P"><Radio value="a">A</Radio></RadioGroup>',
      { RadioGroup, Radio },
    )
    expect(w.get('[role="radiogroup"]').attributes('id')).toBe('plan')
  })

  it.each([
    ['Input', '<Input id="mine" />', 'input'],
    [
      'RadioGroup',
      '<RadioGroup id="mine"><Radio value="a">A</Radio></RadioGroup>',
      '[role="radiogroup"]',
    ],
  ])('inside a Field, %s keeps the Field id so the label stays linked', (_n, control, sel) => {
    const w = renderTemplate(`<Field label="L">${control}</Field>`, {
      Field,
      Input,
      RadioGroup,
      Radio,
    })
    expect(w.get(sel).attributes('id')).toBe(w.get('label').attributes('for'))
  })
})
