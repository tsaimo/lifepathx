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
const activeType = computed(() => findReadingType(activeTypeId.value))
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
  if (activeTypeId.value === 'birthday') {
    return activeType.value.detailReadings.find((reading) => reading.number === selectedBirthdayDay.value)
  }

  return activeType.value.readings.find((reading) => reading.number === selected.value)
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

  return calculated.value.missing.linkedNumbers
})

function getCalculatedNumber(typeId) {
  if (!calculated.value) {
    return 1
  }

  if (typeId === 'destiny') {
    return calculated.value.destiny.root
  }

  if (typeId === 'birthday') {
    return calculated.value.birthday.number
  }

  if (typeId === 'talent') {
    return calculated.value.talent.number
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
        <ReadingTypeTabs :types="readingTypes" :active-type-id="activeTypeId" @select="selectType" />
        <NumberGrid
          :readings="activeType.readings"
          :selected="selected"
          :linked-numbers="linkedNumbers"
          @select="selectNumber"
        />
        <div v-if="activeTypeId === 'birthday'" class="birthday-days" aria-label="出生日解读">
          <button
            v-for="reading in visibleBirthdayDayReadings"
            :key="reading.number"
            class="day-button"
            :class="{ active: selectedBirthdayDay === reading.number }"
            type="button"
            @click="selectBirthdayDay(reading.number)"
          >
            {{ reading.number }}
          </button>
        </div>
      </div>
      <ReadingPanel :reading="currentReading" :type="activeType" />
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

.day-button {
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

.day-button:hover,
.day-button.active {
  background: #9a5b35;
  border-color: #9a5b35;
  color: #fffaf2;
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
