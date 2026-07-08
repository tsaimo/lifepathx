<script setup>
defineProps({
  types: { type: Array, required: true },
  activeTypeId: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <div class="tabs" aria-label="解读类型">
    <button
      v-for="type in types"
      :key="type.id"
      class="tab"
      :class="{ active: activeTypeId === type.id }"
      type="button"
      :disabled="disabled"
      @click="$emit('select', type.id)"
    >
      {{ type.label }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 10px;
}

.tab {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-medium);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  min-height: 38px;
  padding: 7px 10px;
}

.tab:hover,
.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-contrast);
}

.tab:disabled {
  background: var(--color-bg-elevated);
  border-color: var(--color-stroke);
  color: var(--color-text-low);
  cursor: not-allowed;
}
</style>
