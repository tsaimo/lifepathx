export const HISTORY_STORAGE_KEY = 'lifepathx:reading-history:v2'

export function loadReadingHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveReadingHistory(history) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
}
