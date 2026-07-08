const MASTER_NUMBERS = [11, 22, 33, 44]
const GRID_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
export const MIN_BIRTH_YEAR = 1900
export const MAX_BIRTH_YEAR = 9999
const BIRTHDAY_RELATED_DAYS = {
  1: [1, 10, 19, 28],
  2: [2, 22, 29],
  3: [3, 12, 21, 30],
  4: [4, 13, 31],
  5: [5, 14, 23],
  6: [6, 15, 24],
  7: [7, 16, 25],
  8: [8, 17, 26],
  9: [9, 18, 27],
}

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

export function reduceToSingleDigit(value) {
  let number = Number(value)

  while (number > 9) {
    number = sumDigits(number)
  }

  return number
}

function reduceBirthdayNumber(day) {
  const matchedEntry = Object.entries(BIRTHDAY_RELATED_DAYS).find(([, days]) => days.includes(day))

  return matchedEntry ? Number(matchedEntry[0]) : reduceToSingleDigit(day)
}

function formatDatePart(value) {
  return String(value).padStart(2, '0')
}

export function getDefaultBirthDate(referenceDate = new Date()) {
  const year = referenceDate.getFullYear() - 22
  const month = formatDatePart(referenceDate.getMonth() + 1)
  const day = formatDatePart(referenceDate.getDate())

  return `${year}-${month}-${day}`
}

export function normalizeBirthDateInput(birthDate, referenceDate = new Date()) {
  if (!birthDate) {
    return ''
  }

  const matchedDate = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!matchedDate) {
    return getDefaultBirthDate(referenceDate)
  }

  const [, yearValue, monthValue, dayValue] = matchedDate
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const checkedDate = new Date(year, month - 1, day)
  const isRealDate =
    checkedDate.getFullYear() === year && checkedDate.getMonth() === month - 1 && checkedDate.getDate() === day

  if (year < MIN_BIRTH_YEAR || year > MAX_BIRTH_YEAR || !isRealDate) {
    return getDefaultBirthDate(referenceDate)
  }

  return birthDate
}

function parseBirthDate(birthDate) {
  if (!birthDate) {
    return null
  }

  const matchedDate = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!matchedDate) {
    return null
  }

  const [, yearValue, monthValue, dayValue] = matchedDate
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const checkedDate = new Date(year, month - 1, day)
  const isRealDate =
    checkedDate.getFullYear() === year && checkedDate.getMonth() === month - 1 && checkedDate.getDate() === day

  if (year < MIN_BIRTH_YEAR || year > MAX_BIRTH_YEAR || !isRealDate) {
    return null
  }

  return { year, month, day }
}

export function calculateLifePath(birthDate) {
  const parsed = parseBirthDate(birthDate)

  if (!parsed) {
    return null
  }

  const { year, month, day } = parsed

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

function getPresentDigits({ year, month, day }) {
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
    .split('')
    .map(Number)
    .filter((digit) => digit > 0)
}

export function calculateNumerologyProfile(birthDate) {
  const parsed = parseBirthDate(birthDate)

  if (!parsed) {
    return null
  }

  const { year, month, day } = parsed
  const destiny = calculateLifePath(birthDate)
  const birthdayNumber = reduceBirthdayNumber(day)
  const talentNumber = reduceToSingleDigit(month + day)
  const presentDigits = getPresentDigits(parsed)
  const missingNumbers = GRID_NUMBERS.filter((number) => !presentDigits.includes(number))

  return {
    destiny,
    birthday: {
      number: birthdayNumber,
      source: day,
      linkedNumbers: [birthdayNumber],
    },
    talent: {
      number: talentNumber,
      parts: { month, day },
      linkedNumbers: [talentNumber],
    },
    missing: {
      numbers: missingNumbers,
      linkedNumbers: missingNumbers,
    },
    dateParts: { year, month, day },
  }
}
