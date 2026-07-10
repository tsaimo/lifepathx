<script setup>
import { computed, ref, watch } from 'vue'
import { calculateNumerologyProfile, getDefaultBirthDate, normalizeBirthDateInput } from './lifePathCalculator'
import { createRuleExampleBlock } from './lifePathRuleExamples'

const props = defineProps({
  activeType: { type: Object, required: true },
})

const emit = defineEmits(['calculated'])
const birthDate = ref(getDefaultBirthDate())
const showRules = ref(false)
const result = computed(() => calculateNumerologyProfile(birthDate.value))

const ruleBlocks = computed(() => {
  const dynamicExampleBlock = createRuleExampleBlock(props.activeType.id, result.value)

  return props.activeType.rules.blocks.map((block) => (block.title === '计算示例' && dynamicExampleBlock ? dynamicExampleBlock : block))
})

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

          <div v-for="block in ruleBlocks" :key="block.title" class="rule-block">
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
  gap: 8px;
  margin-bottom: 12px;
}

label {
  display: grid;
  gap: 8px;
}

.date-field {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-primary);
  border-radius: 14px;
  box-shadow: var(--shadow-surface);
  padding: 10px;
}

.date-field.incomplete {
  outline: 3px solid color-mix(in srgb, var(--color-primary) 18%, transparent);
}

span,
small {
  color: var(--color-text-medium);
  font-size: 13px;
  font-weight: 800;
}

input {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-high);
  font: inherit;
  min-height: 40px;
  padding: 8px 10px;
  width: 100%;
}

.result {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 14px;
  box-shadow: var(--shadow-surface);
  display: grid;
  gap: 4px;
  padding: 10px;
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
  color: var(--color-text-high);
}

.rules {
  display: grid;
  gap: 8px;
}

.rules-toggle {
  align-items: center;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  color: var(--color-text-high);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  justify-content: center;
  min-height: 38px;
  padding: 8px 12px;
  width: 100%;
}

.rules-toggle:hover {
  border-color: var(--color-primary-hover);
  color: var(--color-text-high);
}

.rules-toggle:disabled {
  background: var(--color-bg-elevated);
  color: var(--color-text-low);
  cursor: not-allowed;
}

.rules-overlay {
  align-items: center;
  background: rgba(18, 18, 18, 0.72);
  display: grid;
  inset: 0;
  justify-items: center;
  padding: 18px;
  position: fixed;
  z-index: 20;
}

.rules-panel {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke);
  border-radius: 14px;
  box-shadow: var(--shadow-surface);
  color: var(--color-text-high);
  display: grid;
  gap: 16px;
  max-height: min(720px, 88vh);
  max-width: 620px;
  overflow: auto;
  padding: 22px;
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
  font-size: 30px;
  line-height: 1.1;
}

h3 {
  color: var(--color-text-high);
  font-size: 15px;
}

.rules-close {
  background: var(--color-primary);
  border: 0;
  border-radius: 6px;
  color: var(--color-primary-contrast);
  cursor: pointer;
  flex: 0 0 auto;
  font: inherit;
  font-size: 22px;
  line-height: 1;
  min-height: 38px;
  width: 38px;
}

.rule-block {
  border-left: 3px solid var(--color-accent);
  display: grid;
  gap: 6px;
  padding-left: 12px;
}

.empty {
  color: var(--color-text-medium);
}

strong {
  font-size: 36px;
  line-height: 1;
}

p {
  margin: 0;
}
</style>
