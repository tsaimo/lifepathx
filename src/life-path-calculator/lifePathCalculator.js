const MASTER_NUMBERS = [11, 22, 33, 44]

function sumDigits(value) {
  return String(value)
    .split('')
    .reduce((total, digit) => total + Number(digit), 0)
}

// 数字归约：主数 11/22/33 保留，其余归约到个位。
export function reduceLifePathNumber(value) {
  let number = Number(value)

  while (number > 9 && !MASTER_NUMBERS.includes(number)) {
    number = sumDigits(number)
  }

  return number
}

export function calculateLifePath(birthDate) {
  if (!birthDate) {
    return null
  }

  const [year, month, day] = birthDate.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  const parts = {
    month: reduceLifePathNumber(month),
    day: reduceLifePathNumber(day),
    year: reduceLifePathNumber(sumDigits(year)),
  }
  const number = reduceLifePathNumber(parts.month + parts.day + parts.year)
  const root = MASTER_NUMBERS.includes(number) ? reduceLifePathNumber(sumDigits(number)) : number

  return {
    number,
    root,
    linkedNumbers: number === root ? [number] : [number, root],
    parts,
  }
}
