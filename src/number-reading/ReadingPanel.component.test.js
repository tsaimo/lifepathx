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

  it('编辑时同时展示原内容和当前编辑内容，保存后通知创建全局历史版本', async () => {
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

    await wrapper.find('.draft-panel input').setValue('新版开创者')
    await wrapper.findAll('textarea')[0].setValue('新版摘要')
    await wrapper.findAll('textarea')[1].setValue('新版优势一\n新版优势二')
    await wrapper.findAll('textarea')[2].setValue('新版课题')
    await wrapper.findAll('textarea')[3].setValue('新版建议')
    await wrapper.find('.form-actions .panel-action.primary').trigger('click')

    expect(wrapper.text()).toContain('新版开创者')
    expect(wrapper.text()).toContain('新版摘要')
    expect(wrapper.emitted('create-history-version')).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('lifepathx:reading-current:v1'))['destiny:1'].title).toBe('新版开创者')
  })

  it('连续保存会更新当前解读内容并持续通知全局历史', async () => {
    const wrapper = mount(ReadingPanel, {
      props: { reading, type },
    })

    await wrapper.find('.panel-action').trigger('click')
    await wrapper.find('.draft-panel input').setValue('第一版标题')
    await wrapper.find('.form-actions .panel-action.primary').trigger('click')
    await wrapper.find('.panel-action').trigger('click')
    await wrapper.find('.draft-panel input').setValue('第二版标题')
    await wrapper.find('.form-actions .panel-action.primary').trigger('click')

    expect(wrapper.find('h2').text()).toBe('第二版标题')
    expect(wrapper.emitted('create-history-version')).toHaveLength(2)
    expect(JSON.parse(localStorage.getItem('lifepathx:reading-current:v1'))['destiny:1'].title).toBe('第二版标题')
  })
})
