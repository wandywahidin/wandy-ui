import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { axe } from 'vitest-axe'
import { renderTemplate } from '../../test-utils'
import { Tab, TabList, TabPanel, Tabs } from './index'

const C = { Tabs, TabList, Tab, TabPanel }

const markup = (attrs = '', disableB = false) => `
  <Tabs v-model="value" ${attrs}>
    <TabList aria-label="Settings">
      <Tab value="a">Account</Tab>
      <Tab value="b" :disabled="${disableB}">Billing</Tab>
      <Tab value="c">Code</Tab>
    </TabList>
    <TabPanel value="a">Account panel</TabPanel>
    <TabPanel value="b">Billing panel</TabPanel>
    <TabPanel value="c">Code panel</TabPanel>
  </Tabs>`

async function setup(opts: { attrs?: string; disableB?: boolean; initial?: string } = {}) {
  const value = ref<string | undefined>(opts.initial ?? 'a')
  const w = renderTemplate(markup(opts.attrs, opts.disableB), C, () => ({ value }))
  await nextTick()
  const tabs = w.findAll('[role="tab"]')
  const panels = w.findAll('[role="tabpanel"]')
  const key = async (i: number, k: string) => {
    ;(tabs[i]!.element as HTMLElement).focus()
    await tabs[i]!.trigger('keydown', { key: k })
  }
  return { w, value, tabs, panels, key }
}

describe('Tabs', () => {
  it('wires ids and aria between tabs and panels', async () => {
    const { w, tabs, panels } = await setup()
    const list = w.get('[role="tablist"]')
    expect(list.attributes('aria-orientation')).toBe('horizontal')
    const baseId = tabs[0]!.attributes('id')!.replace(/-tab-a$/, '')
    tabs.forEach((t, i) => {
      const v = ['a', 'b', 'c'][i]
      expect(t.attributes('id')).toBe(`${baseId}-tab-${v}`)
      expect(t.attributes('aria-controls')).toBe(`${baseId}-panel-${v}`)
      expect(panels[i]!.attributes('id')).toBe(`${baseId}-panel-${v}`)
      expect(panels[i]!.attributes('aria-labelledby')).toBe(`${baseId}-tab-${v}`)
      expect(panels[i]!.attributes('tabindex')).toBe('0')
    })
    expect(tabs.map((t) => t.attributes('aria-selected'))).toEqual(['true', 'false', 'false'])
    expect(tabs.map((t) => t.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
  })

  it('shows only the selected panel, keeping others in the DOM', async () => {
    const { panels } = await setup()
    expect(panels).toHaveLength(3)
    expect((panels[0]!.element as HTMLElement).style.display).toBe('')
    expect((panels[1]!.element as HTMLElement).style.display).toBe('none')
  })

  it('automatic: ArrowRight focuses and selects the next tab', async () => {
    const { value, tabs, key } = await setup()
    await key(0, 'ArrowRight')
    expect(document.activeElement).toBe(tabs[1]!.element)
    expect(value.value).toBe('b')
  })

  it('manual: ArrowRight only focuses; Enter selects', async () => {
    const { value, tabs, key } = await setup({ attrs: 'activation="manual"' })
    await key(0, 'ArrowRight')
    expect(document.activeElement).toBe(tabs[1]!.element)
    expect(value.value).toBe('a')
    // Enter/Space on a native button fire click.
    await tabs[1]!.trigger('click')
    expect(value.value).toBe('b')
  })

  it('Home and End move to the first and last tabs', async () => {
    const { value, tabs, key } = await setup({ initial: 'b' })
    await key(1, 'End')
    expect(document.activeElement).toBe(tabs[2]!.element)
    expect(value.value).toBe('c')
    await key(2, 'Home')
    expect(document.activeElement).toBe(tabs[0]!.element)
    expect(value.value).toBe('a')
  })

  it('skips a disabled tab', async () => {
    const { value, tabs, key } = await setup({ disableB: true })
    await key(0, 'ArrowRight')
    expect(document.activeElement).toBe(tabs[2]!.element)
    expect(value.value).toBe('c')
  })

  it('vertical: uses ArrowDown, not ArrowRight', async () => {
    const { w, value, key } = await setup({ attrs: 'orientation="vertical"' })
    expect(w.get('[role="tablist"]').attributes('aria-orientation')).toBe('vertical')
    await key(0, 'ArrowRight')
    expect(value.value).toBe('a')
    await key(0, 'ArrowDown')
    expect(value.value).toBe('b')
  })

  it('selects the first enabled tab when no value is given', async () => {
    const value = ref<string>()
    const w = renderTemplate(markup(), C, () => ({ value }))
    await nextTick()
    await nextTick()
    expect(value.value).toBe('a')
    expect(w.findAll('[role="tab"]')[0]!.attributes('aria-selected')).toBe('true')
  })

  it('gives two Tabs instances distinct ids', async () => {
    const w = renderTemplate(`<div>${markup()}${markup()}</div>`, C, () => ({ value: ref('a') }))
    await nextTick()
    const ids = w.findAll('[role="tab"]').map((t) => t.attributes('id'))
    expect(new Set(ids).size).toBe(6)
  })

  it('tabs that arrive after mount still get a selected, tabbable tab', async () => {
    const value = ref<string>()
    const items = ref<string[]>([])
    const w = renderTemplate(
      `<Tabs v-model="value"><TabList aria-label="Async">
        <Tab v-for="i in items" :key="i" :value="i">{{ i }}</Tab>
      </TabList><TabPanel v-for="i in items" :key="i" :value="i">{{ i }} panel</TabPanel></Tabs>`,
      C,
      () => ({ value, items }),
    )
    await nextTick()
    items.value = ['x', 'y']
    await nextTick()
    await nextTick()
    expect(value.value).toBe('x')
    expect(w.findAll('[role="tab"]').filter((t) => t.attributes('tabindex') === '0')).toHaveLength(
      1,
    )
  })

  it('a value matching no tab still leaves exactly one tabbable tab and one visible panel', async () => {
    const { tabs, panels } = await setup({ initial: 'zzz' })
    expect(tabs.filter((t) => t.attributes('tabindex') === '0')).toHaveLength(1)
    expect(panels.filter((p) => (p.element as HTMLElement).style.display !== 'none')).toHaveLength(
      1,
    )
  })

  it('a disabled selected tab is not the only tabbable tab', async () => {
    const { tabs } = await setup({ initial: 'b', disableB: true })
    const tabbable = tabs.filter((t) => t.attributes('tabindex') === '0')
    expect(tabbable).toHaveLength(1)
    expect(tabbable[0]!.attributes('disabled')).toBeUndefined()
  })

  it('values with spaces still wire tab and panel ids', async () => {
    const w = renderTemplate(
      `<Tabs model-value="Account settings"><TabList aria-label="S">
        <Tab value="Account settings">A</Tab></TabList>
        <TabPanel value="Account settings">P</TabPanel></Tabs>`,
      C,
    )
    await nextTick()
    const tab = w.get('[role="tab"]')
    const panel = w.get('[role="tabpanel"]')
    // aria-labelledby / aria-controls are space-separated IDREF lists.
    expect(tab.attributes('id')).not.toMatch(/\s/)
    expect(panel.attributes('id')).not.toMatch(/\s/)
    expect(document.getElementById(panel.attributes('aria-labelledby')!)).toBe(tab.element)
    expect(document.getElementById(tab.attributes('aria-controls')!)).toBe(panel.element)
  })

  it('has no axe violations', async () => {
    const { w } = await setup({ disableB: true })
    expect(await axe(w.element)).toHaveNoViolations()
  })
})
