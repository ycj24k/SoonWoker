<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

html,
body {
  margin: 0;
  height: 100%;
}

// 引导样式
.guide_body {
  position: relative;
  z-index: 200;
  background-color: #fff;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px dashed #2e9bfb;
}
.guide_box {
  border: 1px dashed #2e9bfb;
  padding: 12px;
  .guide_title {
    font-weight: bold;
    font-size: 16px;
    color: #000000;
    line-height: 30px;
    span {
      font-size: 13px;
      color: #999;
      font-weight: 400;
    }
  }
  .guide_desc {
    font-size: 13px;
    color: #000000;
    line-height: 24px;
    a {
      color: #2e9bfb;
      cursor: pointer;
    }
  }
  .guide_btns {
    padding: 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: end;
    .guide_btn1 {
      color: #999;
    }
    .guide_btn2  {
      background-color: #2e9bfb;
      border: none;
    }
  }
}
.el-popover {
  padding: 0;
}
</style>
