import { serializeReading } from '../number-reading/readingContent'
import { birthdayRelatedDays, readingTypes as sourceReadingTypes } from '../number-reading/numberReadingTypes'

export function createReadingPayload(currentReadings = {}) {
  return {
    birthdayRelatedDays,
    readingTypes: applyCurrentReadings(sourceReadingTypes, currentReadings),
  }
}

export function createReadingExportPayload(readingTypes, currentReadings) {
  return createReadingPayload(currentReadings)
}

export function exportReadingPayload(payload, filenamePrefix) {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function collectAllReadingContents(readingTypes) {
  return readingTypes.reduce((contents, type) => {
    getReadings(type).forEach((reading) => {
      contents[getReadingKey(type.id, reading)] = serializeReading(reading)
    })

    return contents
  }, {})
}

function applyCurrentReadings(readingTypes, currentReadings) {
  return readingTypes.map((type) => {
    const nextType = {
      ...type,
      readings: applyCurrentReadingsToList(type.id, type.readings, currentReadings),
    }

    if (type.extraReadings) {
      nextType.extraReadings = applyCurrentReadingsToList(type.id, type.extraReadings, currentReadings)
    }

    if (type.detailReadings) {
      nextType.detailReadings = applyCurrentReadingsToList(type.id, type.detailReadings, currentReadings)
    }

    if (type.connectionLines) {
      nextType.connectionLines = applyCurrentReadingsToList(type.id, type.connectionLines, currentReadings)
    }

    return nextType
  })
}

function applyCurrentReadingsToList(typeId, readings = [], currentReadings) {
  return readings.map((reading) => ({
    ...reading,
    ...(currentReadings[getReadingKey(typeId, reading)] ?? {}),
  }))
}

function getReadings(type) {
  if (type.id === 'connection') {
    return type.connectionLines ?? []
  }

  return [...(type.readings ?? []), ...(type.extraReadings ?? []), ...(type.detailReadings ?? [])]
}

function getReadingKey(typeId, reading) {
  return `${typeId}:${reading.id ?? reading.number}`
}
