import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LifePathCalculator from './LifePathCalculator.vue'
import { readingTypes } from '../number-reading/numberReadingTypes'

describe('LifePathCalculator', () => {
  it('通过覆盖层展开和收起计算规则', async () => {
    const wrapper = mount(LifePathCalculator, {
      props: { activeType: readingTypes[0] },
    })
    const toggle = wrapper.find('.rules-toggle')

    expect(wrapper.find('.rules-overlay').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('命运数 = 归约(月) + 归约(日) + 归约(年)')
    expect(toggle.attributes('aria-expanded')).toBe('false')

    await toggle.trigger('click')

    expect(wrapper.find('.rules-overlay').attributes('role')).toBe('dialog')
    expect(wrapper.find('.rules-overlay').attributes('aria-modal')).toBe('true')
    expect(wrapper.text()).toContain('命运数 = 归约(月) + 归约(日) + 归约(年)')
    expect(wrapper.text()).toContain('生日 1989-08-18')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await wrapper.find('.rules-close').trigger('click')

    expect(wrapper.find('.rules-overlay').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('命运数 = 归约(月) + 归约(日) + 归约(年)')
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })
})
