<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  reading: { type: Object, required: true },
  type: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
})

const activeAdviceMode = ref('self')
const adviceModes = [
  { id: 'self', label: '给自己' },
  { id: 'relationship', label: '与对方相处' },
]
const sectionLabels = computed(() => ({
  strengths: '优势',
  challenges: '课题',
  ...props.type.sectionLabels,
}))

const activeAdviceItems = computed(() => {
  if (Array.isArray(props.reading.advice)) {
    return props.reading.advice
  }

  if (typeof props.reading.advice === 'string') {
    return [props.reading.advice]
  }

  return props.reading.advice[activeAdviceMode.value] ?? []
})

watch(
  () => props.reading.number,
  () => {
    activeAdviceMode.value = 'self'
  },
)
</script>

<template>
  <!-- 解读面板：只负责阅读体验。 -->
  <article class="panel">
    <p class="eyebrow">{{ type.eyebrow }} {{ reading.number }}</p>
    <h2>{{ reading.title }}</h2>
    <p class="description">{{ type.description }}</p>
    <p class="summary">{{ reading.summary }}</p>

    <section>
      <h3>{{ sectionLabels.strengths }}</h3>
      <p>{{ reading.strengths.join(' / ') }}</p>
    </section>

    <section>
      <h3>{{ sectionLabels.challenges }}</h3>
      <p>{{ reading.challenges.join(' / ') }}</p>
    </section>

    <section>
      <div class="section-heading">
        <h3>建议</h3>
        <div class="advice-tabs" aria-label="建议视角">
          <button
            v-for="mode in adviceModes"
            :key="mode.id"
            class="advice-tab"
            :class="{ active: activeAdviceMode === mode.id }"
            type="button"
            :disabled="disabled"
            @click="activeAdviceMode = mode.id"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>
      <ol class="advice-list">
        <li v-for="item in activeAdviceItems" :key="item">{{ item }}</li>
      </ol>
    </section>
  </article>
</template>

<style scoped>
.panel {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 14px;
  box-shadow: var(--shadow-surface);
  min-width: 0;
  padding: 22px;
}

.eyebrow,
h2,
h3,
p {
  margin: 0;
}

.eyebrow {
  color: var(--color-text-medium);
  font-size: 13px;
  font-weight: 700;
}

h2 {
  font-size: clamp(36px, 4vw, 56px);
  line-height: 1;
  margin-top: 6px;
}

.summary {
  color: var(--color-text-high);
  font-size: 17px;
  line-height: 1.65;
  margin: 10px 0 16px;
}

.description {
  color: var(--color-text-medium);
  line-height: 1.6;
  margin-top: 8px;
}

section + section {
  margin-top: 12px;
}

.section-heading {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

h3 {
  font-size: 14px;
  margin-bottom: 6px;
}

section p {
  color: var(--color-text-medium);
  line-height: 1.65;
}

.advice-tabs {
  display: inline-flex;
  gap: 6px;
}

.advice-tab {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-medium);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 8px;
}

.advice-tab:hover,
.advice-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-contrast);
}

.advice-tab:disabled {
  background: var(--color-bg-elevated);
  border-color: var(--color-stroke);
  color: var(--color-text-low);
  cursor: not-allowed;
}

.advice-list {
  color: var(--color-text-medium);
  line-height: 1.65;
  margin: 0;
  padding-left: 22px;
}

.advice-list li + li {
  margin-top: 6px;
}

@media (max-width: 900px) {
  .panel {
    padding: 18px;
  }
}
</style>
