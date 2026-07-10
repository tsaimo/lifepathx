import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LifePathCalculator from './LifePathCalculator.vue'
import { readingTypes } from '../number-reading/numberReadingTypes'

describe('LifePathCalculator', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('限制生日年份范围和位数', () => {
    const wrapper = mount(LifePathCalculator, {
      props: { activeType: readingTypes[0] },
    })
    const input = wrapper.find('input[type="date"]')

    expect(input.attributes('min')).toBe('1900-01-01')
    expect(input.attributes('max')).toBe('9999-12-31')
  })

  it('进入页面默认填写 18 年前的今天', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 8))
    const wrapper = mount(LifePathCalculator, {
      props: { activeType: readingTypes[0] },
    })

    expect(wrapper.find('input[type="date"]').element.value).toBe('2008-07-08')
    expect(wrapper.text()).toContain('命运数')
  })

  it('输入越界生日后自动回填默认生日并计算', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 8))
    const wrapper = mount(LifePathCalculator, {
      props: { activeType: readingTypes[0] },
    })
    const input = wrapper.find('input[type="date"]')

    await input.setValue('1222-08-18')
    await input.trigger('blur')

    expect(input.element.value).toBe('2008-07-08')
    expect(wrapper.text()).toContain('命运数')
  })

  it('默认生日回填后仍可手动修改为合法日期', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 8))
    const wrapper = mount(LifePathCalculator, {
      props: { activeType: readingTypes[0] },
    })
    const input = wrapper.find('input[type="date"]')

    await input.setValue('1222-08-18')
    await input.trigger('blur')
    expect(input.element.value).toBe('2008-07-08')

    await input.setValue('1989-08-18')
    await input.trigger('blur')

    expect(input.element.value).toBe('1989-08-18')
    expect(wrapper.text()).toContain('命运数')
  })

  it('手动编辑过程中不立即回填默认生日', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 8))
    const wrapper = mount(LifePathCalculator, {
      props: { activeType: readingTypes[0] },
    })
    const input = wrapper.find('input[type="date"]')

    await input.setValue('1222-08-18')

    expect(input.element.value).toBe('1222-08-18')

    await input.trigger('blur')

    expect(input.element.value).toBe('2008-07-08')
  })

  it('通过覆盖层展开和收起计算规则', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 8))
    const wrapper = mount(LifePathCalculator, {
      props: { activeType: readingTypes[0] },
    })
    const toggle = wrapper.find('.rules-toggle')

    expect(wrapper.find('.rules-overlay').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('命运数 = 归约(月) + 归约(日) + 归约(年)')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.attributes('disabled')).toBeUndefined()

    await toggle.trigger('click')

    expect(wrapper.find('.rules-overlay').attributes('role')).toBe('dialog')
    expect(wrapper.find('.rules-overlay').attributes('aria-modal')).toBe('true')
    expect(wrapper.text()).toContain('命运数 = 归约(月) + 归约(日) + 归约(年)')
    expect(wrapper.text()).toContain('生日 2008-07-08')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await wrapper.find('.rules-close').trigger('click')

    expect(wrapper.find('.rules-overlay').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('命运数 = 归约(月) + 归约(日) + 归约(年)')
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('计算规则示例随当前填写的生日同步更新', async () => {
    const wrapper = mount(LifePathCalculator, {
      props: { activeType: readingTypes[0] },
    })
    const input = wrapper.find('input[type="date"]')

    await input.setValue('1990-12-31')
    await wrapper.find('.rules-toggle').trigger('click')

    expect(wrapper.text()).toContain('生日 1990-12-31')
    expect(wrapper.text()).toContain('月 1 + 2 = 3；日 3 + 1 = 4；年 1 + 9 + 9 + 0 = 19，1 + 9 = 10，1 + 0 = 1')
    expect(wrapper.text()).toContain('总和 3 + 4 + 1 = 8，所以命运数落在 8。')

    await input.setValue('2001-02-03')

    expect(wrapper.text()).toContain('生日 2001-02-03')
    expect(wrapper.text()).toContain('总和 2 + 3 + 3 = 8，所以命运数落在 8。')
    expect(wrapper.text()).not.toContain('生日 1990-12-31')
  })
})
