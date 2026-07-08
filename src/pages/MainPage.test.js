import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MainPage from './MainPage.vue'

function findNumberTile(wrapper, number) {
  return wrapper.findAll('.tile').find((button) => button.text() === String(number))
}

describe('MainPage', () => {
  it('点击数字后展示对应中文解读', async () => {
    const wrapper = mount(MainPage)

    expect(wrapper.findAll('.tile')).toHaveLength(9)
    expect(wrapper.findAll('.tile').map((button) => button.text())).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    expect(wrapper.text()).toContain('开创者')

    await wrapper.find('input[type="date"]').setValue('1989-08-18')
    await findNumberTile(wrapper, 7).trigger('click')

    expect(wrapper.text()).toContain('探求者')
    expect(wrapper.text()).toContain('追问本质')
  })

  it('生日填写完成前禁用其它页面交互，填写后恢复', async () => {
    const wrapper = mount(MainPage)
    const birthdayTab = wrapper.findAll('.tab').find((tab) => tab.text().includes('生日数'))
    const relationshipAdviceTab = wrapper.findAll('.advice-tab').find((button) => button.text().includes('与对方相处'))

    expect(wrapper.find('.date-field').classes()).toContain('incomplete')
    expect(wrapper.find('.rules-toggle').attributes('disabled')).toBeDefined()
    expect(birthdayTab.attributes('disabled')).toBeDefined()
    expect(findNumberTile(wrapper, 7).attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('.extra-number-button').find((button) => button.text() === '22').attributes('disabled')).toBeDefined()
    expect(relationshipAdviceTab.attributes('disabled')).toBeDefined()

    await birthdayTab.trigger('click')
    await findNumberTile(wrapper, 7).trigger('click')
    await relationshipAdviceTab.trigger('click')

    expect(wrapper.text()).toContain('Destiny Number 1')
    expect(wrapper.text()).toContain('先温柔地承认自己的独立需求')

    await wrapper.find('input[type="date"]').setValue('1989-08-20')

    expect(wrapper.find('.date-field').classes()).not.toContain('incomplete')
    expect(wrapper.find('.rules-toggle').attributes('disabled')).toBeUndefined()
    expect(birthdayTab.attributes('disabled')).toBeUndefined()
    expect(findNumberTile(wrapper, 7).attributes('disabled')).toBeUndefined()
    expect(wrapper.findAll('.extra-number-button').find((button) => button.text() === '22').attributes('disabled')).toBeUndefined()
    expect(relationshipAdviceTab.attributes('disabled')).toBeUndefined()

    await birthdayTab.trigger('click')
    await findNumberTile(wrapper, 7).trigger('click')

    expect(wrapper.text()).toContain('Birthday Number 7')
  })

  it('输入生日后自动计算并联动解读', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1942-06-18')

    expect(wrapper.text()).toContain('愿景建造者')
    expect(wrapper.text()).toContain('命运数 22')
    expect(wrapper.text()).toContain('根数 4')
    expect(wrapper.findAll('.extra-number-button').some((button) => button.classes().includes('active') && button.text() === '22')).toBe(true)
    expect(wrapper.findAll('.tile').some((tile) => tile.classes().includes('linked') && tile.text() === '4')).toBe(true)
  })

  it('命运数和空缺数在九宫格下方展示额外数字解读', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1999-11-22')

    expect(wrapper.findAll('.tile').map((button) => button.text())).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    expect(wrapper.findAll('.extra-number-button').map((button) => button.text())).toEqual(['11', '22', '33'])

    await wrapper.findAll('.extra-number-button').find((button) => button.text() === '11').trigger('click')

    expect(wrapper.text()).toContain('Destiny Number 11')
    expect(wrapper.text()).toContain('灵感者')

    await wrapper.findAll('.tab').find((tab) => tab.text().includes('空缺数')).trigger('click')

    expect(wrapper.findAll('.tile').map((button) => button.text())).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    expect(wrapper.findAll('.extra-number-button').map((button) => button.text())).toEqual(['0'])
    expect(wrapper.findAll('.extra-number-button').some((button) => button.classes().includes('active') && button.text() === '0')).toBe(true)
    expect(wrapper.text()).toContain('Missing Number 0')
    expect(wrapper.text()).toContain('缺少 0：留白与潜能')
  })

  it('切换查看生日数、天赋数和空缺数解读', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1989-08-18')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('生日数')).trigger('click')

    expect(wrapper.text()).toContain('Birthday Number 18')
    expect(wrapper.text()).toContain('18 日：愿景实践者')
    expect(wrapper.findAll('.day-button').map((button) => button.text())).toEqual(['9', '18', '27'])
    expect(wrapper.findAll('.day-button').some((button) => button.classes().includes('active') && button.text() === '18')).toBe(true)

    await wrapper.findAll('.tab').find((tab) => tab.text().includes('天赋数')).trigger('click')

    expect(wrapper.text()).toContain('Talent Number 8')
    expect(wrapper.text()).toContain('天赋数 8 继承')

    await wrapper.findAll('.tab').find((tab) => tab.text().includes('空缺数')).trigger('click')

    expect(wrapper.text()).toContain('Missing Number 2')
    expect(wrapper.text()).toContain('空缺数 2 表示生日数字里少了')
    expect(wrapper.text()).toContain('需要后天补课')
    expect(wrapper.findAll('.linked').some((tile) => tile.text().includes('7'))).toBe(true)
  })

  it('生日数可以切换查看不同具体日期解读', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1989-08-18')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('生日数')).trigger('click')
    await findNumberTile(wrapper, 5).trigger('click')

    expect(wrapper.findAll('.day-button').map((button) => button.text())).toEqual(['5', '14', '23'])

    await wrapper.findAll('.day-button').find((button) => button.text() === '23').trigger('click')

    expect(wrapper.text()).toContain('Birthday Number 23')
    expect(wrapper.text()).toContain('23 日：表达建造者')
    expect(wrapper.findAll('.day-button').some((button) => button.classes().includes('active') && button.text() === '23')).toBe(true)
    expect(wrapper.findAll('.active').some((tile) => tile.text().includes('5'))).toBe(true)
  })

  it('生日数日期按九宫格选中数字渐进披露', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1989-08-18')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('生日数')).trigger('click')
    await findNumberTile(wrapper, 2).trigger('click')

    expect(wrapper.findAll('.day-button').map((button) => button.text())).toEqual(['2', '22', '29'])
    expect(wrapper.text()).not.toContain('31 日：系统成就者')

    await findNumberTile(wrapper, 3).trigger('click')

    expect(wrapper.findAll('.day-button').map((button) => button.text())).toEqual(['3', '12', '21', '30'])
  })

  it('切回生日数时按计算结果重新定位出生日', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1989-08-02')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('生日数')).trigger('click')
    await wrapper.findAll('.day-button').find((button) => button.text() === '22').trigger('click')

    expect(wrapper.findAll('.day-button').some((button) => button.classes().includes('active') && button.text() === '22')).toBe(true)

    await wrapper.findAll('.tab').find((tab) => tab.text().includes('天赋数')).trigger('click')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('生日数')).trigger('click')

    expect(wrapper.text()).toContain('Birthday Number 2')
    expect(wrapper.findAll('.day-button').some((button) => button.classes().includes('active') && button.text() === '2')).toBe(true)
  })

  it('规则弹层随解读类型切换内容', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1989-08-18')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('空缺数')).trigger('click')
    await wrapper.find('.rules-toggle').trigger('click')

    expect(wrapper.text()).toContain('空缺数怎么算')
    expect(wrapper.text()).toContain('完整生日数字中没有出现的 0-9')
  })

  it('空缺数解读展示缺失带来的补足方向', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1989-08-18')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('空缺数')).trigger('click')

    expect(wrapper.text()).toContain('需要补足')
    expect(wrapper.text()).toContain('容易卡住')
    expect(wrapper.text()).toContain('不是优势')
    expect(wrapper.text()).toContain('需要后天补课')
  })

  it('建议可以在给自己和与对方相处之间切换', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1989-08-20')
    expect(wrapper.text()).toContain('先温柔地承认自己的独立需求')

    await wrapper.findAll('.advice-tab').find((button) => button.text().includes('与对方相处')).trigger('click')

    expect(wrapper.text()).toContain('如果你在看另一个人')
    expect(wrapper.text()).toContain('少用催促')
  })
})
