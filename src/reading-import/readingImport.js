import { collectAllReadingContents } from '../reading-export/readingExport'

const MAX_IMPORT_FILE_SIZE = 256 * 1024

export function validateImportFile(file) {
  const errors = []

  if (!file) {
    return ['请先选择要导入的 JSON 文件。']
  }

  if (file.size > MAX_IMPORT_FILE_SIZE) {
    errors.push('文件大小超过 256KB，请导入由本页面导出的 JSON 文件。')
  }

  if (!file.name.toLowerCase().endsWith('.json')) {
    errors.push('文件格式不正确：请选择 .json 文件。')
  }

  return errors
}

export function validateImportPayload(payload, readingTypes) {
  const errors = []
  const readings = {}
  const expectedReadings = collectAllReadingContents(readingTypes)

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { errors: ['JSON 根节点必须是对象。'], readings }
  }

  if (!payload.birthdayRelatedDays || typeof payload.birthdayRelatedDays !== 'object' || Array.isArray(payload.birthdayRelatedDays)) {
    errors.push('birthdayRelatedDays 必须是对象。')
  }

  if (!Array.isArray(payload.readingTypes)) {
    errors.push('readingTypes 必须是数组。')
    return { errors, readings }
  }

  const importedReadings = collectAllReadingContents(payload.readingTypes)

  Object.keys(expectedReadings).forEach((key) => {
    if (!Object.hasOwn(importedReadings, key)) {
      errors.push(`readingTypes 缺少 ${key}。`)
    }
  })

  Object.entries(importedReadings).forEach(([key, content]) => {
    if (!key.includes(':')) {
      errors.push(`readingTypes 中 ${key} 的键名必须包含类型和数字，例如 destiny:1。`)
    }

    const contentErrors = validateReadingContent(content, `readingTypes.${key}`)

    if (contentErrors.length) {
      errors.push(...contentErrors)
      return
    }

    readings[key] = {
      title: content.title.trim(),
      summary: content.summary.trim(),
      strengths: content.strengths.map((item) => item.trim()),
      challenges: content.challenges.map((item) => item.trim()),
      advice: {
        self: content.advice.self.map((item) => item.trim()),
        relationship: content.advice.relationship.map((item) => item.trim()),
      },
    }
  })

  return { errors, readings }
}

function validateReadingContent(content, path) {
  const errors = []

  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return [`${path} 必须是对象。`]
  }

  if (!isNonEmptyString(content.title)) {
    errors.push(`${path}.title 必须是非空字符串。`)
  }

  if (!isNonEmptyString(content.summary)) {
    errors.push(`${path}.summary 必须是非空字符串。`)
  }

  if (!isStringList(content.strengths)) {
    errors.push(`${path}.strengths 必须是非空字符串数组。`)
  }

  if (!isStringList(content.challenges)) {
    errors.push(`${path}.challenges 必须是非空字符串数组。`)
  }

  if (!content.advice || typeof content.advice !== 'object' || Array.isArray(content.advice)) {
    errors.push(`${path}.advice 必须是对象。`)
    return errors
  }

  if (!isStringList(content.advice.self)) {
    errors.push(`${path}.advice.self 必须是非空字符串数组。`)
  }

  if (!isStringList(content.advice.relationship)) {
    errors.push(`${path}.advice.relationship 必须是非空字符串数组。`)
  }

  return errors
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringList(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)
}
