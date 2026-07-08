<script setup>
defineProps({
  reading: { type: Object, required: true },
  active: { type: Boolean, default: false },
  linked: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <!-- 数字卡片：只负责展示与点击。 -->
  <button class="tile" :class="{ active, linked }" type="button" :disabled="disabled" @click="$emit('select', reading)">
    <span>{{ reading.number }}</span>
  </button>
</template>

<style scoped>
.tile {
  min-height: 92px;
  border: 1px solid var(--color-stroke);
  border-radius: 14px;
  background: var(--color-bg-surface);
  color: var(--color-text-high);
  cursor: pointer;
  display: grid;
  place-items: center;
  gap: 4px;
  padding: 10px 8px;
  transition: 0.18s ease;
  width: 100%;
}

.tile:hover,
.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}

.tile:disabled {
  background: var(--color-bg-elevated);
  color: var(--color-text-low);
  cursor: not-allowed;
  transform: none;
}

.tile:disabled:hover {
  border-color: var(--color-stroke);
}

.linked {
  border-color: var(--color-accent);
  box-shadow: inset 0 0 0 2px var(--color-accent);
}

span {
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
}

</style>
