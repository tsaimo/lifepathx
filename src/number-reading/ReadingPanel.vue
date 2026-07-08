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
  border-left: 1px solid #dfd5c5;
  padding-left: clamp(20px, 3vw, 32px);
  min-width: 0;
}

.eyebrow,
h2,
h3,
p {
  margin: 0;
}

.eyebrow {
  color: #9a5b35;
  font-size: 13px;
  font-weight: 700;
}

h2 {
  font-size: clamp(34px, 7vw, 72px);
  line-height: 0.95;
  margin-top: 8px;
}

.summary {
  color: #41505b;
  font-size: clamp(16px, 2vw, 18px);
  line-height: 1.75;
  margin: 12px 0 clamp(18px, 3vw, 24px);
}

.description {
  color: #65727b;
  line-height: 1.6;
  margin-top: 10px;
}

section + section {
  margin-top: 14px;
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
  color: #4c5a63;
  line-height: 1.65;
}

.advice-tabs {
  display: inline-flex;
  gap: 6px;
}

.advice-tab {
  background: #fffdf8;
  border: 1px solid #dfd5c5;
  border-radius: 8px;
  color: #4c5a63;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 8px;
}

.advice-tab:hover,
.advice-tab.active {
  background: #20272d;
  border-color: #20272d;
  color: #fffaf2;
}

.advice-tab:disabled {
  background: #f1eadf;
  border-color: #dfd5c5;
  color: #8b948f;
  cursor: not-allowed;
}

.advice-list {
  color: #4c5a63;
  line-height: 1.65;
  margin: 0;
  padding-left: 22px;
}

.advice-list li + li {
  margin-top: 6px;
}

@media (max-width: 900px) {
  .panel {
    border-left: 0;
    border-top: 1px solid #dfd5c5;
    padding: 24px 0 0;
  }
}
</style>
