<script setup>
import { ref, watch } from 'vue'
import { validateImportFile, validateImportPayload } from './readingImport'

const props = defineProps({
  open: { type: Boolean, required: true },
  readingTypes: { type: Array, required: true },
})

const emit = defineEmits(['close', 'imported'])

const selectedFile = ref(null)
const errors = ref([])

watch(
  () => props.open,
  (open) => {
    if (open) {
      selectedFile.value = null
      errors.value = []
    }
  },
)

function handleFileChange(event) {
  selectedFile.value = event.target.files?.[0] ?? null
  errors.value = []
}

async function importReadings() {
  const file = selectedFile.value

  errors.value = validateImportFile(file)

  if (errors.value.length) {
    return
  }

  try {
    const payload = JSON.parse(await file.text())
    const validation = validateImportPayload(payload, props.readingTypes)

    if (validation.errors.length) {
      errors.value = validation.errors
      return
    }

    emit('imported', validation.readings)
    emit('close')
  } catch {
    errors.value = ['文件内容不是有效的 JSON，请检查是否为完整的导出文件。']
  }
}
</script>

<template>
  <div
    v-if="open"
    class="import-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="import-dialog-title"
    @click.self="$emit('close')"
  >
    <section class="import-dialog">
      <div class="import-heading">
        <div>
          <p>JSON Import</p>
          <h2 id="import-dialog-title">导入解读内容</h2>
        </div>
        <button class="top-action" type="button" @click="$emit('close')">关闭</button>
      </div>
      <p class="import-help">
        请选择本页面导出的 JSON 文件。文件大小不超过 256KB，结构必须包含 schemaVersion 和 readings 对象；readings 需要包含全部解读内容。
      </p>
      <div class="import-actions">
        <input class="import-file" type="file" accept="application/json,.json" @change="handleFileChange" />
        <button class="top-action primary" type="button" @click="importReadings">导入</button>
      </div>
      <ul v-if="errors.length" class="import-feedback">
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.import-overlay {
  align-items: center;
  background: rgba(18, 18, 18, 0.72);
  display: grid;
  inset: 0;
  justify-items: center;
  padding: 24px;
  position: fixed;
  z-index: 40;
}

.import-dialog {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 14px;
  box-shadow: var(--shadow-surface);
  color: var(--color-text-high);
  display: grid;
  gap: 14px;
  max-width: 560px;
  padding: 20px;
  width: min(560px, 94vw);
}

.import-heading,
.import-actions {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.import-heading p,
.import-heading h2 {
  margin: 0;
}

.import-heading p {
  color: var(--color-text-medium);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.import-heading h2 {
  font-size: 26px;
  line-height: 1.15;
}

.import-help {
  color: var(--color-text-medium);
  line-height: 1.6;
  margin: 0;
}

.import-actions {
  flex-wrap: wrap;
  justify-content: start;
}

.import-file {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-high);
  max-width: 100%;
  padding: 7px;
}

.import-feedback {
  color: #8f4f4f;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  padding-left: 20px;
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
</style>
