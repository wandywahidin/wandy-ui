import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'

describe('test harness', () => {
  it('mounts a component and runs axe', async () => {
    const Smoke = defineComponent({ render: () => h('button', 'Hi') })
    const wrapper = mount(Smoke, { attachTo: document.body })
    expect(wrapper.text()).toBe('Hi')
    expect(await axe(wrapper.element)).toHaveNoViolations()
    wrapper.unmount()
  })
})
