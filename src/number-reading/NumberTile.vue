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
  min-height: clamp(84px, 18vw, 112px);
  border: 1px solid #e7decf;
  border-radius: 8px;
  background: #fffdf8;
  color: #20272d;
  cursor: pointer;
  display: grid;
  place-items: center;
  gap: 4px;
  padding: 12px 8px;
  transition: 0.18s ease;
  width: 100%;
}

.tile:hover,
.active {
  border-color: #20272d;
  background: #20272d;
  color: #fffaf2;
  transform: translateY(-2px);
}

.tile:disabled {
  background: #f1eadf;
  color: #8b948f;
  cursor: not-allowed;
  transform: none;
}

.tile:disabled:hover {
  border-color: #e7decf;
}

.linked {
  border-color: #9a5b35;
  box-shadow: inset 0 0 0 2px #9a5b35;
}

span {
  font-size: clamp(28px, 7vw, 38px);
  font-weight: 800;
  line-height: 1;
}

</style>
