<template>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">{{ $t("admin.userManage") }}</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">{{ $t("admin.configureManage") }}</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">{{ $t("admin.roleManage") }}</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">{{ $t("admin.timeTask") }}</el-tab-pane>
    </el-tabs>
  </template>
  <script>
    export default {
        name:"admintest",
      data() {
        return {
          activeName: 'second'
        };
      },
    };
  </script>

<style lang="less" scoped>

</style>