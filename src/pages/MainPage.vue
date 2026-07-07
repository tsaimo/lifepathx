<script setup>
import { computed, ref } from 'vue'
import LifePathCalculator from '../life-path-calculator/LifePathCalculator.vue'
import NumberGrid from '../number-reading/NumberGrid.vue'
import ReadingPanel from '../number-reading/ReadingPanel.vue'
import readings from '../number-reading/lifePathReadings.json'

const selected = ref(1)
const calculated = ref(null)
const currentReading = computed(() => readings.find((reading) => reading.number === selected.value))

function applyCalculation(result) {
  calculated.value = result

  if (result) {
    selected.value = result.number
  }
}
</script>

<template>
  <!-- main 页面：生命灵数解读入口。 -->
  <main class="main-page">
    <section class="intro">
      <p>LifePathX</p>
      <h1>生命灵数解读</h1>
    </section>

    <section class="content">
      <div class="side">
        <LifePathCalculator @calculated="applyCalculation" />
        <NumberGrid
          :selected="selected"
          :linked-numbers="calculated?.linkedNumbers"
          @select="selected = $event.number"
        />
      </div>
      <ReadingPanel :reading="currentReading" />
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
