<script setup>
import { computed, ref, watch } from 'vue'
import LifePathCalculator from '../life-path-calculator/LifePathCalculator.vue'
import NumberGrid from '../number-reading/NumberGrid.vue'
import ReadingPanel from '../number-reading/ReadingPanel.vue'
import ReadingTypeTabs from '../number-reading/ReadingTypeTabs.vue'
import { findConnectionLine } from '../number-reading/connectionLineReadings'
import { findReadingType, getBirthdayRelatedDays, readingTypes } from '../number-reading/numberReadingTypes'
import { loadCurrentReadings, saveCurrentReadings } from '../number-reading/readingCurrentStorage'
import ReadingExportButton from '../reading-export/ReadingExportButton.vue'
import { collectAllReadingContents } from '../reading-export/readingExport'
import ReadingHistoryControls from '../reading-history/ReadingHistoryControls.vue'
import { loadReadingHistory, saveReadingHistory } from '../reading-history/readingHistoryStorage'
import ReadingImportDialog from '../reading-import/ReadingImportDialog.vue'

const selected = ref(1)
const selectedBirthdayDay = ref(1)
const calculated = ref(null)
const activeTypeId = ref('destiny')
const isDarkTheme = ref(false)
const currentReadings = ref(loadCurrentReadings())
const readingHistory = ref(loadReadingHistory())
const isImportDialogOpen = ref(false)
const isBirthDateReady = computed(() => Boolean(calculated.value))
const activeType = computed(() => findReadingType(activeTypeId.value))
const activeReadings = computed(() => [...activeType.value.readings, ...(activeType.value.extraReadings ?? [])])
const visibleExtraReadings = computed(() => activeType.value.extraReadings ?? [])
const gridReadings = computed(() => readingTypes[0].readings)
const gridPositions = {
  1: { x: 0, y: 0 },
  2: { x: 1, y: 0 },
  3: { x: 2, y: 0 },
  4: { x: 0, y: 1 },
  5: { x: 1, y: 1 },
  6: { x: 2, y: 1 },
  7: { x: 0, y: 2 },
  8: { x: 1, y: 2 },
  9: { x: 2, y: 2 },
}
const edgeByNumber = {
  2: 'top',
  4: 'left',
  6: 'right',
  8: 'bottom',
}
const adjacentEdges = {
  top: ['left', 'right'],
  right: ['top', 'bottom'],
  bottom: ['left', 'right'],
  left: ['top', 'bottom'],
}

function getLineCrossValue(number, start, end) {
  const point = gridPositions[number]
  const startPoint = gridPositions[start]
  const endPoint = gridPositions[end]

  if (!point || !startPoint || !endPoint) {
    return null
  }

  return (
    (point.x - startPoint.x) * (endPoint.y - startPoint.y) -
    (point.y - startPoint.y) * (endPoint.x - startPoint.x)
  )
}

function areCollinear(numbers) {
  if (numbers.length < 3) {
    return true
  }

  const [start, middle, end] = numbers

  return getLineCrossValue(middle, start, end) === 0
}

function sortLineNumbers(numbers) {
  const [start, end] = [numbers[0], numbers[numbers.length - 1]]
  const startPoint = gridPositions[start]
  const endPoint = gridPositions[end]
  const axis = Math.abs(endPoint.x - startPoint.x) >= Math.abs(endPoint.y - startPoint.y) ? 'x' : 'y'
  const direction = endPoint[axis] >= startPoint[axis] ? 1 : -1

  return [...numbers].sort((first, second) => {
    const firstPoint = gridPositions[first]
    const secondPoint = gridPositions[second]

    return (firstPoint[axis] - secondPoint[axis]) * direction
  })
}

function areAdjacentEdgeMidpoints(first, second) {
  const firstEdge = edgeByNumber[first]
  const secondEdge = edgeByNumber[second]

  return Boolean(firstEdge && secondEdge && adjacentEdges[firstEdge].includes(secondEdge))
}

function getPairs(numbers) {
  return numbers.flatMap((first, firstIndex) => numbers.slice(firstIndex + 1).map((second) => [first, second]))
}

