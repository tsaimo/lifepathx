<script setup>
import { computed, ref, watch } from 'vue'
import { normalizeAdvice } from './readingContent'
import {
  loadCurrentReadings,
  saveCurrentReadings,
} from './readingCurrentStorage'

const props = defineProps({
  reading: { type: Object, required: true },
  type: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  currentReadings: { type: Object, default: null },
})

const emit = defineEmits(['create-history-version', 'update-current-readings'])

const activeAdviceMode = ref('self')
const adviceModes = [
  { id: 'self', label: '给自己' },
  { id: 'relationship', label: '与对方相处' },
]
const isEditing = ref(false)
const currentByKey = ref(props.currentReadings ?? loadCurrentReadings())
const draft = ref(createEditableContent(props.reading))
const sectionLabels = computed(() => ({
  strengths: '优势',
  challenges: '课题',
  ...props.type.sectionLabels,
}))
const readingKey = computed(() => `${props.type.id}:${props.reading.number}`)
const displayedReading = computed(() => ({
  ...props.reading,
  ...(currentByKey.value[readingKey.value] ?? {}),
}))

const activeAdviceItems = computed(() => {
  if (Array.isArray(displayedReading.value.advice)) {
    return displayedReading.value.advice
  }

  if (typeof displayedReading.value.advice === 'string') {
    return [displayedReading.value.advice]
  }

  return displayedReading.value.advice[activeAdviceMode.value] ?? []
})

watch(
  readingKey,
  () => {
    activeAdviceMode.value = 'self'
    isEditing.value = false
    draft.value = createEditableContent(displayedReading.value)
  },
)

watch(
  () => props.currentReadings,
  (nextCurrentReadings) => {
    if (nextCurrentReadings) {
      currentByKey.value = nextCurrentReadings
      draft.value = createEditableContent(displayedReading.value)
    }
  },
)

function persistCurrentReadings(nextCurrentReadings) {
  currentByKey.value = nextCurrentReadings
  emit('update-current-readings', nextCurrentReadings)

  try {
    saveCurrentReadings(nextCurrentReadings)
  } catch {
    // Keep the in-memory edited reading usable if browser storage is unavailable.
  }
}

function createEditableContent(reading) {
  const advice = normalizeAdvice(reading.advice)

  return {
    title: reading.title,
    summary: reading.summary,
    strengths: reading.strengths.join('\n'),
    challenges: reading.challenges.join('\n'),
    adviceSelf: advice.self.join('\n'),
    adviceRelationship: advice.relationship.join('\n'),
  }
}

function splitLines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function serializeDraft() {
  return {
    title: draft.value.title.trim(),
    summary: draft.value.summary.trim(),
    strengths: splitLines(draft.value.strengths),
    challenges: splitLines(draft.value.challenges),
    advice: {
      self: splitLines(draft.value.adviceSelf),
      relationship: splitLines(draft.value.adviceRelationship),
    },
  }
}

function beginEdit() {
  draft.value = createEditableContent(displayedReading.value)
  isEditing.value = true
}

function cancelEdit() {
  draft.value = createEditableContent(displayedReading.value)
  isEditing.value = false
}

function saveDraft() {
  const key = readingKey.value

  emit('create-history-version')
  persistCurrentReadings({
    ...currentByKey.value,
    [key]: serializeDraft(),
  })
  isEditing.value = false
}

</script>

