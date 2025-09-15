<template>
  <div class="energy-bar compact energy-dash" :title="tooltip">
    <div class="energy-cells" :style="{ gap: gap + 'px' }">
      <div
        v-for="n in segments"
        :key="n"
        :class="cellClass(n)"
        :style="{ width: cellWidth + 'px', height: cellHeight + 'px', borderRadius: borderRadius + 'px' }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnergyBar',
  props: {
    // 百分比 0-100
    percent: { type: Number, default: 0 },
    // 段数 6 或 8
    segments: { type: Number, default: 8 },
    // 显示文本
    showText: { type: Boolean, default: true },
    // 自定义文本
    text: { type: String, default: '' },
    // 尺寸控制（像素）
    cellWidth: { type: Number, default: 4 },
    cellHeight: { type: Number, default: 10 },
    gap: { type: Number, default: 1 },
    borderRadius: { type: Number, default: 1 },
  },
  computed: {
    litCells() {
      const clamped = Math.max(0, Math.min(100, Math.round(this.percent || 0)))
      // 一个能量格代表10（进1制向上取整）
      const cells = Math.ceil(clamped / 10)
      return Math.max(0, Math.min(this.segments, cells))
    },
    displayText() {
      return this.text || `${Math.max(0, Math.min(100, Math.round(this.percent || 0)))}%`
    },
    tooltip() {
      return this.displayText
    },
    tone() {
      // 低电量红 / 中电量橙 / 高电量绿
      const p = Math.max(0, Math.min(100, this.percent || 0))
      if (p <= 20) return 'danger'
      if (p <= 50) return 'warning'
      return 'success'
    },
    chargingIndex() {
      // 若不是整十，最后一格视为“充能中”
      const p = Math.max(0, Math.min(100, this.percent || 0))
      if (p % 10 === 0 || this.litCells === 0) return -1
      return this.litCells
    }
  },
  methods: {
    cellClass(n) {
      const lit = n <= this.litCells
      // 仿数码表样式：前2格为红色，其余为绿色（只在被点亮时着色）
      const zone = n <= 2 ? 'low' : 'high'
      return [
        'energy-cell',
        lit ? (zone === 'low' ? 'is-red' : 'is-green') : 'is-off',
        (this.chargingIndex === n && lit) ? 'is-charging' : ''
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.energy-bar {
  display: inline-flex;
}
.energy-dash {
  /* 取消黑色底，采用透明背景以突出分隔与未点亮格 */
  background: transparent;
  padding: 1px 3px;
  border-radius: 2px;
}
.compact .energy-cells {
  display: flex;
  align-items: center;
}
.energy-cell {
  background: transparent;
  box-sizing: border-box;
  display: inline-block;
}
.energy-cell.is-red {
  background: linear-gradient(180deg, #ff6b6b, #ff3f3f);
  box-shadow: 0 0 2px rgba(255,58,58,.45);
  position: relative;
  overflow: hidden;
  animation: pulse 2.8s ease-in-out infinite;
}
.energy-cell.is-green {
  background: linear-gradient(180deg, #6dff55, #30cc42);
  box-shadow: 0 0 2px rgba(103,255,77,.35);
  position: relative;
  overflow: hidden;
  animation: pulse 2.8s ease-in-out infinite;
}
.energy-cell.is-off {
  /* 提高对比度：更亮的灰底+更明显边框，便于在深色背景下辨识格数 */
  background: #2f3643;
  border: 1px solid #556179;
  box-shadow: inset 0 1px 1px rgba(255,255,255,.06);
}
.energy-cell.is-charging {
  position: relative;
  overflow: hidden;
}
.energy-cell.is-charging::after {
  content: '';
  position: absolute;
  left: -120%;
  top: 0;
  width: 120%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.28), rgba(255,255,255,0));
  animation: sweep 2.4s linear infinite;
}
/* 所有点亮的格子也有较弱的扫光效果与更高亮度 */
.energy-cell.is-green::before,
.energy-cell.is-red::before {
  content: '';
  position: absolute;
  left: -120%;
  top: 0;
  width: 120%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.18), rgba(255,255,255,0));
  animation: sweep 3s linear infinite;
}
@keyframes pulse {
  0% { filter: brightness(0.98); }
  50% { filter: brightness(1.08); }
  100% { filter: brightness(0.98); }
}
@keyframes sweep {
  0% { left: -120%; }
  100% { left: 120%; }
}
</style>

