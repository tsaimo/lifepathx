<script setup>
import readings from './lifePathReadings.json'
import NumberTile from './NumberTile.vue'

defineProps({
  selected: { type: Number, required: true },
  linkedNumbers: { type: Array, default: () => [] },
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
      @select="$emit('select', reading)"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: clamp(8px, 2vw, 12px);
  grid-template-columns: repeat(auto-fit, minmax(86px, 1fr));
}
</style>
