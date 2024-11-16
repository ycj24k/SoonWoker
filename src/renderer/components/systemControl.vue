<template>
  <div class="system">
    <div class="restart" v-if="false">
      <div class="title">{{ $t("systemControl.restart") }}</div>
      <div class="service">
        <div class="tips" style="text-align: left">
          {{ $t("systemControl.nowState") }}
          <span style="font-weight: bold">{{
            state == null
              ? this.$t("systemControl.detecting")
              : state
              ? this.$t("systemControl.start")
              : this.$t("systemControl.stop")
          }}</span>
          <div>{{ $t("systemControl.tips1") }}</div>
        </div>
        <div class="serviceImg">
          <el-button
            icon="el-icon-video-play"
            circle
            @click="play"
            :disabled="state || state == null"
          ></el-button>
          <el-button
            icon="el-icon-video-pause"
            circle
            @click="pause"
            :disabled="!state || state == null"
          ></el-button>
        </div>
      </div>
    </div>
    <div class="control">
      <div class="title">{{ $t("systemControl.operatingWorkstation") }}</div>
      <div class="service">
        <div class="select">
          <div class="lable">{{ $t("systemControl.selectWorkstation") }}</div>
          <el-select v-model="workValue">
            <el-option
              v-for="item in printData"
              :key="item.PrinterID"
              :label="getPrintName(item.PrinterID)"
              :value="item.PrinterID"
            >
            </el-option>
          </el-select>
        </div>
        <div class="select">
          <div class="lable">工作站状态</div>
          {{ this.statusText }}
        </div>
        <div class="concrete">
          <div class="lable">{{ $t("systemControl.moveCardTo") }}</div>
          <div class="buttons">
            <el-button @click="handledkq">{{
              $t("systemControl.dkq")
            }}</el-button>
            <el-button @click="handlefkh">{{
              $t("systemControl.fkh")
            }}</el-button>
            <el-button @click="handleckk">{{
              $t("systemControl.ckk")
            }}</el-button>
            <el-button @click="handledd">{{
              $t("systemControl.dd")
            }}</el-button>
            <el-button @click="handledqk">{{
              $t("systemControl.dqk")
            }}</el-button>
            <el-button @click="handlehckk">{{
              $t("systemControl.hckk")
            }}</el-button>
            <!--<el-button @click="handleInCard">{{
              $t("systemControl.handleInCard")
            }}</el-button>
            <el-button @click="handleMoveReject">{{
              $t("systemControl.handleMoveReject")
            }}</el-button>
            <el-button @click="handleMoveToExit">{{
              $t("systemControl.handleMoveToExit")
            }}</el-button>
            <el-button @click="handleRestartPrint">{{
              $t("systemControl.handleRestartPrint")
            }}</el-button>
            <el-button @click="handleCleanPrint">{{
              $t("systemControl.handleCleanPrint")
            }}</el-button>-->
          </div>
        </div>
        <div class="concrete">
          <div class="lable">{{ $t("systemControl.serviceStation") }}</div>
          <div class="buttons">
            <el-button @click="handleczgzz">{{
              $t("systemControl.czgzz")
            }}</el-button>
            <el-button @click="handleczdyj">{{
              $t("systemControl.czdyj")
            }}</el-button>
            <el-button @click="handlejzsdd">{{
              $t("systemControl.jzsdd")
            }}</el-button>
            <el-button @click="handlecshjkc">{{
              $t("systemControl.cshjkc")
            }}</el-button>
            <!-- <el-button @click="handlebszjkc">{{
              $t("systemControl.bszjkc")
            }}</el-button> -->
            <el-button @click="handleqjgzz">{{
              $t("systemControl.qjgzz")
            }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="control" style="height: 240px">
      <div class="title">{{ $t("systemControl.system") }}</div>
      <div class="service">
        <div class="select">
          <div class="lable">{{ $t("systemControl.refreshTime1") }}</div>
          <el-input v-model="refreshTime1" type="number" style="width: 300px">
            <el-button
              slot="append"
              icon="el-icon-finished"
              @click="handleSaveTime1"
            ></el-button>
            ></el-input
          >
        </div>
        <div class="select">
          <div class="lable">{{ $t("systemControl.refreshTime2") }}</div>
          <el-input v-model="refreshTime2" type="number" style="width: 300px">
            <el-button
              slot="append"
              icon="el-icon-finished"
              @click="handleSaveTime2"
            ></el-button
          ></el-input>
        </div>
        <div class="select">
          <div class="lable">{{ $t("systemControl.guide") }}</div>
          <el-switch @change="changeStep" v-model="showStep" :active-text="$t('systemControl.show')" :inactive-text="$t('systemControl.hide')"></el-switch>
        </div>
      </div>
    </div>
    <div class="languageer">
      <div class="title">{{ $t("systemControl.language") }}</div>
      <div class="select">
        <div class="lable">{{ $t("systemControl.changeLanguage") }}</div>
        <el-select v-model="selectLan">
          <el-option
            v-for="item in languages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "systemControl",
  data() {
    return {
      showStep: false,
      workValue: "",
      languages: [
        {
          value: "zh",
          label: "中文（简体）",
        },
        {
          value: "ozh",
          label: "中文（繁体）",
        },
        {
          value: "en",
          label: "English",
        },
      ],
      selectLan: "",
      printData: [],
      state: null,
      timer: 1,
      refreshTime1: 3000,
      refreshTime2: 180000,
      statusText: "",
      status: {
        87: { tag: "ERROR_INVALID_PARAMETER", err: 0 },
        0: { tag: "NORMAL", err: 0 },
        30016: { tag: "PAVO_DS_LOCKED", err: 0 },
        128: { tag: "PAVO_DS_OFFLINE", err: 0 },
        256: { tag: "PAVO_DS_0100_COVER_OPEN", err: 0 },
        257: { tag: "PAVO_DS_0200_IC_MISSING", err: 0 },
        512: { tag: "PAVO_DS_0201_RIBBON_MISSING", err: 0 },
        513: { tag: "PAVO_DS_0202_RIBON_MISMATCH", err: 0 },
        259: { tag: "PAVO_DS_0203_RIBBON_TYPE_ERROR", err: 0 },
        768: { tag: "PAVO_DS_0300_RIBBON_SEARCH_FAIL", err: 0 },
        769: { tag: "PAVO_DS_0301_RIBBON_OUT", err: 0 },
        770: { tag: "PAVO_DS_0302_PRINT_FAIL", err: 0 },
        771: { tag: "PAVO_DS_0303_PRINT_FAIL", err: 0 },
        772: { tag: "PAVO_DS_0304_RIBBON_OUT", err: 0 },
        1024: { tag: "PAVO_DS_0400_CARD_OUT", err: 1 },
        1280: { tag: "PAVO_DS_0500_CARD_JAM", err: 1 },
        1281: { tag: "PAVO_DS_0501_CARD_JAM", err: 1 },
        1282: { tag: "PAVO_DS_0502_CARD_JAM", err: 1 },
        1283: { tag: "PAVO_DS_0503_CARD_JAM", err: 1 },
        1284: { tag: "PAVO_DS_0504_CARD_JAM", err: 1 },
        1285: { tag: "PAVO_DS_0505_CARD_JAM", err: 1 },
        1286: { tag: "PAVO_DS_0506_CARD_JAM", err: 1 },
        1287: { tag: "PAVO_DS_0507_CARD_JAM", err: 1 },
        1288: { tag: "PAVO_DS_0508_CARD_JAM", err: 1 },
        1536: { tag: "PAVO_DS_0600_CARD_MISMATCH", err: 0 },
        1792: { tag: "PAVO_DS_0700_CAM_ERROR", err: 0 },
        2048: { tag: "PAVO_DS_0800_FLIPPER_ERROR", err: 0 },
        2049: { tag: "PAVO_DS_0801_FLIPPER_ERROR", err: 0 },
        2050: { tag: "PAVO_DS_0802_FLIPPER_ERROR", err: 0 },
        2051: { tag: "PAVO_DS_0803_FLIPPER_ERROR", err: 0 },
        2304: { tag: "PAVO_DS_0900_NVRAM_ERROR", err: 0 },
        4096: { tag: "PAVO_DS_1000_RIBBON_ERROR", err: 0 },
        4352: { tag: "PAVO_DS_1100_RBN_TAKE_CALIB_FAIL", err: 0 },
        4353: { tag: "PAVO_DS_1101_RBN_SUPPLY_CALIB_FAIL", err: 0 },
        4608: { tag: "PAVO_DS_1200_ADC_ERROR", err: 0 },
        4864: { tag: "PAVO_DS_1300_FW_ERROR", err: 0 },
        4865: { tag: "PAVO_DS_1301_FW_ERROR", err: 0 },
        5120: { tag: "PAVO_DS_1400_POWER_SUPPLY_ERROR", err: 0 },
        65537: { tag: "Firmware_Error", err: 0 },
        65539: { tag: "Encoder_Error3", err: 0 },
        65540: { tag: "Encoder_Error4", err: 0 },
        65541: { tag: "ADC_Error", err: 0 },
        65542: { tag: "Enocoder_Error_Film", err: 0 },
        65552: { tag: "Card_Jam", err: 1 },
        65553: { tag: "Card_Jam", err: 1 },
        65554: { tag: "Card_Jam", err: 1 },
        65555: { tag: "Card_Jam", err: 1 },
        65556: { tag: "Card_Jam", err: 1 },
        65557: { tag: "Card_Jam", err: 1 },
        65558: { tag: "Card_Jam", err: 1 },
        65559: { tag: "Card_Jam", err: 1 },
        65560: { tag: "Card_Jam", err: 1 },
        65561: { tag: "Card_Jam", err: 1 },
        65562: { tag: "Card_Jam", err: 1 },
        65563: { tag: "Card_Jam", err: 1 },
        65569: { tag: "Cover_open", err: 0 },
        65570: { tag: "Rejectbox_Open", err: 0 },
        65571: { tag: "Rejectbox_Full", err: 0 },
        65572: { tag: "Flat_Cover_Open", err: 0 },
        65587: { tag: "Flipper_Error", err: 0 },
        65601: { tag: "Ribbon_Out", err: 0 },
        65602: { tag: "Ribbon_Error", err: 0 },
        65603: { tag: "Ribbon_Missing", err: 0 },
        65604: { tag: "Ribbon_Unsupport", err: 0 },
        65605: { tag: "Ribbon_Missing", err: 0 },
        65606: { tag: "Ribbon_Out", err: 0 },
        65607: { tag: "Ribbon_Mismatch", err: 0 },
        65608: { tag: "Ribbon_Error", err: 0 },
        65609: { tag: "Ribbon_Error", err: 0 },
        65610: { tag: "Ribbon_Install_Error", err: 0 },
        65617: { tag: "Card_Feed_Error ", err: 1 },
        65618: { tag: "Card_Feed_Error ", err: 1 },
        65619: { tag: "Card_Feed_Error ", err: 1 },
        65630: { tag: "Card_Feed_Error ", err: 1 },
        65631: { tag: "Card_Out", err: 0 },
        65649: { tag: "Film_Out", err: 0 },
        65650: { tag: "Film_Error", err: 0 },
        65651: { tag: "Film_Missing", err: 0 },
        65652: { tag: "Film_Unsupport", err: 0 },
        65653: { tag: "Film_Missing", err: 0 },
        65654: { tag: "Film_Out", err: 0 },
        65655: { tag: "Film_Error", err: 0 },
        65656: { tag: "Film_Error", err: 0 },
        65657: { tag: "Film_Unsupport", err: 0 },
        65658: { tag: "Film_Install_Error", err: 0 },
        65701: { tag: "Printer_Memory_Full", err: 0 },
        69639: { tag: "Filpper_Not_Install", err: 0 },
        69640: { tag: "600DPI_Not_Enabled", err: 0 },
        69649: { tag: "Ribbon_Unmatched", err: 0 },
        69651: { tag: "Text_Image_Outside", err: 0 },
        69652: { tag: "No_Card", err: 0 },
        69653: { tag: "Take_Ribbon", err: 0 },
        131073: { tag: "Ribbon_Low", err: 0 },
        131074: { tag: "Card_Low", err: 0 },
        131075: { tag: "Waiting_Card_In", err: 0 },
        131076: { tag: "Waiting_Card_Out", err: 0 },
        131077: { tag: "Card_Low", err: 0 },
        131078: { tag: "Card_Low", err: 0 },
        131081: { tag: "Need_Cleaning", err: 0 },
        1167: { tag: "PAVO_DS_OFFLINE", err: 0 },
      },
    };
  },
  mounted() {
    this.selectLan = localStorage.getItem("lang");
    this.getData();
    this.checkServerState(1);
    const refreshTempTime1 = localStorage.getItem("refreshTime1");
    const refreshTempTime2 = localStorage.getItem("refreshTime2");
    if (refreshTempTime1) {
      this.refreshTime1 = refreshTempTime1;
    } else {
      //默认值就是3000ms
      //this.refreshTempTime1 = 3000;
    }
    if (refreshTempTime2) {
      this.refreshTime2 = refreshTempTime2;
    } else {
      //默认值就是3000ms
      //this.refreshTempTime1 = 3000;
    }
    /*
    setInterval(() => {
      this.checkServerState();
    }, 2000);
    */
    //setTimeout(() => {
    //  this.checkServerState(
    //    setTimeout(() => {
    //      this.checkServerState();
    //    }, 2000)
    //  );
    //}, 2000);
    //this.workValue = !this.printData ? null : this.printData[0].PrinterID;
    if (!localStorage.getItem('hideStep')||localStorage.getItem('hideStep')==0) this.showStep = true
  },
  beforeDestroy() {
    this.timer = null;
  },
  methods: {
    getStatus(printId) {
      this.statusText = "";
      this.$axios({
        method: "post",
        url: `/printer/checkstatus?printerid=${printId}`,
      }).then((res) => {
        console.log(this.status, [res.data]);
        this.statusText = this.$t(`index.${this.status[res.data].tag}`);
      });
    },
    handleSaveTime1() {
      localStorage.setItem("refreshTime1", parseInt(this.refreshTime1));
      this.$message({
        offset: 100,
        message: this.$t("systemControl.saveTimeSucc"),
        type: "success",
      });
    },
    handleSaveTime2() {
      localStorage.setItem("refreshTime2", parseInt(this.refreshTime2));
      this.$message({
        offset: 100,
        message: this.$t("systemControl.saveTimeSucc"),
        type: "success",
      });
    },
    getData() {
      this.$axios({
        method: "get",
        url: "/web/get_printer_info",
      }).then((res) => {
        this.printData = res.data.printerList;
        if (this.printData.length != 0) {
          //自动选择第一个
          this.workValue = this.printData[0].PrinterID;
        }
      });
    },
    checkServerState(callback) {
      this.$axios({
        method: "get",
        url: "/web/get_printer_info",
      })
        .then((res) => {
          this.state = true;
        })
        .catch((e) => {
          this.state = false;
        });
    },
    handleAll(t2, t3, url, params) {
      if (this.workValue == "") {
        this.$message({
          offset: 100,
          message: this.$t("systemControl.selectTips"),
          type: "warning",
        });
        return;
      }
      this.$confirm(t2, this.$t("index.tips"), {
        confirmButtonText: this.$t("admin.confirm"),
        cancelButtonText: this.$t("admin.cancel"),
        type: "warning",
      }).then(() => {
        this.$axios({
          method: "post",
          url:
            `/printer/${url}?printerid=` +
            this.workValue +
            (params ? params : ""),
        })
          .then((res) => {
            this.$message({
              offset: 100,
              type: "success",
              message: t3,
            });
            setTimeout(() => {
              this.getStatus(this.workValue);
            }, 1000);
          })
          .catch((e) => {
            this.$message({
              offset: 100,
              type: "error",
              message: "Fail",
            });
            setTimeout(() => {
              this.getStatus(this.workValue);
            }, 1000);
          });
      });
    },
    handledkq() {
      this.handleAll(
        this.$t("systemControl.tips1_dkq"),
        this.$t("systemControl.tips2_dkq"),
        "movetousbreader"
      );
    },
    handlefkh() {
      this.handleAll(
        this.$t("systemControl.tips1_fkh"),
        this.$t("systemControl.tips2_fkh"),
        "movetoReject"
      );
    },
    handleckk() {
      this.handleAll(
        this.$t("systemControl.tips1_ckk"),
        this.$t("systemControl.tips2_ckk"),
        "movetohopper"
      );
    },
    handledd() {
      this.handleAll(
        this.$t("systemControl.tips1_dd"),
        this.$t("systemControl.tips2_dd"),
        "movetoready"
      );
    },
    handledqk() {
      this.handleAll(
        this.$t("systemControl.tips1_dqk"),
        this.$t("systemControl.tips2_dqk"),
        "movetostandbyback"
      );
    },
    handlehckk() {
      this.handleAll(
        this.$t("systemControl.tips1_hckk"),
        this.$t("systemControl.tips2_hckk"),
        "movetofront"
      );
    },
    handleczgzz() {
      this.handleAll(
        this.$t("systemControl.tips1_czgzz"),
        this.$t("systemControl.tips2_czgzz"),
        "resetprinter",
        "&has_card=false"
      );
    },
    handleczdyj() {
      this.handleAll(
        this.$t("systemControl.tips1_czdyj"),
        this.$t("systemControl.tips2_czdyj"),
        "resetprinter",
        "&has_card=true"
      );
    },
    handlejzsdd() {
      this.handleAll(
        this.$t("systemControl.tips1_jzsdd"),
        this.$t("systemControl.tips2_jzsdd"),
        "cal_ribbonled"
      );
    },
    handlecshjkc() {
      this.handleAll(
        this.$t("systemControl.tips1_cshjkc"),
        this.$t("systemControl.tips2_cshjkc"),
        "reset_zero_num"
      );
    },
    handlebszjkc() {
      this.handleAll(
        this.$t("systemControl.tips1_bszjkc"),
        this.$t("systemControl.tips2_bszjkc"),
        "setunknowntype"
      );
    },
    handleqjgzz() {
      this.handleAll(
        this.$t("systemControl.tips1_qjgzz"),
        this.$t("systemControl.tips2_qjgzz"),
        "cleanprinter"
      );
    },
    handleInCard() {
      if (this.workValue == "") {
        this.$message({
          offset: 100,
          message: this.$t("systemControl.selectTips"),
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t("systemControl.tips2"), this.$t("index.tips"), {
        confirmButtonText: this.$t("admin.confirm"),
        cancelButtonText: this.$t("admin.cancel"),
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "post",
            url: "/printer/movetousbreader?printerid=" + this.workValue,
          }).then((res) => {
            this.$message({
              offset: 100,
              type: "success",
              message: this.$t("systemControl.moveTips"),
            });
          });
        })
        .catch(() => {
          this.$message({
            offset: 100,
            type: "info",
            message: this.$t("systemControl.canceledMove"),
          });
        });
      // /printer/movetousbreader?printerid=3dc681034076126
    },
    handleCleanPrint() {
      if (this.workValue == "") {
        this.$message({
          offset: 100,
          message: this.$t("systemControl.selectTips"),
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t("systemControl.tips3"), this.$t("index.tips"), {
        confirmButtonText: this.$t("admin.confirm"),
        cancelButtonText: this.$t("admin.cancel"),
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "post",
            url: "/printer/cleanprinter?printerid=" + this.workValue,
          }).then((res) => {
            this.$message({
              offset: 100,
              type: "success",
              message: this.$t("systemControl.claenSuccess"),
            });
          });
        })
        .catch(() => {
          this.$message({
            offset: 100,
            type: "info",
            message: this.$t("systemControl.canceledClean"),
          });
        });
      // /printer/cleanprinter?printerid=3dc681034076126
    },
    handleRestartPrint() {
      if (this.workValue == "") {
        this.$message({
          offset: 100,
          message: this.$t("systemControl.selectTips"),
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t("systemControl.tips5"), this.$t("index.tips"), {
        confirmButtonText: this.$t("admin.confirm"),
        cancelButtonText: this.$t("admin.cancel"),
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "post",
            url: "/printer/resetprinter?printerid=" + this.workValue,
          }).then((res) => {
            this.$message({
              offset: 100,
              type: "success",
              message: this.$t("systemControl.resetSuccess"),
            });
          });
        })
        .catch(() => {
          this.$message({
            offset: 100,
            type: "info",
            message: this.$t("systemControl.canceledReset"),
          });
        });
      // /printer/resetprinter?printerid=3dc681034076126
    },
    handleMoveReject() {
      if (this.workValue == "") {
        this.$message({
          offset: 100,
          message: this.$t("systemControl.selectTips"),
          type: "warning",
        });
        return;
      }
      this.$confirm(
        this.$t("systemControl.outCardtips"),
        this.$t("index.tips"),
        {
          confirmButtonText: this.$t("admin.confirm"),
          cancelButtonText: this.$t("admin.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.$axios({
            method: "post",
            url: "/printer/movetoReject?printerid=" + this.workValue,
          }).then((res) => {
            this.$message({
              offset: 100,
              message: this.$t("systemControl.outCardsuccess"),
              type: "success",
            });
          });
        })
        .catch(() => {
          this.$message({
            offset: 100,
            type: "info",
            message: this.$t("systemControl.canceledOut"),
          });
        });
      // /printer/movetoReject
    },
    handleMoveToExit() {
      if (this.workValue == "") {
        this.$message({
          offset: 100,
          message: this.$t("systemControl.selectTips"),
          type: "warning",
        });
        return;
      }

      this.$confirm(this.$t("systemControl.tips4"), this.$t("index.tips"), {
        confirmButtonText: this.$t("admin.confirm"),
        cancelButtonText: this.$t("admin.cancel"),
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "post",
            url: "/printer/movetohopper?printerid=" + this.workValue,
          }).then((res) => {
            this.$message({
              offset: 100,
              type: "success",
              message: this.$t("systemControl.outCardsuccess"),
            });
          });
        })
        .catch(() => {
          this.$message({
            offset: 100,
            type: "info",
            message: this.$t("systemControl.canceledOut"),
          });
        });
      // /printer/movetohopper
    },
    play() {
      this.state = null;
      var cmdShell = require("node-cmd");
      cmdShell.run(
        "chcp 65001>nul && net start CSPServer",
        (err, data, stderr) => {
          if (!err) {
            this.$message({
              offset: 100,
              type: "success",
              message: this.$t("systemControl.prepareStart"),
            });
            console.log("success", data);
          } else {
            this.$message({
              offset: 100,
              type: "error",
              message: this.$t("systemControl.startFailed"),
            });
            console.log("error", err);
          }
        }
      );
    },
    pause() {
      this.state = null;
      var cmdShell = require("node-cmd");
      cmdShell.run("net stop CSPServer", (err, data, stderr) => {
        if (!err) {
          this.$message({
            offset: 100,
            type: "success",
            message: this.$t("systemControl.pauseStart"),
          });
          console.log("success", data);
        } else {
          this.$message({
            offset: 100,
            type: "error",
            message: this.$t("systemControl.pauseFailed"),
          });
          console.log("error", err);
        }
      });
    },
    toChar(n) {
      return String.fromCharCode(65 + parseInt(n));
    },
    getPrintName(id) {
      return this.$t("index.wordSpace") + id.substr(-5);
    },
    getPrintName1(id) {
      for (let i = 0; i < this.printData.length; i++) {
        if (this.printData[i].PrinterID == id) {
          return this.$t("index.wordSpace") + this.toChar(i);
        }
      }
    },
    // 引导开关
    changeStep() {
      let hideStep = this.showStep ? 0 : 1
      localStorage.setItem('hideStep', hideStep)
      let currentStep = this.showStep ? 0 : -1
      localStorage.setItem('currentStep', currentStep)
    }
  },
  watch: {
    selectLan(val) {
      localStorage.setItem("lang", val);
      this.$i18n.locale = val;
    },
    workValue: {
      immediate: true,
      handler() {
        this.getStatus(this.workValue);
      },
    },
  },
};
</script>

