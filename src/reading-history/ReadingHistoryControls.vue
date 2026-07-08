<script setup>
import { computed, ref, watch } from 'vue'
import { createReadingPayload, exportReadingPayload } from '../reading-export/readingExport'

const props = defineProps({
  history: { type: Array, required: true },
})

const emit = defineEmits(['delete', 'restore'])

const selectedId = ref(props.history.at(-1)?.id ?? '')
const selectedVersion = computed(() => props.history.find((version) => version.id === selectedId.value))

watch(
  () => props.history,
  (history) => {
    selectedId.value = history.at(-1)?.id ?? ''
  },
)

function restoreSelectedVersion() {
  if (selectedVersion.value) {
    emit('restore', selectedVersion.value)
  }
}

function deleteSelectedVersion() {
  if (selectedId.value) {
    emit('delete', selectedId.value)
  }
}

function exportSelectedVersion() {
  if (selectedVersion.value) {
    exportReadingPayload(createReadingPayload(selectedVersion.value.readings), 'lifepathx-reading-history')
  }
}
</script>

<template>
  <div v-if="history.length" class="history-controls" aria-label="历史版本">
    <select v-model="selectedId" class="history-select" aria-label="选择历史版本">
      <option v-for="version in history" :key="version.id" :value="version.id">
        {{ new Date(version.savedAt).toLocaleString() }}
      </option>
    </select>
    <button class="top-action" type="button" @click="restoreSelectedVersion">恢复</button>
    <button class="top-action history-export-action" type="button" @click="exportSelectedVersion">导出历史</button>
    <button class="top-action danger" type="button" @click="deleteSelectedVersion">删除</button>
  </div>
</template>

<style scoped>
.history-controls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.history-select {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-high);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  max-width: 190px;
  min-height: 38px;
  padding: 7px 8px;
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

.top-action:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-contrast);
}

.top-action.danger:hover {
  background: #8f4f4f;
  border-color: #8f4f4f;
  color: #ffffff;
}
</style>
