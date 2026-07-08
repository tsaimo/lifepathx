<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NumberTile from './NumberTile.vue'

const props = defineProps({
  readings: { type: Array, required: true },
  selected: { type: Number, required: true },
  linkedNumbers: { type: Array, default: () => [] },
  lineSegments: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
})

defineEmits(['select'])

const gridElement = ref(null)
const gridSize = ref({ width: 0, height: 0 })
const tileCenters = ref({})
const tileElements = new Map()
let resizeObserver

const viewBox = computed(() =>
  gridSize.value.width && gridSize.value.height ? `0 0 ${gridSize.value.width} ${gridSize.value.height}` : '0 0 3 3',
)
const renderedLineSegments = computed(() => {
  if (!gridSize.value.width || !gridSize.value.height) {
    return props.lineSegments
  }

  return props.lineSegments
    .map((linePoints) =>
      linePoints.map((point) => {
        const number = getNumberFromGridPoint(point)
        const center = tileCenters.value[number]

        return center ? `${center.x},${center.y}` : null
      }),
    )
    .filter((linePoints) => linePoints.every(Boolean))
})

function setTileElement(number, element) {
  if (element) {
    tileElements.set(number, element)
  } else {
    tileElements.delete(number)
  }
}

function getNumberFromGridPoint(point) {
  const [x, y] = point.split(',').map(Number)
  const column = Math.round(x - 0.5)
  const row = Math.round(y - 0.5)
  const number = row * 3 + column + 1

  return Number.isInteger(number) && number >= 1 && number <= 9 ? number : null
}

function updateLineGeometry() {
  const grid = gridElement.value

  if (!grid) {
    return
  }

  const gridRect = grid.getBoundingClientRect()
  const centers = {}

  tileElements.forEach((element, number) => {
    const rect = element.getBoundingClientRect()

    centers[number] = {
      x: rect.left - gridRect.left + rect.width / 2,
      y: rect.top - gridRect.top + rect.height / 2,
    }
  })

  gridSize.value = { width: gridRect.width, height: gridRect.height }
  tileCenters.value = centers
}

function scheduleLineGeometryUpdate() {
  nextTick(updateLineGeometry)
}

onMounted(() => {
  scheduleLineGeometryUpdate()

  if (window.ResizeObserver && gridElement.value) {
    resizeObserver = new ResizeObserver(updateLineGeometry)
    resizeObserver.observe(gridElement.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(() => [props.readings, props.lineSegments], scheduleLineGeometryUpdate, { deep: true, flush: 'post' })
</script>

<template>
  <!-- 数字网格：按数据实例化同一个数字组件模版。 -->
  <div ref="gridElement" class="grid">
    <svg v-if="renderedLineSegments.length" class="line-layer" :viewBox="viewBox" aria-hidden="true">
      <polyline
        v-for="(linePoints, index) in renderedLineSegments"
        :key="index"
        class="connection-line"
        :points="linePoints.join(' ')"
      />
    </svg>
    <div
      v-for="reading in readings"
      :key="reading.number"
      :ref="(element) => setTileElement(reading.number, element)"
      class="grid-cell"
    >
      <NumberTile
        :reading="reading"
        :active="selected === reading.number"
        :linked="linkedNumbers.includes(reading.number) && selected !== reading.number"
        :disabled="disabled"
        @select="$emit('select', reading)"
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  position: relative;
}

.line-layer {
  height: 100%;
  inset: 0;
  overflow: visible;
  pointer-events: none;
  position: absolute;
  width: 100%;
  z-index: 3;
}

.connection-line {
  fill: none;
  opacity: 0.82;
  stroke: var(--color-accent);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
  vector-effect: non-scaling-stroke;
}

.grid-cell {
  padding: 4px;
  position: relative;
  z-index: 2;
}
</style>