<template>
  <!-- 解读面板：只负责阅读体验。 -->
  <article class="panel">
    <div class="panel-heading">
      <p class="eyebrow">{{ type.eyebrow }} {{ reading.number }}</p>
      <button class="panel-action" type="button" :disabled="disabled || isEditing" @click="beginEdit">编辑</button>
    </div>
    <h2>{{ displayedReading.title }}</h2>
    <p class="description">{{ type.description }}</p>
    <p class="summary">{{ displayedReading.summary }}</p>

    <section>
      <h3>{{ sectionLabels.strengths }}</h3>
      <p>{{ displayedReading.strengths.join(' / ') }}</p>
    </section>

    <section>
      <h3>{{ sectionLabels.challenges }}</h3>
      <p>{{ displayedReading.challenges.join(' / ') }}</p>
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

    <div
      v-if="isEditing"
      class="editor-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reading-editor-title"
      @click.self="cancelEdit"
    >
      <section class="editor-dialog">
        <div class="editor-heading">
          <div>
            <p class="eyebrow">{{ type.eyebrow }} {{ reading.number }}</p>
            <h2 id="reading-editor-title">编辑解读内容</h2>
          </div>
        </div>

        <div class="editor">
          <div class="compare-panel original">
            <h3>原内容</h3>
            <div class="readonly-field">
              <b>标题</b>
              <p>{{ reading.title }}</p>
            </div>
            <div class="readonly-field">
              <b>摘要</b>
              <p>{{ reading.summary }}</p>
            </div>
            <div class="readonly-field">
              <b>{{ sectionLabels.strengths }}，每行一条</b>
              <p v-for="item in reading.strengths" :key="item">{{ item }}</p>
            </div>
            <div class="readonly-field">
              <b>{{ sectionLabels.challenges }}，每行一条</b>
              <p v-for="item in reading.challenges" :key="item">{{ item }}</p>
            </div>
            <div class="readonly-field">
              <b>给自己的建议，每行一条</b>
              <p v-for="item in normalizeAdvice(reading.advice).self" :key="item">{{ item }}</p>
            </div>
            <div class="readonly-field">
              <b>与对方相处的建议，每行一条</b>
              <p v-for="item in normalizeAdvice(reading.advice).relationship" :key="item">{{ item }}</p>
            </div>
          </div>

          <div class="compare-panel draft-panel">
            <h3>当前编辑</h3>
            <label>
              标题
              <input v-model="draft.title" type="text" />
            </label>
            <label>
              摘要
              <textarea v-model="draft.summary" rows="5" />
            </label>
            <label>
              {{ sectionLabels.strengths }}，每行一条
              <textarea v-model="draft.strengths" rows="4" />
            </label>
            <label>
              {{ sectionLabels.challenges }}，每行一条
              <textarea v-model="draft.challenges" rows="4" />
            </label>
            <label>
              给自己的建议，每行一条
              <textarea v-model="draft.adviceSelf" rows="6" />
            </label>
            <label>
              与对方相处的建议，每行一条
              <textarea v-model="draft.adviceRelationship" rows="6" />
            </label>
            <div class="form-actions">
              <button class="panel-action primary" type="button" @click="saveDraft">保存</button>
              <button class="panel-action" type="button" @click="cancelEdit">取消</button>
            </div>
          </div>
        </div>
      </section>
    </div>
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

.panel-heading,
.editor-heading,
.edit-actions,
.form-actions {
  align-items: center;
  display: flex;
  gap: 8px;
}

.panel-heading {
  justify-content: space-between;
}

.editor-heading {
  border-bottom: 1px solid var(--color-stroke);
  justify-content: space-between;
  padding: 18px 22px;
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

.panel-action {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-high);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  min-height: 32px;
  padding: 6px 10px;
}

.panel-action.primary,
.panel-action:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-contrast);
}

.panel-action.danger:hover {
  background: #8f4f4f;
  border-color: #8f4f4f;
  color: #ffffff;
}

.panel-action:disabled {
  background: var(--color-bg-elevated);
  color: var(--color-text-low);
  cursor: not-allowed;
}

.editor {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-height: 0;
  overflow: auto;
  padding: 18px 22px 22px;
}

.editor-overlay {
  align-items: center;
  background: rgba(18, 18, 18, 0.72);
  display: grid;
  inset: 0;
  justify-items: center;
  padding: 24px;
  position: fixed;
  z-index: 30;
}

.editor-dialog {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 16px;
  box-shadow: var(--shadow-surface);
  color: var(--color-text-high);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  max-height: min(920px, 92vh);
  max-width: 1280px;
  overflow: hidden;
  width: min(1280px, 96vw);
}

.compare-panel {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-stroke);
  border-radius: 14px;
  display: grid;
  gap: 8px;
  padding: 14px;
}

.original {
  align-content: start;
}

.readonly-field {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  display: grid;
  gap: 6px;
  padding: 8px 10px;
}

.readonly-field b {
  color: var(--color-text-medium);
  font-size: 13px;
}

.draft-panel {
  align-content: start;
}

.form-actions {
  border-top: 1px solid var(--color-stroke);
  justify-content: end;
  margin-top: 4px;
  padding-top: 12px;
}

.compare-panel b {
  color: var(--color-text-high);
}

label {
  color: var(--color-text-medium);
  display: grid;
  font-size: 13px;
  font-weight: 800;
  gap: 6px;
}

input,
textarea {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-high);
  font: inherit;
  line-height: 1.5;
  padding: 8px 10px;
  resize: vertical;
  width: 100%;
}

small {
  color: var(--color-text-medium);
  display: block;
  margin-top: 3px;
}

@media (max-width: 900px) {
  .panel {
    padding: 18px;
  }

  .editor {
    grid-template-columns: 1fr;
  }

  .editor-heading {
    align-items: start;
    flex-direction: column;
  }

  .editor-overlay {
    padding: 12px;
  }
}
</style>
