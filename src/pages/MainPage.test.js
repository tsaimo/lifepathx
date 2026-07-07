import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MainPage from './MainPage.vue'

describe('MainPage', () => {
  it('点击数字后展示对应中文解读', async () => {
    const wrapper = mount(MainPage)

    expect(wrapper.findAll('button')).toHaveLength(13)
    expect(wrapper.text()).toContain('开创者')

    await wrapper.findAll('button').find((button) => button.text().includes('7')).trigger('click')

    expect(wrapper.text()).toContain('探求者')
    expect(wrapper.text()).toContain('追问本质')
  })

  it('输入生日后自动计算并联动解读', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1942-06-18')

    expect(wrapper.text()).toContain('愿景建造者')
    expect(wrapper.text()).toContain('主数 22 联动根数 4')
    expect(wrapper.findAll('.linked').some((tile) => tile.text().includes('4'))).toBe(true)
  })
})
