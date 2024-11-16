<template>
  <div style="height: 100%">
    <div style="height: 100%; width: 100%; display: flex">
      <div :span="3" style="height: 100%; width: 164px">
        <div class="grid-content bg-purple left">
          <div class="title">
            {{ $t("index.wordSpace") }}
          </div>
          <div
            class="card"
            v-for="(item, index) of infoData"
            :key="item.PrinterID"
            @click="() => (printData = index)"
            style="text-align: left"
          >
            <span style="font-size: 18px; margin-left: 40px">{{
              getPrintName(item.PrinterID, true)
            }}</span>
            <span style="font-size: 9px">
              {{
                item.PrinterType == "0"
                  ? $t("index.workspacenodata")
                  : item.PrinterType
              }}
            </span>
          </div>
        </div>
      </div>

      <div :span="21" style="height: 100%; width: calc(100% - 164px)">
        <div class="grid-content bg-purple-light mid">
          <div class="toMain">
            <span style="margin-right: 20px"
              >{{ $t("admin.hello") }} {{ user }}</span
            >
            <router-link to="/main"> {{ $t("admin.home") }}</router-link>
          </div>

          <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane :label="$t('admin.systemControl')" name="first">
              <div class="system">
                <system></system>
              </div>
            </el-tab-pane>

            <el-tab-pane :label="$t('admin.userManage')" name="second">
              <div class="brief">
                <el-row :gutter="20" style="height: 100%">
                  <el-table
                    :data="userData"
                    style="width: 100%"
                    :empty-text="$t('admin.nodata')"
                  >
                    <el-table-column
                      prop="userUuid"
                      label="ID"
                    ></el-table-column>
                    <el-table-column
                      prop="userName"
                      :label="$t('admin.userName')"
                    ></el-table-column>
                    <el-table-column
                      prop="userRole"
                      :label="$t('admin.role')"
                    ></el-table-column>
                    <el-table-column
                      prop="time"
                      :label="$t('admin.lastTime')"
                    ></el-table-column>
                    <el-table-column prop="time" :label="$t('admin.online')">
                      <template slot-scope="scope">
                        {{
                          scope.row.userName == "admin"
                            ? $t("admin.onlineWord")
                            : ""
                        }}
                      </template>
                    </el-table-column>
                    <!--<el-table-column prop="describe" label="描述"></el-table-column>-->
                    <el-table-column width="120">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="medium"
                          @click="() => edit(scope.row)"
                          >{{ $t("admin.edit") }}</el-button
                        >
                        <el-button
                          type="text"
                          size="medium"
                          @click="adduserVisible = true"
                          v-if="scope.row.userName == 'admin'"
                          >{{ $t("admin.add") }}</el-button
                        >
                        <el-button
                          type="text"
                          size="medium"
                          @click="() => deleted(scope.row)"
                          v-if="scope.row.userName != 'admin'"
                          >{{ $t("admin.delete") }}</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
              </div>
            </el-tab-pane>

            <el-tab-pane :label="$t('admin.app')" name="third">
              <div class="App">
                <div class="format">
                  <div class="title">{{ $t("admin.batchFormat") }}</div>
                  <div class="tips">
                    {{ $t("admin.tips1") }}
                  </div>
                  <div class="service">
                    <div class="lable">{{ $t("admin.selectWorkstation") }}</div>
                    <el-select v-model="workValue">
                      <el-option
                        v-for="(item, index) in infoData"
                        :key="item.PrinterID"
                        :label="getPrintName(item.PrinterID)"
                        :value="item.PrinterID"
                        :disabled="runningState"
                      >
                      </el-option>
                    </el-select>

                    <div class="lable">{{ $t("admin.formatType") }}</div>
                    <el-select v-model="formatValue">
                      <el-option
                        v-for="item in formatOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="runningState"
                      >
                      </el-option>
                    </el-select>

                    <div class="lable">{{ $t("admin.number") }}</div>
                    <el-input
                      v-model="number"
                      :disabled="runningState"
                    ></el-input>
                  </div>
                  <el-button
                    @click="
                      () => {
                        running = 0;
                        runningEmergy = false;
                        isFormat = true;
                        handleFormat();
                      }
                    "
                    :loading="runningState && isFormat"
                    :disabled="runningState && !isFormat"
                    >{{ $t("work.submit") }}</el-button
                  >
                </div>

                <div class="copy">
                  <div class="title">{{ $t("admin.bulkCopy") }}</div>
                  <div class="tips">
                    {{ $t("admin.tips2") }}
                  </div>
                  <div class="service">
                    <div class="lable">{{ $t("admin.selectWorkstation") }}</div>
                    <el-select v-model="workValue2">
                      <el-option
                        v-for="(item, index) in infoData"
                        :key="index"
                        :label="getPrintName(item.PrinterID)"
                        :value="item.PrinterID"
                        :disabled="runningState"
                      >
                      </el-option>
                    </el-select>

                    <div class="lable">{{ $t("admin.copyPath") }}</div>
                    <el-input
                      v-model="path"
                      :disabled="runningState"
                    ></el-input>

                    <div class="lable">{{ $t("admin.number") }}</div>
                    <el-input
                      v-model="number2"
                      :disabled="runningState"
                    ></el-input>
                  </div>
                  <el-button
                    :loading="runningState && !isFormat"
                    :disabled="runningState && isFormat"
                    @click="
                      () => {
                        running = 0;
                        runningEmergy = false;
                        isFormat = false;
                        handleCopy();
                      }
                    "
                    >{{ $t("work.submit") }}</el-button
                  >
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('admin.configuration')" name="four">
              <dispose></dispose>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!--<div :span="3" style="height: 100%; width: 164px">
        <div class="grid-content bg-purple right" style="overflow: hidden">
          <div class="title">
            {{ $t("index.notice") }}
            <div class="log" v-for="(item, index) of infoData.sysLogs">
              {{ item }}
            </div>
          </div>

          <warnCard
            v-for="item of errList"
            :data="item"
            @ok="okWarning"
            v-if="item.show"
          />
        </div>
      </div>-->
    </div>

    <el-dialog :title="$t('index.entireLog')" :visible.sync="dialogWholeLog">
      <div class="wLog" v-html="wlog" style="text-align: left"></div>
    </el-dialog>

    <el-dialog
      :title="$t('admin.addUser')"
      :visible.sync="adduserVisible"
      width="450px"
      class="infdialog"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <adduser
        :changevisiable="this.chageAdduservisible"
        v-if="adduserVisible"
      ></adduser>
    </el-dialog>

    <el-dialog
      :title="$t('admin.editUser')"
      :visible.sync="edituserVisible"
      width="450px"
      class="infdialog"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <edituser
        :changevisiable="this.chageEdituservisible"
        v-if="edituserVisible"
        :data="editData"
        @editover="
          () => {
            chageEdituservisible(false);
            getUserData();
          }
        "
      ></edituser>
    </el-dialog>
    <el-dialog
      :title="$t('admin.copying')"
      :visible.sync="copyVisible"
      width="450px"
    >
      <el-progress
        :percentage="parseInt(copyState.progress * 100)"
        v-if="copyVisible"
      ></el-progress>
    </el-dialog>
  </div>
