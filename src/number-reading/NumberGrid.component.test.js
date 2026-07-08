import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NumberGrid from './NumberGrid.vue'

const readings = Array.from({ length: 9 }, (_, index) => ({ number: index + 1 }))

describe('NumberGrid', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('根据真实格子中心动态计算连线点位', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect() {
      if (this.classList.contains('grid')) {
        return { left: 0, top: 0, width: 300, height: 300, right: 300, bottom: 300 }
      }

      if (this.classList.contains('grid-cell')) {
        const number = Number(this.textContent)
        const index = number - 1
        const left = (index % 3) * 100
        const top = Math.floor(index / 3) * 100

        return { left, top, width: 100, height: 100, right: left + 100, bottom: top + 100 }
      }

      return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 }
    })

    const wrapper = mount(NumberGrid, {
      props: {
        readings,
        selected: 2,
        lineSegments: [['1.5,0.5', '1.5,1.5', '1.5,2.5']],
      },
    })

    await nextTick()
    await nextTick()

    expect(wrapper.find('.line-layer').attributes('viewBox')).toBe('0 0 300 300')
    expect(wrapper.find('.connection-line').attributes('points')).toBe('150,50 150,150 150,250')
  })
})
