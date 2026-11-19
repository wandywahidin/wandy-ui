import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import { axe } from 'vitest-axe'
import { Button, IconButton } from './index'

const mounted: VueWrapper[] = []
function render<T>(component: T, options: Record<string, unknown> = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = mount(component as any, { attachTo: document.body, ...options })
  mounted.push(w)
  return w
}
afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount()
})

const bgClasses = (el: Element) => [...el.classList].filter((c) => /^bg-/.test(c))

describe('Button', () => {
  it('renders a native button with type="button" by default', () => {
    const w = render(Button, { slots: { default: 'Save' } })
    const btn = w.get('button')
    expect(btn.attributes('type')).toBe('button')
    expect(btn.text()).toBe('Save')
  })

  it('lets a consumer bg class replace the variant bg class', () => {
    const w = render(Button, { attrs: { class: 'bg-red-500' }, slots: { default: 'Save' } })
    expect(bgClasses(w.get('button').element)).toEqual(['bg-red-500'])
  })

  it('forwards non-class attrs to the button', () => {
    const w = render(Button, { attrs: { 'data-testid': 'b' }, slots: { default: 'Save' } })
    expect(w.get('button').attributes('data-testid')).toBe('b')
  })

  it('emits click when enabled', async () => {
    const w = render(Button, { slots: { default: 'Save' } })
    await w.get('button').trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
  })

  it('loading: marks busy and disabled for AT, keeps focusable, emits no click', async () => {
    const w = render(Button, { props: { loading: true }, slots: { default: 'Save' } })
    const btn = w.get('button')
    expect(btn.attributes('aria-busy')).toBe('true')
    expect(btn.attributes('aria-disabled')).toBe('true')
    expect(btn.attributes('disabled')).toBeUndefined()
    ;(btn.element as HTMLButtonElement).focus()
    await btn.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
    expect(document.activeElement).toBe(btn.element)
  })

  it('loading: blocks form submission', async () => {
    let submitted = 0
    const w = render(
      {
        render: () =>
          h('form', { onSubmit: (e: Event) => (e.preventDefault(), submitted++) }, [
            h(Button, { type: 'submit', loading: true }, () => 'Send'),
          ]),
      },
      {},
    )
    ;(w.get('button').element as HTMLButtonElement).click()
    expect(submitted).toBe(0)
  })

  it('disabled: sets native disabled and emits no click', async () => {
    const w = render(Button, { props: { disabled: true }, slots: { default: 'Save' } })
    const btn = w.get('button')
    expect(btn.attributes('disabled')).toBeDefined()
    await btn.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })

  it('renders leading and trailing slots', () => {
    const w = render(Button, {
      slots: { default: 'Save', leading: '<i data-lead />', trailing: '<i data-trail />' },
    })
    expect(w.find('[data-lead]').exists()).toBe(true)
    expect(w.find('[data-trail]').exists()).toBe(true)
  })

  it.each([
    ['default', {}],
    ['loading', { loading: true }],
    ['disabled', { disabled: true }],
  ])('has no axe violations (%s)', async (_name, props) => {
    const w = render(Button, { props, slots: { default: 'Save' } })
    expect(await axe(w.element)).toHaveNoViolations()
  })
})

describe('IconButton', () => {
  it('uses label as aria-label and hides the icon', () => {
    const w = render(IconButton, {
      props: { label: 'Close' },
      slots: { default: '<svg data-icon></svg>' },
    })
    const btn = w.get('button')
    expect(btn.attributes('aria-label')).toBe('Close')
    expect(w.get('[data-icon]').element.parentElement?.getAttribute('aria-hidden')).toBe('true')
  })

  it('has no axe violations', async () => {
    const w = render(IconButton, {
      props: { label: 'Close' },
      slots: { default: '<svg data-icon></svg>' },
    })
    expect(await axe(w.element)).toHaveNoViolations()
  })
})
