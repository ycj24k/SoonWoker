<template>
  <work-main ref="workMain" v-bind="$props" v-on="$listeners" />
</template>

<script>
import WorkMain from './work/WorkMain.vue'

export default {
  name: 'work',
  components: {
    WorkMain
  },
  props: {
    dice: Number,
    saveWorkList: Object,
    isNew: Boolean,
    printerList: Array,
    shareDisk: String,
    isCopy: { type: Boolean, default: false },
    filterPassedType: { type: Array, default: () => [] },
    sizeType: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>
/* Main entry point for the refactored work component.
   Real implementation is in ./work/WorkMain.vue */
</style>
