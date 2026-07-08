import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import ReadingPanel from './ReadingPanel.vue'
import { readingTypes } from './numberReadingTypes'

const type = readingTypes[0]
const reading = type.readings[0]

describe('ReadingPanel', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('编辑时同时展示原内容和当前编辑内容，保存后生成历史版本', async () => {
    const wrapper = mount(ReadingPanel, {
      props: { reading, type },
    })

    await wrapper.find('.panel-action').trigger('click')

    expect(wrapper.find('.editor-overlay').attributes('role')).toBe('dialog')
    expect(wrapper.find('.editor-overlay').attributes('aria-modal')).toBe('true')
    expect(wrapper.text()).toContain('原内容')
    expect(wrapper.text()).toContain('当前编辑')
    expect(wrapper.find('.original').text()).toContain('开创者')
    expect(wrapper.findAll('.readonly-field')).toHaveLength(wrapper.findAll('.draft-panel label').length)

    await wrapper.find('input').setValue('新版开创者')
    await wrapper.findAll('textarea')[0].setValue('新版摘要')
    await wrapper.findAll('textarea')[1].setValue('新版优势一\n新版优势二')
    await wrapper.findAll('textarea')[2].setValue('新版课题')
    await wrapper.findAll('textarea')[3].setValue('新版建议')
    await wrapper.find('.form-actions .panel-action.primary').trigger('click')

    expect(wrapper.text()).toContain('新版开创者')
    expect(wrapper.text()).toContain('新版摘要')
    expect(wrapper.text()).toContain('历史版本')
    expect(wrapper.findAll('.history-item')).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('lifepathx:reading-history:v1'))['destiny:1']).toHaveLength(1)
  })

  it('历史版本可以恢复和删除', async () => {
    const wrapper = mount(ReadingPanel, {
      props: { reading, type },
    })

    await wrapper.find('.panel-action').trigger('click')
    await wrapper.find('input').setValue('第一版标题')
    await wrapper.find('.panel-action.primary').trigger('click')
    await wrapper.find('.panel-action').trigger('click')
    await wrapper.find('input').setValue('第二版标题')
    await wrapper.find('.panel-action.primary').trigger('click')

    expect(wrapper.findAll('.history-item')).toHaveLength(2)
    expect(wrapper.find('h2').text()).toBe('第二版标题')

    await wrapper.findAll('.history-item')[0].find('.history-actions .panel-action').trigger('click')

    expect(wrapper.find('h2').text()).toBe('第一版标题')
    expect(wrapper.findAll('.history-item')).toHaveLength(3)

    await wrapper.findAll('.history-item')[2].find('.danger').trigger('click')

    expect(wrapper.find('h2').text()).toBe('第二版标题')
    expect(wrapper.findAll('.history-item')).toHaveLength(2)
  })
})