</template>
<script>
import work from "./work";
import adduser from "./adduser";
import edituser from "./edituser";
import warnCard from "./warn-card.vue";
import system from "./systemControl.vue";
import dispose from "./dispose.vue";
var fs = require("fs");
import FakeProgress from "fake-progress";
import { copy } from "./files/copy";
const { dialog } = require("@electron/remote");
const { ipcRenderer } = require("electron");
import { appendLog } from "./log/log";
export default {
  name: "admin",
  components: {
    work,
    adduser,
    edituser,
    warnCard,
    system,
    dispose,
  },
  data() {
    return {
      path: "C:\\data",
      number: 10,
      number2: 10,
      activeName: "first",
      userData: [],
      editData: null,
      isNew: true,
      saveWorkList: {},
      adduserVisible: false,
      edituserVisible: false,
      deleteuserVisible: false,
      printData: 0, //打印机选择
      dialogVisible: false,
      DualSide: null,
      infoData: [],
      tasks: [],
      log: "",
      wlog: "",
      timer1: "",
      timer2: "",
      timer3: "1",
      dialogWholeLog: false,
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
      workValue: null,
      workValue2: null,
      formatOptions: [
        {
          value: "FAT",
          label: "FAT",
        },
        {
          value: "FAT32",
          label: "FAT32",
        },
        {
          value: "NTFS",
          label: "NTFS",
        },
        {
          value: "exFAT",
          label: "exFAT",
        },
      ],
      formatValue: "FAT32",
      selectLan: "",
      errs: {
        87: { tag: "ERROR_INVALID_PARAMETER", err: 0 },
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
        196609:{ tag: "FIND_CARD", err: 0 },
      },
      errList: [],
      checkStates: {},
      running: 0, //执行次数
      runningState: false,
      runningId: "",
      runningEmergy: false,
      copyState: null,
      copyVisible: false,
      isFormat: null, // true is format, false is copy
      root: "",
    };
  },
  mounted() {
    this.selectLan = localStorage.getItem("lang");
    this.getData();
    this.getUserData();
    //this.timer3 = setInterval(this.runCheckState, 2000);

    ipcRenderer.on("get-root-callback", (event, data) => {
      this.root = data;
      console.log("adminroot" + this.root);
    });
    ipcRenderer.send("get-root");
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    stopTimer() {
      // clearInterval(this.timer3);
      // this.timer3 = null;
    },
    getUserData() {
      this.$axios({
        method: "get",
        url: "/user/AllUserInfo",
      }).then((res) => {
        console.log(res);
        this.userData = res.data.userInfoList;
        console.log(this.userData);
      });
    },
    getData() {
      this.$axios({
        method: "get",
        url: "/web/get_printer_info",
      }).then((res) => {
        this.infoData = res.data.printerList;
        this.workValue2 = this.workValue =
          res.data.printerList.length > 0
            ? res.data.printerList[0].PrinterID
            : null;
        for (const item of res.data.printerList) {
          if (!this.checkStates[item.PrinterID]) {
            //说明这是新增的打印机
            this.checkStates[item.PrinterID] = 1;
          }
          if (item.DualSide == 1) {
            this.DualSide = 1; //只要有一个是双面就是1
          }
        }
      });
    },
    runCheckState() {
      for (let i = 0; i < this.infoData.length; i++) {
        //this.checkState(i, this.infoData[i].PrinterID);
      }
    },
    checkState(i, id) {
      //检查打印机状态
      if (this.checkStates[id] == 1) {
        //如果是1检查
        this.$axios({
          method: "post",
          url: `/printer/checkstatus?printerid=${id}`,
        }).then((res) => {
          //const data = JSON.parse(`{${res.data}}`);
          const data = {
            printer_status: res.data,
          };
          console.log("s: " + data.printer_status);
          if (this.errs[data.printer_status]) {
            //状态码存在错误列表中
            if (
              (data.printer_status == 1024 ||
                data.printer_status == 65617 ||
                data.printer_status == 65618 ||
                data.printer_status == 65619 ||
                data.printer_status == 65630 ||
                data.printer_status == 65631) &&
              id == this.runningId
            ) {
              //阻止即将发生的事件
              this.runningEmergy = true;
              appendLog(
                `Task ${this.running + 1}/${
                  this.isFormat ? this.number : this.number2
                } failed, Error = ${data.printer_status}`,
                this.root
              );
            }
            this.errList.push({
              i: i,
              pid: id,
              code: data.printer_status,
              printName: this.getPrintName(id),
              tag: this.errs[data.printer_status].tag,
              err: this.errs[data.printer_status].err,
              show: true,
            });
            this.checkStates[id] = 2; //让当前报错机器不再检查
          }
        });
      }
    },
    okWarning(id) {
      this.checkStates[id] = 1;
    },
    getPrintName(id, onlyId) {
      if (onlyId === true) {
        return id.substr(-5);
      }
      return this.$t("index.wordSpace") + id.substr(-5);
    },
    chageAdduservisible(visible) {
      this.getUserData();
      this.adduserVisible = visible;
    },
    chageEdituservisible(visible) {
      this.edituserVisible = visible;
    },
    edit(row) {
      this.editData = row;
      this.edituserVisible = true;
    },
    deleted(item) {
      this.$confirm(this.$t("admin.confirmDelete"), this.$t("admin.tips"), {
        confirmButtonText: this.$t("admin.confirm"),
        cancelButtonText: this.$t("admin.cancel"),
        type: "warning",
      }).then(() => {
        this.$axios({
          method: "post",
          url: `/user/delete_user?user_name=${item.userName}`,
        }).then((res) => {
          this.$message({
            offset: 100,
            type: "success",
            message: this.$t("admin.successDeleted"),
          });
          this.getUserData();
        });
      });
    },
    toChar(n) {
      return String.fromCharCode(65 + parseInt(n));
    },
    openWork() {
      this.isNew = false;
      const _this = this;
      dialog
        .showOpenDialog({
          title: this.$t("admin.openWork"),
          filters: [{ name: "Soon Work", extensions: ["swk"] }],
        })
        .then((res) => {
          fs.readFile(res.filePaths[0], (err, data) => {
            let fName = res.filePaths[0].trim();
            let fileName = fName.substring(fName.lastIndexOf("\\") + 1);
            _this.saveWorkList = JSON.parse(data);
            _this.saveWorkList.taskName = fileName;
            _this.dialogVisible = true;
          }).catch((err) => {
            console.log(err);
          });
        });
    },
    newWork() {
      this.isNew = true;
      this.dialogVisible = true;
    },
    async handleFormat() {
      if (this.runningEmergy) {
        this.$message({
          offset: 100,
          message: this.$t("admin.missingStop"),
          type: "warning",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task Finished.", this.root);
        return;
      }
      if (this.running >= this.number) {
        this.$message({
          offset: 100,
          message: this.$t("admin.makeOver"),
          type: "success",
        });
        appendLog("Task Finished", this.root);
        this.runningState = false;
        this.runningId = "";
        return;
      }
      this.$message(`starting ${this.running + 1}/${this.number}`);
      appendLog(
        `starting format ${this.running + 1}/${this.number}`,
        this.root
      );
      this.runningState = true;
      this.runningId = this.workValue;
      setTimeout(() => {
        this.$message(this.$t("admin.cardIng"));
      }, 0);
      await this.$axios({
        method: "post",
        url: "/printer/movetousbreader?printerid=" + this.workValue,
      });
      setTimeout(() => {
        this.handleLog();
      }, 10000);
    },
    async handleCopy() {
      if (this.path == "") {
        this.$message({
          offset: 100,
          message: this.$t("admin.fillPath"),
          type: "warning",
        });
        return;
      }
      if (this.runningEmergy) {
        this.$message({
          offset: 100,
          message: this.$t("admin.missingStop"),
          type: "warning",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task Finished.", this.root);
        return;
      }
      if (this.running >= this.number2) {
        this.$message({
          offset: 100,
          message: this.$t("admin.makeOver"),
          type: "success",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task successful.", this.root);
        return;
      }
      this.$message(`starting ${this.running + 1}/${this.number2}`);
      appendLog(`starting copy ${this.running + 1}/${this.number2}`, this.root);
      this.runningState = true;
      this.runningId = this.workValue2;
      setTimeout(() => {
        this.$message(this.$t("admin.cardIng"));
      }, 0);
      await this.$axios({
        method: "post",
        url: "/printer/movetousbreader?printerid=" + this.workValue2,
      });
      setTimeout(() => {
        this.handleCopyLog();
      }, 10000);
    },
    async handleCopyLog() {
      if (this.runningEmergy) {
        this.$message({
          offset: 100,
          message: this.$t("admin.missingStop"),
          type: "warning",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task Finished.", this.root);
        return;
      }
      let logs = await this.$axios({
        method: "get",
        url: "/web/cspserver.log",
      });
      // this.$message("进卡中...")
      const regex = /(?<=).*?(?=\\, MTG)/;
      const allRegex = /^.*MTG.*$/gm;
      const regex1 = /(?<=).*?(?=\|)/;
      const regex2 = /(?<=Drive ).*?(?=:\\, MTG)/;
      const regex3 = /(?<=MTG\s\,)[\s\S]*$/;
      let info = logs.data.match(allRegex);
      if (info && info.length > 0) {
        let time = info[info.length - 1].match(regex1);
        let disk = info[info.length - 1].match(regex2);
        let log = info[info.length - 1].match(regex3);
        if (time && time.length > 0 && disk && disk.length > 0) {
          let distTime = this.getDistanceTime(time[0]);
          if (
            distTime > 30 ||
            info[info.length - 1].indexOf("SerialNo 0") != -1
          ) {
            //退槽
            this.$message(this.$t("admin.readFailure"));
            this.handleCopyRejectOutCard();
            appendLog(`Failed to read log.`, this.root);
          } else {
            appendLog(
              `copy ${disk[0]}: to ${this.path} ${this.formatValue}${log}`,
              this.root
            );
            this.$message(
              this.$t("admin.comingSoon") +
                `${time[0]}` +
                this.$t("admin.readLetter") +
                `${disk[0]}` +
                this.$t("admin.makeCpoy")
            );
            this.handleCopyFile(`${disk[0]}:\\`);
          }
        } else {
          this.$message(this.$t("admin.readFailure"));
          this.handleCopyRejectOutCard();
          appendLog(`Failed to read log.`, this.root);
        }
      } else {
        this.$message(this.$t("admin.readFailure"));
        this.handleCopyRejectOutCard();
        appendLog(`Failed to read log.`, this.root);
      }
    },
    async handleCopyFile(disk) {
      this.copyVisible = true;
      this.copyState = new FakeProgress({
        timeConstant: 10000,
        autoStart: true,
      });
      copy(disk, this.path, true, this.handleCopyOver, []);
    },
    handleCopyOver(fileList, success) {
      this.copyState.end();
      if (!success) {
        //复制失败
        appendLog(`Fail to copy USB Card, Error = 0x000001c3`, this.root);
      }
      appendLog(`${this.running + 1}/${this.number2} OK`, this.root);
      setTimeout(() => {
        this.copyVisible = false;
        setTimeout(() => {
          this.$message(this.$t("admin.exitCard"));
          this.handleCopyOutCard();
        }, 1000);
      }, 500);
    },
    handleCopyOutCard() {
      if (this.runningEmergy) {
        this.$message({
          offset: 100,
          message: this.$t("admin.missingStop"),
          type: "warning",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task Finished.", this.root);
        return;
      }
      this.$axios({
        method: "post",
        url: "/printer/movetohopper?printerid=" + this.workValue2,
      }).then((res) => {
        this.running += 1;
        setTimeout(() => {
          this.handleCopy();
        }, 1000);
      });
    },
    async handleLog() {
      //格式化
      if (this.runningEmergy) {
        this.$message({
          offset: 100,
          message: this.$t("admin.missingStop"),
          type: "warning",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task Finished.", this.root);
        return;
      }
      let logs = await this.$axios({
        method: "get",
        url: "/web/cspserver.log",
      });
      // this.$message("进卡中...")
      const regex = /(?<=).*?(?=\\, MTG)/;
      const allRegex = /^.*MTG.*$/gm;
      const regex1 = /(?<=).*?(?=\|)/;
      const regex2 = /(?<=Drive ).*?(?=:\\, MTG)/;
      const regex3 = /(?<=MTG\s\,)[\s\S]*$/;
      let info = logs.data.match(allRegex);
      if (info && info.length > 0) {
        let time = info[info.length - 1].match(regex1);
        let disk = info[info.length - 1].match(regex2);
        let log = info[info.length - 1].match(regex3);
        if (time && time.length > 0 && disk && disk.length > 0) {
          let distTime = this.getDistanceTime(time[0]);
          if (
            distTime < 30 &&
            info[info.length - 1].indexOf("SerialNo 0") == -1
          ) {
            this.$message(
              this.$t("admin.comingSoon") +
                `${time[0]}` +
                this.$t("admin.readLetter") +
                `${disk[0]}` +
                this.$t("admin.format")
            );
            await this.$axios({
              method: "post",
              url: `/admin/format_disk_notype?drive_path=${disk[0]}:&drive_type=${this.formatValue}`,
            })
              .then((res) => {
                //正常格式化
                appendLog(`${disk[0]}: ${this.formatValue}${log}`, this.root);
                //this.$message(this.$t("admin.exitCard"));
                this.handleOutCard();
              })
              .catch((err) => {
                //失败格式化
                appendLog(`Fail to DiskFormat, Error = 0x00000006`, this.root);

                this.$message("Fail to DiskFormat");
                this.handleRejectOutCard(); //格式化废卡退槽 随后会继续下一个
                //this.$message(this.$t("admin.exitCard"));
                //this.handleOutCard();
              });
            // setTimeout(() => {
            //   this.$message(this.$t("admin.exitCard"));
            //   this.handleOutCard();
            // }, 10000);
            // return;
          } else {
            appendLog(`Fail to read USB Card`, this.root);
            this.$message(this.$t("admin.readFailure"));
            this.handleRejectOutCard(); //格式化废卡退槽 随后会继续下一个
          }
        } else {
          appendLog(`Fail to read USB Card`, this.root);
          this.$message(this.$t("admin.readFailure"));
          this.handleRejectOutCard(); //格式化废卡退槽 随后会继续下一个
        }
      } else {
        appendLog(`Fail to read USB Card`, this.root);
        this.$message(this.$t("admin.readFailure"));
        this.handleRejectOutCard(); //格式化废卡退槽 随后会继续下一个
      }

      //未读取到正确的日志

      //退槽
    },
    handleCopyRejectOutCard() {
      //拷贝退卡废卡
      if (this.runningEmergy) {
        this.$message({
          offset: 100,
          message: this.$t("admin.missingStop"),
          type: "warning",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task Finished.", this.root);
        return;
      }
      this.$axios({
        method: "post",
        url: "/printer/movetoReject?printerid=" + this.workValue2,
      }).then((res) => {
        this.running += 1;
        setTimeout(() => {
          this.handleCopy();
        }, 1000);
      });
    },
    handleRejectOutCard() {
      //格式化
      if (this.runningEmergy) {
        this.$message({
          offset: 100,
          message: this.$t("admin.missingStop"),
          type: "warning",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task Finished.", this.root);
        return;
      }
      setTimeout(() => {
        appendLog(`Task ${this.running + 1}/${this.number} failed`, this.root);
      }, 500);
      this.$axios({
        method: "post",
        url: "/printer/movetoReject?printerid=" + this.workValue,
      }).then((res) => {
        this.running += 1;
        setTimeout(() => {
          this.handleFormat();
        }, 1000);
      });
    },
    handleOutCard() {
      //格式化处理完一张后退卡
      if (this.runningEmergy) {
        this.$message({
          offset: 100,
          message: this.$t("admin.missingStop"),
          type: "warning",
        });
        this.runningState = false;
        this.runningId = "";
        appendLog("Task Finished.", this.root);
        return;
      }

      setTimeout(() => {
        appendLog(`${this.running + 1}/${this.number} OK`, this.root);
      }, 100);
      this.$axios({
        method: "post",
        url: "/printer/movetohopper?printerid=" + this.workValue,
      }).then((res) => {
        this.running += 1;
        setTimeout(() => {
          this.handleFormat();
        }, 1000);
      });
    },
    getDistanceTime(targetTime) {
      // 指定时间字符串，注意时间格式需为 "yyyy/mm/dd hh:mm:ss"
      // 将目标时间字符串转为Date对象
      let targetDate = new Date(targetTime);
      // 获取目标时间到现在的毫秒数
      let elapsedTime = Date.now() - targetDate.getTime();
      // 将毫秒数转换为秒数
      let elapsedSeconds = Math.floor(elapsedTime / 1000);
      return elapsedSeconds;
    },
  },

  computed: {
    user() {
      return localStorage.getItem("loginname");
    },
  },
  watch: {
    selectLan(val) {
      localStorage.setItem("lang", val);
      this.$i18n.locale = val;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-tabs__content {
  overflow-y: auto;
}
.infdialog {
  /deep/.el-dialog {
    padding: 20px 0px;
  }
  /deep/.el-dialog__header {
    padding: 0px;
    font-size: 15px;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    margin-top: 30px;
    padding: 0px;
  }
  /deep/.el-dialog__title {
  }
}

.wLog {
  max-height: 600px;
  overflow: auto;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.left {
  background-color: #e8e7ee;
  height: 100%;
  padding: 20px 5px;
  border-right: #b8b8b8 solid 1px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  .title {
    color: #999999;
    font-size: 28px;
  }
  .card {
    background-color: #f5f5f5;
    height: 50px;
    line-height: 55px;
    color: #3a3a3a;
    border: #b8b8b8 solid 1px;
    margin-top: 10px;
  }
}

.mid {
  background-color: #f5f5f5;
  height: 100%;
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  overflow-y: auto;
  .tabs {
    height: 100%;
    /deep/.el-tabs__header {
      margin: 0px;
    }
    /deep/ .el-tabs__content {
      height: 100%;
    }
  }
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
  .system {
    height: 100%;
    width: 100%;
  }
  .App {
    height: 100%;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    padding: 10px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    .format {
      width: 100%;
      height: 300px;
      border-bottom: 1px rgb(224, 224, 224) solid;
      .title {
        font-size: 14px;
        width: 150px;
        height: 40px;
        color: rgb(139, 139, 139);
        padding-left: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: rgb(240, 240, 240);
        font-weight: bold;
      }
      .tips {
        font-size: 14px;
        padding: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-align: left;
      }
      .service {
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .lable {
          margin: 20px;
          font-size: 14px;
        }
        .el-select {
          width: 150px;
        }
        .el-input {
          width: 180px;
        }
      }
      .el-button {
        color: rgb(154, 202, 128);
        width: 120px;
        height: 40px;
        font-size: 14px;
        border-radius: 1px;
        box-shadow: 1px 0px 2px 0px grey;
        float: right;
        margin-right: 25px;
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

    .copy {
      width: 100%;
      height: 300px;
      border-bottom: 1px rgb(224, 224, 224) solid;
      .title {
        margin-top: 10px;
        font-size: 14px;
        width: 150px;
        height: 40px;
        color: rgb(139, 139, 139);
        padding-left: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: rgb(240, 240, 240);
        font-weight: bold;
      }
      .tips {
        font-size: 14px;
        padding: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .service {
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .lable {
          margin: 20px;
          font-size: 14px;
        }
        .el-select {
          width: 150px;
        }
        .el-input {
          width: 180px;
        }
      }
      .el-button {
        color: rgb(154, 202, 128);
        width: 120px;
        height: 40px;
        font-size: 14px;
        border-radius: 1px;
        box-shadow: 1px 0px 2px 0px grey;
        float: right;
        margin-right: 25px;
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
  .dispose {
    height: 100%;
    width: 100%;
  }
  .brief {
    height: 90%;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    padding: 10px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    .el-table {
      position: absolute;
      z-index: 0;
    }
    .add-button {
      position: absolute;
      top: 6px;
      right: 130px;
      z-index: 1;
    }
  }
}
.right {
  background-color: #c8cfd7;
  height: 100%;
  padding: 20px 10px;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  .title {
    color: #999999;
    font-size: 28px;
  }
  .log {
    padding: 20px;
    font-size: 18px;
    background-color: #e2e2e2;
    border: #b8b8b8 solid 1px;
    color: #333333;
    margin-top: 10px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
}
.toMain {
  position: absolute;
  right: 200px;
  font-size: 16px;
  z-index: 1;
  .link {
    color: blue;
    cursor: pointer;
  }
}
</style>
