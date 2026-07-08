import numberReadings from '../data/numberReadings.json'

export const birthdayRelatedDays = numberReadings.birthdayRelatedDays
export const readingTypes = numberReadings.readingTypes

export function findReadingType(typeId) {
  return readingTypes.find((type) => type.id === typeId) ?? readingTypes[0]
}

export function getBirthdayRelatedDays(number) {
  return birthdayRelatedDays[number] ?? []
}
