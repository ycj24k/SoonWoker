<template>
  <div class="list">
    <listItem v-for="(item, key) in list" :key="key" :info="item" :del="del" />
  </div>
</template>
<script>
import listItem from "./listItem";
export default {
  name: "fileList",
  props: {
    list: {
      type: Object | Array,
    },
    del: {
      type: Function,
    },
  },
  components: {
    listItem,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.list {
  height: 374px;
  max-height: 374px;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c7c7cb;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
}
</style>
