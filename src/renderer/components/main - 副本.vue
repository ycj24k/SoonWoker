<template>
  <div style="height: 100%; position: relative">
    <div
      v-if="beginStep && parseInt(currentStep) >= 0 && parseInt(currentStep) < 8"
      class="bg_box"
      style="position: absolute; top: 0; left: 0; z-index: 10; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5)"></div>
    <div style="height: 100%; width: 100%; display: flex">
      <div
        :span="3"
        style="height: 100%; width: 164px">
        <div class="grid-content bg-purple left">
          <div class="title">
            {{ $t('index.wordSpace') }}
          </div>
          <!-- @click="() => (printData = index)" -->
          <div
            class="card"
            v-for="(item) of infoData"
            :key="item.PrinterID"
            style="background-color: #f5f5f5; text-align: left">
            <span style="font-size: 18px; margin-left: 40px">{{ getPrintName(item.PrinterID, true) }}</span>
            <span style="font-size: 9px">{{ item.PrinterType == '-1' ? $t('index.workspacenodata') : item.PrinterType }}</span>
          </div>
        </div>
      </div>
      <div
        :span="18"
        style="height: 100%; width: calc(100% - 328px)">
        <div
          class="grid-content bg-purple-light mid"
          id="rte"
          style="position: relative">
          <div
            class="title"
            style="position: relative; height: 45px; display: flex; justify-content: space-between">
            <el-popover
              v-if="guideStep"
              :placement="guideStep[0].placement"
              width="250"
              trigger="manual"
              v-model="guideStep[0].show">
              <div class="guide_box">
                <div class="guide_title">
                  {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                </div>
                <div class="guide_desc">{{ $t(`guide.step1`) }}</div>
                <div class="guide_btns">
                  <el-button
                    @click="exitGuide"
                    class="guide_btn1"
                    size="mini"
                    type="text"
                    >{{ $t('guide.skip') }}</el-button
                  >
                  <el-button
                    v-if="parseInt(currentStep) > 0"
                    @click="prevStep"
                    class="guide_btn1"
                    size="mini"
                    >{{ $t('guide.prev') }}</el-button
                  >
                  <el-button
                    @click="nextStep"
                    class="guide_btn2"
                    size="mini"
                    type="primary"
                    >{{ parseInt(currentStep) == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button
                  >
                </div>
              </div>
              <div
                slot="reference"
                :class="{ guide_body: beginStep && currentStep == 0 }"
                class="switch"
                style="position: relative; left: 0; top: 3px">
                <el-switch
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleOpenSwitch"
                  :value="state">
                </el-switch>
              </div>
            </el-popover>
            <el-popover
              v-if="guideStep"
              :placement="guideStep[1].placement"
              width="250"
              trigger="manual"
              v-model="guideStep[1].show">
              <div class="guide_box">
                <div class="guide_title">
                  {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                </div>
                <div class="guide_desc">{{ $t(`guide.step2`) }}</div>
                <div class="guide_btns">
                  <el-button
                    @click="exitGuide"
                    class="guide_btn1"
                    size="mini"
                    type="text"
                    >{{ $t('guide.skip') }}</el-button
                  >
                  <el-button
                    v-if="parseInt(currentStep) > 0"
                    @click="prevStep"
                    class="guide_btn1"
                    size="mini"
                    >{{ $t('guide.prev') }}</el-button
                  >
                  <el-button
                    @click="nextStep"
                    class="guide_btn2"
                    size="mini"
                    type="primary"
                    >{{ currentStep == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button
                  >
                </div>
              </div>
              <div
                slot="reference"
                :class="{ guide_body: beginStep && currentStep == 1 }"
                class="information"
                style="font-size: 15px; display: flex; gap: 25px; position: relative; top: 5px">
                <div style="display: inline-block">
                  <div style="text-decoration: underline">
                    {{ $t('main.doneCopyNum') }}
                  </div>
                  <div>{{ doneCopyNum }}</div>
                </div>
                <div style="display: inline-block">
                  <div style="text-decoration: underline">
                    {{ $t('main.cancelCopyNum') }}
                  </div>
                  <div>{{ cancelCopyNum }}</div>
                </div>
                <div style="display: inline-block">
                  <div style="text-decoration: underline">
                    {{ $t('main.failNum') }}
                  </div>
                  <div>{{ failNum }}</div>
                </div>
              </div>
            </el-popover>
            <el-popover
              v-if="guideStep"
              :placement="guideStep[2].placement"
              width="250"
              trigger="manual"
              v-model="guideStep[2].show">
              <div class="guide_box">
                <div class="guide_title">
                  {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                </div>
                <div class="guide_desc">{{ $t(`guide.step3`) }}</div>
                <div class="guide_btns">
                  <el-button
                    @click="exitGuide"
                    class="guide_btn1"
                    size="mini"
                    type="text"
                    >{{ $t('guide.skip') }}</el-button
                  >
                  <el-button
                    v-if="parseInt(currentStep) > 0"
                    @click="prevStep"
                    class="guide_btn1"
                    size="mini"
                    >{{ $t('guide.prev') }}</el-button
                  >
                  <el-button
                    @click="nextStep"
                    class="guide_btn2"
                    size="mini"
                    type="primary"
                    >{{ currentStep == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button
                  >
                </div>
              </div>
              <div
                style="display: flex; align-items: center"
                class="add"
                slot="reference"
                :class="{ guide_body: beginStep && currentStep == 2 }">
                <span style="font-size: 18px; line-height: 45px">{{ $t('main.submitTask') }}</span>
                <el-popover
                  v-if="guideStep"
                  :placement="guideStep[7].placement"
                  width="250"
                  trigger="manual"
                  v-model="guideStep[7].show">
                  <div class="guide_box">
                    <div class="guide_title">
                      {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                    </div>
                    <div class="guide_desc">{{ $t(`guide.step8`) }}</div>
                    <div class="guide_btns">
                      <el-button
                        @click="exitGuide"
                        class="guide_btn1"
                        size="mini"
                        type="text"
                        >{{ $t('guide.skip') }}</el-button
                      >
                      <el-button
                        v-if="parseInt(currentStep) > 0"
                        @click="prevStep"
                        class="guide_btn1"
                        size="mini"
                        >{{ $t('guide.prev') }}</el-button
                      >
                      <el-button
                        @click="nextStep"
                        class="guide_btn2"
                        size="mini"
                        type="primary"
                        >{{ currentStep == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button
                      >
                    </div>
                  </div>
                  <div
                    style="margin-right: 10px"
                    slot="reference"
                    :class="{ guide_body: beginStep && currentStep == 7 }">
                    <el-button
                      type="primary"
                      @click="newWork">
                      {{ $t('index.newWork') }}
                    </el-button>
                  </div>
                </el-popover>

                <el-button
                  type="primary"
                  @click="newNetWork"
                  v-if="false">
                  {{ $t('index.newWork') }}
                </el-button>
                <el-button
                  type="primary"
                  @click="openWork()"
                  v-if="true"
                  :disabled="infoData.length == 0 && state == false">
                  {{ $t('admin.openWork') }}
                </el-button>
              </div>
            </el-popover>
            <div class="user">
              <span style="margin-right: 20px">{{ $t('admin.hello') }} {{ user }}</span>
              <router-link
                to="/admin"
                v-if="isAdmin"
                >{{ $t('main.adminMange') }}</router-link
              >
              <router-link to="/">{{ $t('main.out') }}</router-link>
            </div>
          </div>
          <el-popover
            v-if="guideStep"
            :placement="guideStep[4].placement"
            width="250"
            trigger="manual"
            v-model="guideStep[4].show">
            <div class="guide_box">
              <div class="guide_title">
                {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
              </div>
              <div class="guide_desc">{{ $t(`guide.step5`) }}</div>
              <div class="guide_btns">
                <el-button
                  @click="exitGuide"
                  class="guide_btn1"
                  size="mini"
                  type="text"
                  >{{ $t('guide.skip') }}</el-button
                >
                <el-button
                  v-if="parseInt(currentStep) > 0"
                  @click="prevStep"
                  class="guide_btn1"
                  size="mini"
                  >{{ $t('guide.prev') }}</el-button
                >
                <el-button
                  @click="nextStep"
                  class="guide_btn2"
                  size="mini"
                  type="primary"
                  >{{ currentStep == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button
                >
              </div>
            </div>
            <div
              class="brief"
              slot="reference"
              :class="{ guide_body: beginStep && currentStep == 4 }">
              <el-row
                :gutter="20"
                style="height: 100%">
                <el-col
                  :span="12"
                  style="height: 100%">
                  <div
                    class="grid-content bg-purple b_left"
                    style="padding-top: 1px !important; display: flex; align-items: center">
                    <!-- <div class="b_title">{{ $t("main.systemInformation") }}</div> -->
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                      <img
                        v-if="os.CardsoonModel"
                        :src="os.CardsoonModel.indexOf(`TH80N`) != -1 ? N80N : N800N"
                        width="150"
                        height="95" />
                      <span style="font-weight: bold; font-size: 18px">{{ $t('main.systemInformation') }}</span>
                    </div>
                    <div style="margin-left: 20px">
                      <div class="item">{{ $t('main.deviceType') }}{{ os.CardsoonModel }}</div>
                      <div class="item">{{ $t('main.serialNumber') }}{{ os.SystemSn }}</div>
                      <div class="item">{{ $t('main.hostName') }}{{ os.hostname }}</div>
                      <div class="item">{{ $t('main.hostIp') }}{{ os.ip }}</div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="12"
                  style="height: 100%">
                  <div
                    class="grid-content bg-purple b_mid"
                    style="padding-top: 1px !important; display: flex; align-items: center">
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                      <img
                        src="../assets/cpu.png"
                        width="150"
                        height="95" />
                      <span style="font-weight: bold; font-size: 18px">{{ $t('main.hardwareConfiguration') }}</span>
                    </div>
                    <div style="margin-left: 20px">
                      <!-- <div class="item">
                        {{ $t("main.hardwareConfiguration") }}
                      </div> -->
                      <div class="item">{{ $t('main.Cpu') }}{{ os.cpu }}</div>
                      <div class="item">{{ $t('main.Memory') }}{{ os.ram }}</div>
                      <div class="item">{{ $t('main.hardDrive') }}{{ os.HD }}</div>
                      <div class="item" :style="{color: os.cacheSpaceNum < 8 ? '#ff0000' : os.cacheSpaceNum < 20 ? '#ff9f0b' : ''}">
                        {{ $t('main.cacheSpace') }}：{{ os.remainCacheSpace }} /
                        {{ os.totalCacheSpace }}
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-popover>
          <el-popover
            v-if="guideStep"
            :placement="guideStep[5].placement"
            width="250"
            trigger="manual"
            v-model="guideStep[5].show">
            <div class="guide_box">
              <div class="guide_title">
                {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
              </div>
              <div class="guide_desc">{{ $t(`guide.step6`) }}</div>
              <div class="guide_btns">
                <el-button
                  @click="exitGuide"
                  class="guide_btn1"
                  size="mini"
                  type="text"
                  >{{ $t('guide.skip') }}</el-button
                >
                <el-button
                  v-if="parseInt(currentStep) > 0"
                  @click="prevStep"
                  class="guide_btn1"
                  size="mini"
                  >{{ $t('guide.prev') }}</el-button
                >
                <el-button
                  @click="nextStep"
                  class="guide_btn2"
                  size="mini"
                  type="primary"
                  >{{ currentStep == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button
                >
              </div>
            </div>
            <div
              slot="reference"
              :class="{ guide_body: beginStep && currentStep == 5 }"
              class="machines work"
              style="height: 120px;margin-top: 10px">
              <el-table
                :data="infoData"
                max-height="120"
                size="mini"
                style="width: 100%"
                :empty-text="$t('index.nodata')"
                row-class-name="rowclass">
                <el-table-column
                  prop="gzz"
                  :label="$t('main.tableMachine')"
                  min-width="100">
                  <template slot-scope="scope">
                    {{ getPrintName(scope.row.PrinterID, true) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="status"
                  :label="$t('main.tableState')"
                  min-width="80">
                  <template slot-scope="scope">{{ $t('main.tableOnline') }}</template>
                </el-table-column>
                <el-table-column
                  prop="SerialNo"
                  :label="$t('main.tableSerialNo')"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  prop="RibbonType"
                  :label="$t('main.tableRibbonType')"
                  min-width="80">
                </el-table-column>
                <el-table-column
                  prop="RibbonAmount"
                  :label="$t('main.tableRibbonAmount')"
                  min-width="100">
                  <template slot-scope="scope">
                    <el-progress
                      :color="customColors"
                      :width="45"
                      define-back-color="#ebeef5"
                      :format="() => scope.row.RibbonAmount"
                      :stroke-width="3"
                      :percentage="
                        scope.row.RibbonAmount == undefined || scope.row.RibbonAmount == '0'
                          ? 0
                          : parseFloat(((scope.row.RibbonAmount / getRibbonAmount(scope.row.ModeName, scope.row.RibbonType)) * 100).toFixed(0))
                      "></el-progress>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PrinterType"
                  :label="$t('main.tablePrinterType')"
                  min-width="100">
                  <template slot-scope="scope">
                    <el-dropdown
                      trigger="click"
                      @command="(e) => handleMachineCommand(e, scope.row.PrinterID)">
                      <span
                        class="el-dropdown-link"
                        style="color: #000; font-size: 12px">
                        {{ scope.row.PrinterType }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="auto">
                          <span style="color: #000; font-size: 12px">{{ $t('main.autoSetting') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="null">
                          <span style="color: #000; font-size: 12px">{{ $t('main.cancelSetting') }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-for="item in _PrinterTypeList"
                          :key="item.value"
                          :command="item.value">
                          <span style="color: #000; font-size: 12px">{{ item.label }}</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PrinterRemaCapa"
                  :label="$t('main.tablePrinterRemaCapa')"
                  min-width="100">
                  <template slot-scope="scope">
                    <el-progress
                      :color="customColors"
                      :width="45"
                      define-back-color="#ebeef5"
                      :format="() => (scope.row.PrinterRemaCapa > 0 ? scope.row.PrinterRemaCapa : 0)"
                      :stroke-width="3"
                      :percentage="
                        scope.row.PrinterRemaCapa == undefined || scope.row.PrinterRemaCapa == '0'
                          ? 0
                          : parseFloat((((scope.row.PrinterRemaCapa > 0 ? scope.row.PrinterRemaCapa : 0) / getPrinterRemaCapaAmount(scope.row.ModeName)) * 100).toFixed(0))
                      "></el-progress>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-popover>
          <el-popover
            v-if="guideStep"
            :placement="guideStep[6].placement"
            width="250"
            trigger="manual"
            v-model="guideStep[6].show">
            <div class="guide_box">
              <div class="guide_title">
                {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
              </div>
              <div class="guide_desc">{{ $t(`guide.step7`) }}</div>
              <div class="guide_btns">
                <el-button
                  @click="exitGuide"
                  class="guide_btn1"
                  size="mini"
                  type="text"
                  >{{ $t('guide.skip') }}</el-button
                >
                <el-button
                  v-if="parseInt(currentStep) > 0"
                  @click="prevStep"
                  class="guide_btn1"
                  size="mini"
                  >{{ $t('guide.prev') }}</el-button
                >
                <el-button
                  @click="nextStep"
                  class="guide_btn2"
                  size="mini"
                  type="primary"
                  >{{ currentStep == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button
                >
              </div>
            </div>
            <div
              slot="reference"
              :class="{ guide_body: beginStep && currentStep == 6 }">
              <el-tabs
                v-model="activeName"
                style="background-color: #fff; padding-bottom: 20px; max-height: 240px; margin-top: 10px 20px">
                <el-tab-pane
                  :label="$t(`index.workList`)"
                  name="first">
                  <div class="work worklist">
                    <el-table
                      height="200"
                      :data="tasks"
                      style="width: 100%"
                      size="mini"
                      :empty-text="$t('index.nodata')"
                      row-class-name="rowclass">
                      <el-table-column
                        label="#"
                        width="50">
                        <template slot-scope="scope">
                          {{ scope.$index + 1 }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="jId"
                        :label="$t('index.wordID')"
                        min-width="85">
                      </el-table-column>
                      <el-table-column
                        prop="DataSource"
                        :label="$t('index.wordOrigin')"
                        min-width="50">
                      </el-table-column>
                      <el-table-column
                        :label="$t('index.wordSpace')"
                        min-width="45">
                        <template slot-scope="scope">
                          {{ getPrintName(scope.row.PrinterID, true) }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        :label="$t('main.USBType')"
                        min-width="55">
                        <template slot-scope="scope">
                          {{ scope.row.PrinterType }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        min-width="60"
                        prop="TaskCapacity"
                        :label="$t('main.TaskCapacity')">
                      </el-table-column>
                      <el-table-column
                        v-if="false"
                        prop="DataDir"
                        :label="$t('main.taskFile')">
                      </el-table-column>
                      <el-table-column
                        prop="CreateTime"
                        :label="$t('index.createTime')"
                        min-width="75">
                      </el-table-column>
                      <el-table-column
                        v-if="false"
                        prop="usb_version"
                        :label="$t('main.USBVersion')"
                        :filters="[
                          { text: '2.0', value: 2 },
                          { text: '3.0', value: 3 }
                        ]"
                        :filter-method="filterHandler">
                      </el-table-column>
                      <el-table-column
                        prop="FinishTime"
                        :label="$t('index.finishedTime')"
                        min-width="75">
                      </el-table-column>
                      <el-table-column
                        prop="JobCompletion"
                        min-width="40"
                        :label="$t('index.finishedNumber')">
                      </el-table-column>
                      <el-table-column
                        :label="$t('index.state')"
                        prop="JobStatus"
                        width="135">
                        <template slot-scope="scope">
                          <el-dropdown
                            trigger="click"
                            @command="(e) => handleTaskCommand(e, scope.row.JobID)"
                            :disabled="scope.row.JobStatus != 'Fail'">
                            <span
                              class="el-dropdown-link"
                              style="color: #000; font-size: 12px">
                              {{ jobState(scope.row.JobStatus) }}<b v-if="scope.row.JobStatus === 'Copying'" style="margin-left: 3px;">{{ scope.row.CopySpeed ? Math.ceil(parseFloat(scope.row.CopySpeed)*10)/10 : '0.0' }}MB/s</b>
                              <i
                                class="el-icon-arrow-down el-icon--right"
                                v-if="scope.row.JobStatus == 'Fail'"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item command="refresh">
                                <span style="color: #000; font-size: 12px">{{ $t('main.commandRefresh') }}</span>
                              </el-dropdown-item>
                              <el-dropdown-item command="delete">
                                <span style="color: #000; font-size: 12px">{{ $t('main.commandDelete') }}</span>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                          <el-progress
                            :color="customColors"
                            :width="45"
                            define-back-color="#ebeef5"
                            :stroke-width="3"
                            :percentage="parseFloat(scope.row.TaskPercentage.replace(`%`, ``))"
                            v-if="scope.row.JobStatus == `Copying`"></el-progress>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
                <el-tab-pane
                  :label="$t(`index.curLog`)"
                  name="second">
                  <div class="work">
                    <div class="w_title">
                      <div class="w_right">
                        <el-button
                          type="text"
                          icon="el-icon-document-copy"
                          v-if="isAdmin"
                          @click="getWLogData()">
                          {{ $t('index.openHistoryLog') }}
                        </el-button>
                      </div>
                    </div>
                    <div
                      class="c_log"
                      v-html="log"></div></div
                ></el-tab-pane>
              </el-tabs>
            </div>
          </el-popover>
          <s-footer></s-footer>
        </div>
      </div>
      <div
        :span="3"
        style="height: 100%; width: 164px">
        <div
          class="grid-content bg-purple right"
          style="overflow: hidden">
          <el-popover
            v-if="guideStep"
            :placement="guideStep[3].placement"
            width="250"
            trigger="manual"
            v-model="guideStep[3].show">
            <div class="guide_box">
              <div class="guide_title">
                {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
              </div>
              <div class="guide_desc">{{ $t(`guide.step4`) }}</div>
              <div class="guide_btns">
                <el-button
                  @click="exitGuide"
                  class="guide_btn1"
                  size="mini"
                  type="text"
                  >{{ $t('guide.skip') }}</el-button
                >
                <el-button
                  v-if="parseInt(currentStep) > 0"
                  @click="prevStep"
                  class="guide_btn1"
                  size="mini"
                  >{{ $t('guide.prev') }}</el-button
                >
                <el-button
                  @click="nextStep"
                  class="guide_btn2"
                  size="mini"
                  type="primary"
                  >{{ currentStep == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button
                >
              </div>
            </div>
            <div
              class="title"
              slot="reference"
              :class="{ guide_body: beginStep && currentStep == 3 }">
              {{ $t('index.notice') }}
            </div>
          </el-popover>

          <template v-for="(item,index) of errList">
            <warnCard
              :key="index"
              :data="item"
              @ok="okWarning"
              v-if="item.show" />
          </template>
        </div>
      </div>
    </div>
    <div v-if="dialogVisible">
      <el-dialog
        @close="initData"
        :visible.sync="dialogVisible"
        width="1200px"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :title="$t('index.newWork')">
        <work
          :dice="DualSide == 1 ? 2 : 1"
          @jobPost="closeWork"
          @addError="addError"
          :isNew="isNew"
          :saveWorkList="saveWorkList"
          :printerList="infoData"
          :shareDisk="shareDisk"
          :isCopy="isLocal"
          :filterPassedType="filterPassedType"
          :sizeType="_PrinterTypeList">
        </work>
      </el-dialog>
    </div>
    <div v-if="dialogNetVisible">
      <el-dialog
        :visible.sync="dialogNetVisible"
        width="1200px"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :title="$t('index.newWork')">
        <worknet
          :dice="DualSide == 1 ? 2 : 1"
          @jobPost="closeNetWork"
          :printerList="infoData">
        </worknet>
      </el-dialog>
    </div>
    <el-dialog
      width="1040px"
      :title="$t('index.entireLog')"
      :visible.sync="dialogWholeLog">
      <div
        class="wLog"
        v-html="wlog"
        style="text-align: left"></div>
    </el-dialog>

    <!-- 开始用户引导 -->
    <el-dialog
      class="guide_dialog"
      top="30vh"
      :show-close="false"
      title="温馨提示"
      :visible.sync="showStep"
      width="350px"
      :close-on-click-modal="false">
      <div class="start_box">
        <div class="start_content">欢迎使用卡树自动拷贝打印系统，我们将引导您使用本系统，请按照提示学习操作！</div>
        <div class="start_hide">
          <el-checkbox v-model="hideStep">本次引导结束，不再进入</el-checkbox>
        </div>
        <div class="start_btn">
          <el-button
            @click="startStep"
            type="primary"
            >开始引导</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')
const { dialog } = require('@electron/remote')
var fs = require('fs'),
  ini = require('ini')
import IP from 'ip'
var os = require('os')
var fs = require('fs')
import work from './work'
import worknet from './worknet'
import sFooter from './footer.vue'
import warnCard from './warn-card.vue'
import N80N from '../assets/80N.png'
import N800N from '../assets/800N.png'

export default {
  name: 'Main',
  components: {
    work,
    worknet,
    warnCard,
    sFooter
  },
  data() {
    return {
      guideStep: null,
      currentStep: 0,
      showStep: false,
      hideStep: false,
      beginStep: false,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 50 },
        { color: '#5cb87a', percentage: 100 }
      ],
      N80N: N80N,
      N800N: N800N,
      state: false,
      activeName: 'first',
      tableData: [
        {
          id: 1,
          workspace: 'LAPTOP-1024',
          type: 1,
          size: 8,
          usb_version: 2,
          req_num: 59,
          done_num: 100,
          status: 1,
          process: 59,
          info: 'sth'
        }
      ],
      printData: 0, //打印机选择
      dialogVisible: false,
      dialogNetVisible: false,
      DualSide: null,
      infoData: [],
      checkStates: {},
      tasks: [],
      log: '',
      wlog: '',
      timer1: '',
      timer2: '',
      dialogWholeLog: false,
      isNew: true,
      saveWorkList: {},
      languages: [
        {
          value: 'zh',
          label: '中文（简体）'
        },
        {
          value: 'ozh',
          label: '中文（繁体）'
        },
        {
          value: 'en',
          label: 'English'
        }
      ],
      selectLan: '',
      errs: {
        87: { tag: 'ERROR_INVALID_PARAMETER', err: 0 },
        30016: { tag: 'PAVO_DS_LOCKED', err: 0 },
        128: { tag: 'PAVO_DS_OFFLINE', err: 0 },
        256: { tag: 'PAVO_DS_0100_COVER_OPEN', err: 0 },
        257: { tag: 'PAVO_DS_0200_IC_MISSING', err: 0 },
        512: { tag: 'PAVO_DS_0201_RIBBON_MISSING', err: 0 },
        513: { tag: 'PAVO_DS_0202_RIBON_MISMATCH', err: 0 },
        259: { tag: 'PAVO_DS_0203_RIBBON_TYPE_ERROR', err: 0 },
        768: { tag: 'PAVO_DS_0300_RIBBON_SEARCH_FAIL', err: 0 },
        769: { tag: 'PAVO_DS_0301_RIBBON_OUT', err: 0 },
        770: { tag: 'PAVO_DS_0302_PRINT_FAIL', err: 0 },
        771: { tag: 'PAVO_DS_0303_PRINT_FAIL', err: 0 },
        772: { tag: 'PAVO_DS_0304_RIBBON_OUT', err: 0 },
        1024: { tag: 'PAVO_DS_0400_CARD_OUT', err: 1 },
        1280: { tag: 'PAVO_DS_0500_CARD_JAM', err: 1 },
        1281: { tag: 'PAVO_DS_0501_CARD_JAM', err: 1 },
        1282: { tag: 'PAVO_DS_0502_CARD_JAM', err: 1 },
        1283: { tag: 'PAVO_DS_0503_CARD_JAM', err: 1 },
        1284: { tag: 'PAVO_DS_0504_CARD_JAM', err: 1 },
        1285: { tag: 'PAVO_DS_0505_CARD_JAM', err: 1 },
        1286: { tag: 'PAVO_DS_0506_CARD_JAM', err: 1 },
        1287: { tag: 'PAVO_DS_0507_CARD_JAM', err: 1 },
        1288: { tag: 'PAVO_DS_0508_CARD_JAM', err: 1 },
        1536: { tag: 'PAVO_DS_0600_CARD_MISMATCH', err: 0 },
        1792: { tag: 'PAVO_DS_0700_CAM_ERROR', err: 0 },
        2048: { tag: 'PAVO_DS_0800_FLIPPER_ERROR', err: 0 },
        2049: { tag: 'PAVO_DS_0801_FLIPPER_ERROR', err: 0 },
        2050: { tag: 'PAVO_DS_0802_FLIPPER_ERROR', err: 0 },
        2051: { tag: 'PAVO_DS_0803_FLIPPER_ERROR', err: 0 },
        2304: { tag: 'PAVO_DS_0900_NVRAM_ERROR', err: 0 },
        4096: { tag: 'PAVO_DS_1000_RIBBON_ERROR', err: 0 },
        4352: { tag: 'PAVO_DS_1100_RBN_TAKE_CALIB_FAIL', err: 0 },
        4353: { tag: 'PAVO_DS_1101_RBN_SUPPLY_CALIB_FAIL', err: 0 },
        4608: { tag: 'PAVO_DS_1200_ADC_ERROR', err: 0 },
        4864: { tag: 'PAVO_DS_1300_FW_ERROR', err: 0 },
        4865: { tag: 'PAVO_DS_1301_FW_ERROR', err: 0 },
        5120: { tag: 'PAVO_DS_1400_POWER_SUPPLY_ERROR', err: 0 },
        65537: { tag: 'Firmware_Error', err: 0 },
        65539: { tag: 'Encoder_Error3', err: 0 },
        65540: { tag: 'Encoder_Error4', err: 0 },
        65541: { tag: 'ADC_Error', err: 0 },
        65542: { tag: 'Enocoder_Error_Film', err: 0 },
        65552: { tag: 'Card_Jam', err: 1 },
        65553: { tag: 'Card_Jam', err: 1 },
        65554: { tag: 'Card_Jam', err: 1 },
        65555: { tag: 'Card_Jam', err: 1 },
        65556: { tag: 'Card_Jam', err: 1 },
        65557: { tag: 'Card_Jam', err: 1 },
        65558: { tag: 'Card_Jam', err: 1 },
        65559: { tag: 'Card_Jam', err: 1 },
        65560: { tag: 'Card_Jam', err: 1 },
        65561: { tag: 'Card_Jam', err: 1 },
        65562: { tag: 'Card_Jam', err: 1 },
        65563: { tag: 'Card_Jam', err: 1 },
        65569: { tag: 'Cover_open', err: 0 },
        65570: { tag: 'Rejectbox_Open', err: 0 },
        65571: { tag: 'Rejectbox_Full', err: 0 },
        65572: { tag: 'Flat_Cover_Open', err: 0 },
        65587: { tag: 'Flipper_Error', err: 0 },
        65601: { tag: 'Ribbon_Out', err: 0 },
        65602: { tag: 'Ribbon_Error', err: 0 },
        65603: { tag: 'Ribbon_Missing', err: 0 },
        65604: { tag: 'Ribbon_Unsupport', err: 0 },
        65605: { tag: 'Ribbon_Missing', err: 0 },
        65606: { tag: 'Ribbon_Out', err: 0 },
        65607: { tag: 'Ribbon_Mismatch', err: 0 },
        65608: { tag: 'Ribbon_Error', err: 0 },
        65609: { tag: 'Ribbon_Error', err: 0 },
        65610: { tag: 'Ribbon_Install_Error', err: 0 },
        65617: { tag: 'Card_Feed_Error ', err: 1 },
        65618: { tag: 'Card_Feed_Error ', err: 1 },
        65619: { tag: 'Card_Feed_Error ', err: 1 },
        65630: { tag: 'Card_Feed_Error ', err: 1 },
        65631: { tag: 'Card_Out', err: 0 },
        65649: { tag: 'Film_Out', err: 0 },
        65650: { tag: 'Film_Error', err: 0 },
        65651: { tag: 'Film_Missing', err: 0 },
        65652: { tag: 'Film_Unsupport', err: 0 },
        65653: { tag: 'Film_Missing', err: 0 },
        65654: { tag: 'Film_Out', err: 0 },
        65655: { tag: 'Film_Error', err: 0 },
        65656: { tag: 'Film_Error', err: 0 },
        65657: { tag: 'Film_Unsupport', err: 0 },
        65658: { tag: 'Film_Install_Error', err: 0 },
        65701: { tag: 'Printer_Memory_Full', err: 0 },
        69639: { tag: 'Filpper_Not_Install', err: 0 },
        69640: { tag: '600DPI_Not_Enabled', err: 0 },
        69649: { tag: 'Ribbon_Unmatched', err: 0 },
        69651: { tag: 'Text_Image_Outside', err: 0 },
        69652: { tag: 'No_Card', err: 0 },
        69653: { tag: 'Take_Ribbon', err: 0 },
        131073: { tag: 'Ribbon_Low', err: 0 },
        131074: { tag: 'Card_Low', err: 0 },
        131075: { tag: 'Waiting_Card_In', err: 0 },
        131076: { tag: 'Waiting_Card_Out', err: 0 },
        131077: { tag: 'Card_Low', err: 0 },
        131078: { tag: 'Card_Low', err: 0 },
        131081: { tag: 'Need_Cleaning', err: 0 },
        1167: { tag: 'PAVO_DS_OFFLINE', err: 0 },
        196609: { tag: 'FIND_CARD', err: 0 }
      },
      errList: [],
      isAdmin: false,
      os: {
        CardsoonModel: '',
        Version: '',
        SystemSn: '',
        ip: '',
        cpu: '',
        ram: '',
        hostname: '',
        HD: '',
        remainCacheSpace: '',
        totalCacheSpace: ''
      },
      isLocal: false,
      EquipOnline: '',
      shareDisk: '',
      root: '',
      printerStatus: {},
      ribbonList: {
        P320E: {
          YMCKO: '300',
          K: '1500',
          PrinterRemaCapa: '50'
        },
        S21: {
          YMCKO: '300',
          K: '1500',
          PrinterRemaCapa: '50'
        },
        S20: {
          YMCKO: '300',
          K: '1500',
          PrinterRemaCapa: '50'
        },
        'ID CARD PRINTER': {
          YMCKO: '300',
          K: '1500',
          PrinterRemaCapa: '50'
        }
      },
      CapSettings: [
        {
          value: 0.512,
          disksize: '512MB',
          usbtype: '2.0'
        },
        {
          value: 4,
          disksize: '4GB',
          usbtype: '2.0'
        },
        {
          value: 32,
          disksize: '32GB',
          usbtype: '2.0'
        },
        {
          value: 64,
          disksize: '64GB',
          usbtype: '3.0'
        },
        {
          value: 128,
          disksize: '128GB',
          usbtype: '3.0'
        }
      ],
      typeRegex: /(\d+(?:\.\d+)?)(?=G)/,
      typeRegex_M: /(\d+(?:\.\d+)?)(?=M)/,
      filterPassedType: [],
      intervalTime: 3000,
      doingWorkStatus: true,
      refreshTime1: localStorage.getItem('refreshTime1') ? parseInt(localStorage.getItem('refreshTime1')) : 3000,
      refreshTime2: localStorage.getItem('refreshTime2') ? parseInt(localStorage.getItem('refreshTime2')) : 180000
    }
  },
  created() {
    const refreshTempTime1 = localStorage.getItem('refreshTime1')
    const refreshTempTime2 = localStorage.getItem('refreshTime2')
    if (refreshTempTime1) {
      this.refreshTime1 = refreshTempTime1
      // console.log('refreshTime1 set ', this.refreshTime1)
    } else {
      //默认值就是3000ms
      //this.refreshTempTime1 = 3000;
    }
    if (refreshTempTime2) {
      this.refreshTime2 = refreshTempTime2
      // console.log('refreshTime2 set ', this.refreshTime2)
    } else {
      //默认值就是3000ms
      //this.refreshTempTime1 = 3000;
    }
  },
  mounted() {
    this.getPrintData()
    this.getLogData(1)
    this.getSystemInfo()
    this.selectLan = localStorage.getItem('lang')
    this.isAdmin = localStorage.getItem('loginrole') == 'administrator'
    // const tempTimer = setInterval(() => {
    //   if (JSON.stringify(this.ribbonList) != '{}') {
    //     this.getData(1) //首次触发需要先获取到Ribbon数据
    //     clearInterval(tempTimer)
    //   }
    // }, 200)
    ipcRenderer.on('open-program-callback', (event, data) => {
      console.log(data)
      this.openFile(data)
    })

    ipcRenderer.on('get-root-callback', (event, data) => {
      this.root = data
      this.getOS()
      this.getRibbon()
      this.getCapSettings()
    })
    ipcRenderer.send('get-root')
    ipcRenderer.send('open-program')
    this.guideStep = JSON.parse(localStorage.getItem('guideStep'))
    console.log(this.guideStep)
    this.currentStep = localStorage.getItem('currentStep')
    if ((!localStorage.getItem('hideStep') || localStorage.getItem('hideStep') == 0)&&this.currentStep>-1) this.showStep = true
    setTimeout(() => {
      this.doingWorkStatus = false
    }, 10000)
    // this.timer2 = setInterval(this.getPrintData, this.refreshTime2)
  },
  beforeDestroy() {
    this.stopTimer()
  },
  methods: {
    initData() {
      this.getData()
      this.getLogData()
      this.runCheckState()
    },
    handleMachineCommand(e, id) {
      this.printerTypeChange(id, e)
      console.log(e, id)
    },
    handleOpenSwitch(e) {
      if (e) {
        // true
        this.play()
      } else {
        this.pause()
      }
    },
    getSystemInfo(c) {
      this.$axios({
        method: 'get',
        url: `web/systeminfo`
      })
        .then((res) => {
          console.log(res)
          this.os.ip = res.data.CPIPaddr
          this.os.cpu = res.data.CPU
          this.os.SystemSn = res.data.systemSNO
          this.os.HD = res.data.diskInfo
          this.os.remainCacheSpace = res.data.remainCacheSpace
          this.os.totalCacheSpace = res.data.totalCacheSpace
          let remain = this.os.remainCacheSpace.replace(' GB', '')
          let total = res.data.totalCacheSpace.replace(' GB', '')
          this.os.cacheSpaceNum = (parseFloat(remain) / parseFloat(total))*100
          this.os.ram = res.data.CPMemory
          this.os.CardsoonModel = res.data.systemName
          this.os.hostname = res.data.CPName
        })
        .catch((e) => {
          if (c) {
            setTimeout(() => {
              this.getSystemInfo(1)
            }, 2000)
          }
        })
    },
    handleTypeCommand(val) {
      this.$confirm(this.$t('index.tipsRefresh'), this.$t('index.tips'), {
        confirmButtonText: this.$t('index.comfirm'),
        cancelButtonText: this.$t('index.cancel'),
        type: 'warning'
      }).then(() => {
        this.printerTypeChange(val)
      })
    },
    printerTypeChange(pid, val) {
      if (val == 'auto') {
        this.refreshCard(pid)
      } else if (val == 'null') {
        this.$confirm(this.$t('index.tipsAutoRefresh'), this.$t('index.tips'), {
          confirmButtonText: this.$t('index.comfirm'),
          cancelButtonText: this.$t('index.cancel'),
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: 'post',
            url: `/printer/setunknowntype?printerid=${pid}`
          }).then((res) => {
            this.getPrintData()
            this.$message({
              offset: 100,
              type: 'success',
              message: this.$t('index.refreshSuccess')
            })
          })
        })
      } else {
        this.$confirm(this.$t('index.tipsSet'), this.$t('index.tips'), {
          confirmButtonText: this.$t('index.comfirm'),
          cancelButtonText: this.$t('index.cancel'),
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: 'post',
            url: `/printer/setdisksizeprinter?printerid=${pid}&disksize=${val}`
          }).then((res) => {
            this.getPrintData()
            this.$message({
              offset: 100,
              type: 'success',
              message: this.$t('index.refreshSuccess')
            })
          })
        })
      }
    },
    stopTimer() {
      clearInterval(this.timer1)
      this.timer1 = null
      clearInterval(this.timer2)
      this.timer2 = null
    },
    getRibbon() {
      let that = this
      // fs.readFile(this.root + "/ribbonconfig.json", "utf-8", (err, res) => {
      //   if (err) {

      //   } else {
      //     console.log(res);
      //     that.ribbonList = JSON.parse(res);
      //     console.log("ribbonList", that.ribbonList);
      //   }
      // });
    },
    getCapSettings() {
      let that = this
      // fs.readFile(this.root + "/CapSettings.json", "utf-8", (err, res) => {
      //   if (err) {
      //   } else {
      //     console.log(res);
      //     that.CapSettings = JSON.parse(res)["CapacityS"];
      //     console.log("CapSettings", that.CapSettings);
      //   }
      // });
    },
    getOS() {
      let that = this
      console.log(this.root + '/../ProductionServer/config.ini')
      fs.readFile(this.root + '/../ProductionServer/config.ini', 'utf-8', (err, res) => {
        console.log(this.root + '/../ProductionServer/config.ini')
        if (err) {
          that.isLocal = false
        } else {
          let data = ini.parse(res)

          this.shareDisk = data.SharedDir
          that.isLocal = data.UploadSharedDir
        }
      })
    },
    getData(callback) {
      this.$axios({
        method: 'get',
        url: '/web/cmd_getSummary'
      })
        .then((res) => {
          this.state = true
          let tasks = [...this.tasks]
          this.tasks = []
          for (let item of res.data.unfinishedTasks) {
            item.jId = item.JobID.split('-')[0] //+ "...";
            this.tasks.push(item)
          }
          for (let item of res.data.finishedTasks) {
            item.jId = item.JobID.split('-')[0] //+ "...";
            this.tasks.push(item)
          }
          let total1 = 0
          let total2 = 0
          for (let item of tasks) {
            if (item.TaskPercentage === '100%') total1++
          }
          for (let item of this.tasks) {
            if (item.TaskPercentage === '100%') total2++
          }
          if (total1!==total2) {
            setTimeout(() => {
              this.getPrintData()
            }, 3000);
          }
          
          if (callback) {
            this.runCheckState() //首次先check一遍
          }
        })
        .catch((e) => {
          this.state = false
          this.clear()
        })
    },
    getPrintData() {
      this.$axios({
        method: 'get',
        url: '/web/get_printer_info'
      })
        .then((res) => {
          let infoData = [...this.infoData]
          this.infoData = res.data.printerList.map((item, index) => {
            let child = {...item}
            console.log('childchildchild', infoData[index], child)
            if (infoData[index]&&!child.ModeName&&!child.SerialNo) {
              child = infoData[index]
            }
            return {
              ...child,
              _PrinterType: child.PrinterType
            }
          })
          // console.log('infoData', this.infoData)
          if (!res.data.printerList || res.data.printerList.length == 0) {
            this.$message.error(this.$t('main.notConnected'))
          }
          let DualSide = 0 //默认是单面
          let filterPassedType = []
          for (const item of res.data.printerList) {
            if (!this.checkStates[item.PrinterID]) {
              //说明这是新增的打印机
              this.checkStates[item.PrinterID] = 1
            }
            const fil = item.PrinterType.match(this.typeRegex)
            const fil_m = item.PrinterType.match(this.typeRegex_M)
            if (fil && fil[0]) {
              filterPassedType.push(fil[0] - 0)
            } else if (fil_m && fil_m[0]) {
              filterPassedType.push(fil_m[0] / 1000 - 0)
            }
            if (item.DualSide == 1) {
              //console.log(item);
              DualSide = 1 //只要有一个是双面就是1
            } else {
              //console.log(item);
            }
          }
          let isAllTypeNull = true
          for (const item of res.data.printerList) {
            if (item.PrinterType != -1) {
              isAllTypeNull = false
              break
            }
          }
          if (isAllTypeNull) {
            this.filterPassedType = this.CapSettings.map((item) => item.value)
          } else {
            this.filterPassedType = filterPassedType
          }
          this.DualSide = DualSide
        })
        .catch((e) => {
          
        })
    },
    // 清除报错通知
    clear() {
      this.checkStates = {}
      this.tasks = []
      this.errList = []
      this.log = this.$t('index.nodata')
      this.printerStatus = {}
    },
    // 添加报错通知
    addError(data) {
      console.log(data, this.errList)
      //状态码存在错误列表中
      this.errList.push({
        i: this.errList.length + 1,
        pid: this.errList.length + 1,
        code: data.code,
        printName: '新建作业',
        tag: data.tag,
        err: data.err,
        show: true
      })
      console.log(data, this.errList)
    },
    getLogData(callback) {
      this.$axios({
        method: 'get',
        url: '/web/cspserver.log'
      })
        .then((res) => {
          let Logs = res.data.split('\n')
          let log = ''
          for (let s of Logs) {
            log += '<p>' + s + '</p>'
          }
          this.log = log
        })
        .catch((e) => {
        })
    },
    getWLogData() {
      this.$axios({
        method: 'get',
        url: '/web/cspserver'
      })
        .then((res) => {
          let Logs = res.data.split('\n')
          let log = ''
          for (let s of Logs) {
            log += '<p>' + s + '</p>'
          }
          this.wlog = log
          this.dialogWholeLog = true
        })
        .catch((e) => {
          this.$message.error(this.$t('index.netFail'))
        })
    },
    runCheckState() {
      for (let i = 0; i < this.infoData.length; i++) {
        this.checkState(i, this.infoData[i].PrinterID)
      }
    },
    refreshCard(pid) {
      this.$confirm(this.$t('index.tipsAutoRefresh'), this.$t('index.tips'), {
        confirmButtonText: this.$t('index.comfirm'),
        cancelButtonText: this.$t('index.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: '/printer/refreshprinter?printerid=' + pid
        }).then((res) => {
          this.$message({
            offset: 100,
            type: 'success',
            message: this.$t('index.refreshSuccess')
          })
          this.getPrintData()
        })
      })
    },
    setState(id, state) {
      this.printerStatus[id] = state
    },
    checkState(i, id) {
      //检查打印机状态
      if (this.checkStates[id] == 1) {
        //如果是1检查
        this.$axios({
          method: 'post',
          url: `/printer/checkstatus?printerid=${id}`
        }).then((res) => {
          //const data = JSON.parse(`{${res.data}}`);
          const data = {
            printer_status: res.data
          }
          // console.log(id, 'printer state: ' + data.printer_status)
          if (data.printer_status == 128 || data.printer_status == 1167) {
            this.setState(id, 'off')
          } else {
            this.setState(id, 'on')
          }
          if (this.errs[data.printer_status]) {
            //状态码存在错误列表中
            this.errList.push({
              i: i,
              pid: id,
              code: data.printer_status,
              printName: this.getPrintName(id),
              tag: this.errs[data.printer_status].tag,
              err: this.errs[data.printer_status].err,
              show: true
            })
            this.checkStates[id] = 2 //让当前报错机器不再检查
          }
        })
      }
    },
    okWarning(id, retry) {
      this.checkStates[id] = 1
      if (retry) {
        this.initData()
      }
    },
    closeWork() {
      //关闭添加任务窗口
      this.dialogVisible = false

      this.initData()
    },
    closeNetWork() {
      //关闭网络版添加任务窗口
      this.dialogNetVisible = false
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleTaskCommand(e, id) {
      this.$confirm(e == 'refresh' ? this.$t('main.taskRefreshCommandTips') : e == 'delete' ? this.$t('main.taskDeleteCommandTips') : '', this.$t('index.tips'), {
        confirmButtonText: this.$t('index.comfirm'),
        cancelButtonText: this.$t('index.cancel'),
        type: 'warning'
      }).then(() => {
        if (e == 'refresh') {
          this.restart_job(id)
        } else if (e == 'delete') {
          this.remove_job(id)
        }
      })
    },
    restart_serve() {
      this.$message({ offset: 100, message: this.$t('index.restarting') })
      this.$axios({
        method: 'get',
        url: '/cmd_resetprinter'
      }).then((res) => {
        this.$message({
          offset: 100,
          type: 'success',
          message: this.$t('index.restartSucc')
        })

        this.initData()
      })
    },
    restart_job(id) {
      this.$axios({
        method: 'get',
        url: '/admin/cmd_resume_service?id=' + id
      }).then((res) => {
        this.$message({
          offset: 100,
          type: 'success',
          message: this.$t('index.operSucc')
        })

        this.initData()
      })
    },
    suspend_job(idx) {
      let id = this.tasks[idx].JobID
      this.$axios({
        method: 'get',
        url: '/cmd_pause_service?id=' + id
      }).then((res) => {
        this.$message({
          offset: 100,
          type: 'success',
          message: this.$t('index.operSucc')
        })

        this.initData()
      })
    },
    start_job(idx) {
      let id = this.tasks[idx].JobID
      this.$axios({
        method: 'get',
        url: '/cmd_resume_service?id=' + id
      }).then((res) => {
        this.$message({
          offset: 100,
          type: 'success',
          message: this.$t('index.operSucc')
        })

        this.initData()
        s
      })
    },
    remove_job(id) {
      // admin/cmd_cancel_service?id={}
      this.$axios({
        method: 'get',
        url: '/admin/cmd_cancel_service?id=' + id
      }).then((res) => {
        this.$message({
          offset: 100,
          type: 'success',
          message: this.$t('index.operSucc')
        })
        //this.tasks.splice(idx, 1);
        this.initData()
      })
    },
    removeDoneWork() {
      this.$confirm(this.$t('index.tipsCont'), this.$t('index.tips'), {
        confirmButtonText: this.$t('index.comfirm'),
        cancelButtonText: this.$t('index.cancel'),
        type: 'warning'
      })
        .then(() => {
          //let rest = [];
          //for(let item of this.tasks){
          //    if(item.JobStatus == "成功"){
          this.$axios({
            method: 'post',
            url: '/web/delcompletetask'
          })
          //    }else{
          //  rest.push(item);
          //    }
          //}
          //this.tasks = rest;
          this.$message({
            offset: 100,
            type: 'success',
            message: this.$t('index.deleteSucc')
          })

          this.initData()
        })
        .catch(() => {
          this.$message({
            offset: 100,
            type: 'info',
            message: this.$t('index.cancelDelete')
          })
        })
    },
    jobState(str) {
      switch (str) {
        case 'New':
          return this.$t('index.new')
        case 'Pending':
          return this.$t('index.pendding')
        case 'Printing':
          return this.$t('index.printing')
        case 'Copying':
          return this.$t('index.copying')
        case 'Fail':
          return this.$t('index.fail')
        case 'Done':
          return this.$t('index.done')
        case 'FileReady':
          return this.$t('index.fileready')
        case 'Cancel':
          return this.$t('index.cancelState')
      }
    },
    openFile(openPath) {
      console.log('openFile')
      this.isNew = false
      const _this = this
      fs.readFile(openPath, (err, data) => {
        let fName = openPath.trim()
        let fileName = fName.substring(fName.lastIndexOf('\\') + 1)
        _this.saveWorkList = JSON.parse(data)
        _this.saveWorkList.taskName = fileName
        _this.dialogVisible = true
      }).catch((err) => {
        console.log(err)
      })
    },

    openWork() {
      console.log('openWork')
      this.isNew = false
      const _this = this
      dialog
        .showOpenDialog({
          title: this.$t('admin.openWork'),
          filters: [{ name: 'Soon Work', extensions: ['swk'] }]
        })
        .then((res) => {
          fs.readFile(res.filePaths[0], (err, data) => {
            let fName = res.filePaths[0].trim()
            let fileName = fName.substring(fName.lastIndexOf('\\') + 1)
            _this.saveWorkList = JSON.parse(data)
            _this.saveWorkList.taskName = fileName
            _this.dialogVisible = true
          }).catch((err) => {
            console.log(err)
          })
        })
    },
    newWork() {
      if (this.currentStep == 7) {
        this.nextStep()
        return
      }
      this.isNew = true
      this.dialogVisible = true
    },
    newNetWork() {
      //this.isNew = true;
      this.dialogNetVisible = true
    },

    toChar(n) {
      return String.fromCharCode(65 + parseInt(n))
    },
    getPrintName(id, onlyId) {
      if (onlyId === true) {
        return id.substr(-5)
      }
      return this.$t('index.wordSpace') + id.substr(-5)
    },
    getPrinterRemaCapaAmount(ModeName) {
      // console.log('PrinterRemaCapa', this.ribbonList[ModeName].PrinterRemaCapa)
      return this.ribbonList[ModeName].PrinterRemaCapa || 0
    },
    getRibbonAmount(ModeName, RibbonType) {
      console.log('getRibbonAmount', this.ribbonList)
      return this.ribbonList[ModeName][RibbonType] || 0
    },
    play() {
      this.$confirm(this.$t('index.tipsPlaying'), this.$t('index.tips'), {
        confirmButtonText: this.$t('index.comfirm'),
        cancelButtonText: this.$t('index.cancel'),
        type: 'warning'
      }).then(() => {
        var cmdShell = require('node-cmd')
        cmdShell.run('chcp 65001>nul && net start CSPServer', (err, data, stderr) => {
          if (!err) {
            this.$message({
              offset: 100,
              type: 'success',
              message: this.$t('systemControl.prepareStart')
            })
            console.log('success', data)
            this.getData()
            this.getSystemInfo(1)
          } else {
            this.$message({
              offset: 100,
              type: 'success',
              message: this.$t('systemControl.prepareStart')
            })
            console.log('error', err)
            this.getData()
            this.getSystemInfo(1)
          }
        })
      })
    },
    pause() {
      this.$confirm(this.$t('index.tipsPausing'), this.$t('index.tips'), {
        confirmButtonText: this.$t('index.comfirm'),
        cancelButtonText: this.$t('index.cancel'),
        type: 'warning'
      }).then(() => {
        var cmdShell = require('node-cmd')
        cmdShell.run('net stop CSPServer', (err, data, stderr) => {
          if (!err) {
            this.$message({
              offset: 100,
              type: 'success',
              message: this.$t('systemControl.pauseStart')
            })
            console.log('success', data)
            this.getData()
          } else {
            this.$message({
              offset: 100,
              type: 'error',
              message: this.$t('systemControl.pauseFailed')
            })
            console.log('error', err)
            this.getData()
          }
        })
      })
    },
    // 开启引导
    startStep() {
      let hideStep = this.hideStep ? 1 : 0
      localStorage.setItem('hideStep', hideStep)
      this.showStep = false
      this.beginStep = true
      if (this.guideStep[this.currentStep]) {
        this.guideStep[this.currentStep].show = false
        setTimeout(() => {
          this.guideStep[this.currentStep].show = true
        }, 100)
      }
    },
    // 退出新手引导
    exitGuide() {
      for (let key in this.guideStep) {
        this.guideStep[key].show = false
      }
      this.currentStep = -1
      localStorage.setItem('currentStep', this.currentStep)
      localStorage.setItem('guideStep', JSON.stringify(this.guideStep))
    },
    // 上一步
    prevStep(e) {
      this.guideStep[this.currentStep].show = false
      this.currentStep = parseInt(this.currentStep) - 1
      if (this.guideStep[this.currentStep]) {
        this.guideStep[this.currentStep].show = true
        localStorage.setItem('guideStep', JSON.stringify(this.guideStep))
        localStorage.setItem('currentStep', this.currentStep)
      } else {
        this.exitGuide()
      }
    },
    // 下一步
    nextStep() {
      if (this.currentStep == 7) {
        this.isNew = true
        this.dialogVisible = true
      }
      this.guideStep[this.currentStep].show = false
      this.currentStep = parseInt(this.currentStep) + 1
      if (this.guideStep[this.currentStep]) {
        this.guideStep[this.currentStep].show = true
        localStorage.setItem('guideStep', JSON.stringify(this.guideStep))
        localStorage.setItem('currentStep', this.currentStep)
      } else {
        this.exitGuide()
      }
    }
  },
  computed: {
    doneCopyNum() {
      if (this.tasks.length != 0) {
        return this.tasks.filter((item) => {
          return item.JobStatus == 'Done'
        }).length
      } else {
        return 0
      }
    },
    cancelCopyNum() {
      if (this.tasks.length != 0) {
        return this.tasks.filter((item) => {
          return item.JobStatus == 'Cancel'
        }).length
      } else {
        return 0
      }
    },
    failNum() {
      if (this.tasks.length != 0) {
        return this.tasks.filter((item) => {
          return item.JobStatus == 'Fail'
        }).length
      } else {
        return 0
      }
    },
    _PrinterTypeList() {
      return [
        ...this.CapSettings.map((item) => {
          return {
            value: item.disksize,
            label: item.disksize + '|' + item.usbtype
          }
        })
      ]
    },
    hasDoingWork() {
      // True 就是不休眠 |||| False就是休眠
      let flag = (
        this.tasks.filter((item) => {
          return item.JobStatus != 'Done' && item.JobStatus != 'Fail' && item.JobStatus != 'Cancel'
        }).length != 0 ||
        this.state == false ||
        this.infoData.filter((item) => item.SerialNo == '').length != 0 || this.doingWorkStatus
      )
      return flag
    },
    user() {
      return decodeURI(localStorage.getItem('loginname'))
    }
  },
  watch: {
    hasDoingWork: {
      handler() {
        // if (this.hasDoingWork) {
        //   this.intervalTime = parseInt(this.refreshTime1)
        //   clearInterval(this.timer1)
        //   this.timer1 = setInterval(this.initData, this.intervalTime)
        // } else {
        //   this.intervalTime = parseInt(this.refreshTime2)
        //   clearInterval(this.timer1)
        //   this.timer1 = setInterval(this.initData, this.intervalTime)
        // }
      },
      immediate: true
    },
    selectLan(val) {
      localStorage.setItem('lang', val)
      this.$i18n.locale = val
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
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
// li {
//   display: inline-block;
//   margin: 0 10px;
// }
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
    cursor: pointer;
  }
}

.mid {
  background-color: #f5f5f5;
  height: 100%;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  overflow-y: hidden;
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
  .title {
    font-size: 32px;
    .add {
      float: left;
    }
  }
  .brief {
    height: 180px;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;

    .item {
      margin-top: 12px;
      font-size: 12px;
    }
    .b_title {
      position: absolute;
      font-weight: bold;
    }
    .b_left {
      position: relative;
      height: 100%;
      border-right: #b8b8b8 solid 1px;
      text-align: left;
    }
    .b_mid {
      position: relative;
      height: 100%;
      text-align: left;
      //border-right: #B8B8B8 solid 1px;
    }
    .b_right {
      position: relative;
      height: 100%;
    }
  }
  .work {
    // height: 180px;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    margin-bottom: 10px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    .w_title {
      font-size: 24px;
      font-weight: bold;
      text-align: left;
      .w_right {
        position: absolute;
        right: 20px;
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

.c_log {
  // height: 180px;
  text-align: left;
  color: #999999;
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
  /deep/ p {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
  }
}

.user {
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  .link {
    color: blue;
    cursor: pointer;
  }
}
/deep/ .el-dialog__body {
  padding: 10px 20px !important;
}

/deep/ .el-table {
  font-size: 12px;
}

/deep/ .el-dialog {
  margin-top: 3vh !important;
}
/* 开始引导 */
.guide_dialog {
  /deep/ .el-dialog {
    margin-top: 25vh !important;
  }
}
.start_box {
  .start_content {
    font-size: 15px;
    line-height: 24px;
  }
  .start_hide {
    padding: 40px 0 10px;
  }
}

.worklist{
  .el-table {
    height: calc(100vh - 520px) !important;
    /deep/ .el-table__body-wrapper {
      height: calc(100% - 48px) !important;
      overflow: scroll!important;
    }
  }
  ::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 0;
  }

  ::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}
</style>
<style>
.rowclass {
  background-color: #e4ecdc !important;
}
</style>
