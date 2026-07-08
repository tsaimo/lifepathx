export const CURRENT_STORAGE_KEY = 'lifepathx:reading-current:v1'

export function loadCurrentReadings() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export function saveCurrentReadings(readings) {
  localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(readings))
}
