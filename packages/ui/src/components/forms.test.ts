// Controls built from buttons still take part in native form submission when given a name.
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { renderTemplate, settle } from '../test-utils'
import { Select } from './Select'
import { Radio, RadioGroup } from './RadioGroup'
import { Switch } from './Switch'

const data = (w: { element: Element }) => new FormData(w.element as HTMLFormElement)

describe('native form participation', () => {
  it('Select submits its value under name', async () => {
    const value = ref('cherry')
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
    expect(data(w).get('fruit')).toBe('cherry')
  })

  it('RadioGroup submits the selected value under name', async () => {
    const value = ref('b')
    const w = renderTemplate(
      '<form><RadioGroup name="plan" label="Plan" v-model="value"><Radio value="a">A</Radio><Radio value="b">B</Radio></RadioGroup></form>',
      { RadioGroup, Radio },
      () => ({ value }),
    )
    expect(data(w).get('plan')).toBe('b')
    value.value = 'a'
    await nextTick()
    expect(data(w).get('plan')).toBe('a')
  })

  it('RadioGroup without a selection submits nothing', () => {
    const w = renderTemplate(
      '<form><RadioGroup name="plan" label="Plan"><Radio value="a">A</Radio></RadioGroup></form>',
      { RadioGroup, Radio },
    )
    expect(data(w).has('plan')).toBe(false)
  })

  it('Switch submits its value (default "on") only while checked', async () => {
    const value = ref(false)
    const w = renderTemplate(
      '<form><Switch name="wifi" v-model="value">Wi-Fi</Switch><Switch name="bt" value="yes" :model-value="true">BT</Switch></form>',
      { Switch },
      () => ({ value }),
    )
    expect(data(w).has('wifi')).toBe(false)
    expect(data(w).get('bt')).toBe('yes')
    value.value = true
    await nextTick()
    expect(data(w).get('wifi')).toBe('on')
  })
})
