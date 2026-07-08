<script setup>
import NumberTile from './NumberTile.vue'

defineProps({
  readings: { type: Array, required: true },
  selected: { type: Number, required: true },
  linkedNumbers: { type: Array, default: () => [] },
  lineSegments: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <!-- 数字网格：按数据实例化同一个数字组件模版。 -->
  <div class="grid">
    <svg v-if="lineSegments.length" class="line-layer" viewBox="0 0 3 3" aria-hidden="true" preserveAspectRatio="none">
      <polyline
        v-for="(linePoints, index) in lineSegments"
        :key="index"
        class="connection-line"
        :points="linePoints.join(' ')"
      />
    </svg>
    <NumberTile
      v-for="reading in readings"
      :key="reading.number"
      :reading="reading"
      :active="selected === reading.number"
      :linked="linkedNumbers.includes(reading.number) && selected !== reading.number"
      :disabled="disabled"
      @select="$emit('select', reading)"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: clamp(8px, 2vw, 12px);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  position: relative;
}

.line-layer {
  inset: 0;
  overflow: visible;
  pointer-events: none;
  position: absolute;
  z-index: 3;
}

.connection-line {
  fill: none;
  opacity: 0.82;
  stroke: #9a5b35;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 0.07;
}

.grid :deep(.tile) {
  position: relative;
  z-index: 2;
}
</style>
