<script setup>
import { computed, ref, watch } from 'vue'
import { calculateNumerologyProfile, normalizeBirthDateInput } from './lifePathCalculator'

defineProps({
  activeType: { type: Object, required: true },
})

const emit = defineEmits(['calculated'])
const birthDate = ref('')
const showRules = ref(false)
const result = computed(() => calculateNumerologyProfile(birthDate.value))

function normalizeBirthDate() {
  const normalizedDate = normalizeBirthDateInput(birthDate.value)

  if (birthDate.value && normalizedDate !== birthDate.value) {
    birthDate.value = normalizedDate
  }
}

watch(result, (value) => emit('calculated', value), { immediate: true })
</script>

<template>
  <!-- 计算模块：输入生日后自动计算生命灵数。 -->
  <section class="calculator">
    <label class="date-field" :class="{ incomplete: !result }">
      <span>先填写出生日期</span>
      <input
        v-model="birthDate"
        type="date"
        min="1900-01-01"
        max="9999-12-31"
        aria-label="出生日期"
        autofocus
        @blur="normalizeBirthDate"
      />
    </label>

    <div class="result" :class="{ empty: !result }">
      <small>计算结果</small>
      <strong>{{ result ? result.destiny.number : '—' }}</strong>
      <div v-if="result" class="result-list">
        <p>
          <b>命运数</b>
          {{ result.destiny.number }}
          <span v-if="result.destiny.number !== result.destiny.root">根数 {{ result.destiny.root }}</span>
        </p>
        <p><b>生日数</b>{{ result.birthday.number }}</p>
        <p><b>天赋数</b>{{ result.talent.number }}</p>
        <p><b>空缺数</b>{{ result.missing.numbers.length ? result.missing.numbers.join(' / ') : '无' }}</p>
      </div>
      <p v-else>选择生日后自动联动下方数字解读</p>
    </div>

    <div class="rules">
      <button
        class="rules-toggle"
        type="button"
        :disabled="!result"
        :aria-expanded="showRules"
        aria-controls="life-path-rules"
        @click="showRules = !showRules"
      >
        {{ showRules ? '收起计算规则' : `了解${activeType.label}计算规则` }}
      </button>

      <div
        v-if="showRules"
        id="life-path-rules"
        class="rules-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="life-path-rules-title"
        @click.self="showRules = false"
      >
        <div class="rules-panel">
          <div class="rules-heading">
            <div>
              <small>计算规则</small>
              <h2 id="life-path-rules-title">{{ activeType.rules.title }}</h2>
            </div>
            <button class="rules-close" type="button" aria-label="关闭计算规则" @click="showRules = false">×</button>
          </div>

          <div v-for="block in activeType.rules.blocks" :key="block.title" class="rule-block">
            <h3>{{ block.title }}</h3>
            <p v-for="line in block.lines" :key="line">{{ line }}</p>
          </div>
        </div>
      </div>
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

.date-field {
  background: #fff7e9;
  border: 2px solid #9a5b35;
  border-radius: 8px;
  box-shadow: 0 12px 34px rgb(154 91 53 / 0.18);
  padding: 12px;
}

.date-field.incomplete {
  outline: 3px solid rgb(154 91 53 / 0.14);
}

span,
small {
  color: #9a5b35;
  font-size: 13px;
  font-weight: 800;
}

input {
  border: 1px solid #c58a63;
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

.result-list {
  display: grid;
  gap: 4px;
}

.result-list p {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

b {
  color: #9a5b35;
}

.rules {
  display: grid;
  gap: 8px;
}

.rules-toggle {
  align-items: center;
  background: #fffdf8;
  border: 1px solid #dfd5c5;
  border-radius: 8px;
  color: #9a5b35;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  justify-content: center;
  min-height: 42px;
  padding: 9px 12px;
  width: 100%;
}

.rules-toggle:hover {
  border-color: #9a5b35;
}

.rules-toggle:disabled {
  background: #f1eadf;
  color: #8b948f;
  cursor: not-allowed;
}

.rules-overlay {
  align-items: center;
  background: rgb(32 39 45 / 0.55);
  display: grid;
  inset: 0;
  justify-items: center;
  padding: 18px;
  position: fixed;
  z-index: 20;
}

.rules-panel {
  background: #fffdf8;
  border: 1px solid #dfd5c5;
  border-radius: 8px;
  box-shadow: 0 18px 44px rgb(32 39 45 / 0.24);
  color: #20272d;
  display: grid;
  gap: 16px;
  max-height: min(720px, 88vh);
  max-width: 620px;
  overflow: auto;
  padding: clamp(18px, 4vw, 26px);
  width: min(100%, 620px);
}

.rules-heading {
  align-items: start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

h2,
h3 {
  margin: 0;
}

h2 {
  font-size: clamp(24px, 6vw, 34px);
  line-height: 1.1;
}

h3 {
  color: #9a5b35;
  font-size: 15px;
}

.rules-close {
  background: #20272d;
  border: 0;
  border-radius: 8px;
  color: #fffaf2;
  cursor: pointer;
  flex: 0 0 auto;
  font: inherit;
  font-size: 22px;
  line-height: 1;
  min-height: 38px;
  width: 38px;
}

.rule-block {
  border-left: 3px solid #9a5b35;
  display: grid;
  gap: 6px;
  padding-left: 12px;
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