const connectionNumbers = computed(() => {
  if (!calculated.value) {
    return []
  }

  return [calculated.value.destiny.root, calculated.value.birthday.number, calculated.value.talent.number]
})
const uniqueConnectionNumbers = computed(() =>
  connectionNumbers.value.filter((number, index, numbers) => numbers.indexOf(number) === index),
)
const connectionLineNumbers = computed(() => {
  if (uniqueConnectionNumbers.value.length < 2) {
    return []
  }

  if (uniqueConnectionNumbers.value.length === 3 && areCollinear(uniqueConnectionNumbers.value)) {
    return [sortLineNumbers(uniqueConnectionNumbers.value)]
  }

  return getPairs(uniqueConnectionNumbers.value).filter(([first, second]) => areAdjacentEdgeMidpoints(first, second))
})
const connectionLineSegments = computed(() => {
  if (activeTypeId.value !== 'connection') {
    return []
  }

  return connectionLineNumbers.value.map((lineNumbers) =>
    lineNumbers.map((number) => {
      const position = gridPositions[number]

      return `${position.x + 0.5},${position.y + 0.5}`
    }),
  )
})
const connectionReadingNumbers = computed(() =>
  connectionLineNumbers.value.flat().filter((number, index, numbers) => numbers.indexOf(number) === index),
)
const connectionReading = computed(() => {
  const sourcePath = connectionNumbers.value.join('、')
  const lines = connectionLineNumbers.value
    .map((lineNumbers) => findConnectionLine(activeType.value.connectionLines ?? [], lineNumbers))
    .filter(Boolean)

  if (!lines.length) {
    return {
      number: '无连线',
      title: '未形成连线',
      summary: `命运数根数、生日数、天赋数分别落在 ${sourcePath || '等待生日'}。三个数字没有形成直线，也没有任意两个数字刚好落在相邻边的中点。`,
      strengths: ['先分别阅读三个核心数字', '观察数字之间没有形成稳定路径', '适合从单点能力开始整理节奏'],
      challenges: ['容易各自发力而不成线', '需要人为建立优先级', '行动顺序需要额外确认'],
      advice: {
        self: [
          '先分别确认命运数、生日数和天赋数各自代表的需求。',
          '把近期最重要的一件事写成明确顺序，不急着要求三股力量同时启动。',
          '当你感觉方向分散时，用一个小目标把注意力收回来。',
        ],
        relationship: [
          '如果你在看另一个人，先不要强行解释成某条连线。',
          '沟通时分别看对方的方向、反应和做事方式，避免把不同层面的需求混在一起。',
          '需要合作时，先约定优先级和分工，再讨论长期节奏。',
        ],
      },
      keywords: ['无连线', '分散', '整理'],
    }
  }

  if (lines.length === 1) {
    const line = lines[0]

    return {
      number: line.id,
      title: line.title,
      summary: `命运数根数、生日数、天赋数分别落在 ${sourcePath}。本次成立的是 ${line.label} ${line.name}：${line.summary}`,
      strengths: line.strengths,
      challenges: line.challenges,
      advice: line.advice,
      keywords: line.keywords,
    }
  }

  return {
    number: lines.map((line) => line.id).join('/'),
    title: lines.map((line) => line.title).join(' / '),
    summary: `命运数根数、生日数、天赋数分别落在 ${sourcePath}。本次同时成立 ${lines.map((line) => `${line.label} ${line.name}`).join('、')}，请分别阅读每条线的独立主题，再看它们如何共同影响节奏。`,
    strengths: lines.flatMap((line) => line.strengths.slice(0, 2)),
    challenges: lines.flatMap((line) => line.challenges.slice(0, 2)),
    advice: {
      self: lines.flatMap((line) => line.advice.self.slice(0, 2)),
      relationship: lines.flatMap((line) => line.advice.relationship.slice(0, 2)),
    },
    keywords: lines.flatMap((line) => line.keywords),
  }
})
const visibleBirthdayDayReadings = computed(() => {
  if (activeTypeId.value !== 'birthday') {
    return []
  }

  const relatedDays = getBirthdayRelatedDays(selected.value)
  const readings = activeType.value.detailReadings.filter((reading) => relatedDays.includes(reading.number))
  const currentReading = activeType.value.detailReadings.find((reading) => reading.number === selectedBirthdayDay.value)

  if (currentReading && currentReading.linkedNumber === selected.value && !readings.includes(currentReading)) {
    return [...readings, currentReading].sort((first, second) => first.number - second.number)
  }

  return readings
})
const currentReading = computed(() => {
  if (activeTypeId.value === 'connection') {
    return connectionReading.value
  }

  if (activeTypeId.value === 'birthday') {
    return activeType.value.detailReadings.find((reading) => reading.number === selectedBirthdayDay.value)
  }

  return activeReadings.value.find((reading) => reading.number === selected.value)
})

const linkedNumbers = computed(() => {
  if (!calculated.value) {
    return []
  }

  if (activeTypeId.value === 'destiny') {
    return [calculated.value.destiny.root]
  }

  if (activeTypeId.value === 'birthday') {
    return calculated.value.birthday.linkedNumbers
  }

  if (activeTypeId.value === 'talent') {
    return calculated.value.talent.linkedNumbers
  }

  if (activeTypeId.value === 'connection') {
    return connectionReadingNumbers.value
  }

  return calculated.value.missing.linkedNumbers
})

