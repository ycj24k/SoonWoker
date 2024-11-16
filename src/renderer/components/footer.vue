<template>
  <div class="footer">
    <div class="company">Copyright @ 2023 CARDSOON Corporation</div>

    <div class="btns">
      <div class="help btn" @click="help">帮助</div>
      <div class="about btn" @click="dialogVisible = true">关于我们</div>
    </div>

    <el-dialog
      title="关于Soon Worker"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <div>
        <img src="../../../static/images/logo256.png" style="width: 120px" />
        <div class="company-name white">Soon Worker</div>
        <div class="version white">版本3.0.0</div>
        <div class="copyright white">
          (c) 2023 上海卡树信息科技有限公司 保留所有权利
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    help() {
      ipcRenderer.send("open-help-file");
    },
    about() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped>
.footer {
  width: calc(100% - 40px);
  background-color: #6dc14c;
  height: 50px;
  margin-bottom: 10px;
  box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  position: absolute;
  bottom: 0;
}
.company {
  font-size: 15px;
  color: white;
}

.btns {
  position: absolute;
  right: 50px;
  height: 100%;
  display: flex;
}
.btn {
  padding: 0px 20px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  color: white;
  transition: 100ms;
}
.btn:hover {
  background-color: rgb(79, 144, 53);
}
.btn:active {
  background-color: rgb(70, 127, 48);
}

.company-name {
  font-size: 15px;
}
.version {
  font-size: 15px;
}
.copyright {
  font-size: 15px;
}

/deep/ .el-dialog__body {
  background-color: #32363a;
}

.white {
  color: white;
}
</style>
