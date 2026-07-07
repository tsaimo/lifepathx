import { describe, expect, it } from 'vitest'
import readings from './lifePathReadings.json'

describe('lifePathReadings', () => {
  it('覆盖 1-9 与主数 11/22/33/44', () => {
    expect(readings.map((reading) => reading.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, 44])
  })

  it('每个数字都有可阅读的中文解读', () => {
    readings.forEach((reading) => {
      expect(reading.summary.length).toBeGreaterThan(35)
      expect(reading.strengths).toHaveLength(3)
      expect(reading.challenges).toHaveLength(3)
      expect(reading.advice.length).toBeGreaterThan(20)
      expect(reading.refs.length).toBeGreaterThan(1)
    })
  })
})
