import { afterEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick, type Component } from 'vue'

const mounted: VueWrapper[] = []

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount()
  document.body.innerHTML = ''
})

/** Mount attached to document.body (focus, axe) and unmount after each test. */
export function render(component: Component, options: Parameters<typeof mount>[1] = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = mount(component as any, { attachTo: document.body, ...options })
  mounted.push(w)
  return w
}

/** Let Reka's portals, presence, and focus management settle. */
export async function settle(ms = 20) {
  await flushPromises()
  await nextTick()
  await new Promise((r) => setTimeout(r, ms))
}

/** Mount a template string with the given components in scope. */
export function renderTemplate(
  template: string,
  components: Record<string, Component>,
  setup: () => Record<string, unknown> = () => ({}),
) {
  return render({ components, setup, template })
}
