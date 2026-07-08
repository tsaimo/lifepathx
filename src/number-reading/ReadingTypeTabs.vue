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
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 12px;
}

.tab {
  background: #fffdf8;
  border: 1px solid #dfd5c5;
  border-radius: 8px;
  color: #4c5a63;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  min-height: 40px;
  padding: 8px 10px;
}

.tab:hover,
.active {
  background: #20272d;
  border-color: #20272d;
  color: #fffaf2;
}

.tab:disabled {
  background: #f1eadf;
  border-color: #dfd5c5;
  color: #8b948f;
  cursor: not-allowed;
}
</style>
