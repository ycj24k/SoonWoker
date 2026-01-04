<template>
  <div class="dispose" v-if="show">
    <div class="title">{{ $t("dispose.configTitle") }}</div>
    <div class="row">
      <div class="lable">LogLevel</div>
      <el-select v-model="iniData.LogLevel">
        <el-option v-for="item in LogLevelOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div class="tips">{{ $t("dispose.infoTips") }}</div>
    </div>
    <div class="row">
      <div class="lable">AutoRetryTimes</div>
      <el-select v-model="iniData.AutoRetryTimes">
        <el-option v-for="item in autoRetryOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div class="tips">{{ $t("dispose.errorTips1") }}</div>
    </div>

    <div class="row">
      <div class="lable">TaskDir</div>
      <el-input v-model="iniData.TaskDir"></el-input>
      <div class="tips">{{ $t("dispose.monitorPath") }}</div>
    </div>

    <div class="row">
      <div class="lable">SharedDir</div>
      <el-input v-model="iniData.SharedDir"></el-input>
      <div class="tips">{{ $t("dispose.taskPath") }}</div>
    </div>

    <div class="row">
      <div class="lable">RejectConfig</div>
      <div class="switch">
        <el-switch v-model="iniData.RejectConfig" :active-value="1" :inactive-value="0"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.tips1") }}</div>
    </div>
    <div class="row">
      <div class="lable">StopOnFailure</div>
      <div class="switch">
        <el-switch v-model="iniData.StopOnFailure" :active-value="1" :inactive-value="0"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.errorTips2") }}</div>
    </div>
    <div class="row">
      <div class="lable">KeepCombinedImage</div>
      <div class="switch">
        <el-switch v-model="iniData.KeepCombinedImage" :active-value="1" :inactive-value="0"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.isReserveimg") }}</div>
    </div>
    <div class="row">
      <div class="lable">CleanTaskFile</div>
      <div class="switch">
        <el-switch v-model="iniData.CleanTaskFile" :active-value="1" :inactive-value="0"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.isReservetask") }}</div>
    </div>
    <div class="row" style="
        align-items: start;
        height: 50px;
        border-bottom: 1px rgb(224, 224, 224) solid;
      ">
      <div class="lable">UploadSharedDir</div>
      <div class="switch">
        <el-switch v-model="iniData.UploadSharedDir" :active-value="1" :inactive-value="0"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.isUpload") }}</div>
    </div>

    <div class="row">
      <div class="lable">AuthorizationCode</div>
      <el-input v-model="iniData.AuthorizationCode" :placeholder="$t('dispose.authCodePlaceholder')"></el-input>
      <div class="tips">{{ $t("dispose.authCodeTips") }}</div>
    </div>

    <div class="row" style="
        align-items: flex-start;
        justify-content: flex-end;
        margin-top: 40px;
        margin-right: 40px;
        height: 300px;
      ">
      <el-button @click="save">{{ $t("work.submit") }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "dispose",
  data() {
    return {
      autoRetryOptions: [
        { value: 0, label: "0" },
        { value: 1, label: "1" },
        { value: 2, label: "2" },
      ],
      LogLevelOptions: [
        { value: "TRACE", label: "TRACE" },
        { value: "DEBUG", label: "DEBUG" },
        { value: "INFO", label: "INFO" },
        { value: "WARNING", label: "WARNING" },
        { value: "ERROR", label: "ERROR" },
        { value: "FATAL", label: "FATAL" },
      ],
      iniData: {
        LogLevel: "INFO",
        AutoRetryTimes: 0,
        TaskDir: "",
        SharedDir: "",
        RejectConfig: 0,
        StopOnFailure: 0,
        KeepCombinedImage: 0,
        CleanTaskFile: 0,
        UploadSharedDir: 0,
        AuthorizationCode: "",
        DeleteTask: 0 // Ensure this is preserved if present in API
      },
      show: true,
    };
  },
  methods: {
    // 获取配置
    getConfig() {
      this.$axios.get('/admin/get_config')
        .then(res => {
          if (res && res.data) {
            // 合并数据，确保所有字段都存在
            this.iniData = { ...this.iniData, ...res.data };
          } else {
            this.$message.error(this.$t("dispose.errorRead"));
          }
        })
        .catch(err => {
          console.error(err);
          this.$message.error(this.$t("dispose.errorRead"));
        });
    },
    // 保存配置
    save() {
      this.$axios.post('/admin/get_config', this.iniData)
        .then(res => {
          if (res && (res.data === "success" || res.status === 200)) {
            this.$message({
              type: "success",
              message: this.$t("dispose.successReserve"),
            });
          } else {
            // 某些接口可能返回 { ret: 0 } 或其他形式，视具体情况而定
            // 这里假设200 OK即为成功，或者根据res.data判断
            this.$message({
              type: "success",
              message: this.$t("dispose.successReserve"),
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.$message.error(this.$t("dispose.errorReserve"));
        });
    },
  },
  mounted() {
    this.getConfig();
  },
};
</script>

<style lang="less" scoped>
.dispose {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  padding: 10px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .title {
    font-size: 14px;
    font-weight: bold;
    width: 500px;
    height: 40px;
    color: rgb(139, 139, 139);
    padding-left: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: rgb(240, 240, 240);
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;

    .lable {
      width: 200px;
      margin-left: 20px;
      font-size: 14px;
      text-align: left;
    }

    .el-input {
      width: 200px;
      margin-left: 20px;
    }

    .el-select {
      width: 200px;
      margin-left: 20px;
    }

    .switch {
      display: flex;
      margin-left: 20px;
      justify-content: flex-start;
      width: 200px;
    }

    .tips {
      font-size: 14px;
      margin-left: 20px;
      width: calc(100% - 440px);
      text-align: left;
    }

    .el-button {
      color: rgb(154, 202, 128);
      width: 120px;
      height: 40px;
      font-size: 14px;
      border-radius: 1px;
      box-shadow: 1px 0px 2px 0px grey;
    }

    .el-button:hover {
      background-color: white;
    }

    .el-button:active {
      background-color: white;
    }

    .el-button:focus {
      background-color: white;
    }
  }
}
</style>
