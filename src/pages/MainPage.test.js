import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import numberReadings from '../data/numberReadings.json'
import MainPage from './MainPage.vue'

function findNumberTile(wrapper, number) {
  return wrapper.findAll('.tile').find((button) => button.text() === String(number))
}

async function getExportedPayload(wrapper, selector = '.export-action') {
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:readings')
  const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  const createElement = document.createElement.bind(document)
  const click = vi.fn()

  vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
    if (tagName !== 'a') {
      return createElement(tagName, options)
    }

    return {
      click,
      set href(value) {
        this._href = value
      },
      get href() {
        return this._href
      },
      set download(value) {
        this._download = value
      },
      get download() {
        return this._download
      },
    }
  })

  await wrapper.find(selector).trigger('click')

  const payload = JSON.parse(await createObjectURL.mock.calls[0][0].text())

  expect(confirm).toHaveBeenCalledTimes(1)
  expect(click).toHaveBeenCalledTimes(1)
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:readings')

  return payload
}

function findPayloadReading(payload, typeId, number, collection = 'readings') {
  return payload.readingTypes
    .find((type) => type.id === typeId)
    [collection].find((reading) => reading.number === number)
}

describe('MainPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('可以在浅色和深色主题之间切换', async () => {
    const wrapper = mount(MainPage)
    const themeToggle = wrapper.find('.theme-toggle')

    expect(wrapper.find('.main-page').classes()).not.toContain('dark')
    expect(themeToggle.text()).toBe('深色')

    await themeToggle.trigger('click')

    expect(wrapper.find('.main-page').classes()).toContain('dark')
    expect(themeToggle.text()).toBe('浅色')
  })

  it('点击数字后展示对应中文解读', async () => {
    const wrapper = mount(MainPage)

    expect(wrapper.findAll('.tile')).toHaveLength(9)
    expect(wrapper.findAll('.tile').map((button) => button.text())).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])

    await wrapper.find('input[type="date"]').setValue('1989-08-18')
    await findNumberTile(wrapper, 7).trigger('click')

    expect(wrapper.text()).toContain('探求者')
    expect(wrapper.text()).toContain('追问的坚持')
  })

  it('默认生日填写完成后页面交互可用', async () => {
    const wrapper = mount(MainPage)
    await wrapper.vm.$nextTick()

    const birthdayTab = wrapper.findAll('.tab').find((tab) => tab.text().includes('生日数'))
    const relationshipAdviceTab = wrapper.findAll('.advice-tab').find((button) => button.text().includes('与对方相处'))

    expect(wrapper.find('.date-field').classes()).not.toContain('incomplete')
    expect(wrapper.find('.rules-toggle').attributes('disabled')).toBeUndefined()
    expect(birthdayTab.attributes('disabled')).toBeUndefined()
    expect(findNumberTile(wrapper, 7).attributes('disabled')).toBeUndefined()
    expect(wrapper.findAll('.extra-number-button').find((button) => button.text() === '22').attributes('disabled')).toBeUndefined()
    expect(relationshipAdviceTab.attributes('disabled')).toBeUndefined()

    await wrapper.find('input[type="date"]').setValue('1989-08-20')
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

  it('连线解读在三个数字形成直线时展示九宫格连线', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1902-03-05')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('连线解读')).trigger('click')

    expect(wrapper.text()).toContain('Connection Line 2-5-8')
    expect(wrapper.text()).toContain('情绪线（2-5-8）')
    expect(wrapper.text()).toContain('感受、变化与现实压力')
    expect(wrapper.find('.line-layer').exists()).toBe(true)
    expect(wrapper.findAll('.connection-line').map((line) => line.attributes('points'))).toEqual([
      '1.5,0.5 1.5,1.5 1.5,2.5',
    ])
  })

  it('连线解读在不能形成直线时连接相邻边中点', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1902-04-04')
    await wrapper.findAll('.tab').find((tab) => tab.text().includes('连线解读')).trigger('click')

    expect(wrapper.text()).toContain('Connection Line 2-4/4-8')
    expect(wrapper.text()).toContain('灵巧线（2-4）')
    expect(wrapper.text()).toContain('纪律线（4-8）')
    expect(wrapper.findAll('.connection-line').map((line) => line.attributes('points'))).toEqual([
      '1.5,0.5 0.5,1.5',
      '0.5,1.5 1.5,2.5',
    ])

    await wrapper.find('input[type="date"]').setValue('1902-04-22')

    expect(wrapper.text()).toContain('Connection Line 无连线')
    expect(wrapper.find('.line-layer').exists()).toBe(false)
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
    expect(wrapper.text()).toContain('现实转化能力')

    await wrapper.findAll('.tab').find((tab) => tab.text().includes('空缺数')).trigger('click')

    expect(wrapper.text()).toContain('Missing Number 2')
    expect(wrapper.text()).toContain('缺少了「2」的能量')
    expect(wrapper.text()).toContain('后天有意识地培养')
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
    expect(wrapper.text()).toContain('不是缺陷')
    expect(wrapper.text()).toContain('后天有意识地培养')
  })

  it('建议可以在给自己和与对方相处之间切换', async () => {
    const wrapper = mount(MainPage)

    await wrapper.find('input[type="date"]').setValue('1989-08-20')
    expect(wrapper.text()).toContain('真正的领导力不是独自扛起一切')

    await wrapper.findAll('.advice-tab').find((button) => button.text().includes('与对方相处')).trigger('click')

    expect(wrapper.text()).toContain('看见对方的“行动快”')
    expect(wrapper.text()).toContain('清晰的请求')
  })

  it('全局导出默认与内置数据文件规格一致', async () => {
    const wrapper = mount(MainPage)
    const payload = await getExportedPayload(wrapper)

    expect(payload).toEqual(numberReadings)
  })

  it('取消确认时不会导出 JSON 文件', async () => {
    const wrapper = mount(MainPage)
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const createObjectURL = vi.spyOn(URL, 'createObjectURL')

    await wrapper.find('.export-action').trigger('click')

    expect(confirm).toHaveBeenCalledTimes(1)
    expect(createObjectURL).not.toHaveBeenCalled()
  })

  it('全局导出包含全部解读内容数据和当前修改', async () => {
    localStorage.setItem(
      'lifepathx:reading-current:v1',
      JSON.stringify({
        'destiny:1': {
          title: '已编辑命运数',
          summary: '已编辑摘要',
          strengths: ['已编辑优势'],
          challenges: ['已编辑课题'],
          advice: { self: ['已编辑建议'], relationship: ['已编辑相处建议'] },
        },
      }),
    )
    const wrapper = mount(MainPage)
    const payload = await getExportedPayload(wrapper)

    expect(payload.birthdayRelatedDays).toEqual(numberReadings.birthdayRelatedDays)
    expect(findPayloadReading(payload, 'destiny', 1).title).toBe('已编辑命运数')
    expect(findPayloadReading(payload, 'birthday', 31, 'detailReadings').title).toContain('31 日')
    expect(findPayloadReading(payload, 'talent', 9).title).toBeTruthy()
    expect(findPayloadReading(payload, 'missing', 0, 'extraReadings').title).toContain('缺少 0')
  })

  it('全局历史版本包含全部解读内容，可恢复、导出和删除', async () => {
    const wrapper = mount(MainPage)
    await wrapper.vm.$nextTick()

    await wrapper.find('.panel-heading .panel-action').trigger('click')
    await wrapper.find('.draft-panel input').setValue('全局历史当前标题')
    await wrapper.find('.form-actions .panel-action.primary').trigger('click')

    expect(wrapper.find('.history-controls').exists()).toBe(true)
    expect(wrapper.findAll('.history-select option')).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('lifepathx:reading-history:v2'))[0].readings['destiny:1'].title).toBe(
      '开创者',
    )
    expect(JSON.parse(localStorage.getItem('lifepathx:reading-history:v2'))[0].readings['birthday:31'].title).toContain(
      '31 日',
    )

    const historyPayload = await getExportedPayload(wrapper, '.history-export-action')

    expect(historyPayload.birthdayRelatedDays).toEqual(numberReadings.birthdayRelatedDays)
    expect(findPayloadReading(historyPayload, 'destiny', 1).title).toBe('开创者')
    expect(findPayloadReading(historyPayload, 'missing', 0, 'extraReadings').title).toContain('缺少 0')

    vi.restoreAllMocks()
    await wrapper.find('.history-controls .top-action').trigger('click')
    await findNumberTile(wrapper, 1).trigger('click')

    expect(wrapper.find('h2').text()).toBe('开创者')
    expect(JSON.parse(localStorage.getItem('lifepathx:reading-current:v1'))['destiny:1'].title).toBe('开创者')

    await wrapper.find('.history-controls .danger').trigger('click')

    expect(wrapper.find('.history-controls').exists()).toBe(false)
    expect(JSON.parse(localStorage.getItem('lifepathx:reading-history:v2'))).toEqual([])
  })

  it('全局导入在弹层内校验，成功后关闭弹层并更新当前显示', async () => {
    const wrapper = mount(MainPage)
    const payload = await getExportedPayload(wrapper)

    vi.restoreAllMocks()
    Object.assign(findPayloadReading(payload, 'destiny', 1), {
      title: '全局导入标题',
      summary: '全局导入摘要',
      strengths: ['全局导入优势'],
      challenges: ['全局导入课题'],
      advice: { self: ['全局导入建议'], relationship: ['全局导入相处建议'] },
    })

    await wrapper.find('.import-action').trigger('click')

    const invalidFile = new File([JSON.stringify({ birthdayRelatedDays: {}, readingTypes: [] })], 'invalid.json', {
      type: 'application/json',
    })
    const fileInput = wrapper.find('.import-file')

    Object.defineProperty(fileInput.element, 'files', { value: [invalidFile], configurable: true })
    await fileInput.trigger('change')
    await wrapper.find('.import-actions .primary').trigger('click')
    await flushPromises()

    expect(wrapper.find('.import-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('readingTypes 缺少 destiny:1')

    const validFile = new File([JSON.stringify(payload)], 'valid.json', { type: 'application/json' })

    Object.defineProperty(fileInput.element, 'files', { value: [validFile], configurable: true })
    await fileInput.trigger('change')
    await wrapper.find('.import-actions .primary').trigger('click')
    await flushPromises()

    expect(wrapper.find('.import-overlay').exists()).toBe(false)
    await findNumberTile(wrapper, 1).trigger('click')

    expect(wrapper.find('h2').text()).toBe('全局导入标题')
    expect(JSON.parse(localStorage.getItem('lifepathx:reading-current:v1'))['destiny:1'].summary).toBe('全局导入摘要')
  })
})
