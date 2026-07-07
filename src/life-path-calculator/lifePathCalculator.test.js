import { describe, expect, it } from 'vitest'
import { calculateLifePath, reduceLifePathNumber } from './lifePathCalculator'

describe('lifePathCalculator', () => {
  it('归约普通数字到个位并保留主数', () => {
    expect(reduceLifePathNumber(26)).toBe(8)
    expect(reduceLifePathNumber(11)).toBe(11)
    expect(reduceLifePathNumber(22)).toBe(22)
    expect(reduceLifePathNumber(33)).toBe(33)
    expect(reduceLifePathNumber(44)).toBe(44)
  })

  it('按生日计算生命灵数', () => {
    expect(calculateLifePath('1989-08-18')).toMatchObject({
      number: 8,
      root: 8,
      linkedNumbers: [8],
      parts: { month: 8, day: 9, year: 9 },
    })
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
})
