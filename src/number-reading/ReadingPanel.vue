<script setup>
defineProps({
  reading: { type: Object, required: true },
  type: { type: Object, required: true },
})
</script>

<template>
  <!-- 解读面板：只负责阅读体验。 -->
  <article class="panel">
    <p class="eyebrow">{{ type.eyebrow }} {{ reading.number }}</p>
    <h2>{{ reading.title }}</h2>
    <p class="description">{{ type.description }}</p>
    <p class="summary">{{ reading.summary }}</p>

    <section>
      <h3>优势</h3>
      <p>{{ reading.strengths.join(' / ') }}</p>
    </section>

    <section>
      <h3>课题</h3>
      <p>{{ reading.challenges.join(' / ') }}</p>
    </section>

    <section>
      <h3>建议</h3>
      <p>{{ reading.advice }}</p>
    </section>
  </article>
</template>

<style scoped>
.panel {
  border-left: 1px solid #dfd5c5;
  padding-left: clamp(20px, 3vw, 32px);
  min-width: 0;
}

.eyebrow,
h2,
h3,
p {
  margin: 0;
}

.eyebrow {
  color: #9a5b35;
  font-size: 13px;
  font-weight: 700;
}

h2 {
  font-size: clamp(34px, 7vw, 72px);
  line-height: 0.95;
  margin-top: 8px;
}

.summary {
  color: #41505b;
  font-size: clamp(16px, 2vw, 18px);
  line-height: 1.75;
  margin: 12px 0 clamp(18px, 3vw, 24px);
}

.description {
  color: #65727b;
  line-height: 1.6;
  margin-top: 10px;
}

section + section {
  margin-top: 14px;
}

h3 {
  font-size: 14px;
  margin-bottom: 6px;
}

section p {
  color: #4c5a63;
  line-height: 1.65;
}

@media (max-width: 900px) {
  .panel {
    border-left: 0;
    border-top: 1px solid #dfd5c5;
    padding: 24px 0 0;
  }
}
</style>
