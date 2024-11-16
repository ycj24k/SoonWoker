<template>
  <div :style="'background-image:url(' + bgi + ');background-repeat: no-repeat;background-position: 50% 50%;'" class="empty"></div>
</template>
<script>
export default {
  name: "fileEmpty",
  data() {
    return {
      fileList: [],
    };
  },
  methods: {},
  computed: {
    bgi() {
      return this.$t("work.dropBg");
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.empty {
  height: 345px;
  width: 100%;
}
</style>
