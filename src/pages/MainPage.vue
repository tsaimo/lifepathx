<script setup>
import { computed, ref, watch } from 'vue'
import LifePathCalculator from '../life-path-calculator/LifePathCalculator.vue'
import NumberGrid from '../number-reading/NumberGrid.vue'
import ReadingPanel from '../number-reading/ReadingPanel.vue'
import ReadingTypeTabs from '../number-reading/ReadingTypeTabs.vue'
import { findReadingType, getBirthdayRelatedDays, readingTypes } from '../number-reading/numberReadingTypes'

const selected = ref(1)
const selectedBirthdayDay = ref(1)
const calculated = ref(null)
const activeTypeId = ref('destiny')
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
const connectionPathLabel = computed(() => {
  if (!connectionLineNumbers.value.length) {
    return ''
  }

  return connectionLineNumbers.value.map((numbers) => numbers.join(' → ')).join(' / ')
})
const connectionReading = computed(() => {
  const path = connectionPathLabel.value
  const readings = connectionReadingNumbers.value
    .map((number) => gridReadings.value.find((reading) => reading.number === number))
    .filter(Boolean)
  const title = readings.map((reading) => reading.title).join('、')
  const sourcePath = connectionNumbers.value.join('、')

  return {
    number: path || '无连线',
    title: path ? `${path} 连线` : '未形成连线',
    summary: path
      ? `命运数根数、生日数、天赋数分别落在 ${sourcePath}。实际形成连线的是 ${path}，所以本次只解读${title}这条连线。`
      : `命运数根数、生日数、天赋数分别落在 ${sourcePath || '等待生日'}。三个数字没有形成直线，也没有任意两个数字刚好落在相邻边的中点。`,
    strengths: readings.map((reading) => reading.strengths[0]),
    challenges: readings.map((reading) => reading.challenges[0]),
    advice: {
      self: [
        '先看连线上的第一个数字，它通常代表这条路径最自然的启动方式。',
        '再看最后一个数字，它提示你把能量落地时最容易调用的能力。',
        '如果有多条连线，先分别理解每条线，再看它们共同指向的行动节奏。',
      ],
      relationship: [
        '如果你在看另一个人，先理解这条线同时包含方向、反应和做事方式。',
        '沟通时不要只抓单个数字，连线上的组合会影响对方如何从想法走到行动。',
        '当连线呈现拉扯时，用具体分工和节奏帮助对方把能量接住。',
      ],
    },
    keywords: readings.flatMap((reading) => reading.keywords),
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
</script>

<template>
  <!-- main 页面：生命灵数解读入口。 -->
  <main class="main-page">
    <section class="intro">
      <p>LifePathX</p>
      <h1>生命灵数</h1>
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
      <ReadingPanel :reading="currentReading" :type="activeType" :disabled="!isBirthDateReady" />
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  background: #f6f1e8;
}

.main-page {
  min-height: 100vh;
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(20px, 5vw, 56px);
  color: #20272d;
  font-family: system-ui, sans-serif;
}

.intro {
  margin-bottom: clamp(24px, 4vw, 40px);
}

.intro p,
h1 {
  margin: 0;
}

.intro p {
  color: #9a5b35;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(40px, 10vw, 104px);
  line-height: 0.92;
}

.content {
  display: grid;
  gap: clamp(24px, 4vw, 44px);
  grid-template-columns: minmax(300px, 420px) minmax(0, 1fr);
  align-items: start;
}

.side {
  min-width: 0;
}

.birthday-days {
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-top: 12px;
}

.extra-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.day-button,
.extra-number-button {
  background: #fffdf8;
  border: 1px solid #dfd5c5;
  border-radius: 8px;
  color: #4c5a63;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  min-height: 34px;
}

.extra-number-button {
  min-width: 58px;
  padding: 8px 14px;
}

.day-button:hover,
.day-button.active,
.extra-number-button:hover,
.extra-number-button.active {
  background: #9a5b35;
  border-color: #9a5b35;
  color: #fffaf2;
}

.extra-number-button.linked {
  border-color: #9a5b35;
  box-shadow: inset 0 0 0 2px #9a5b35;
}

.day-button:disabled,
.extra-number-button:disabled {
  background: #f1eadf;
  border-color: #dfd5c5;
  color: #8b948f;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .main-page {
    padding: 18px;
  }
}
</style>
