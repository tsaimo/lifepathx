export function serializeReading(reading) {
  const advice = normalizeAdvice(reading.advice)

  return {
    title: reading.title,
    summary: reading.summary,
    strengths: [...reading.strengths],
    challenges: [...reading.challenges],
    advice: {
      self: [...advice.self],
      relationship: [...advice.relationship],
    },
  }
}

export function normalizeAdvice(advice) {
  if (Array.isArray(advice)) {
    return { self: advice, relationship: [] }
  }

  if (typeof advice === 'string') {
    return { self: [advice], relationship: [] }
  }

  return {
    self: advice.self ?? [],
    relationship: advice.relationship ?? [],
  }
}
