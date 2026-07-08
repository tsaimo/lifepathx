import { describe, expect, it } from 'vitest'
import {
  calculateLifePath,
  calculateNumerologyProfile,
  getDefaultBirthDate,
  normalizeBirthDateInput,
  reduceLifePathNumber,
  reduceToSingleDigit,
} from './lifePathCalculator'

describe('lifePathCalculator', () => {
  it('归约普通数字到个位并保留主数', () => {
    expect(reduceLifePathNumber(26)).toBe(8)
    expect(reduceLifePathNumber(11)).toBe(11)
    expect(reduceLifePathNumber(22)).toBe(22)
    expect(reduceLifePathNumber(33)).toBe(33)
    expect(reduceLifePathNumber(44)).toBe(44)
  })

  it('归约到九宫格数字', () => {
    expect(reduceToSingleDigit(18)).toBe(9)
    expect(reduceToSingleDigit(29)).toBe(2)
  })

  it('按生日计算生命灵数', () => {
    expect(calculateLifePath('1989-08-18')).toMatchObject({
      number: 8,
      root: 8,
      linkedNumbers: [8],
      parts: { month: 8, day: 9, year: 9 },
    })
  })

  it('拒绝 1900 年以前或非 4 位年份的生日', () => {
    expect(calculateLifePath('1899-12-31')).toBeNull()
    expect(calculateLifePath('099-08-18')).toBeNull()
    expect(calculateLifePath('10000-08-18')).toBeNull()
    expect(calculateNumerologyProfile('1899-12-31')).toBeNull()
    expect(calculateNumerologyProfile('10000-08-18')).toBeNull()
  })

  it('把越界生日修正为当前日期 22 年前的默认值', () => {
    const referenceDate = new Date(2026, 6, 8)

    expect(getDefaultBirthDate(referenceDate)).toBe('2004-07-08')
    expect(normalizeBirthDateInput('1222-08-18', referenceDate)).toBe('2004-07-08')
    expect(normalizeBirthDateInput('10000-08-18', referenceDate)).toBe('2004-07-08')
    expect(normalizeBirthDateInput('1989-08-18', referenceDate)).toBe('1989-08-18')
  })

  it('主数结果联动根数', () => {
    expect(calculateLifePath('1942-06-18')).toMatchObject({
      number: 22,
      root: 4,
      linkedNumbers: [22, 4],
    })
    expect(calculateLifePath('2009-11-29')).toMatchObject({
      number: 33,
      root: 6,
      linkedNumbers: [33, 6],
    })
    expect(calculateLifePath('1993-11-29')).toMatchObject({
      number: 44,
      root: 8,
      linkedNumbers: [44, 8],
    })
  })

  it('按生日生成四类数字结果', () => {
    expect(calculateNumerologyProfile('1989-08-18')).toMatchObject({
      destiny: { number: 8, root: 8, linkedNumbers: [8] },
      birthday: { number: 9, source: 18, linkedNumbers: [9] },
      talent: { number: 8, parts: { month: 8, day: 18 }, linkedNumbers: [8] },
      missing: { numbers: [2, 3, 4, 5, 6, 7], linkedNumbers: [2, 3, 4, 5, 6, 7] },
    })
  })

  it('空缺数包含生日数字中没有出现的 0', () => {
    expect(calculateNumerologyProfile('1999-11-22')).toMatchObject({
      missing: { numbers: [0, 3, 4, 5, 6, 7, 8], linkedNumbers: [0, 3, 4, 5, 6, 7, 8] },
    })
  })

  it('生日数按日期关联规则计算', () => {
    expect(calculateNumerologyProfile('1989-08-22')).toMatchObject({
      birthday: { number: 2, source: 22, linkedNumbers: [2] },
    })
  })
})
