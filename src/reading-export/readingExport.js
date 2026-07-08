import { serializeReading } from '../number-reading/readingContent'

const EXPORT_SCHEMA_VERSION = 1

export function createReadingPayload(readings) {
  return {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    readings,
  }
}

export function createReadingExportPayload(readingTypes, currentReadings) {
  return createReadingPayload({
    ...collectAllReadingContents(readingTypes),
    ...currentReadings,
  })
}

export function exportReadingPayload(payload, filenamePrefix) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function collectAllReadingContents(readingTypes) {
  return readingTypes.reduce((contents, type) => {
    getExportableReadings(type).forEach((reading) => {
      contents[`${type.id}:${reading.number}`] = serializeReading(reading)
    })

    return contents
  }, {})
}

function getExportableReadings(type) {
  if (type.id === 'birthday') {
    return type.detailReadings
  }

  if (type.id === 'connection') {
    return []
  }

  return [...type.readings, ...(type.extraReadings ?? [])]
}
