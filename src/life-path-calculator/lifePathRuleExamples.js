import { reduceToSingleDigit } from './lifePathCalculator'

const EXCELLENCE_NUMBERS = [11, 22, 33]

function formatDatePart(value) {
  return String(value).padStart(2, '0')
}

function formatBirthDate({ year, month, day }) {
  return `${year}-${formatDatePart(month)}-${formatDatePart(day)}`
}

function formatPresentDigits({ year, month, day }) {
  return `${year}${formatDatePart(month)}${formatDatePart(day)}`
}

function sumDigits(value) {
  return String(value)
    .split('')
    .reduce((total, digit) => total + Number(digit), 0)
}

function formatReductionSteps(value, { preserveExcellenceNumbers = false } = {}) {
  let current = Number(value)
  const steps = []

  while (current > 9 && !(preserveExcellenceNumbers && EXCELLENCE_NUMBERS.includes(current))) {
    const expression = String(current).split('').join(' + ')
    const next = sumDigits(current)

    steps.push(`${expression} = ${next}`)
    current = next
  }

  return steps.length ? steps.join('，') : String(current)
}

function formatReductionWithInitial(value, options) {
  return Number(value) > 9 ? formatReductionSteps(value, options) : String(value)
}

function formatReductionAfterSum(sum, options) {
  const reduction = formatReductionSteps(sum, options)

  return reduction === String(sum) ? String(sum) : `${sum}，${reduction}`
}

function formatNumberList(numbers) {
  return numbers.length ? numbers.join('、') : '无'
}

function formatDestinyOutcome(profile) {
  const { number, root } = profile.destiny

  if (number !== root) {
    return `所以命运数是 ${number}，九宫格落在根数 ${root}。`
  }

  return `所以命运数落在 ${number}。`
}

function getDestinyExcellenceNumbers(profile) {
  return [
    ...Object.values(profile.destiny.parts),
    profile.destiny.number,
  ].filter((number, index, numbers) => EXCELLENCE_NUMBERS.includes(number) && numbers.indexOf(number) === index)
}

function formatExcellenceNote(profile) {
  const excellenceNumbers = getDestinyExcellenceNumbers(profile)

  if (!excellenceNumbers.length) {
    return null
  }

  return `本次计算过程中出现 ${formatNumberList(excellenceNumbers)}，会先作为卓越数保留，并在九宫格下方高亮对应解读。`
}

export function createRuleExampleBlock(typeId, profile) {
  if (!profile) {
    return null
  }

  const birthDateLabel = formatBirthDate(profile.dateParts)
  const { year, month, day } = profile.dateParts

  if (typeId === 'destiny') {
    const parts = profile.destiny.parts
    const total = parts.month + parts.day + parts.year
    const excellenceNote = formatExcellenceNote(profile)

    return {
      title: '计算示例',
      lines: [
        `生日 ${birthDateLabel}：月 ${formatReductionWithInitial(month, { preserveExcellenceNumbers: true })}；日 ${formatReductionWithInitial(day, { preserveExcellenceNumbers: true })}；年 ${formatReductionWithInitial(year, { preserveExcellenceNumbers: true })}。`,
        `总和 ${parts.month} + ${parts.day} + ${parts.year} = ${formatReductionAfterSum(total, { preserveExcellenceNumbers: true })}，${formatDestinyOutcome(profile)}`,
        excellenceNote,
      ].filter(Boolean),
    }
  }

  if (typeId === 'birthday') {
    const birthdayNumber = profile.birthday.number
    const singleDigitBirthday = reduceToSingleDigit(day)
    const birthdayReduction = formatReductionWithInitial(day)
    const resultLine =
      singleDigitBirthday === birthdayNumber
        ? `${birthdayReduction}，所以生日数是 ${birthdayNumber}。`
        : `${birthdayReduction}；当前生日数规则将 ${day} 对应到 ${birthdayNumber}，所以生日数是 ${birthdayNumber}。`

    return {
      title: '计算示例',
      lines: [`生日 ${birthDateLabel}：出生日是 ${day}。`, resultLine],
    }
  }

  if (typeId === 'talent') {
    const total = month + day

    return {
      title: '计算示例',
      lines: [
        `生日 ${birthDateLabel}：月 ${month}，日 ${day}。`,
        `${month} + ${day} = ${formatReductionAfterSum(total)}，所以天赋数是 ${profile.talent.number}。`,
      ],
    }
  }

  if (typeId === 'missing') {
    const presentDigits = [...new Set(formatPresentDigits(profile.dateParts).split('').map(Number))].sort(
      (first, second) => first - second,
    )
    const missingNumbers = profile.missing.numbers

    return {
      title: '计算示例',
      lines: [
        `生日 ${birthDateLabel} 写作 ${formatPresentDigits(profile.dateParts)}，出现了 ${formatNumberList(presentDigits)}。`,
        missingNumbers.length
          ? `没有出现 ${formatNumberList(missingNumbers)}，所以这些都是空缺数。`
          : '0-9 都已出现，所以没有空缺数。',
      ],
    }
  }

  return null
}
