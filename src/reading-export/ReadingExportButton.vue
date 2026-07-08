<script setup>
import { createReadingExportPayload, exportReadingPayload } from './readingExport'

const props = defineProps({
  readingTypes: { type: Array, required: true },
  currentReadings: { type: Object, required: true },
})

function exportCurrentReadings() {
  exportReadingPayload(createReadingExportPayload(props.readingTypes, props.currentReadings), 'lifepathx-readings')
}
</script>

<template>
  <button class="top-action export-action" type="button" @click="exportCurrentReadings">导出 JSON</button>
</template>

<style scoped>
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
</style>
