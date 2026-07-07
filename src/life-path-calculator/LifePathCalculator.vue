<script setup>
import { computed, ref, watch } from 'vue'
import { calculateLifePath } from './lifePathCalculator'

const emit = defineEmits(['calculated'])
const birthDate = ref('')
const result = computed(() => calculateLifePath(birthDate.value))

watch(result, (value) => emit('calculated', value), { immediate: true })
</script>

<template>
  <!-- 计算模块：输入生日后自动计算生命灵数。 -->
  <section class="calculator">
    <label>
      <span>出生日期</span>
      <input v-model="birthDate" type="date" aria-label="出生日期" />
    </label>

    <div class="result" :class="{ empty: !result }">
      <small>计算结果</small>
      <strong>{{ result ? result.number : '—' }}</strong>
      <p v-if="result && result.number !== result.root">主数 {{ result.number }} 联动根数 {{ result.root }}</p>
      <p v-else-if="result">月 {{ result.parts.month }} / 日 {{ result.parts.day }} / 年 {{ result.parts.year }}</p>
      <p v-else>选择生日后自动联动下方数字解读</p>
    </div>
  </section>
</template>

<style scoped>
.calculator {
  display: grid;
  gap: 10px;
  margin-bottom: clamp(14px, 3vw, 20px);
}

label {
  display: grid;
  gap: 8px;
}

span,
small {
  color: #9a5b35;
  font-size: 13px;
  font-weight: 800;
}

input {
  border: 1px solid #dfd5c5;
  border-radius: 8px;
  color: #20272d;
  font: inherit;
  min-height: 46px;
  padding: 11px 12px;
  width: 100%;
}

.result {
  border: 1px solid #dfd5c5;
  border-radius: 8px;
  display: grid;
  gap: 4px;
  padding: 12px;
}

.empty {
  color: #65727b;
}

strong {
  font-size: clamp(34px, 8vw, 42px);
  line-height: 1;
}

p {
  margin: 0;
}
</style>
