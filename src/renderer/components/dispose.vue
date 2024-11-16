<template>
  <div class="dispose" v-if="show">
    <div class="title">{{ $t("dispose.configTitle") }}</div>
    <div class="row">
      <div class="lable">LogLevel</div>
      <el-select v-model="iniData.LogLevel">
        <el-option
          v-for="item in LogLevelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="tips">{{ $t("dispose.infoTips") }}</div>
    </div>
    <div class="row">
      <div class="lable">AutoRetryTimes</div>
      <el-select v-model="iniData.AutoRetryTimes">
        <el-option
          v-for="item in autoRetryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
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
        <el-switch v-model="iniData.RejectConfig"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.tips1") }}</div>
    </div>
    <div class="row">
      <div class="lable">StopOnFailure</div>
      <div class="switch">
        <el-switch v-model="iniData.StopOnFailure"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.errorTips2") }}</div>
    </div>
    <div class="row">
      <div class="lable">KeepCombinedImage</div>
      <div class="switch">
        <el-switch v-model="iniData.KeepCombinedImage"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.isReserveimg") }}</div>
    </div>
    <div class="row">
      <div class="lable">CleanTaskFile</div>
      <div class="switch">
        <el-switch v-model="iniData.CleanTaskFile"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.isReservetask") }}</div>
    </div>
    <div
      class="row"
      style="
        align-items: start;
        height: 50px;
        border-bottom: 1px rgb(224, 224, 224) solid;
      "
    >
      <div class="lable">UploadSharedDir</div>
      <div class="switch">
        <el-switch v-model="iniData.UploadSharedDir"></el-switch>
      </div>
      <div class="tips">{{ $t("dispose.isUpload") }}</div>
    </div>

    <div
      class="row"
      style="
        align-items: flex-start;
        justify-content: flex-end;
        margin-top: 40px;
        margin-right: 40px;
        height: 300px;
      "
    >
      <el-button @click="save">{{ $t("work.submit") }}</el-button>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
var fs = require("fs"),
  ini = require("ini");
export default {
  name: "dispose",
  data() {
    return {
      autoRetryOptions: [
        {
          value: 0,
          label: "0",
        },
        {
          value: 1,
          label: "1",
        },
        {
          value: 2,
          label: "2",
        },
      ],
      LogLevelOptions: [
        {
          value: "TRACE",
          label: "TRACE",
        },
        {
          value: "DEBUG",
          label: "DEBUG",
        },
        {
          value: "INFO",
          label: "INFO",
        },
        {
          value: "WARNING",
          label: "WARNING",
        },
        {
          value: "ERROR",
          label: "ERROR",
        },
        {
          value: "FATAL",
          label: "FATAL",
        },
      ],
      iniData: null,

      AutoRetryTimes: null,
      LogLevel: "TRACE",
      TaskDir: null,
      SharedDir: null,
      RejectConfig: false,
      StopOnFailure: false,
      KeepCombinedImage: false,
      CleanTaskFile: false,
      show: true,
      root: "",
    };
  },
  methods: {
    save() {
      //console.log(this.iniData);
      //console.log(ini.stringify(this.iniData));
      //fs.writeFileSync("../Debug/config.ini");
      let that = this;
      fs.writeFile(
        this.root + "/../ProductionServer/config.ini",
        ini.stringify(this.iniData),
        function (err) {
          if (err) {
            that.$message.error(that.$t("dispose.errorReserve"));
          } else {
            that.$message({
              type: "success",
              message: that.$t("dispose.successReserve"),
            });
          }
        }
      );
    },
  },
  mounted() {
    let that = this;
    //var data = ini.parse(fs.readFileSync("F:\\controll\\config.ini", "utf-8"));
    ipcRenderer.on("get-root-callback", (event, data) => {
      this.root = data;
      fs.readFile(this.root + "/../ProductionServer/config.ini", "utf-8", (err, res) => {
        if (err) {
          console.log(err);
          this.$message.error(that.$t("dispose.errorRead"));
          this.show = false;
        } else {
          console.log(res);
          let data = ini.parse(res);
          console.log(data);
          this.iniData = data;
          that.iniData.AutoRetryTimes = data.AutoRetryTimes
            ? data.AutoRetryTimes
            : 0;
          that.iniData.TaskDir = data.TaskDir ? data.TaskDir : "";
          that.iniData.SharedDir = data.SharedDir ? data.SharedDir : "";
          that.iniData.LogLevel = data.LogLevel ? data.LogLevel : "";
          that.iniData.CleanTaskFile =
            data.CleanTaskFile == "true" ||
            data.CleanTaskFile == "True" ||
            data.CleanTaskFile
              ? true
              : false;
          that.iniData.KeepCombinedImage =
            data.KeepCombinedImage == "true" ||
            data.KeepCombinedImage == "True" ||
            data.KeepCombinedImage
              ? true
              : false;
          that.iniData.RejectConfig =
            data.RejectConfig == "true" ||
            data.RejectConfig == "True" ||
            data.RejectConfig
              ? true
              : false;
          that.iniData.StopOnFailure =
            data.StopOnFailure == "true" ||
            data.StopOnFailure == "True" ||
            data.StopOnFailure
              ? true
              : false;
          that.iniData.UploadSharedDir =
            data.UploadSharedDir == "true" ||
            data.UploadSharedDir == "True" ||
            data.UploadSharedDir
              ? true
              : false;
          console.log(data);
        }
      });
    });
    ipcRenderer.send("get-root");

    //iniparser.parse("../Debug/config.ini", function (err, data) {
    /*
        AutoRetryTimes: "0"
        CardsoonModel: "SF80"
        CleanTaskFile: "false"
        RejectConfig: "false"
        KeepCombinedImage: "True"
        LogLevel: "DEBUG"
        SharedDir: "C:\\CardSoonRepo"
        StopOnFailure: "false"
        SystemSn: "830001"
        TaskDir: "C:\\PrintTasks"
        Version: "V3.0"

    iniparser.parse("F:\\controll\\config.ini", function (err, data) {
      console.log(err);
      if (err) {
        that.$message.error("读取配置文件失败！");
      } else {
        console.log(data);
        that.AutoRetryTimes = data.AutoRetryTimes ? data.AutoRetryTimes : 0;
        that.TaskDir = data.TaskDir ? data.TaskDir : "";
        that.SharedDir = data.SharedDir ? data.SharedDir : "";
        that.LogLevel = data.LogLevel ? data.LogLevel : "";
        that.CleanTaskFile =
          data.CleanTaskFile == "true" || data.CleanTaskFile == "True"
            ? true
            : false;
        that.KeepCombinedImage =
          data.KeepCombinedImage == "true" || data.KeepCombinedImage == "True"
            ? true
            : false;
        that.RejectConfig =
          data.RejectConfig == "true" || data.RejectConfig == "True"
            ? true
            : false;
        that.StopOnFailure =
          data.StopOnFailure == "true" || data.StopOnFailure == "True"
            ? true
            : false;
      }
    });
    */
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
