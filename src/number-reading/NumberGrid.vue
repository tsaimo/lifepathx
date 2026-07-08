<script setup>
import NumberTile from './NumberTile.vue'

defineProps({
  readings: { type: Array, required: true },
  selected: { type: Number, required: true },
  linkedNumbers: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <!-- 数字网格：按数据实例化同一个数字组件模版。 -->
  <div class="grid">
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
}
</style>