function getCalculatedNumber(typeId) {
  if (!calculated.value) {
    return 1
  }

  if (typeId === 'destiny') {
    const destinyNumber = calculated.value.destiny.number

    return activeReadings.value.some((reading) => reading.number === destinyNumber) ? destinyNumber : calculated.value.destiny.root
  }

  if (typeId === 'birthday') {
    return calculated.value.birthday.number
  }

  if (typeId === 'talent') {
    return calculated.value.talent.number
  }

  if (typeId === 'connection') {
    return connectionReadingNumbers.value[0] ?? connectionNumbers.value[0] ?? selected.value
  }

  return calculated.value.missing.numbers[0] ?? selected.value
}

function syncBirthdayDayFromCalculation(typeId) {
  if (typeId === 'birthday' && calculated.value) {
    selectedBirthdayDay.value = calculated.value.dateParts.day
  }
}

function applyCalculation(result) {
  calculated.value = result

  if (result) {
    selectedBirthdayDay.value = result.dateParts.day
    selected.value = getCalculatedNumber(activeTypeId.value)
  }
}

function selectType(typeId) {
  syncBirthdayDayFromCalculation(typeId)
  activeTypeId.value = typeId
  selected.value = getCalculatedNumber(typeId)
}

watch(activeTypeId, (typeId) => {
  syncBirthdayDayFromCalculation(typeId)
  selected.value = getCalculatedNumber(typeId)
})

function selectBirthdayDay(day) {
  selectedBirthdayDay.value = day
  const reading = activeType.value.detailReadings.find((item) => item.number === day)

  if (reading) {
    selected.value = reading.linkedNumber
  }
}

function selectNumber(reading) {
  selected.value = reading.number

  if (activeTypeId.value === 'birthday') {
    const nextDayReading = activeType.value.detailReadings.find((item) =>
      getBirthdayRelatedDays(reading.number).includes(item.number),
    )

    if (nextDayReading) {
      selectedBirthdayDay.value = nextDayReading.number
    }
  }
}

function persistCurrentReadings(nextCurrentReadings) {
  currentReadings.value = nextCurrentReadings

  try {
    saveCurrentReadings(nextCurrentReadings)
  } catch {
    // Keep the in-memory edited readings usable if browser storage is unavailable.
  }
}

function persistReadingHistory(nextHistory) {
  readingHistory.value = nextHistory

  try {
    saveReadingHistory(nextHistory)
  } catch {
    // Keep the in-memory reading history usable if browser storage is unavailable.
  }
}

function createHistoryVersion() {
  const snapshot = {
    ...collectAllReadingContents(readingTypes),
    ...currentReadings.value,
  }
  const nextVersion = {
    id: `${Date.now()}-${readingHistory.value.length + 1}`,
    savedAt: new Date().toISOString(),
    readings: snapshot,
  }

  persistReadingHistory([...readingHistory.value, nextVersion])
}

function restoreHistoryVersion(version) {
  persistCurrentReadings(version.readings)
}

function deleteHistoryVersion(versionId) {
  persistReadingHistory(readingHistory.value.filter((version) => version.id !== versionId))
}

function openImportDialog() {
  isImportDialogOpen.value = true
}

function closeImportDialog() {
  isImportDialogOpen.value = false
}

</script>