<style lang="less" scoped>
.system {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  padding: 10px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  .restart {
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px rgb(224, 224, 224) solid;
    .title {
      font-size: 14px;
      width: 300px;
      height: 40px;
      color: rgb(139, 139, 139);
      padding-left: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: rgb(240, 240, 240);
      font-weight: bold;
    }
    .service {
      width: 100%;
      height: 120px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .tips {
        color: rgb(94, 94, 94);
        font-size: 14px;
        margin-left: 20px;
      }
      .serviceImg {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        margin-left: 100px;
        .begin {
          width: 55px;
          height: 55px;
        }
        .stop {
          margin-left: 5px;
          width: 50px;
          height: 50px;
        }
      }
    }
  }
  .control {
    width: 100%;
    height: 420px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px rgb(224, 224, 224) solid;
    .title {
      margin-top: 20px;
      font-size: 14px;
      width: 300px;
      height: 40px;
      color: rgb(139, 139, 139);
      padding-left: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: rgb(240, 240, 240);
      font-weight: bold;
    }
    .service {
      display: flex;
      flex-direction: column;
      .select {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-top: 20px;

        .lable {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          margin-top: 5px;
          font-size: 14px;
          width: 150px;
          margin-left: 20px;
        }
        .el-select {
          width: 180px;
        }
      }
      .concrete {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;

        .lable {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          width: 150px;
          margin-top: 5px;
          font-size: 14px;
          margin-top: 27px;
          margin-left: 20px;
        }

        .buttons {
          width: 650px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;
          .el-button {
            width: 180px;
            height: 35px;
            background-color: #ffffff;
            margin-top: 20px;
            margin-right: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: rgb(154, 202, 128);
            box-shadow: 1px 0px 2px 0px grey;
            user-select: none;
            color: rgb(154, 202, 128);
            font-size: 14px;
            border-radius: 1px;
            box-shadow: 1px 0px 2px 0px grey;
          }
          .el-button:nth-child(4) {
            margin-left: 0 !important;
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
    }
  }
  .languageer {
    width: 100%;
    height: 220px;
    display: flex;
    flex-direction: column;
    .title {
      margin-top: 20px;
      font-size: 14px;
      width: 300px;
      height: 40px;
      color: rgb(139, 139, 139);
      padding-left: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: rgb(240, 240, 240);
      font-weight: bold;
    }
    .select {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      margin-left: 20px;
      margin-top: 20px;
      .lable {
        margin-top: 5px;
        font-size: 14px;
        width: 150px;
        text-align: left;
      }
      .el-select {
        width: 180px;
      }
    }
  }
}

.bu:hover {
  background-color: antiquewhite;
}
</style>
