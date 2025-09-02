<template>
  <div
    v-loading="submitLoading"
    element-loading-text="正在准备任务，您也可以直接右上角关闭作业窗口"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    style="position: relative">
    <div
      v-if="currentStep && parseInt(currentStep) >= 8"
      class="bg_box"
      style="position: absolute; top: 0; left: 0; z-index: 10; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5)"></div>
    <div class="header">
      <div class="dialog-header-btns">
        <el-popover
          v-if="guideStep"
          :placement="guideStep[8].placement"
          width="250"
          trigger="manual"
          v-model="guideStep[8].show">
          <div class="guide_box">
            <div class="guide_title">
              {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
            </div>
            <div class="guide_desc">{{ $t(`guide.step9`) }}</div>
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
            :class="{ guide_body: currentStep == 8 }">
            <span style="font-size: 16px; line-height: 32px; float: left">
              {{ $t('work.size') }}
            </span>

            <el-select
              :placeholder="$t('work.pleaseSelect')"
              style="width: 160px"
              v-model="size_form">
              <el-option
                v-for="item in size_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="filterPassedType.indexOf(item.value) == -1">
              </el-option>
            </el-select>
          </div>
        </el-popover>
        <el-popover
          v-if="guideStep"
          :placement="guideStep[9].placement"
          width="250"
          trigger="manual"
          v-model="guideStep[9].show">
          <div class="guide_box">
            <div class="guide_title">
              {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
            </div>
            <div class="guide_desc">{{ $t(`guide.step10`) }}</div>
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
            slot="reference"
            :class="{ guide_body: currentStep == 9 }">
            <span style="font-size: 16px; line-height: 32px">
              {{ $t('work.content') }}
            </span>
            <el-select
              :placeholder="$t('work.pleaseSelect')"
              style="margin-left: 10px"
              v-model="file_form">
              <el-option
                v-for="item in file_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-popover>
        <div v-show="false">
          <span style="font-size: 16px; line-height: 32px">
            {{ $t('work.partType') }}
          </span>

          <el-select
            :placeholder="$t('work.pleaseSelect')"
            v-model="type_form">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </div>
        <div style="position: absolute; right: 20px">
          <el-popover
            style="float: right"
            placement="left"
            width="600"
            trigger="click">
            <div>
              <el-form
                :label-position="'right'"
                label-width="250px">
                <el-form-item :label="$t('work.better')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.priority">
                    <el-option
                      v-for="item in high_setting.priority"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item :label="$t('work.gshType')">
									<el-select :placeholder="$t('work.pleaseSelect')" v-model="high_setting_form.fileSystem">
										<el-option v-for="item in high_setting.fileSystem" :key="item.value" :label="item.label"
										:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>-->
                <el-form-item :label="$t('work.startWorkSpace')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.target_work">
                    <el-option
                      v-for="item in high_setting.target_work"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.ribbonType')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.color_type">
                    <el-option
                      v-for="item in high_setting.color_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="$t('work.formatFile')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.formatFile">
                    <el-option
                      v-for="item in high_setting.formatFile"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.hash')">
                  <el-switch v-model="high_setting_form.s1"> </el-switch>
                </el-form-item>
                <el-form-item :label="$t('work.md5')">
                  <el-switch v-model="high_setting_form.s2"> </el-switch>
                </el-form-item>
                <el-form-item :label="$t('work.fail')">
                  <el-switch v-model="high_setting_form.s3"> </el-switch>
                </el-form-item>
                <el-form-item :label="$t('work.spanUSBcard')">
                  <el-switch v-model="high_setting_form.Span_USBcard"> </el-switch>
                </el-form-item>
                <!--<el-form-item :label="$t('work.disk')">
									<el-switch v-model="high_setting_form.s4">
									</el-switch>
								</el-form-item>
								<el-form-item :label="$t('work.bitlocker')">
									<el-switch v-model="high_setting_form.s5">
									</el-switch>
								</el-form-item>-->

                <!-- <el-form-item :label="$t('work.localFiles')"> -->
                <!-- <el-switch v-model="high_setting_form.localfiles"> -->
                <!-- </el-switch> -->
                <!-- </el-form-item> -->
              </el-form>
              <!--<el-descriptions :column="2" v-if="high_setting_form.s5">
								<el-descriptions-item :label="$t('work.password')">
									<el-input placeholder="$t('work.pleasePassword')" v-model="high_setting_form.pass" show-password
									size="mini">
									</el-input>
								</el-descriptions-item>
								<el-descriptions-item :label="$t('work.comfirm')">
									<el-input placeholder="$t('work.pleasePassword')" v-model="high_setting_form.repass" show-password
									size="mini">
									</el-input>
								</el-descriptions-item>
							</el-descriptions>-->
            </div>
            <el-button
              slot="reference"
              size="medium"
              style="height: 32px; padding: 0 15px; line-height: 32px">
              {{ $t('work.senior') }}
            </el-button>
          </el-popover>
          <!-- 屏幕录制按钮 -->
          <screen-recorder 
            ref="screenRecorder"
            @recording-started="onRecordingStarted"
            @recording-stopped="onRecordingStopped"
            @recording-saved="onRecordingSaved"
            style="margin-left: 10px; display: inline-block;"
          />
        </div>
      </div>
      <el-row
        :gutter="20"
        v-if="0">
        <el-col :span="6">
          <el-row :gutter="0">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span style="font-size: 16px; line-height: 32px; float: left">
                  {{ $t('work.size') }}
                </span>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">
                <el-select
                  :placeholder="$t('work.pleaseSelect')"
                  style="width: 160px"
                  v-model="size_form">
                  <el-option
                    v-for="item in size_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="filterPassedType.indexOf(item.value) == -1">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <!--
					<el-input v-model="juanbiao_form" :placeholder="$t('work.pleaseInput')" style="width:280px;float:left">
						<template slot="prepend">
							{{$t("work.sign")}}
						</template>
					</el-input>
                    -->
        </el-col>
        <el-col :span="6">
          <el-row :gutter="0">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span style="font-size: 16px; line-height: 32px; float: left">
                  {{ $t('work.content') }}
                </span>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">
                <el-select
                  :placeholder="$t('work.pleaseSelect')"
                  style="float: left; margin-left: 10px"
                  v-model="file_form">
                  <el-option
                    v-for="item in file_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row :gutter="0">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span style="font-size: 16px; line-height: 32px">
                  {{ $t('work.partType') }}
                </span>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">
                <el-select
                  :placeholder="$t('work.pleaseSelect')"
                  v-model="type_form">
                  <el-option
                    v-for="item in type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-popover
            style="float: right"
            placement="left"
            width="600"
            trigger="click">
            <div>
              <el-form
                :label-position="'right'"
                label-width="250px">
                <el-form-item :label="$t('work.better')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.priority">
                    <el-option
                      v-for="item in high_setting.priority"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item :label="$t('work.gshType')">
									<el-select :placeholder="$t('work.pleaseSelect')" v-model="high_setting_form.fileSystem">
										<el-option v-for="item in high_setting.fileSystem" :key="item.value" :label="item.label"
										:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>-->
                <el-form-item :label="$t('work.startWorkSpace')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.target_work">
                    <el-option
                      v-for="item in high_setting.target_work"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.ribbonType')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.color_type">
                    <el-option
                      v-for="item in high_setting.color_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="$t('work.formatFile')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.formatFile">
                    <el-option
                      v-for="item in high_setting.formatFile"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.hash')">
                  <el-switch v-model="high_setting_form.s1"> </el-switch>
                </el-form-item>
                <el-form-item :label="$t('work.md5')">
                  <el-switch v-model="high_setting_form.s2"> </el-switch>
                </el-form-item>
                <el-form-item :label="$t('work.fail')">
                  <el-switch v-model="high_setting_form.s3"> </el-switch>
                </el-form-item>

                <el-form-item :label="$t('work.spanUSBcard')">
                  <el-switch v-model="high_setting_form.Span_USBcard"> </el-switch>
                </el-form-item>
                <!--<el-form-item :label="$t('work.disk')">
									<el-switch v-model="high_setting_form.s4">
									</el-switch>
								</el-form-item>
								<el-form-item :label="$t('work.bitlocker')">
									<el-switch v-model="high_setting_form.s5">
									</el-switch>
								</el-form-item>-->

                <!-- <el-form-item :label="$t('work.localFiles')"> -->
                <!-- <el-switch v-model="high_setting_form.localfiles"> -->
                <!-- </el-switch> -->
                <!-- </el-form-item> -->
              </el-form>
              <!--<el-descriptions :column="2" v-if="high_setting_form.s5">
								<el-descriptions-item :label="$t('work.password')">
									<el-input placeholder="$t('work.pleasePassword')" v-model="high_setting_form.pass" show-password
									size="mini">
									</el-input>
								</el-descriptions-item>
								<el-descriptions-item :label="$t('work.comfirm')">
									<el-input placeholder="$t('work.pleasePassword')" v-model="high_setting_form.repass" show-password
									size="mini">
									</el-input>
								</el-descriptions-item>
							</el-descriptions>-->
            </div>
            <el-button
              slot="reference"
              size="medium"
              style="height: 32px; padding: 0 15px; line-height: 32px">
              {{ $t('work.senior') }}
            </el-button>
          </el-popover>
        </el-col>
      </el-row>
    </div>
    <!-- <el-row
      :gutter="20"
      style="margin-top: 10px">
      <el-col :span="12">
        <el-switch
          v-model="switch_cont"
          :active-text="$t('work.addContent')"
          style="float: left">
        </el-switch>
      </el-col>
      <el-col :span="12">
        <el-switch
          v-model="switch_tag"
          style="float: right"
          :active-text="$t('work.addTag')">
        </el-switch>
      </el-col>
    </el-row> -->
    <el-row
      :gutter="0"
      style="margin-top: 10px">
      <el-col :span="switch_tag && switch_cont ? 12 : switch_tag && !switch_cont ? 0 : 24">
        <div class="grid-content bg-purple">
          <div class="file">
            <div style="display: flex">
              <div style="font-size: 16px; font-weight: 700; height: 32px; line-height: 32px; text-align: left">
                {{ $t('work.contentTitle') }}
              </div>
              <el-popover
                v-if="guideStep"
                :placement="guideStep[10].placement"
                width="250"
                trigger="manual"
                v-model="guideStep[10].show">
                <div class="guide_box">
                  <div class="guide_title">
                    {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                  </div>
                  <div class="guide_desc">{{ $t(`guide.step11`) }}</div>
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
                  class="btn-group"
                  slot="reference"
                  :class="{ guide_body: currentStep == 10 }">
                  <!-- <div
                    class="btn"
                    @click="addFolder"
                    style="color: #67c23a">
                    {{ $t('file.addFolder') }}
                  </div>
                  <div
                    class="btn"
                    @click="addFile"
                    style="color: #67c23a">
                    <i class="el-icon-files" />
                    {{ $t('file.addFile') }}
                  </div> -->
                  <el-button
                    style="margin-left: 10px; font-size: 14px; height: 32px; padding: 0 15px; line-height: 32px"
                    @click="addFolder">
                    {{ $t('file.addFolder') }}
                  </el-button>
                  <el-button
                    style="margin-left: 10px; font-size: 14px; height: 32px; padding: 0 15px; line-height: 32px"
                    @click="addFile">
                    {{ $t('file.addFile') }}
                  </el-button>
                </div>
              </el-popover>
              <el-popover
                v-if="guideStep"
                :placement="guideStep[11].placement"
                width="250"
                trigger="manual"
                v-model="guideStep[11].show">
                <div class="guide_box">
                  <div class="guide_title">
                    {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                  </div>
                  <div class="guide_desc">{{ $t(`guide.step12`) }}</div>
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
                  :class="{ guide_body: currentStep == 11 }">
                  <el-input
                    v-model="juanbiao_form"
                    :placeholder="$t('work.pleaseInput')"
                    style="width: 290px; margin-left: 10px">
                    <template slot="prepend">
                      {{ $t('work.sign') }}
                    </template>
                  </el-input>
                </div>
              </el-popover>
            </div>
            <el-row
              :gutter="20"
              v-if="false">
              <el-col :span="3">
                <span style="font-size: 16px; font-weight: 700; height: 32px; line-height: 32px; text-align: left">
                  {{ $t('work.contentTitle') }}
                </span>
              </el-col>
              <el-col :span="11">
                <el-input
                  v-model="juanbiao_form"
                  :placeholder="$t('work.pleaseInput')"
                  style="width: 250px; float: left">
                  <template slot="prepend">
                    {{ $t('work.sign') }}
                  </template>
                </el-input>
              </el-col>
              <el-col :span="10">
                <el-progress
                  :text-inside="true"
                  :percentage="file_percent"
                  :format="format"
                  style="line-height: 32px"
                  :stroke-width="20"
                  :color="customColors"></el-progress>
              </el-col>
            </el-row>
            <div style="clear: both"></div>

            <Files
              ref="files"
              :onSizechange="sizeChange"
              :complete="upload_over"
              :saveWorkList="saveWorkList"
              ><el-progress
                :text-inside="true"
                :percentage="file_percent"
                :format="format"
                style="line-height: 32px; flex: 1"
                :stroke-width="20"
                :color="customColors"></el-progress
            ></Files>
          </div>
        </div>
      </el-col>
      <el-col :span="switch_cont && switch_tag ? 12 : switch_cont && !switch_tag ? 0 : 24">
        <div class="grid-content bg-purple">
          <div class="label">
            <div
              class="title"
              style="width: 100%; display: flex; align-items: center; justify-content: space-between">
              <div>
                <span style="font-size: 16px; color: #606266; margin-right: 10px"> {{ $t('work.tag') }} </span>
                <el-select
                  clearable
                  style="width: 280px"
                  v-model="currentTemplate"
                  @change="changeTemplate"
                  :placeholder="$t('work.pleaseSelect')"
                  size="mini">
                  <el-option
                    v-for="(item, index) in templates"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <!-- <el-select
                  v-model="print_flag"
                  :placeholder="$t('work.pleaseSelect')"
                  size="mini">
                  <el-option
                    v-for="item in print_op"
                    v-if="!(flag && item.value == 1)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> -->
              </div>
              <div style="display: flex; align-items: center">
                <el-button
                  style="margin-left: 10px; font-size: 14px; height: 32px; padding: 0 15px; line-height: 32px"
                  @click="openDesign">
                  {{ $t('work.createTag') }}
                </el-button>
                <el-popover
                  v-if="guideStep"
                  :placement="guideStep[12].placement"
                  width="250"
                  trigger="manual"
                  v-model="guideStep[12].show">
                  <div class="guide_box">
                    <div class="guide_title">
                      {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                    </div>
                    <div class="guide_desc">{{ $t(`guide.step13`) }}</div>
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
                    :class="{ guide_body: currentStep == 12 }">
                    <el-button
                      style="margin-left: 10px; font-size: 14px; height: 32px; padding: 0 15px; line-height: 32px"
                      @click="openFile">
                      {{ $t('work.importTag') }}
                    </el-button>
                  </div>
                </el-popover>
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  :content="file_name == null ? $t('work.binfile') : file_name.strLen() > 12 ? file_name.subCHStr(0, 12) + '...' : file_name"
                  placement="top-start">
                  <el-button
                    type="text"
                    icon="el-icon-upload2"
                    style="margin-left: 10px; font-size: 14px"
                    @click="openFile2">
                    {{ file_name == null ? $t('work.binfile') : file_name.strLen() > 12 ? file_name.subCHStr(0, 12) + '...' : file_name }}
                  </el-button>
                </el-tooltip> -->
                <input
                  type="file"
                  accept=".csv"
                  @change="fileLoad2"
                  ref="refFile2"
                  style="display: none" />

                <input
                  type="file"
                  accept="..zip,.rar"
                  @change="fileLoad3"
                  ref="refFile3"
                  style="display: none" />
              </div>
            </div>
            <div style="float: right"></div>
            <input
              type="file"
              accept=".cs,.soon"
              @change="fileLoad"
              ref="refFile"
              style="display: none" />
            <div style="clear: both"></div>
            <el-popover
              v-if="guideStep"
              :placement="guideStep[13].placement"
              width="250"
              trigger="manual"
              v-model="guideStep[13].show">
              <div class="guide_box">
                <div class="guide_title">
                  {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                </div>
                <div class="guide_desc">{{ $t(`guide.step14`) }}</div>
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
                :class="{ guide_body: currentStep == 13 }">
                <div class="display_box">
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="打印正面"
                    placement="bottom">
                    <div
                      class="display_item"
                      @click="print_flag = 2">
                      <div
                        class="display_bg"
                        v-if="print_flag == 3"></div>
                      <img :src="fileData.frontDisplayPic" />
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="打印反面"
                    placement="bottom">
                    <div
                      class="display_item"
                      @click="print_flag = 3">
                      <div
                        class="display_bg"
                        v-if="print_flag == 2"></div>
                      <img :src="fileData.backDisplayPic" />
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </el-popover>
            <el-popover
              v-if="guideStep"
              :placement="guideStep[14].placement"
              width="250"
              trigger="manual"
              v-model="guideStep[14].show">
              <div class="guide_box">
                <div class="guide_title">
                  {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                </div>
                <div class="guide_desc">{{ $t(`guide.step15`) }}</div>
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
                :class="{ guide_body: currentStep == 14 }">
                <el-table
                  :data="tableData"
                  height="200"
                  style="width: 100%"
                  :empty-text="$t('work.nodata')"
                  :show-header="false">
                  <el-table-column
                    prop="name"
                    min-width="110"
                    :label="$t('work.fieldName')">
                  </el-table-column>
                  <el-table-column
                    prop="val"
                    min-width="240">
                    <template slot-scope="scope">
                      <div v-if="scope.row.type == 1">
                        <input
                          type="file"
                          accept="image/*"
                          :ref="scope.row.origin_name"
                          :data-name="scope.row.origin_name" />
                      </div>
                      <div v-if="scope.row.type == 3 || scope.row.type == 4 || scope.row.type == 5">
                        <el-input
                          :placeholder="$t('work.pleaseInput')"
                          v-model="form[scope.row.origin_name]"
                          clearable
                          style="width: calc(100% - 30px) !important"
                          :disabled="csvIsExist">
                        </el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="val"
                    min-width="90">
                    <template slot-scope="scope">
                      <div v-if="scope.row.type == 3 || scope.row.type == 4 || scope.row.type == 5">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="file_name == null ? $t('work.binfile') : file_name.strLen() > 12 ? file_name.subCHStr(0, 12) + '...' : file_name"
                          placement="top-start">
                          <el-button
                            size="mini"
                            @click="openFile2">
                            {{ file_name == null ? $t('work.binfile') : file_name.strLen() > 12 ? file_name.subCHStr(0, 12) + '...' : file_name }}
                          </el-button>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-popover>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      style="padding: 10px">
      <el-col :span="16">
        <div v-if="file_form == 2 && switch_cont">
          <template v-if="isPass">
            <el-input
              :placeholder="$t('work.pleasePassword')"
              style="width: 25%; float: left"
              show-password
              v-model="p1">
              <template slot="prepend">
                {{ $t('work.password') }}
              </template>
            </el-input>
            <el-input
              :placeholder="$t('work.pleasePassword')"
              style="width: 25%; float: left; margin-left: 20px"
              show-password
              v-model="p2">
              <template slot="prepend">
                {{ $t('work.comfirm') }}
              </template>
            </el-input>
          </template>
          <el-input
            :placeholder="$t('work.addContent')"
            style="width: 30%; float: left; margin-left: 20px"
            v-model="zip_name">
            <template slot="prepend">
              {{ $t('work.name') }}
            </template>
          </el-input>
          <div style="float: left; padding-left: 20px; height: 32px; display: flex; align-items: center">
            <el-checkbox v-model="isPass">是否加密</el-checkbox>
          </div>
        </div>
        <div
          style="width: 100%"
          v-else>
          &nbsp;
        </div>
      </el-col>
      <el-col
        :span="8"
        style="display: flex; align-items: center; justify-content: space-between">
        <el-popover
          v-if="guideStep"
          :placement="guideStep[15].placement"
          width="250"
          trigger="manual"
          v-model="guideStep[15].show">
          <div class="guide_box">
            <div class="guide_title">
              {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
            </div>
            <div class="guide_desc">{{ $t(`guide.step16`) }}</div>
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
            :class="{ guide_body: currentStep == 15 }">
            <el-input
              :placeholder="$t('work.addContent')"
              v-model="number"
              style="width: 200px; height: 32px">
              <template slot="prepend">
                {{ $t('work.num') }}
              </template>
            </el-input>
          </div>
        </el-popover>
        <div style="display: flex; align-items: center">
          <el-button
            type="primary"
            @click="saveWork"
            style="margin-right: 20px; height: 32px; padding: 0 15px; line-height: 32px">
            {{ $t('work.save') }}
          </el-button>
          <el-popover
            v-if="guideStep"
            :placement="guideStep[16].placement"
            width="250"
            trigger="manual"
            v-model="guideStep[16].show">
            <div class="guide_box">
              <div class="guide_title">
                {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
              </div>
              <div class="guide_desc">
                {{ $t(`guide.step17`)
                }}<a
                  @click="help"
                  v-if="currentStep == guideStep.length - 1"
                  >，{{ $t(`guide.help`) }}</a
                >
              </div>
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
              :class="{ guide_body: currentStep == 16 }">
              <el-button
                type="primary"
                style="height: 32px; padding: 0 15px; line-height: 32px"
                @click="upload">
                {{ $t('work.submit') }}
              </el-button>
            </div>
          </el-popover>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
String.prototype.strLen = function () {
  var len = 0
  for (var i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2
    else len++
  }
  return len
}
String.prototype.strToChars = function () {
  var chars = new Array()
  for (var i = 0; i < this.length; i++) {
    chars[i] = [this.substr(i, 1), this.isCHS(i)]
  }
  String.prototype.charsArray = chars
  return chars
}
String.prototype.isCHS = function (i) {
  if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) return true
  else return false
}
String.prototype.subCHString = function (start, end) {
  var len = 0
  var str = ''
  this.strToChars()
  for (var i = 0; i < this.length; i++) {
    if (this.charsArray[i][1]) len += 2
    else len++
    if (end < len) return str
    else if (start < len) str += this.charsArray[i][0]
  }
  return str
}
String.prototype.subCHStr = function (start, length) {
  return this.subCHString(start, start + length)
}
function getNowFormatDate() {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
import Files from './files/file.vue'
import ScreenRecorder from './recorder/ScreenRecorder.vue'
let fs = require('fs')
let path = require('path')
const { app, dialog } = require('@electron/remote')
const { exec } = require('child_process')
const { ipcRenderer } = require('electron')
export default {
  name: 'work',
  props: {
    dice: {
      type: Number
    },
    saveWorkList: {
      type: Object | undefined
    },
    isNew: {
      type: Boolean
    },
    printerList: {
      type: Object | undefined
    },
    shareDisk: {
      type: String | undefined
    },
    isCopy: {
      type: Boolean | undefined,
      default: false
    },
    filterPassedType: {
      type: Array,
      default: []
    },
    sizeType: {
      type: Array,
      default: []
    }
  },
  components: {
    Files,
    ScreenRecorder
  },
  data() {
    return {
      // 模板列表
      templates: [],
      currentTemplate: '',
      guideStep: null,
      currentStep: 0,
      flag: false,
      switch_cont: true,
      switch_tag: true,
      print_flag: null,
      //print_op: [{
      //    value: 2,
      //  label: this.$t("work.front")
      //}, {
      //    value: 3,
      //    label: this.$t("work.back")
      //}, {
      //    value: 1,
      //    label: this.$t("work.double")
      //}],
      size_type: [],
      // size_type: [
      // {
      // value: 0.512,
      // label: "512MB|2.0",
      // },
      // {
      // value: 4,
      // label: "4GB|2.0",
      // },
      // {
      // value: 32,
      // label: "32GB|2.0",
      // },
      // {
      // value: 64,
      // label: "64GB|3.0",
      // },
      // {
      // value: 128,
      // label: "128GB|3.0",
      // },
      // {
      // value: 256,
      // label: "256GB|3.0",
      // },
      // ],
      //type: [{
      //    value: 0,
      //    label: this.$t("work.diskPart")
      //}, {
      //    value: 1,
      //    label: this.$t("work.cdPart")
      //}, {
      //
      //   // -- value: 2,
      //   //  label: '加密分区'
      ////  }, {

      //    value: 3,
      //    label: this.$t("work.forbidCopyPart")
      //}, {
      //   // -- value: 4,
      // //    label: '普普分区'
      ////  }, {

      //    value: 5,
      //    label: this.$t("work.cdWithDisk")
      //}],
      //file_type: [{
      //    value: 0,
      //    label: this.$t("work.fileAnd")
      //}, {
      //    value: 1,
      //    label: this.$t("work.eCd")
      //}, {
      //     value: 2,
      //     label: this.$t("work.zip")
      //  }, {
      //     value: 3,
      //     label: this.$t("work.passZip")
      // }, {
      //    value: 4,
      //    label: this.$t("work.forbidCopyU")
      //}],
      size_form: null,
      type_form: 0,
      file_form: 0,
      number: 1,
      juanbiao_form: '',
      options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target: '/upload/',
        testChunks: false
      },
      zip_attrs: {
        accept: '.zip'
      },
      iso_attrs: {
        accept: 'iso/img'
      },
      fileData: {},
      tableData: [],
      //high_setting: {
      //    priority: [{
      //        value: 1,
      //        label: this.$t("work.low")
      //    }, {
      //        value: 0,
      //        label: this.$t("work.normal")
      //    }, {
      //        value: 2,
      //        label: this.$t("work.high")
      //    }],
      //    fileSystem: [{
      //        value: 0,
      //        label: this.$t("work.auto")
      //    }, {
      //        value: 1,
      //        label: 'FAT32'
      //    }, {
      //        value: 2,
      //        label: 'exFAT'
      //    }, {
      //        value: 3,
      //        label: 'NTFS'
      //    }],
      //    target_work: [{
      //        value: 0,
      //        label: this.$t("work.any")
      //    }, ],
      //    color_type: [{
      //        value: 0,
      //        label: this.$t("work.any")
      //    }, {
      //        value: 1,
      //        label: this.$t("work.sigleColor")
      //    }, {
      //        value: 2,
      //        label: this.$t("work.colorful")
      //    }, ],
      //},
      high_setting_form: {
        priority: 0,
        fileSystem: 0,
        target_work: 0,
        color_type: 0,
        s1: false,
        s2: false,
        s3: false,
        s4: false,
        s5: false,
        pass: '',
        repass: '',
        localfiles: false, //本地文件
        formatFile: 0, // auto
        Span_USBcard: false
      },
      file_name: null,
      file_name3: this.$t('work.binImg'),
      upload_disk: '',
      p1: '',
      p2: '',
      size: 0,
      zip_name: '',
      isPass: false,
      flag_cont_up: false,
      filter_rules: [[0], [1, 5], [0], [0], [3]],
      form: {},
      fullscreenLoading: false,
      file_len: 0,
      customColors: [
        { color: '#67C23A', percentage: 99 },
        { color: '#F56C6C', percentage: 100 }
      ],
      csvIsExist: false,
      upload_flag: false,
      fileLists: [], //上传文件列表
      submitLoading: false
    }
  },
  created() {
    this.upload_disk = this.genTaskUUID()
    this.options.target += this.upload_disk + '/data'
    //this.options.target = "/api";
  },
  updated() {},
  mounted() {
    const high = localStorage.getItem('high_setting_form')
    if (high) {
      this.high_setting_form = JSON.parse(high)
    }
    this.juanbiao_form = getNowFormatDate()
    if (this.dice == 1) {
      this.flag = true
      this.print_flag = 2
    } else {
      this.print_flag = 1
    }
    this.guideStep = JSON.parse(localStorage.getItem('guideStep'))
    this.currentStep = localStorage.getItem('currentStep')
    if (this.guideStep[this.currentStep]) {
      this.guideStep[this.currentStep].show = false
      setTimeout(() => {
        this.guideStep[this.currentStep].show = true
      }, 200)
    }
    this.getTemplates()
  },
  updated() {},
  methods: {
    // 录制相关方法
    onRecordingStarted() {
      console.log('录制已开始')
    },
    onRecordingStopped() {
      console.log('录制已停止')
    },
    onRecordingSaved(result) {
      console.log('录制已保存:', result)
      this.$message.success(`录制已保存: ${result.fileName}`)
    },
    async stopRecordingIfActive() {
      // 如果正在录制，则停止录制
      if (this.$refs.screenRecorder) {
        await this.$refs.screenRecorder.stopIfRecording()
      }
    },
    addFolder() {
      this.$refs.files.addFolder()
    },
    addFile() {
      this.$refs.files.addFile()
    },
    toChar(n) {
      return String.fromCharCode(65 + parseInt(n))
    },
    getPrintName(id) {
      return this.$t('index.wordSpace') + id.substr(-5)
    },
    getPrintName1(id) {
      for (let i = 0; i < this.printerList.length; i++) {
        if (this.printerList[i].PrinterID == id) {
          return this.$t('index.wordSpace') + this.toChar(i)
        }
      }
    },
    openFile() {
      this.$refs.refFile.dispatchEvent(new MouseEvent('click'))
    },
    openFile2() {
      this.$refs.refFile2.dispatchEvent(new MouseEvent('click'))
    },
    openFile3() {
      this.$refs.refFile3.dispatchEvent(new MouseEvent('click'))
    },
    fileLoad() {
      this.fileLists = this.$refs.refFile.files
      let selectedFile = this.fileLists[0]
      let reader = new FileReader()
      reader.readAsText(selectedFile)
      let _this = this
      _this.currentTemplate = ''
      reader.onload = function () {
        _this.readFile(this.result)
      }
    },
    fileLoad2() {
      this.file_name = this.$refs.refFile2.files[0].name
      this.csvLoad()
    },
    fileLoad3() {
      this.file_name3 = this.$refs.refFile3.files[0].name
    },
    csvLoad() {
      let selectedFile = this.$refs.refFile2.files[0]
      let reader = new FileReader()
      reader.readAsText(selectedFile)
      let _this = this
      reader.onload = function () {
        //let flag = true; //校验结果
        let first_line = this.result.split('\n')[0].replace('\r', '').split(',') //第一行
        let second_line = this.result.split('\n')[1].replace('\r', '').split(',') //第二行
        let i = 0
        for (let item of first_line) {
          _this.$set(_this.form, item, second_line[i])
          i++
        }
        _this.csvIsExist = true

        //let ava_num = 0; //实际数量，去除空
        //let str_len = this.result.split("\n").length - 1;
        //for (let item of arr) {
        //    if (item != "") {
        //        ava_num++;
        //    }
        //}
        //if (ava_num != _this.tableData.length) {
        //    flag = false; //参数量不相等
        //    _this.$message({offset:100,
        //        message: '请检查，合并文件csv数据跟cs字段数不匹配！',
        //        type: 'warning'
        //    });
        //    return;
        //}
        //if (str_len < _this.number) {
        //
        //    flag = false; //数量不匹配
        //    _this.$message({offset:100,
        //        message: '请检查，合并文件csv数据组跟usb卡片发行数字num不匹配！',
        //        type: 'warning'
        //    });
        //    return;
        //}
        //let warn_arr = [];
        //for (let item of _this.tableData) {
        //    console.log(item)
        //    if (arr.indexOf(item.origin_name + '') == -1) {
        //        warn_arr.push(item.origin_name + '');
        //    }
        //}
        //if (warn_arr.length != 0) { //参数名不匹配
        //    _this.$message({offset:100,
        //        message: '未发现' + warn_arr + "字段！",
        //        type: 'warning'
        //    });
        //}
      }
    },
    format(percentage) {
      let mb = (this.size_form * 931.3).toFixed(0)
      return (this.size / (1024 * 1024)).toFixed(1) + 'MB / ' + mb + 'MB'
    },

    genTaskUUID() {
      var myDate = new Date()
      var dateStr =
        myDate.getFullYear().toString() +
        (myDate.getMonth() + 1 >= 10 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1).toString()) +
        (myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate().toString()) +
        (myDate.getHours() > 9 ? myDate.getHours().toString() : '0' + myDate.getHours().toString()) +
        (myDate.getMinutes() > 9 ? myDate.getMinutes().toString() : '0' + myDate.getMinutes().toString()) +
        (myDate.getSeconds() > 9 ? myDate.getSeconds().toString() : '0' + myDate.getSeconds().toString()) +
        myDate
          .getTime()
          .toString()
          .slice(myDate.getTime().toString().length - 3, myDate.getTime().toString().length - 1)
      // return 'W' + Math.random().toString(36).substr(2)
      return dateStr
    },
    async upload_over() {
      //左侧内容上传结束
      if (!this.upload_flag) {
        return
      }
      this.upload_flag = false
      if (this.flag_cont_up) {
        //如果是点击按钮开启的上传，则进行上传右侧
        if ((!this.isNew && this.fileData) || (this.isNew && this.fileLists[0])) {
          //开启了标签则检测并上传
          let files_n_incr = 1
          let data1 = new FormData()
          if (this.isNew) {
            if (this.fileLists[0]) {
              data1.append(`file${files_n_incr}`, this.fileLists[0]) //标签cs文件
              files_n_incr++
            } else {
              this.$message({
                offset: 100,
                message: this.$t('work.pleaseUploadTag'),
                type: 'warning'
              })
              return
            }
          } else {
            if (this.fileData && !this.fileLists[0]) {
              //纯打开，需要上传的是as文件
              let _file = new File([JSON.stringify(this.fileData)], this.saveWorkList.taskName, { type: 'text/plain' })
              data1.append(`file${files_n_incr}`, _file) //标签cs文件
              files_n_incr++
            } else if (this.fileData && this.fileLists[0]) {
              //打开后，又重新选择了soon文件
              data1.append(`file${files_n_incr}`, this.fileLists[0]) //标签cs文件
              files_n_incr++
            } else {
              this.$message({
                offset: 100,
                message: this.$t('work.pleaseUploadTag'),
                type: 'warning'
              })
              return
            }
          }

          if (this.$refs.refFile2.files.length != 0) {
            // 有csv合并文件
            data1.append(`file${files_n_incr}`, this.$refs.refFile2.files[0]) //csv文件
            data1.append(`csv`, true) //csv文件flag
            //console.log(this.$refs.refFile2.files);
            files_n_incr++
          } else {
            data1.append(`csv`, false) //csv文件flag
          }
          for (let item of this.tableData) {
            if (item.type == 1 && this.$refs[item.origin_name].files[0] != undefined && this.$refs.refFile2.files.length != 0) {
              //有合并文件
              //data1.append(item.origin_name, this.$refs[item.origin_name].files[0]);//图片文件
              data1.append(`file${files_n_incr}`, this.$refs[item.origin_name].files[0]) //图片文件
              files_n_incr++
            } else if (item.type == 1 && this.$refs[item.origin_name].files[0] != undefined && this.$refs.refFile2.files.length == 0) {
              //无合并文件
              data1.append(item.origin_name, this.$refs[item.origin_name].files[0]) //图片文件
              //data1.append(`file${files_n_incr}`, this.$refs[item.origin_name].files[0]);//图片文件
              files_n_incr++
            } else if ((item.type == 3 || item.type == 5) && this.$refs.refFile2.files.length == 0) {
              //无合并文件
              let data = this.form[item.origin_name]
              if (data == '' || data == undefined || data == null) {
                data = item.default
              }
              data1.append(item.origin_name, data) //合成文字与条形码 有默认值的
            } else if (item.type == 4 && this.$refs.refFile2.files.length == 0) {
              //二维码
              data1.append(item.origin_name, this.form[item.origin_name])
            }
          }

          this.$message({ offset: 100, message: this.$t('work.uploadingTag') })
          let pathName
          if (this.high_setting_form.localfiles) {
            //打开本地选项
            let rootFile = this.$refs.uploader.uploader.getRoot()
            if (rootFile.fileList.length != 1) {
              this.$message({
                offset: 100,
                message: this.$t('work.oneFolder'),
                type: 'warning'
              })
              return
            }
            let filePath = rootFile.fileList[0]
            if (!filePath.isFolder) {
              this.$message({
                offset: 100,
                message: this.$t('work.notFolder'),
                type: 'warning'
              })
              return
            }
            pathName = filePath.name
          } else {
            pathName = this.upload_disk
          }
          this.$axios({
            method: 'post',
            url: '/upload/' + pathName,
            headers: {
              'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime()
            },
            data: data1
          }).then((res) => {
            this.submit() //调用提交函数
          })
          //this.submit(); //调用提交函数
          //if (this.fileLists[0]) {
          //    data1.append("file1", this.fileLists[0]);
          //}else{
          //    this.$message({offset:100,
          //        message: "请上传标签！",
          //        type: 'warning'
          //    });
          //    return;
          //}
          //if (this.$refs.refFile3.files[0]) {//添加了图片就上传图片文件
          //    data1.append("file3", this.$refs.refFile3.files[0]);
          //}
          //if( this.tableData.length != 0 ){
          //    //需要上传数据文件
          //
          //    if (this.$refs.refFile2.files[0]) {
          //        //有数据文件
          //        data1.append("file2", this.$refs.refFile2.files[0]);
          //        //需要进一步判断是否有合成图片，有则上传
          //        if(isExistBinPic()){
          //            //存在合成图片，则上传合成图片
          //            let f1 = this.check_compressed();
          //            let f2;
          //            await f1.then((res)=>{
          //                f2 = res;
          //            })
          //            if(res){
          //                //校验合并图片成功
          //            }else{
          //                return;
          //            }
          //        }
          //    }else{
          //        let flag_1 = false;//如果全部是合成图片，则false；如果有 非合成图片 ，那么就是true
          //        for( let value of this.tableData){
          //            if(value.type != 1){
          //                flag_1 = true;
          //                break;
          //            }
          //        }
          //        if(flag_1){
          //            //需要上传csv则校验，否则
          //            this.$message({offset:100,
          //                message: "请上传标签合并文件！",
          //                type: 'warning'
          //            });
          //            return;
          //        }
          //    }
          //
          //}
          //
          //this.$message({offset:100,
          //    message: "正在上传标签文件...",
          //});
          //
          //this.$axios({
          //    method: "post",
          //    url: "/upload/" + this.upload_disk,
          //    headers: {
          //        "Content-Type": "multipart/form-data;boundary=" + new Date().getTime()
          //    },
          //    data: data1,
          //}).then(res=>{
          //    this.submit();//调用提交函数
          //});
        } else {
          //未开启标签则直接提交
          this.submit()
        }
        //this.submit();
      }
      this.flag_cont_up = false
    },
    isExistBinPic() {
      let flag_1 = false
      for (let value of this.tableData) {
        if (value.type == 1) {
          flag_1 = true
          break
        }
      }
      return flag_1 //如果存在合成图片，就返回true
    },
    async check_compressed() {
      let flag = true //全部选择
      for (let item in this.$refs) {
        if (item.search('compress') != -1) {
          //出现compress
          if (this.$refs[item].files.length == 0) {
            flag = false //有未选择的，报错
            break
          }
        }
      }
      if (!flag) {
        //报错内容
        this.$message({
          offset: 100,
          message: this.$t('work.pleaseUploadingImgBin'),
          type: 'warning'
        })
        return false
      } else {
        //开始上传合并图片压缩文件

        let data1 = new FormData() // 创建一个表单数据
        let i = 0
        for (let item in this.$refs) {
          if (item.search('compress') != -1) {
            //出现compress
            data1.append(this.$refs[item].dataset.name, this.$refs[item].files[0])
          }
          i++
        }
        this.$message({
          offset: 100,
          message: this.$t('work.UploadingImgBin')
        })
        let re
        await this.$axios({
          method: 'post',
          url: '/upload/' + this.upload_disk,
          headers: {
            'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime()
          },
          data: data1
        })
          .then((res) => {
            re = true
          })
          .catch(() => {
            this.$message({
              offset: 100,
              message: this.$t('work.UploadingImgBinFail'),
              type: 'warning'
            })
            re = false
          })
        return re
      }
    },
    async upload() {
      this.exitGuide()
      /*
      开启了内容文件
      上传按钮->work.upload->file.resume->file.cp----over>>> work.complete(work.upload_over)

      */
      //console.log(this.$refs.filesss.files);return;
      console.log(this.size_form, this.$refs.files.filesList)
      // this.localUpload('filepath')
      if (!this.size_form) {
        this.$message({
          offset: 100,
          message: this.$t('work.size_form_error'),
          type: 'warning'
        })
        return
      }
      for (let i in this.$refs.files.filesList) {
        this.$refs.files.filesList[i].state = false
      }
      this.$refs.files.nowstate = true
      if (this.$refs.files.allNumber > 0) {
        //开启了左边内容则先左边
        if (!this.high_setting_form.Span_USBcard && this.size > ((this.size_form * 1000) / 1.024 / 1.024 / 1.024) * 1024 * 1024) {
          this.$message({
            offset: 100,
            message: this.$t('work.sizeExtra'),
            type: 'warning'
          })
          return
        }

        if (this.$refs.files.allNumber == 0) {
          this.$message({
            offset: 100,
            message: this.$t('work.pleaseUploadContent'),
            type: 'warning'
          })
          return
        }
        this.flag_cont_up = true
        this.upload_flag = true
        /*
        if (this.$refs.uploader.uploader.isComplete()) {
          //如果已经上传成功了，直接开始下一步
          this.upload_over();
          return;
        }
        */
        if (this.high_setting_form.localfiles) {
          //如果开启本地文件，则只上传路径，不上传文件
          // this.upload_over();
          return
        } else {
          let t = true
          for (let i in this.$refs.files.filesList) {
            if (this.$refs.files.filesList[i].size == -1) {
              t = false
            }
          }
          if (t) {
            if (this.file_form == 0) {
              //文件和文件夹
              //this.$refs.files.progressVisible = true;
            } else if (this.file_form == 1) {
              //电子光盘
            } else if (this.file_form == 2) {
              //zip
              //this.$refs.files.archiverVisible = true;
            } else if (this.file_form == 3) {
              //加密zip
              //this.$refs.files.archiverVisible = true;
            } else if (this.file_form == 4) {
              //u盘
            }
            this.$refs.files.isCopy = this.isCopy
            this.$refs.files.copyPath = this.shareDisk + '\\' + this.upload_disk + '\\data\\'
            console.log('path', this.$refs.files.copyPath)
            console.log('isCopy', this.isCopy)
            this.$refs.files.resume(this.file_form)
            // this.$message({offset:100,
            //   message: this.$t("work.uploadingContent"),
            // });
          } else {
            this.$message({
              offset: 100,
              message: this.$t('work.waitCalculate'),
              type: 'warning'
            })
          }
        }
      } else {
        //没开启左边，则右边一定开启了
        let files_n_incr = 1
        let data1 = new FormData()
        if (this.isNew) {
          if (this.fileLists[0]) {
            data1.append(`file${files_n_incr}`, this.fileLists[0]) //标签cs文件
            files_n_incr++
          } else {
            this.$message({
              offset: 100,
              message: this.$t('work.pleaseUploadTag'),
              type: 'warning'
            })
            return
          }
        } else {
          if (this.fileData && !this.fileLists[0]) {
            //纯打开，需要上传的是as文件
            let _file = new File([JSON.stringify(this.fileData)], this.saveWorkList.taskName, { type: 'text/plain' })
            data1.append(`file${files_n_incr}`, _file) //标签cs文件
            files_n_incr++
          } else if (this.fileData && this.fileLists[0]) {
            //打开后，又重新选择了soon文件
            data1.append(`file${files_n_incr}`, this.fileLists[0]) //标签cs文件
            files_n_incr++
          } else {
            this.$message({
              offset: 100,
              message: this.$t('work.pleaseUploadTag'),
              type: 'warning'
            })
            return
          }
        }

        if (this.$refs.refFile2.files.length != 0) {
          // 有csv合并文件
          data1.append(`file${files_n_incr}`, this.$refs.refFile2.files[0]) //csv文件
          data1.append(`csv`, true) //csv文件flag
          files_n_incr++
        } else {
          data1.append(`csv`, false) //csv文件flag
        }
        for (let item of this.tableData) {
          if (item.type == 1 && this.$refs[item.origin_name].files[0] != undefined && this.$refs.refFile2.files.length != 0) {
            //有合并文件
            //data1.append(item.origin_name, this.$refs[item.origin_name].files[0]);//图片文件
            data1.append(`file${files_n_incr}`, this.$refs[item.origin_name].files[0]) //图片文件
            files_n_incr++
          } else if (item.type == 1 && this.$refs[item.origin_name].files[0] != undefined && this.$refs.refFile2.files.length == 0) {
            //无合并文件
            data1.append(item.origin_name, this.$refs[item.origin_name].files[0]) //图片文件
            //data1.append(`file${files_n_incr}`, this.$refs[item.origin_name].files[0]);//图片文件
            files_n_incr++
          } else if ((item.type == 3 || item.type == 5) && this.$refs.refFile2.files.length == 0) {
            //无合并文件
            let data = this.form[item.origin_name]
            if (data == '' || data == undefined || data == null) {
              data = item.default
            }
            data1.append(item.origin_name, data) //合成文字与条形码 有默认值的
          } else if (item.type == 4 && this.$refs.refFile2.files.length == 0) {
            //二维码
            data1.append(item.origin_name, this.form[item.origin_name])
          }
        }

        this.$message({ offset: 100, message: this.$t('work.uploadingTag') })
        this.$axios({
          method: 'post',
          url: '/upload/' + this.upload_disk,
          headers: {
            'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime()
          },
          data: data1
        }).then((res) => {
          this.submit() //调用提交函数
        })
        //this.submit(); //调用提交函数
        // 创建一个表单数据

        //if (this.fileLists[0]) {
        //    data1.append("file1", this.fileLists[0]);
        //}else{
        //    this.$message({offset:100,
        //        message: "请上传标签！",
        //        type: 'warning'
        //    });
        //    return;
        //}
        //if (this.$refs.refFile3.files[0]) {//添加了图片就上传图片文件
        //    data1.append("file3", this.$refs.refFile3.files[0]);
        //}
        //if( this.tableData.length != 0 ){
        //    //需要上传数据文件
        //    if (this.$refs.refFile2.files[0]) {
        //        //有数据文件，需要检测是否有合并图片
        //        data1.append("file2", this.$refs.refFile2.files[0]);
        //        if(isExistBinPic()){
        //            //存在合成图片，则上传合成图片
        //            let f1 = this.check_compressed();
        //            let f2;
        //            await f1.then((res)=>{
        //                f2 = res;
        //            })
        //            if(res){
        //                //校验合并图片成功
        //            }else{
        //                return;
        //            }
        //        }
        //    }else{
        //        //没有选择数据文件，判断是否全是合并文件
        //        let flag_1 = false;
        //            for( let value of this.tableData){
        //                if(value.type != 1){
        //                    flag_1 = true;
        //                    break;
        //                }
        //            }
        //        if(flag_1){
        //            //需要上传csv则校验，否则
        //            this.$message({offset:100,
        //                message: "请上传标签合并文件！",
        //                type: 'warning'
        //               });
        //            return;
        //        }
        //            let f1 = this.check_compressed();
        //            let f2;
        //            await f1.then((res)=>{
        //                f2 = res;
        //            })
        //            if(res){
        //                //校验合并图片成功
        //            }else{
        //                return;
        //            }
        //    }
        //}
      }
    },
    sizeChange(size) {
      this.size = size
    },
    onDrag(e) {
      this.file_len = 0
      //const loading = this.$loading({
      //  lock: true,
      //  text: 'Loading',
      //  spinner: 'el-icon-loading',
      //  background: 'rgba(0, 0, 0, 0.7)'
      //});
      //setTimeout(() => {
      //    console.log(2);
      //}, 0);
      //console.log(1);
    },
    async submit() {
      // 停止录制（如果正在录制）
      await this.stopRecordingIfActive()
      
      //提交最终的任务请求
      let data = ''
      let pathName
      if (this.high_setting_form.localfiles) {
        //打开本地选项
        let rootFile = this.$refs.uploader.uploader.getRoot()
        if (rootFile.fileList.length != 1) {
          this.$message({
            offset: 100,
            message: this.$t('work.oneFolder'),
            type: 'warning'
          })
          return
        }
        let filePath = rootFile.fileList[0]
        if (!filePath.isFolder) {
          this.$message({
            offset: 100,
            message: this.$t('work.notFolder'),
            type: 'warning'
          })
          return
        }
        pathName = filePath.name
      } else {
        pathName = this.upload_disk
      }
      let data_param = 'CardSoon_File=' + pathName
      if (this.$refs.files.allNumber > 0) {
        //内容开启 则内容项必须要填写。
        /* delete 2022-06-15*/
        //if (this.$refs.uploader.uploader.getSize() == 0) {
        //    this.$message({offset:100,
        //        message: "请添加内容！",
        //        type: 'warning'
        //    });
        //    return;
        //}
        /*
        if (
          !this.$refs.uploader.uploader.isComplete() &&
          !this.high_setting_form.localfiles
        ) {
          this.$message({offset:100,
            message: this.$t("work.uploadFail"),
            type: "warning",
          });
          return;
        }
        */
        /*
                    2022-06-24
                    */
        //选择的是电子光盘，则名称一定要填写
        //if (this.file_form == 1) {
        //    if (this.zip_name == "") {
        //        this.$message({offset:100,
        //            message: this.$t("work.isoNameInput"),
        //            type: 'warning'
        //        });
        //        return;
        //    }
        //    data += "&diskLabel=" + this.zip_name;
        //}
        //选择的是zip文档，则名称一定要填写
        if (this.file_form == 2 && !this.isPass) {
          if (this.zip_name == '') {
            this.$message({
              offset: 100,
              message: this.$t('work.zipNameInput'),
              type: 'warning'
            })
            return
          }
          data += '&zip_name=' + this.zip_name
        }
        //选择的是zip加密，名称和密码需要校验
        if (this.file_form == 2 && this.isPass) {
          if (this.zip_name == '') {
            this.$message({
              offset: 100,
              message: this.$t('work.zipNameInput'),
              type: 'warning'
            })
            return
          }
          data += '&zip_name=' + this.zip_name
          if (this.p1 == '' || this.p1 != this.p2) {
            this.$message({
              offset: 100,
              message: this.$t('work.zipPassWrong'),
              type: 'warning'
            })
            return
          }
          data += '&zip_pw=' + this.p1
        }
        let fileForm = this.file_form == 2 && this.isPass ? 3 : this.file_form
        data += '&file_type=' + fileForm
      }
      if ((!this.isNew && this.fileData) || (this.isNew && this.fileLists[0])) {
        //标签开启，则标签文件一定要上传
        if (this.isNew) {
          if (this.fileLists.length == 0) {
            this.$message({
              offset: 100,
              message: this.$t('work.pleaseUploadTag'),
              type: 'warning'
            })
            return
          }
        } else {
          if (!this.fileData) {
            this.$message({
              offset: 100,
              message: this.$t('work.pleaseUploadTag'),
              type: 'warning'
            })
            return
          }
        }

        if (this.fileData && !this.fileLists[0]) {
          //纯打开，需要上传的是as文件
          data_param += '&Json_File=' + this.saveWorkList.taskName //标签不为空给get参数加上json_file
        } else if (this.fileData && this.fileLists[0]) {
          //打开后，又重新选择了soon文件或新建
          data_param += '&Json_File=' + this.fileLists[0].name //标签不为空给get参数加上json_file
        }

        if (this.$refs.refFile2.files.length != 0) {
          //数据文件不为空给get参数加上udf_File
          data_param += '&Udf_File=file:' + this.$refs.refFile2.files[0].name
        }
        if ((this.print_flag == 1 && this.fileData.flag != 1) || (this.print_flag == 2 && this.fileData.flag == 3) || (this.print_flag == 3 && this.fileData.flag == 2)) {
          //打印面数print_flag为1 - 双面的时候，模板flag必须为1 - 双面
          //打印面数print_flag为2 - 正 的时候 模板正面必须有内容 (flag != 3)
          //打印面数print_flag为3 - 反 的时候 模板背面必须有内容 (flag != 2)
          this.$message({
            offset: 100,
            message: this.$t('work.print_flagError'),
            type: 'warning'
          })
          return
        }
        data += '&print_flag=' + this.print_flag //打印面数需要在开启了标签时，1双 2正3背
      }
      if (this.juanbiao_form == '') {
        this.$message({
          offset: 100,
          message: this.$t('work.juanbiaoInput'),
          type: 'warning'
        })
        return
      }
      const printStatus = this.fileLists[0] ? true : false
      const copyStatus = this.$refs.files.allNumber > 0 ? true : false
      data += '&label=' + this.juanbiao_form //卷标
      //校验完毕，拼接剩余参数

      data += '&printCopys=' + this.number //份数
      data += '&disk_size=' + this.size_form //容量，4，8，32
      data += '&zone_type=' + this.type_form //按照界面顺序从0到5
      data += '&hasPrintTask=' + printStatus //标签开关
      data += '&hasCopyTask=' + copyStatus //内容开关
      //data += "&local=" + this.high_setting_form.localfiles; //本地文件开关
      data += '&copy_cache_data=' + this.isCopy //本地文件开关
      data += '&SpanUcard=' + this.high_setting_form.Span_USBcard //允许跨卡
      data += '&version=local' //单机版
      data += '&hash=' + this.high_setting_form.s1 //hash
      data += '&md5=' + this.high_setting_form.s2 //md5
      data += '&printer=' + this.high_setting_form.target_work //目标打印机id，若0则全部
      if (this.high_setting_form.formatFile != 0) {
        data += '&formatFile=' + this.high_setting_form.formatFile //拷贝前类型
      }
      // if (this.file_form == 0 || this.file_form == 1 || this.file_form == 4 || this.file_form == 2 || this.file_form == 3 || this.file_form == 7) {

      // } else {
      //   this.$message({ offset: 100, message: this.$t('work.submiting') })
      //   this.$emit('jobPost')
      // }
      if (this.isCopy) {
        this.submitLoading = true
        this.$axios({
          method: 'post',
          url: '/rest/job/?' + data_param + data
        })
          .then((res) => {
            this.$message({ offset: 100, type: 'success', message: this.$t('work.submitSuccess') })
            that.submitLoading = false
            this.$emit('jobPost')
          })
          .catch((err) => {
            const resl = err.response.data
            console.log(resl)
            if (resl.ret && resl.ret === 9) {
              that.$emit('addError', {
                code: resl.ret,
                tag: 'templateFile',
                err: 0
              })
            } else {
              that.$emit('addError', {
                code: resl.ret,
                tag: 'workFail',
                err: 0
              })
            }
            this.$message({ offset: 100, message: this.$t('work.submiting') })
            this.submitLoading = false
            this.$emit('jobPost')
          })
      } else {
        this.localUpload(pathName, data_param, data)
      }
      // } else if (this.file_form == 2 || this.file_form == 3) {
      // zip一样发送路径
      // const zip_data = [this.$refs.files.zip_path];
      // let file_path = [];
      // for (let i in this.$refs.files.filesList) {
      // file_path.push(this.$refs.files.filesList[i].path);
      // }
      // const file_data = JSON.stringify(file_path);
      // this.$axios({
      // method: "post",
      // url: "/rest/job/?" + data_param + data,
      // data: { files: file_data },
      // }).then((res) => {
      // console.log(res.data);
      // });
      // }
    },
    localUpload(pathName, data_param, data) {
      //文件和文件夹 zip也一样
      let file_path = []
      for (let i in this.$refs.files.filesList) {
        file_path.push(this.$refs.files.filesList[i].path)
      }
      // 创建JSON对象
      const jsonData = {
        files: file_path
      }
      // 生成JSON文件
      const jsonFilePath = path.join(__dirname, 'filepath.json')
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData), 'utf-8')
      console.log(fs.createReadStream(jsonFilePath))
      // 创建文件流
      const fileStream = fs.createReadStream(jsonFilePath)
      // 转换为Blob对象（如果需要）
      const buffer = []
      fileStream.on('data', (chunk) => {
        buffer.push(chunk)
      })
      fileStream.on('end', () => {
        let that = this
        const blob = new Blob([Buffer.concat(buffer)], { type: 'application/octet-stream' })
        console.log(blob)
        // 使用FormData上传文件
        const formData = new FormData()
        formData.append('file', blob, path.basename(jsonFilePath))
        that.submitLoading = true
        // 发送HTTP请求上传文件
        that
          .$axios({
            method: 'post',
            url: `/upload/${pathName}`,
            headers: {
              'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime()
            },
            data: formData
          })
          .then(() => {
            that
              .$axios({
                method: 'post',
                url: '/rest/job/?' + data_param + data
              })
              .then((res) => {
                this.$message({ offset: 100, type: 'success', message: this.$t('work.submitSuccess') })
                that.submitLoading = false
                this.$emit('jobPost')
              })
              .catch((err) => {
                const resl = err.response.data
                if (resl.ret && resl.ret === 9) {
                  that.$emit('addError', {
                    code: resl.ret,
                    tag: 'templateFile',
                    err: 0
                  })
                } else {
                  that.$emit('addError', {
                    code: resl.ret,
                    tag: 'workFail',
                    err: 0
                  })
                }
                this.$message({ offset: 100, message: this.$t('work.submiting') })
                that.submitLoading = false
                this.$emit('jobPost')
              })
          })
      })
    },

    saveWork() {
      let t = true
      for (let i in this.$refs.files.filesList) {
        if (this.$refs.files.filesList[i].size == -1) {
          t = false
        }
      }

      if (t) {
        let save = this.fileData
        save.filesList = this.$refs.files.getLists()
        //save.tagFile = this.fileData;
        save.allNumber = this.$refs.files.allNumber
        save.size = this.size
        save.file_form = this.file_form == 2 && this.isPass ? 3 : this.file_form
        save.type_form = this.type_form
        save.size_form = this.size_form
        save.juanbiao_form = this.juanbiao_form
        save.high_setting_form = this.high_setting_form
        save.print_flag = this.print_flag

        //  save.tableData = this.tableData;
        if (this.$refs.files.allNumber > 0 && this.fileLists[0]) {
          save.switch = 3
        } else if (this.$refs.files.allNumber > 0) {
          save.switch = 1
        } else {
          save.switch = 2
        }
        const v = JSON.stringify(save)
        dialog
          .showSaveDialog({
            title: 'Save',
            filters: [{ name: 'Soon Work', extensions: ['swk'] }]
          })
          .then((result) => {
            fs.writeFileSync(result.filePath, v)
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.$message({
          offset: 100,
          message: this.$t('work.waitCalculate'),
          type: 'warning'
        })
      }
    },
    convertSize(obj) {
      // 提取数值和单位
      const { value, label } = obj
      let numericValue = parseFloat(value)
      const unit = value.slice(-2)

      // 根据单位转换数值
      if (unit === 'GB') {
        // 如果是GB，数值不变
        numericValue = numericValue
      } else if (unit === 'MB') {
        // 如果是MB，转换为GB
        numericValue = numericValue / 1000
      }

      // 返回新的对象
      return { value: numericValue, label: label }
    },
    // 获取模板文件列表
    getTemplates() {
      fs.readdir('User Templates', (err, files) => {
        if (err) {
          console.log(err)
        } else {
          const fileList = files.map((file) => {
            return {
              label: file,
              value: path.join('User Templates', file)
            }
          })
          this.templates = fileList
        }
      })
    },
    // 选择模板
    changeTemplate(e) {
      fs.readFile(e, 'utf8', (err, data) => {
        if (err) {
          console.error('读取文件时出错:', err)
          return
        }
        let name = e.split('\\')[1]
        this.fileLists[0] = new File([data], name, {
          type: ''
        })
        this.readFile(data)
      })
    },
    // 读取文件信息
    readFile(data) {
      let _this = this
      _this.fileData = JSON.parse(data)
      _this.form = {}
      _this.tableData = []
      for (let item of _this.fileData.frontData) {
        if (item.type == 1 || item.type == 3 || item.type == 4 || item.type == 5) {
          _this.tableData.push({
            name: item.name + _this.$t('work.front_tag'),
            val: item.DefaultText == undefined ? '' : item.DefaultText,
            origin_name: item.name,
            type: item.type,
            default: item.DefaultText == undefined ? undefined : item.DefaultText
          }) //前
          _this.$set(_this.form, item.name, item.DefaultText == undefined ? '' : item.DefaultText)
        }
      }
      for (let item of _this.fileData.backData) {
        if (item.type == 1 || item.type == 3 || item.type == 4 || item.type == 5) {
          _this.tableData.push({
            name: item.name + _this.$t('work.back_tag'),
            val: item.DefaultText == undefined ? '' : item.DefaultText,
            origin_name: item.name,
            type: item.type,
            default: item.DefaultText == undefined ? undefined : item.DefaultText
          })
          _this.$set(_this.form, item.name, item.DefaultText == undefined ? '' : item.DefaultText)
        }
      }
      _this.$refs.refFile2.value = ''
      _this.$refs.refFile3.value = ''

      _this.csvIsExist = false
      _this.file_name = null
      _this.file_name3 = _this.$t('work.binImg')
    },
    // 打开标签程序
    openDesign() {
      // 启动exe程序
      exec('"D:\\Program Files\\Cardsoon\\SoonDesign\\SoonDesign.exe"', (error, stdout, stderr) => {
        if (error) {
          console.error(`执行的错误: ${error}`)
          return
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
      })
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
    nextStep(e) {
      this.guideStep[this.currentStep].show = false
      this.currentStep = parseInt(this.currentStep) + 1
      if (this.guideStep[this.currentStep]) {
        this.guideStep[this.currentStep].show = true
        localStorage.setItem('guideStep', JSON.stringify(this.guideStep))
        localStorage.setItem('currentStep', this.currentStep)
      } else {
        this.exitGuide()
      }
    },
    help() {
      ipcRenderer.send('open-help-file')
    }
  },
  computed: {
    file_percent() {
      let t = (this.size / (((this.size_form * 1000) / 1.024 / 1.024 / 1.024) * 1024 * 1024)) * 100
      return t > 100 ? 100.1 : t
    },
    print_op() {
      return [
        {
          value: 2,
          label: this.$t('work.front')
        },
        {
          value: 3,
          label: this.$t('work.back')
        },
        {
          value: 1,
          label: this.$t('work.double')
        }
      ]
    },
    type() {
      return [
        {
          value: 0,
          label: this.$t('work.diskPart')
        },
        {
          value: 1,
          label: this.$t('work.cdPart')
        },
        {
          // -- value: 2,
          //  label: '加密分区'
          //  }, {

          value: 3,
          label: this.$t('work.forbidCopyPart')
        },
        {
          // -- value: 4,
          //    label: '普普分区'
          //  }, {

          value: 5,
          label: this.$t('work.cdWithDisk')
        }
      ]
    },
    file_type() {
      return [
        {
          value: 0,
          label: this.$t('work.fileAnd')
        },
        {
          value: 1,
          label: this.$t('work.eCd')
        },
        {
          value: 5,
          label: this.$t('work.mixMode')
        },
        {
          value: 7,
          label: this.$t('work.iso')
        },
        {
          value: 2,
          label: this.$t('work.zip')
        },
        // {
        //   value: 3,
        //   label: this.$t('work.passZip')
        // },
        {
          value: 4,
          label: this.$t('work.forbidCopyU')
        }
      ]
    },
    high_setting() {
      let target_work = this.printerList.map((item) => {
        return {
          value: item.PrinterID,
          label: this.getPrintName(item.PrinterID)
        }
      })
      target_work.push({
        value: 0,
        label: this.$t('work.any')
      })
      return {
        priority: [
          {
            value: 1,
            label: this.$t('work.low')
          },
          {
            value: 0,
            label: this.$t('work.normal')
          },
          {
            value: 2,
            label: this.$t('work.high')
          }
        ],
        fileSystem: [
          {
            value: 0,
            label: this.$t('work.auto')
          },
          {
            value: 1,
            label: 'FAT32'
          },
          {
            value: 2,
            label: 'exFAT'
          },
          {
            value: 3,
            label: 'NTFS'
          }
        ],
        target_work: target_work,
        color_type: [
          {
            value: 0,
            label: this.$t('work.any')
          },
          {
            value: 1,
            label: this.$t('work.sigleColor')
          },
          {
            value: 2,
            label: this.$t('work.colorful')
          }
        ],
        formatFile: [
          {
            value: 0,
            label: this.$t('work.auto')
          },
          {
            value: 'FAT',
            label: 'FAT'
          },
          {
            value: 'FAT32',
            label: 'FAT32'
          },
          {
            value: 'NTFS',
            label: 'NTFS'
          },
          {
            value: 'EXFAT',
            label: 'EXFAT'
          }
        ]
      }
    },
    bgi() {
      if (this.size != 0) {
        return ''
      }
      return this.$t('work.dropBg')
    }
  },
  watch: {
    sizeType: {
      deep: true,
      immediate: true,
      handler() {
        this.size_type = this.sizeType.map((item) => {
          return this.convertSize(item)
        })
        console.log(this.size_type)
      }
    },
    high_setting_form: {
      deep: true,
      handler(val) {
        console.log(val)
        localStorage.setItem('high_setting_form', JSON.stringify(val))
      }
    },
    filterPassedType: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('work', this.filterPassedType)
        console.log('work', this.size_type)
        if (this.size_form == null) {
          for (let item of this.size_type) {
            if (this.filterPassedType.indexOf(item.value) != -1) {
              this.size_form = item.value
              return
            }
          }
        }
      }
    },
    switch_cont() {
      if (!this.switch_cont && !this.switch_tag) {
        //转换
        this.switch_tag = true
      }
    },
    switch_tag() {
      if (!this.switch_cont && !this.switch_tag) {
        //转换
        this.switch_cont = true
      }
    },
    file_percent(val) {
      if (val > 100 && !this.high_setting_form.Span_USBcard) {
        this.$message({
          offset: 100,
          message: this.$t('work.sizeExtra'),
          type: 'warning'
        })
      }
    },
    file_form: {
      immediate: true,
      handler(val) {
        if (this.filter_rules[val].indexOf(this.type_form) == -1) {
          //现在选择的是不可选择的。
          this.type_form = this.filter_rules[val][0]
        }
        for (let item of this.type) {
          if (this.filter_rules[val].indexOf(item.value) == -1) {
            //设置disable
            this.$set(item, 'disabled', true)
          } else {
            //取消disabled
            this.$set(item, 'disabled', false)
          }
        }
        if (val == 2 || val == 3) {
          this.zip_name = getNowFormatDate()
          this.p1 = '123'
          this.p2 = '123'
        }
      }
    },
    isNew: {
      immediate: true,
      handler(val) {
        this.$nextTick(function () {
          console.log('isNew:' + this.isNew)
          if (!this.isNew) {
            this.fileData = this.saveWorkList
            this.$refs.files.filesList = this.saveWorkList.filesList
            this.$refs.files.allNumber = this.saveWorkList.allNumber
            this.size = this.saveWorkList.size
            this.$refs.files.allSize = this.saveWorkList.size
            if (this.saveWorkList.file_form == 3) {
              this.file_form = 2
              this.isPass = true
            } else {
              this.file_form = this.saveWorkList.file_form
            }
            this.type_form = this.saveWorkList.type_form
            this.size_form = this.saveWorkList.size_form
            this.juanbiao_form = this.saveWorkList.juanbiao_form
            this.high_setting_form = this.saveWorkList.high_setting_form
            this.print_flag = this.saveWorkList.print_flag
            // if (this.saveWorkList.switch == 3) {
            //   this.switch_cont = true
            //   this.switch_tag = true
            // } else if (this.saveWorkList.switch == 2) {
            //   this.switch_tag = true
            // } else if (this.saveWorkList.switch == 1) {
            //   this.switch_cont = true
            // }
            this.form = {}
            for (let item of this.fileData.frontData) {
              if (item.type == 1 || item.type == 3 || item.type == 4 || item.type == 5) {
                this.tableData.push({
                  name: item.name + this.$t('work.front_tag'),
                  val: item.DefaultText == undefined ? '' : item.DefaultText,
                  origin_name: item.name,
                  type: item.type,
                  default: item.DefaultText == undefined ? undefined : item.DefaultText
                }) //前
                this.$set(this.form, item.name, item.DefaultText == undefined ? '' : item.DefaultText)
              }
            }
            for (let item of this.fileData.backData) {
              if (item.type == 1 || item.type == 3 || item.type == 4 || item.type == 5) {
                this.tableData.push({
                  name: item.name + this.$t('work.back_tag'),
                  val: item.DefaultText == undefined ? '' : item.DefaultText,
                  origin_name: item.name,
                  type: item.type,
                  default: item.DefaultText == undefined ? undefined : item.DefaultText
                })
                this.$set(this.form, item.name, item.DefaultText == undefined ? '' : item.DefaultText)
              }
            }

            this.$refs.refFile2.value = ''
            this.$refs.refFile3.value = ''

            this.csvIsExist = false
            this.file_name = null
            this.file_name3 = this.$t('work.binImg')
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.btn-group {
  height: 32px;
  background-color: #e7e7ec;
  display: flex;
  align-items: center;
  .btn {
    color: #53809f;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;

    &:hover {
      background-color: #dfdfe4;
    }

    &:active {
      background-color: #d1d1d7;
    }
  }
}

.header {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
}

.file {
  height: 450px;
  width: 100%;
  background-color: #e8e7ee;
  border: #c8cfd7 solid 1px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding: 10px;

  .title {
    float: left;
    font-size: 16px;
    font-weight: bold;
    height: 32px;
    line-height: 32px;
  }
}

.label {
  height: 450px;
  width: 100%;
  background-color: #e8e7ee;
  border: #c8cfd7 solid 1px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding: 10px;

  .title {
    float: left;
    font-size: 16px;
    font-weight: bold;
    height: 32px;
    line-height: 32px;
  }
}

.uploader-example {
  width: 100%;
  margin: 10px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  position: relative;
}

.uploader-example .uploader-btn {
}

.uploader-example .uploader-list {
  max-height: 405px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}

.uploader-list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.uploader-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c7c7cb;
}

.uploader-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

.add-btns {
  position: absolute;
  left: 10px;
}

.upload-list {
  margin-top: 30px;
}

.display_box {
  margin-top: 10px;
  background-color: #212830;
  height: 180px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .display_item {
    position: relative;
    cursor: pointer;
    img {
      height: 140px;
      background-color: #1e252d;
    }
    .display_bg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 10;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}

/deep/ .uploader-file-name {
  text-align: left;
}

/deep/ .el-progress-bar__outer {
  background-color: #bac2d7;
}

/deep/ .uploader-file-progress {
  background-color: #b0ee91;
}

.drag-bg {
  background-repeat: no-repeat;
  background-position: center;
}

.dialog-header-btns {
  display: flex;
  gap: 60px;
}
/deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
/deep/ .el-input__suffix .el-input__icon {
  height: 32px;
  line-height: 32px;
}
</style>
