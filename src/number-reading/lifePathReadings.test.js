import { describe, expect, it } from 'vitest'
import readings from './lifePathReadings.json'
import { birthdayRelatedDays, readingTypes } from './numberReadingTypes'

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

  it('提供五类 1-9 解读与计算规则', () => {
    expect(readingTypes.map((type) => type.id)).toEqual(['destiny', 'birthday', 'talent', 'connection', 'missing'])

    readingTypes.forEach((type) => {
      expect(type.readings.map((reading) => reading.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(type.rules.title.length).toBeGreaterThan(4)
      expect(type.rules.blocks.length).toBeGreaterThanOrEqual(2)
      type.readings.forEach((reading) => {
        expect(reading.advice.self.length).toBeGreaterThan(0)
        expect(reading.advice.self.length).toBeLessThanOrEqual(5)
        expect(reading.advice.relationship.length).toBeGreaterThan(0)
        expect(reading.advice.relationship.length).toBeLessThanOrEqual(5)
      })
      type.rules.blocks.forEach((block) => {
        expect(block.lines.length).toBeGreaterThanOrEqual(2)
      })
    })
  })

  it('连线解读提供九宫格连线规则', () => {
    const connectionType = readingTypes.find((type) => type.id === 'connection')

    expect(connectionType.sectionLabels).toMatchObject({
      strengths: '连线优势',
      challenges: '连线课题',
    })
    expect(connectionType.rules.blocks[0].lines.join('')).toContain('三个数字必须在九宫格上形成一条直线')
    expect(connectionType.rules.blocks[0].lines.join('')).toContain('相邻边的中点')
  })

  it('命运数和空缺数提供九宫格外的额外解读', () => {
    const destinyType = readingTypes.find((type) => type.id === 'destiny')
    const missingType = readingTypes.find((type) => type.id === 'missing')

    expect(destinyType.extraReadings.map((reading) => reading.number)).toEqual([11, 22, 33])
    expect(missingType.extraReadings.map((reading) => reading.number)).toEqual([0])
    expect(missingType.extraReadings[0].summary).toContain('空缺数 0')
    expect(missingType.rules.blocks[0].lines.join('')).toContain('0-9')
  })

  it('生日数提供 1-31 的具体日期解读', () => {
    const birthdayType = readingTypes.find((type) => type.id === 'birthday')

    expect(birthdayType.detailReadings.map((reading) => reading.number)).toEqual(Array.from({ length: 31 }, (_, index) => index + 1))
    birthdayType.detailReadings.forEach((reading) => {
      expect(reading.summary.length).toBeGreaterThan(35)
      expect(reading.strengths).toHaveLength(3)
      expect(reading.challenges).toHaveLength(3)
      expect(reading.linkedNumber).toBeGreaterThanOrEqual(1)
      expect(reading.linkedNumber).toBeLessThanOrEqual(9)
      expect(reading.advice.self.join('').length).toBeGreaterThan(20)
      expect(reading.advice.self.length).toBeLessThanOrEqual(5)
      expect(reading.advice.relationship.join('').length).toBeGreaterThan(20)
      expect(reading.advice.relationship.length).toBeLessThanOrEqual(5)
    })
  })

  it('生日数按九宫格数字配置渐进披露日期', () => {
    expect(birthdayRelatedDays[2]).toEqual([2, 22, 29])
    expect(Object.values(birthdayRelatedDays).flat()).not.toHaveLength(31)
  })

  it('空缺数解读表达缺少数字带来的短板', () => {
    const missingType = readingTypes.find((type) => type.id === 'missing')
    const missingOne = missingType.readings.find((reading) => reading.number === 1)

    expect(missingType.sectionLabels).toMatchObject({
      strengths: '需要补足',
      challenges: '容易卡住',
    })
    expect(missingOne.title).toContain('缺少 1')
    expect(missingOne.summary).toContain('不是优势')
    expect(missingOne.summary).toContain('需要后天补课')
    expect(missingOne.strengths.join('')).toContain('缺少')
    expect(missingOne.advice.self.join('')).toContain('不是给自己扣分')
  })
})