<template>
  <!-- main 页面：生命灵数解读入口。 -->
  <main class="main-page" :class="{ dark: isDarkTheme }">
    <section class="intro">
      <div>
        <p>LifePathX</p>
        <h1>生命灵数</h1>
      </div>
      <div class="global-actions">
        <div class="history-action-slot">
          <ReadingHistoryControls
            :history="readingHistory"
            @restore="restoreHistoryVersion"
            @delete="deleteHistoryVersion"
          />
        </div>
        <div class="primary-actions">
          <ReadingExportButton :reading-types="readingTypes" :current-readings="currentReadings" />
          <button class="top-action import-action" type="button" @click="openImportDialog">导入 JSON</button>
          <button class="top-action theme-toggle" type="button" @click="isDarkTheme = !isDarkTheme">
            {{ isDarkTheme ? '浅色' : '深色' }}
          </button>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="side">
        <LifePathCalculator :active-type="activeType" @calculated="applyCalculation" />
        <ReadingTypeTabs
          :types="readingTypes"
          :active-type-id="activeTypeId"
          :disabled="!isBirthDateReady"
          @select="selectType"
        />
        <NumberGrid
          :readings="activeType.readings"
          :selected="selected"
          :linked-numbers="linkedNumbers"
          :line-segments="connectionLineSegments"
          :disabled="!isBirthDateReady"
          @select="selectNumber"
        />
        <div v-if="visibleExtraReadings.length" class="extra-numbers" aria-label="额外数字解读">
          <button
            v-for="reading in visibleExtraReadings"
            :key="reading.number"
            class="extra-number-button"
            :class="{
              active: selected === reading.number,
              linked: linkedNumbers.includes(reading.number) && selected !== reading.number,
            }"
            type="button"
            :disabled="!isBirthDateReady"
            @click="selectNumber(reading)"
          >
            {{ reading.number }}
          </button>
        </div>
        <div v-if="activeTypeId === 'birthday'" class="birthday-days" aria-label="出生日解读">
          <button
            v-for="reading in visibleBirthdayDayReadings"
            :key="reading.number"
            class="day-button"
            :class="{ active: selectedBirthdayDay === reading.number }"
            type="button"
            :disabled="!isBirthDateReady"
            @click="selectBirthdayDay(reading.number)"
          >
            {{ reading.number }}
          </button>
        </div>
      </div>
      <ReadingPanel
        :reading="currentReading"
        :type="activeType"
        :disabled="!isBirthDateReady"
        :current-readings="currentReadings"
        @create-history-version="createHistoryVersion"
        @update-current-readings="persistCurrentReadings"
      />
    </section>

    <ReadingImportDialog
      :open="isImportDialogOpen"
      :reading-types="readingTypes"
      @close="closeImportDialog"
      @imported="persistCurrentReadings"
    />
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  background: #f5f7fa;
}

.main-page {
  --color-bg-base: #f5f7fa;
  --color-bg-surface: #ffffff;
  --color-bg-elevated: #f7f8fa;
  --color-text-high: #1a1a1a;
  --color-text-medium: #6b6b6b;
  --color-text-low: #707070;
  --color-stroke: rgba(26, 26, 26, 0.1);
  --color-primary: #4f6f8f;
  --color-primary-hover: #3a536b;
  --color-accent: #4f6f8f;
  --color-primary-contrast: #ffffff;
  --shadow-surface: 0 12px 30px rgba(79, 111, 143, 0.08);

  min-height: 100svh;
  max-width: none;
  margin: 0 auto;
  padding: 24px;
  background: var(--color-bg-base);
  color: var(--color-text-high);
  font-family: system-ui, sans-serif;
}

.intro {
  align-items: end;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 16px;
  max-width: 1360px;
  margin-left: auto;
  margin-right: auto;
}

.intro p,
h1 {
  margin: 0;
}

.intro p {
  color: var(--color-text-medium);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(40px, 5vw, 72px);
  line-height: 1;
}

.global-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
  min-width: min(760px, 100%);
}

.history-action-slot {
  display: flex;
  justify-content: flex-start;
}

.primary-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.top-action {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-high);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  min-height: 38px;
  padding: 7px 12px;
}

.top-action:hover,
.top-action.primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-contrast);
}

.content {
  background: var(--color-bg-base);
  display: grid;
  gap: 24px;
  grid-template-columns: 430px minmax(0, 1fr);
  align-items: start;
  max-width: 1360px;
  min-height: calc(100svh - 136px);
  margin: 0 auto;
}

.side {
  min-width: 0;
}

.birthday-days {
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-top: 10px;
}

.extra-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.day-button,
.extra-number-button {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-medium);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  min-height: 32px;
}

.extra-number-button {
  min-width: 58px;
  padding: 7px 14px;
}

.day-button:hover,
.day-button.active,
.extra-number-button:hover,
.extra-number-button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-contrast);
}

.extra-number-button.linked {
  border-color: var(--color-accent);
  box-shadow: inset 0 0 0 2px var(--color-accent);
}

.day-button:disabled,
.extra-number-button:disabled {
  background: var(--color-bg-elevated);
  border-color: var(--color-stroke);
  color: var(--color-text-low);
  cursor: not-allowed;
}

.dark {
  --color-bg-base: #121212;
  --color-bg-surface: #1e1e1e;
  --color-bg-elevated: #242424;
  --color-text-high: #e8e8e8;
  --color-text-medium: #a0a0a0;
  --color-text-low: #8a8a8a;
  --color-stroke: rgba(255, 255, 255, 0.2);
  --color-primary: #4f6f8f;
  --color-primary-hover: #3a536b;
  --color-accent: #54708c;
  --color-primary-contrast: #ffffff;
  --shadow-surface: none;
}

@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
    min-height: 0;
  }
}

@media (max-width: 520px) {
  .main-page {
    padding: 18px;
  }
}
</style>
