export function getConnectionLineId(numbers) {
  return [...numbers].sort((first, second) => first - second).join('-')
}

export function findConnectionLine(connectionLines, numbers) {
  const lineId = getConnectionLineId(numbers)

  return connectionLines.find((line) => line.id === lineId) ?? null
}
