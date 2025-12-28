<template>
  <div v-loading="submitLoading" element-loading-text="正在准备任务，您也可以直接右上角关闭作业窗口" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" style="position: relative">
    <div v-if="currentStep && parseInt(currentStep) >= 8" class="bg_box"
      style="position: absolute; top: 0; left: 0; z-index: 10; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5)">
    </div>
    <div class="header">
      <div class="dialog-header-btns">
        <el-popover v-if="guideStep" :placement="guideStep[8].placement" width="250" trigger="manual"
          v-model="guideStep[8].show">
          <div class="guide_box">
            <div class="guide_title">
              {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
            </div>
            <div class="guide_desc">{{ $t(`guide.step9`) }}</div>
            <div class="guide_btns">
              <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
              }}</el-button>
              <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                $t('guide.prev') }}</el-button>
              <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
            </div>
          </div>
          <div slot="reference" :class="{ guide_body: currentStep == 8 }">
            <span style="font-size: 16px; line-height: 32px; float: left">
              {{ $t('work.size') }}
            </span>

            <el-select :placeholder="$t('work.pleaseSelect')" style="width: 160px" v-model="size_form">
              <el-option v-for="item in size_type" :key="item.value" :label="item.label" :value="item.value"
                :disabled="filterPassedType.indexOf(item.value) == -1">
              </el-option>
            </el-select>
          </div>
        </el-popover>
        <el-popover v-if="guideStep" :placement="guideStep[9].placement" width="250" trigger="manual"
          v-model="guideStep[9].show">
          <div class="guide_box">
            <div class="guide_title">
              {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
            </div>
            <div class="guide_desc">{{ $t(`guide.step10`) }}</div>
            <div class="guide_btns">
              <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
              }}</el-button>
              <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                $t('guide.prev') }}</el-button>
              <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
            </div>
          </div>
          <div style="display: flex; align-items: center" slot="reference" :class="{ guide_body: currentStep == 9 }">
            <span style="font-size: 16px; line-height: 32px">
              {{ $t('work.content') }}
            </span>
            <el-select :placeholder="$t('work.pleaseSelect')" style="margin-left: 10px" v-model="file_form">
              <el-option v-for="item in file_type" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-popover>
        <div v-show="false">
          <span style="font-size: 16px; line-height: 32px">
            {{ $t('work.partType') }}
          </span>

          <el-select :placeholder="$t('work.pleaseSelect')" v-model="type_form">
            <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </div>
        <div style="position: absolute; right: 20px">
          <!-- 高级设置对话框 (大气宽幅版) -->
          <el-dialog :title="$t('work.senior') || '高级设置'" :visible.sync="highSettingVisible" width="780px"
            append-to-body custom-class="grand-dialog" :close-on-click-modal="false" top="5vh">

            <div class="grand-setting-content" style="max-height: 75vh; overflow-y: auto; padding-right: 10px;">
              <el-form :model="high_setting_form" label-position="right" label-width="110px" size="small">

                <!-- ================= 模式 0: 文件和文件夹 ================= -->
                <div v-if="file_form === 0">
                  <!-- 基础配置 -->
                  <div class="grand-section">
                    <div class="grand-title"><span>{{ $t('work.basicConfig') || '基础配置' }}</span>
                      <div class="title-line"></div>
                    </div>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item :label="$t('work.better') || '优先级'">
                          <el-select v-model="high_setting_form.priority" class="w-full">
                            <el-option v-for="item in high_setting.priority" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.startWorkSpace') || '目标工作站'">
                          <el-select v-model="high_setting_form.target_work" class="w-full">
                            <el-option v-for="item in high_setting.target_work" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.ribbonType') || '色带类型'">
                          <el-select v-model="high_setting_form.color_type" class="w-full">
                            <el-option v-for="item in high_setting.color_type" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.formatFile') || '拷贝前格式化'">
                          <el-select v-model="high_setting_form.formatFile" class="w-full">
                            <el-option v-for="item in high_setting.formatFile" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>

                  <!-- 高级功能 (ISO/ZIP) -->
                  <div class="grand-section">
                    <div class="grand-title"><span>{{ $t('work.advancedFeatures') || '高级功能' }}</span>
                      <div class="title-line"></div>
                    </div>

                    <!-- ISO 生成 -->
                    <div class="feature-row">
                      <el-checkbox v-model="high_setting_form.is_generate_iso">{{ $t('work.generateISO') || '拷贝前生成ISO'
                      }}</el-checkbox>
                      <transition name="el-zoom-in-top">
                        <div v-if="high_setting_form.is_generate_iso" class="mt-10 ml-20">
                          <el-form-item :label="$t('work.isoFileName') || 'ISO名称'" label-width="80px">
                            <el-input v-model="high_setting_form.iso_file_name"
                              :placeholder="$t('work.inputIsoName') || '请输入ISO文件名'"></el-input>
                          </el-form-item>
                        </div>
                      </transition>
                    </div>

                    <!-- ZIP 生成 -->
                    <div class="feature-row mt-10">
                      <el-checkbox v-model="high_setting_form.is_generate_zip">{{ $t('work.generateZIP') || '拷贝前生成ZIP'
                      }}</el-checkbox>
                      <transition name="el-zoom-in-top">
                        <div v-if="high_setting_form.is_generate_zip" class="mt-10 ml-20">
                          <el-form-item :label="$t('work.zipFileName') || 'ZIP文件名'" label-width="100px">
                            <el-input v-model="high_setting_form.zip_file_name"
                              :placeholder="$t('work.inputZipName') || '请输入ZIP文件名'"></el-input>
                          </el-form-item>
                          <el-checkbox v-model="high_setting_form.is_zip_encrypt" class="mb-10">{{ $t('work.isEncrypt')
                            || '是否加密' }}</el-checkbox>
                          <div v-if="high_setting_form.is_zip_encrypt">
                            <el-form-item :label="$t('work.inputPassword') || '请输入密码'" label-width="100px">
                              <el-input type="password" v-model="high_setting_form.zip_password"
                                show-password></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('work.confirmPassword') || '请确认密码'" label-width="100px">
                              <el-input type="password" v-model="high_setting_form.zip_repassword"
                                show-password></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </transition>
                    </div>

                    <div class="divider-h mt-20 mb-20"></div>

                    <!-- HASH / Misc Switches -->
                    <div class="grand-switch-grid">
                      <div class="g-switch-item"
                        v-if="high_setting_form.is_generate_iso || high_setting_form.is_generate_zip">
                        <span class="g-label">{{ $t('work.genMD5') || '生成MD5 HASH文件' }}</span>
                        <el-switch v-model="high_setting_form.s1"></el-switch>
                      </div>
                      <div class="g-switch-item"
                        v-if="high_setting_form.is_generate_iso || high_setting_form.is_generate_zip">
                        <span class="g-label">{{ $t('work.copyHash') || '拷贝HASH文件到存储卡' }}</span>
                        <el-switch v-model="high_setting_form.copy_hash"></el-switch>
                      </div>
                      <div class="g-switch-item"
                        v-if="high_setting_form.is_generate_iso || high_setting_form.is_generate_zip">
                        <span class="g-label">{{ $t('work.printMD5') || '打印MD5到HASH字段' }}</span>
                        <el-switch v-model="high_setting_form.s2"></el-switch>
                      </div>
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.failLabel') || '失败打印标签' }}</span>
                        <el-switch v-model="high_setting_form.s3"></el-switch>
                      </div>
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.allowSpanCard') || '允许跨卡' }}</span>
                        <el-switch v-model="high_setting_form.Span_USBcard"></el-switch>
                      </div>
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.presetContent') || '预设内容拷贝' }}</span>
                        <el-switch v-model="high_setting_form.hasAddFile"></el-switch>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ================= 模式 2: 加密存储卡 ================= -->
                <div v-else-if="file_form === 2">
                  <!-- 基础配置 (完整配置) -->
                  <div class="grand-section">
                    <div class="grand-title"><span>{{ $t('work.basicConfig') || '基础配置' }}</span>
                      <div class="title-line"></div>
                    </div>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item :label="$t('work.better') || '优先级'">
                          <el-select v-model="high_setting_form.priority" class="w-full">
                            <el-option v-for="item in high_setting.priority" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.startWorkSpace') || '目标工作站'">
                          <el-select v-model="high_setting_form.target_work" class="w-full">
                            <el-option v-for="item in high_setting.target_work" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.ribbonType') || '色带类型'">
                          <el-select v-model="high_setting_form.color_type" class="w-full">
                            <el-option v-for="item in high_setting.color_type" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.formatFile') || '拷贝前格式化'">
                          <el-select v-model="high_setting_form.formatFile" class="w-full">
                            <el-option v-for="item in high_setting.formatFile" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>

                  <!-- 高级功能 (ISO/ZIP) -->
                  <div class="grand-section">
                    <div class="grand-title"><span>{{ $t('work.advancedFeatures') || '高级功能' }}</span>
                      <div class="title-line"></div>
                    </div>

                    <div class="feature-row">
                      <el-checkbox v-model="high_setting_form.is_generate_iso">{{ $t('work.generateISO') || '拷贝前生成ISO'
                      }}</el-checkbox>
                      <transition name="el-zoom-in-top">
                        <div v-if="high_setting_form.is_generate_iso" class="mt-10 ml-20">
                          <el-form-item :label="$t('work.isoFileName') || 'ISO文件名'" label-width="100px">
                            <el-input v-model="high_setting_form.iso_file_name"
                              :placeholder="$t('work.inputIsoName') || '请输入ISO文件名'"></el-input>
                          </el-form-item>
                        </div>
                      </transition>
                    </div>

                    <div class="feature-row mt-10">
                      <el-checkbox v-model="high_setting_form.is_generate_zip">{{ $t('work.generateZIP') || '拷贝前生成ZIP'
                      }}</el-checkbox>
                      <transition name="el-zoom-in-top">
                        <div v-if="high_setting_form.is_generate_zip" class="mt-10 ml-20">
                          <el-form-item :label="$t('work.zipFileName') || 'ZIP文件名'" label-width="100px">
                            <el-input v-model="high_setting_form.zip_file_name"
                              :placeholder="$t('work.inputZipName') || '请输入ZIP文件名'"></el-input>
                          </el-form-item>
                          <el-checkbox v-model="high_setting_form.is_zip_encrypt" class="mb-10">{{ $t('work.isEncrypt')
                            || '是否加密' }}</el-checkbox>
                          <div v-if="high_setting_form.is_zip_encrypt">
                            <el-form-item :label="$t('work.inputPassword') || '请输入密码'" label-width="100px">
                              <el-input type="password" v-model="high_setting_form.zip_password"
                                show-password></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('work.confirmPassword') || '请确认密码'" label-width="100px">
                              <el-input type="password" v-model="high_setting_form.zip_repassword"
                                show-password></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </transition>
                    </div>

                    <div class="divider-h mt-20 mb-20"></div>

                    <!-- HASH / Misc Switches -->
                    <div class="grand-switch-grid">
                      <div class="g-switch-item"
                        v-if="high_setting_form.is_generate_iso || high_setting_form.is_generate_zip">
                        <span class="g-label">{{ $t('work.genMD5') || '生成MD5 HASH文件' }}</span>
                        <el-switch v-model="high_setting_form.s1"></el-switch>
                      </div>
                      <div class="g-switch-item"
                        v-if="high_setting_form.is_generate_iso || high_setting_form.is_generate_zip">
                        <span class="g-label">{{ $t('work.copyHash') || '拷贝HASH文件到存储卡' }}</span>
                        <el-switch v-model="high_setting_form.copy_hash"></el-switch>
                      </div>
                      <div class="g-switch-item"
                        v-if="high_setting_form.is_generate_iso || high_setting_form.is_generate_zip">
                        <span class="g-label">{{ $t('work.printMD5') || '打印MD5到HASH字段' }}</span>
                        <el-switch v-model="high_setting_form.s2"></el-switch>
                      </div>
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.failLabel') || '失败打印标签' }}</span>
                        <el-switch v-model="high_setting_form.s3"></el-switch>
                      </div>
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.allowSpanCard') || '允许跨卡' }}</span>
                        <el-switch v-model="high_setting_form.Span_USBcard"></el-switch>
                      </div>
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.presetContent') || '预设内容拷贝' }}</span>
                        <el-switch v-model="high_setting_form.hasAddFile"></el-switch>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ================= 模式 1: 电子光盘 ================= -->
                <div v-else-if="file_form === 1">
                  <div class="grand-section">
                    <div class="grand-title"><span>{{ $t('work.basicConfig') || '基础配置' }}</span>
                      <div class="title-line"></div>
                    </div>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item :label="$t('work.better') || '优先级'">
                          <el-select v-model="high_setting_form.priority" class="w-full">
                            <el-option v-for="item in high_setting.priority" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.startWorkSpace') || '目标工作站'">
                          <el-select v-model="high_setting_form.target_work" class="w-full">
                            <el-option v-for="item in high_setting.target_work" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.ribbonType') || '色带类型'">
                          <el-select v-model="high_setting_form.color_type" class="w-full">
                            <el-option v-for="item in high_setting.color_type" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>

                  <div class="grand-section">
                    <div class="grand-title"><span>{{ $t('work.funcSwitch') || '功能开关' }}</span>
                      <div class="title-line"></div>
                    </div>
                    <div class="grand-switch-grid">
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.failLabel') || '失败打印标签' }}</span>
                        <el-switch v-model="high_setting_form.s3"></el-switch>
                      </div>
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.allowSpanCard') || '允许跨卡' }}</span>
                        <el-switch v-model="high_setting_form.Span_USBcard"></el-switch>
                      </div>
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.presetContent') || '预设内容拷贝' }}</span>
                        <el-switch v-model="high_setting_form.hasAddFile"></el-switch>
                      </div>
                      <div class="g-switch-item highlight">
                        <span class="g-label">{{ $t('work.mixMode') || '混合模式' }}</span>
                        <el-switch v-model="high_setting_form.is_blend"></el-switch>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ================= 模式 4: 防拷贝存储卡 ================= -->
                <div v-else-if="file_form === 4">
                  <div class="grand-section">
                    <div class="grand-title"><span>{{ $t('work.basicConfig') || '基础配置' }}</span>
                      <div class="title-line"></div>
                    </div>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item :label="$t('work.better') || '优先级'">
                          <el-select v-model="high_setting_form.priority" class="w-full">
                            <el-option v-for="item in high_setting.priority" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.startWorkSpace') || '目标工作站'">
                          <el-select v-model="high_setting_form.target_work" class="w-full">
                            <el-option v-for="item in high_setting.target_work" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="$t('work.ribbonType') || '色带类型'">
                          <el-select v-model="high_setting_form.color_type" class="w-full">
                            <el-option v-for="item in high_setting.color_type" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="grand-section">
                    <div class="grand-title"><span>{{ $t('work.funcSwitch') || '功能开关' }}</span>
                      <div class="title-line"></div>
                    </div>
                    <div class="grand-switch-grid">
                      <div class="g-switch-item">
                        <span class="g-label">{{ $t('work.failLabel') || '失败打印标签' }}</span>
                        <el-switch v-model="high_setting_form.s3"></el-switch>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ================= 通用模块：硬件与录制 (所有模式共有) ================= -->
                <div class="grand-section">
                  <el-row :gutter="40">
                    <!-- 录制 -->
                    <el-col :span="14">
                      <div class="grand-title"><span>{{ $t('work.screenRecordReview') || '屏幕记录审查' }}</span>
                        <div class="title-line"></div>
                      </div>
                      <div class="feature-row mb-10">
                        <div class="flex-center-row w-full">
                          <div class="flex-center-row">
                            <el-checkbox v-model="high_setting_form.record_screen" class="font-bold">{{
                              $t('work.enableScreenRecord') || '启用屏幕录制' }}</el-checkbox>
                            <div class="divider-v" style="height: 16px; margin: 0 15px;"></div>
                            <el-checkbox v-model="high_setting_form.print_record_logo"
                              :disabled="!high_setting_form.record_screen">{{ $t('work.printRecordLogo') || '打印录制标识'
                              }}</el-checkbox>
                          </div>
                        </div>
                      </div>
                      <transition name="el-zoom-in-top">
                        <div v-if="high_setting_form.record_screen" class="path-box pl-20">
                          <el-input size="small" v-model="high_setting_form.record_screen_path"
                            :placeholder="$t('work.recordPath') || '录制路径(默认视频目录)'">
                            <template slot="prepend"><i class="el-icon-folder"></i></template>
                          </el-input>
                          <div class="tips-text mt-5"><i class="el-icon-info"></i> 标识使用 <b>luzhi.png</b></div>
                        </div>
                      </transition>
                    </el-col>

                    <!-- 硬件 -->
                    <el-col :span="10">
                      <div class="grand-title"><span>{{ $t('work.hardwareControl') || '硬件管控' }}</span>
                        <div class="title-line"></div>
                      </div>
                      <div class="hardware-box">
                        <div class="mb-10">
                          <el-checkbox v-model="high_setting_form.enable_dongle_counter">{{ $t('work.installDongle') ||
                            '加密狗计数'
                          }}</el-checkbox>
                        </div>
                        <transition name="el-zoom-in-top">
                          <div v-if="high_setting_form.enable_dongle_counter" class="ml-20">
                            <el-form-item :label="$t('work.installCount') || '安装次数'" label-width="80px"
                              style="margin-bottom: 0;">
                              <el-input-number size="small" v-model="high_setting_form.install_dongle_count" :min="1"
                                :max="999"></el-input-number>
                            </el-form-item>
                          </div>
                        </transition>
                      </div>
                      <!-- 新增：授权码 -->
                      <div class="mt-20">
                        <el-form-item :label="$t('work.setAuthCode') || '设置授权码'" label-width="90px"
                          style="margin-bottom: 0;">
                          <el-input size="small" v-model="high_setting_form.auth_code"
                            :placeholder="$t('work.inputAuthCode') || '输入授权码'"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </div>

              </el-form>
            </div>
            <span slot="footer" class="dialog-footer grand-footer">
              <el-button @click="highSettingVisible = false" size="medium" icon="el-icon-close">取 消</el-button>
              <el-button type="primary" @click="saveHighSettings" size="medium" icon="el-icon-check">确认保存</el-button>
            </span>
          </el-dialog>

          <!-- 触发按钮 -->
          <el-button slot="reference" size="medium" @click="highSettingVisible = true"
            style="height: 32px; padding: 0 15px; line-height: 32px">
            {{ $t('work.senior') }}
          </el-button>
          <!-- 屏幕录制按钮 -->
          <screen-recorder ref="screenRecorder" :task-id="upload_disk" @recording-started="onRecordingStarted"
            @recording-stopped="onRecordingStopped" @recording-saved="onRecordingSaved"
            style="margin-right: 10px; display: inline-block;" />

          <!-- 网络路径认证对话框 -->
          <network-auth-dialog :visible="networkAuthVisible" :network-paths="networkAuthPaths"
            @confirm="onNetworkAuthConfirm" @cancel="onNetworkAuthCancel" />
        </div>
      </div>
      <!-- 删除无效布局：v-if=0 -->
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
    <el-row :gutter="0" style="margin-top: 10px">
      <el-col :span="switch_tag && switch_cont ? 12 : switch_tag && !switch_cont ? 0 : 24">
        <div class="grid-content bg-purple">
          <div class="file">
            <div style="display: flex">
              <div style="font-size: 16px; font-weight: 700; height: 32px; line-height: 32px; text-align: left">
                {{ $t('work.contentTitle') }}
              </div>
              <el-popover v-if="guideStep" :placement="guideStep[10].placement" width="250" trigger="manual"
                v-model="guideStep[10].show">
                <div class="guide_box">
                  <div class="guide_title">
                    {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                  </div>
                  <div class="guide_desc">{{ $t(`guide.step11`) }}</div>
                  <div class="guide_btns">
                    <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
                    }}</el-button>
                    <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                      $t('guide.prev') }}</el-button>
                    <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                      guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
                  </div>
                </div>
                <div class="btn-group" slot="reference" :class="{ guide_body: currentStep == 10 }">
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
                  <el-dropdown trigger="click" placement="bottom" style="margin-left: 10px; display: inline-block;"
                    @command="handleContentCommand">
                    <el-button type="primary" plain
                      style="height: 32px; padding: 0 15px; line-height: 32px; font-size: 14px;">
                      {{ $t("work.addContent") }} <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="file">
                        <i class="el-icon-document" style="margin-right: 5px;"></i>{{ $t("file.addFile") }}
                      </el-dropdown-item>
                      <el-dropdown-item command="folder">
                        <i class="el-icon-folder" style="margin-right: 5px;"></i>{{ $t("file.addFolder") }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-popover>
              <el-popover v-if="guideStep" :placement="guideStep[11].placement" width="250" trigger="manual"
                v-model="guideStep[11].show">
                <div class="guide_box">
                  <div class="guide_title">
                    {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                  </div>
                  <div class="guide_desc">{{ $t(`guide.step12`) }}</div>
                  <div class="guide_btns">
                    <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
                    }}</el-button>
                    <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                      $t('guide.prev') }}</el-button>
                    <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                      guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
                  </div>
                </div>
                <div slot="reference" :class="{ guide_body: currentStep == 11 }">
                  <el-input v-model="juanbiao_form" :placeholder="$t('work.pleaseInput')"
                    style="width: 290px; margin-left: 10px">
                    <template slot="prepend">
                      {{ $t('work.sign') }}
                    </template>
                  </el-input>
                </div>
              </el-popover>
            </div>
            <el-row :gutter="20" v-if="false">
              <el-col :span="3">
                <span style="font-size: 16px; font-weight: 700; height: 32px; line-height: 32px; text-align: left">
                  {{ $t('work.contentTitle') }}
                </span>
              </el-col>
              <el-col :span="11">
                <el-input v-model="juanbiao_form" :placeholder="$t('work.pleaseInput')"
                  style="width: 250px; float: left">
                  <template slot="prepend">
                    {{ $t('work.sign') }}
                  </template>
                </el-input>
              </el-col>
              <el-col :span="10">
                <el-progress :text-inside="true" :percentage="file_percent" :format="format" style="line-height: 32px"
                  :stroke-width="20" :color="customColors"></el-progress>
              </el-col>
            </el-row>
            <div style="clear: both"></div>

            <Files ref="files" :onSizechange="sizeChange" :complete="upload_over" :saveWorkList="saveWorkList"
              @network-paths-changed="onNetworkPathsChanged"><el-progress :text-inside="true" :percentage="file_percent"
                :format="format" style="line-height: 32px; flex: 1" :stroke-width="20"
                :color="customColors"></el-progress>
            </Files>
          </div>
        </div>
      </el-col>
      <el-col :span="switch_cont && switch_tag ? 12 : switch_cont && !switch_tag ? 0 : 24">
        <div class="grid-content bg-purple">
          <div class="label">
            <div class="title" style="width: 100%; display: flex; align-items: center; justify-content: space-between">
              <div>
                <span style="font-size: 16px; color: #606266; margin-right: 10px"> {{ $t('work.tag') }} </span>
                <el-select clearable style="width: 280px" v-model="currentTemplate" @change="changeTemplate"
                  :placeholder="$t('work.pleaseSelect')" size="mini">
                  <el-option v-for="(item, index) in templates" :key="index" :label="item.label" :value="item.value">
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
                <el-button style="margin-left: 10px; font-size: 14px; height: 32px; padding: 0 15px; line-height: 32px"
                  @click="openDesign">
                  {{ $t('work.createTag') }}
                </el-button>
                <el-popover v-if="guideStep" :placement="guideStep[12].placement" width="250" trigger="manual"
                  v-model="guideStep[12].show">
                  <div class="guide_box">
                    <div class="guide_title">
                      {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                    </div>
                    <div class="guide_desc">{{ $t(`guide.step13`) }}</div>
                    <div class="guide_btns">
                      <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
                      }}</el-button>
                      <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                        $t('guide.prev') }}</el-button>
                      <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                        guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
                    </div>
                  </div>
                  <div slot="reference" :class="{ guide_body: currentStep == 12 }">
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
                <input type="file" accept=".csv" @change="fileLoad2" ref="refFile2" style="display: none" />

                <input type="file" accept="..zip,.rar" @change="fileLoad3" ref="refFile3" style="display: none" />
              </div>
            </div>
            <div style="float: right"></div>
            <input type="file" accept=".cs,.soon" @change="fileLoad" ref="refFile" style="display: none" />
            <div style="clear: both"></div>
            <el-popover v-if="guideStep" :placement="guideStep[13].placement" width="250" trigger="manual"
              v-model="guideStep[13].show">
              <div class="guide_box">
                <div class="guide_title">
                  {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                </div>
                <div class="guide_desc">{{ $t(`guide.step14`) }}</div>
                <div class="guide_btns">
                  <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
                  }}</el-button>
                  <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                    $t('guide.prev') }}</el-button>
                  <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                    guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
                </div>
              </div>
              <div slot="reference" :class="{ guide_body: currentStep == 13 }">
                <div class="display_box">
                  <el-tooltip class="item" effect="light" content="打印正面" placement="bottom">
                    <div class="display_item" @click="print_flag = 2">
                      <div class="display_bg" v-if="print_flag == 3"></div>
                      <img :src="fileData.frontDisplayPic" />
                    </div>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" content="打印反面" placement="bottom">
                    <div class="display_item" @click="print_flag = 3">
                      <div class="display_bg" v-if="print_flag == 2"></div>
                      <img :src="fileData.backDisplayPic" />
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </el-popover>
            <el-popover v-if="guideStep" :placement="guideStep[14].placement" width="250" trigger="manual"
              v-model="guideStep[14].show">
              <div class="guide_box">
                <div class="guide_title">
                  {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
                </div>
                <div class="guide_desc">{{ $t(`guide.step15`) }}</div>
                <div class="guide_btns">
                  <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
                  }}</el-button>
                  <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                    $t('guide.prev') }}</el-button>
                  <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                    guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
                </div>
              </div>
              <div slot="reference" :class="{ guide_body: currentStep == 14 }">
                <el-table :data="tableData" height="200" style="width: 100%" :empty-text="$t('work.nodata')"
                  :show-header="false">
                  <el-table-column prop="name" min-width="110" :label="$t('work.fieldName')">
                  </el-table-column>
                  <el-table-column prop="val" min-width="240">
                    <template slot-scope="scope">
                      <div v-if="scope.row.type == 1">
                        <input type="file" accept="image/*" :ref="scope.row.origin_name"
                          :data-name="scope.row.origin_name" />
                      </div>
                      <div v-if="scope.row.type == 3 || scope.row.type == 4 || scope.row.type == 5">
                        <el-input :placeholder="$t('work.pleaseInput')" v-model="form[scope.row.origin_name]" clearable
                          style="width: calc(100% - 30px) !important" :disabled="csvIsExist">
                        </el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="val" min-width="90">
                    <template slot-scope="scope">
                      <div v-if="scope.row.type == 3 || scope.row.type == 4 || scope.row.type == 5">
                        <el-tooltip class="item" effect="dark"
                          :content="file_name == null ? $t('work.binfile') : file_name.strLen() > 12 ? file_name.subCHStr(0, 12) + '...' : file_name"
                          placement="top-start">
                          <el-button size="mini" @click="openFile2">
                            {{ file_name == null ? $t('work.binfile') : file_name.strLen() > 12 ? file_name.subCHStr(0,
                              12) + '...' : file_name }}
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
    <el-row :gutter="20" style="padding: 10px">
      <!-- Input fields removed as they are moved to Advanced Settings -->
      <div style="width: 100%">&nbsp;</div>
      </el-col>
      <el-col :span="8" style="display: flex; align-items: center; justify-content: space-between">
        <el-popover v-if="guideStep" :placement="guideStep[15].placement" width="250" trigger="manual"
          v-model="guideStep[15].show">
          <div class="guide_box">
            <div class="guide_title">
              {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
            </div>
            <div class="guide_desc">{{ $t(`guide.step16`) }}</div>
            <div class="guide_btns">
              <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
              }}</el-button>
              <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                $t('guide.prev') }}</el-button>
              <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                guideStep.length
                - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
            </div>
          </div>
          <div slot="reference" :class="{ guide_body: currentStep == 15 }">
            <el-input :placeholder="$t('work.addContent')" v-model="number" style="width: 200px; height: 32px">
              <template slot="prepend">
                {{ $t('work.num') }}
              </template>
            </el-input>
          </div>
        </el-popover>
        <div style="display: flex; align-items: center">
          <el-button type="primary" @click="saveWork"
            style="margin-right: 20px; height: 32px; padding: 0 15px; line-height: 32px">
            {{ $t('work.save') }}
          </el-button>
          <el-popover v-if="guideStep" :placement="guideStep[16].placement" width="250" trigger="manual"
            v-model="guideStep[16].show">
            <div class="guide_box">
              <div class="guide_title">
                {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
              </div>
              <div class="guide_desc">
                {{ $t(`guide.step17`)
                }}<a @click="help" v-if="currentStep == guideStep.length - 1">，{{ $t(`guide.help`) }}</a>
              </div>
              <div class="guide_btns">
                <el-button @click="exitGuide" class="guide_btn1" size="mini" type="text">{{ $t('guide.skip')
                }}</el-button>
                <el-button v-if="parseInt(currentStep) > 0" @click="prevStep" class="guide_btn1" size="mini">{{
                  $t('guide.prev') }}</el-button>
                <el-button @click="nextStep" class="guide_btn2" size="mini" type="primary">{{ currentStep ==
                  guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}</el-button>
              </div>
            </div>
            <div slot="reference" :class="{ guide_body: currentStep == 16 }">
              <el-button type="primary" style="height: 32px; padding: 0 15px; line-height: 32px" @click="upload">
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
import NetworkAuthDialog from './NetworkAuthDialog.vue'
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
    ScreenRecorder,
    NetworkAuthDialog
  },
  data() {
    return {
      // 网络路径认证相关
      networkAuthVisible: false,
      networkAuthPaths: [],
      networkCredentials: {},

      // 模板列表
      templates: [],
      currentTemplate: '',
      highSettingVisible: false,
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
        Span_USBcard: false,
        hasAddFile: false, //拷贝附加文件

        // New Settings Default
        is_blend: false,
        record_screen: false,
        record_screen_path: '',
        print_record_logo: false,
        is_blend: false,

        // New Fields based on requirements
        is_generate_iso: false,
        iso_file_name: '',

        is_generate_zip: false,
        zip_file_name: '',
        is_zip_encrypt: false,
        zip_password: '',
        zip_repassword: '',

        copy_hash: false, // 拷贝HASH到存储卡

        enable_dongle_counter: false, // 启用加密狗计数
        install_dongle_count: 0,

        record_screen: false,
        record_screen_path: '',
        print_record_logo: false,

        auth_code: '' // 授权码
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
  updated() { },
  mounted() {
    const high = localStorage.getItem('high_setting_form')
    // Merge store defaults with localStorage to ensure new fields (is_blend, etc.) exist
    const defaults = (this.$store && this.$store.state && this.$store.state.user) ? this.$store.state.user.setFormDefault : {
      is_blend: false,
      record_screen: false,
      record_screen_path: '',
      print_record_logo: false,
      install_dongle_count: 0
    }
    if (high) {
      try {
        const stored = JSON.parse(high)
        this.high_setting_form = { ...this.high_setting_form, ...defaults, ...stored }
      } catch (e) {
        this.high_setting_form = { ...this.high_setting_form, ...defaults }
      }
    } else {
      this.high_setting_form = { ...this.high_setting_form, ...defaults }
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

    // 加载网络认证信息
    this.loadNetworkCredentials()

    this.getTemplates()
    // 加载已保存的网络认证，支持二次新建直接使用
    if (this.loadNetworkCredentials) {
      this.loadNetworkCredentials()
    }
  },
  updated() { },
  methods: {
    // 高级设置相关
    saveHighSettings() {
      // 保存高级设置到 localStorage
      localStorage.setItem('high_setting_form', JSON.stringify(this.high_setting_form))

      this.$message({
        type: 'success',
        message: '高级设置已保存',
        offset: 100
      })

      // 如果录制设置改变,需要重新初始化
      if (this.high_setting_form.record_screen && !this.isRecording) {
        this.autoStartRecording()
      } else if (!this.high_setting_form.record_screen && this.isRecording) {
        this.stopRecordingIfActive()
      }

      this.highSettingVisible = false
    },

    // 自动录制相关
    autoStartRecording() {
      if (!this.taskUUID) {
        this.taskUUID = this.genTaskUUID()
      }

      const fileName = `${this.taskUUID}.webm`
      const savePath = this.high_setting_form.record_screen_path || this.getDefaultVideoPath()
      this.recordingFilePath = `${savePath}/${fileName}`

      // 调用录制组件开始录制
      if (this.$refs.screenRecorder) {
        this.$refs.screenRecorder.startRecording({ fileName, savePath })
        this.isRecording = true
      } else {
        // 如果没有录制组件,模拟录制状态
        this.isRecording = true
        console.log('[自动录制] 录制已开始:', this.recordingFilePath)
      }
    },

    getDefaultVideoPath() {
      try {
        const { remote } = require('electron')
        return remote.app.getPath('videos')
      } catch (e) {
        return ''
      }
    },

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

    // 网络路径认证相关方法
    loadNetworkCredentials() {
      try {
        const stored = localStorage.getItem('networkCredentials')
        if (stored) {
          this.networkCredentials = JSON.parse(stored)
        }
      } catch (error) {
        console.error('加载网络认证信息失败:', error)
      }
    },

    // 检查是否有网络路径需要认证
    checkNetworkPaths() {
      if (!(this.$refs.files && this.$refs.files.hasNetworkPaths())) {
        return false
      }
      const networkPaths = this.$refs.files.getNetworkPaths() || []
      if (networkPaths.length === 0) return false

      // 从本地存储的 credentials 中匹配已有主机
      let stored = {}
      try {
        stored = JSON.parse(localStorage.getItem('networkCredentials') || '{}')
      } catch (e) {
        stored = {}
      }
      const missing = []
      const prepared = []
      for (const item of networkPaths) {
        const host = item.hostName || this.getHostFromPath(item.path) || ''
        if (host && stored[host] && stored[host].userName && stored[host].password) {
          prepared.push({
            host_name: host,
            user_name: stored[host].userName,
            password: stored[host].password,
          })
        } else {
          missing.push({ ...item, hostName: host })
        }
      }

      if (missing.length > 0) {
        // 仅对缺失凭据的主机弹窗
        this.networkAuthPaths = missing.map(m => ({
          path: m.path,
          hostName: m.hostName,
          userName: '',
          password: ''
        }))
        this.networkAuthVisible = true
        // 先保存已准备好的，等用户补齐再一起提交
        this.networkCredentials = prepared
        return true
      }

      // 全部已有凭据，直接使用
      this.networkCredentials = prepared
      return false
    },

    // 文件列表网络路径变化时触发，若为空则关闭弹窗
    onNetworkPathsChanged(paths) {
      if (!paths || paths.length === 0) {
        this.networkAuthVisible = false
        this.networkAuthPaths = []
      } else {
        this.networkAuthPaths = paths
      }
    },

    // 网络认证确认回调
    onNetworkAuthConfirm(netInfo) {
      this.networkCredentials = netInfo
      this.networkAuthVisible = false

      // 继续提交流程
      this.continueSubmit()
    },

    // 网络认证取消回调
    onNetworkAuthCancel() {
      this.networkAuthVisible = false
      this.$message.info(this.$t('networkAuth.authCanceled'))
    },

    // 继续提交流程
    continueSubmit() {
      // 这里继续原来的提交逻辑
      this.performSubmit()
    },
    // Continue submit flow
    continueSubmit() {
      // Logic
      this.performSubmit()
    },
    handleContentCommand(command) {
      if (command === 'folder') {
        this.addFolder();
      } else {
        this.addFile();
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

      // 检查是否有网络路径需要认证
      if (this.checkNetworkPaths()) {
        return // 等待用户完成网络认证
      }

      // 继续提交流程
      this.performSubmit()
    },

    // 实际的提交逻辑
    async performSubmit() {
      let that = this;
      //提交最终的任务请求
      let data = ''
      let pathName
      if (that.high_setting_form.localfiles) {
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
        // ISO Check
        if (that.high_setting_form.is_generate_iso) {
          if (!that.high_setting_form.iso_file_name) {
            this.$message({
              offset: 100,
              message: "请输入ISO文件名",
              type: 'warning'
            });
            return;
          }
          // data += "&diskLabel=" + that.high_setting_form.iso_file_name; // If needed by backend for ISO label, or just rely on 'iso_file_name' param added later
        }

        // ZIP Check
        if (that.high_setting_form.is_generate_zip) {
          if (!that.high_setting_form.zip_file_name) {
            this.$message({
              offset: 100,
              message: "请输入ZIP文件名", // "Please input ZIP filename"
              type: 'warning'
            });
            return;
          }
        }

        // ZIP Encrypt Check
        if (that.high_setting_form.is_generate_zip && that.high_setting_form.is_zip_encrypt) {
          if (!that.high_setting_form.zip_password || that.high_setting_form.zip_password !== that.high_setting_form.zip_repassword) {
            this.$message({
              offset: 100,
              message: this.$t("work.zipPassWrong"), // "Password mismatch"
              type: "warning"
            });
            return;
          }
        }
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
      data += '&hasAddFile=' + this.high_setting_form.hasAddFile //拷贝附加文件
      data += '&version=local' //单机版
      data += '&hash=' + this.high_setting_form.s1 //hash
      data += '&md5=' + this.high_setting_form.s2 //md5
      data += '&printer=' + this.high_setting_form.target_work //目标打印机id，若0则全部
      if (this.high_setting_form.formatFile != 0) {
        data += '&formatFile=' + this.high_setting_form.formatFile //拷贝前类型
      }

      // 添加网络路径认证信息
      if (this.networkCredentials && this.networkCredentials.length > 0) {
        data += '&net_info=' + JSON.stringify(this.networkCredentials)
      }

      // New Fields Mapping
      data += '&hasAddFile=' + (String(that.high_setting_form.hasAddFile) || 'false') +
        '&is_generate_iso=' + (String(that.high_setting_form.is_generate_iso) || 'false') +
        '&iso_file_name=' + (that.high_setting_form.iso_file_name || '') +
        '&is_generate_zip=' + (String(that.high_setting_form.is_generate_zip) || 'false') +
        '&zip_file_name=' + (that.high_setting_form.zip_file_name || '') +
        '&is_zip_encrypt=' + (String(that.high_setting_form.is_zip_encrypt) || 'false') +
        '&zip_password=' + (that.high_setting_form.zip_password || '') +
        '&copy_hash=' + (String(that.high_setting_form.copy_hash) || 'false') +
        '&enable_dongle_counter=' + (String(that.high_setting_form.enable_dongle_counter) || 'false') +
        '&auth_code=' + (that.high_setting_form.auth_code || '');

      data += '&is_blend=' + (String(that.high_setting_form.is_blend) || 'false');
      // record_path logic: if recording, use path
      if (that.high_setting_form.record_screen && that.$refs.screenRecorder && that.$refs.screenRecorder.videoPath) {
        data += '&record_path=' + that.$refs.screenRecorder.videoPath;
      } else {
        data += '&record_path=';
      }
      data += '&is_printer_record_logo=' + (String(that.high_setting_form.print_record_logo) || 'false');
      if (that.high_setting_form.enable_dongle_counter) {
        data += '&donglel_install_count=' + (that.high_setting_form.install_dongle_count || 0);
      } else {
        data += '&donglel_install_count=0';
      }

      // Correct File Type Mapping
      // 0(File)->1, 1(ISO)->2, 2(Encrypt)->3, 4(Forbid)->4
      const fileTypeMap = {
        0: 1,
        1: 2,
        2: 3,
        4: 4
      };
      let apiFileType = fileTypeMap[that.file_form] || 1;
      data += '&file_type=' + apiFileType;



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
            that.submitLoading = false
            that.$emit('jobPost')
          })
      } else {
        that.localUpload(pathName, data_param, data)
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

        // 添加网络路径认证信息
        if (this.networkCredentials && this.networkCredentials.length > 0) {
          formData.append('net_info', JSON.stringify(this.networkCredentials))
        }
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
    },
    // 从路径提取主机名（兼容 \\host\path 与 //host/path）
    getHostFromPath(p) {
      if (!p || typeof p !== 'string') return ''
      if (p.indexOf('\\\\') === 0) {
        const parts = p.slice(2).split('\\')
        return parts[0] || ''
      }
      if (p.indexOf('//') === 0) {
        const parts = p.slice(2).split('/')
        return parts[0] || ''
      }
      const m = p.match(/^([^\\\/:]+)/)
      return (m && m[1]) ? m[1] : ''
    }
  },
  computed: {
    file_percent() {
      let t = (this.size / (((this.size_form * 1000) / 1.024 / 1.024 / 1.024) * 1024 * 1024)) * 100
      return t ? t > 100 ? 100.1 : t : 0
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
          label: '文件和文件夹'
        },
        {
          value: 1,
          label: '电子光盘'
        },
        {
          value: 2,
          label: '加密存储卡'
        },
        {
          value: 4,
          label: '防拷贝存储卡'
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
        if (!val || !this.filter_rules[val]) {
          return
        }
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

.uploader-example .uploader-btn {}

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


/* Grand Dialog Styles */
.grand-dialog .el-dialog__header {
  padding: 24px 30px;
  border-bottom: 1px solid #f2f2f2;
}

.grand-dialog .el-dialog__title {
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.grand-dialog .el-dialog__body {
  padding: 30px 40px;
  background-color: #fbfbfb;
}

.grand-setting-content {
  /* No padding needed here as body has it */
}

.grand-section {
  background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.02);
  padding: 24px 28px;
  margin-bottom: 25px;
  border: 1px solid #e8eaed;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.grand-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #409EFF 0%, #66b1ff 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.grand-section:hover {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.grand-section:hover::before {
  opacity: 1;
}

.grand-title {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 22px;
  position: relative;
  display: flex;
  align-items: center;
  letter-spacing: 0.3px;
}

.grand-title span {
  padding-right: 12px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.grand-title .title-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #e0e6ed 0%, transparent 100%);
  margin-left: 15px;
}

/* Feature Row 样式 */
.feature-row {
  padding: 12px 0;
  border-left: 3px solid transparent;
  transition: all 0.3s;
}

.feature-row:hover {
  border-left-color: #409EFF;
  padding-left: 8px;
}

/* Path Box 美化 */
.path-box {
  background: #f7f9fc;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s;
}

.path-box:hover {
  background: #f0f5fa;
  border-color: #d0dae5;
}

.w-full {
  width: 100%;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.mb-10 {
  margin-bottom: 10px;
}

.mb-15 {
  margin-bottom: 15px;
}

.mb-20 {
  margin-bottom: 20px;
}

.mr-15 {
  margin-right: 15px;
}

.ml-20 {
  margin-left: 20px;
}

.pl-20 {
  padding-left: 20px;
}

.font-bold {
  font-weight: bold;
}

.text-gray-700 {
  color: #555;
}

.text-gray-600 {
  color: #888;
}

.justify-between {
  justify-content: space-between;
}

.divider-h {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%);
  position: relative;
}

.divider-h::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #d1d5db;
  border-radius: 50%;
}

/* Switch Grid */
.grand-switch-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.g-switch-item {
  width: calc(33.333% - 10px);
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e9ecef;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.g-switch-item:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
  border-color: #dee2e6;
}

.g-switch-item.highlight {
  background: linear-gradient(135deg, #e7f5ff 0%, #d0ebff 100%);
  border: 1.5px solid #74c0fc;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.g-switch-item.highlight:hover {
  background: linear-gradient(135deg, #d0ebff 0%, #a5d8ff 100%);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.25);
}

.g-switch-item.highlight .g-label {
  color: #1971c2;
  font-weight: 600;
}

.g-label {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

/* Utils */
.flex-center-row {
  display: flex;
  align-items: center;
}

.divider-v {
  width: 1px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, #d1d5db, transparent);
  margin: 0 20px;
}

.record-control-box {
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
}

.hardware-box {
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.tips-text {
  font-size: 12px;
  color: #868e96;
  line-height: 1.6;
}

.tips-text i {
  color: #74c0fc;
  margin-right: 5px;
}

.disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* Grand Footer 按钮样式 */
.grand-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 30px;
  background: #fafbfc;
  border-top: 1px solid #e8eaed;
  margin: -24px -30px -20px;
}

.grand-footer .el-button {
  min-width: 100px;
  font-weight: 500;
  transition: all 0.3s;
}

.grand-footer .el-button--primary {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.grand-footer .el-button--primary:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #409EFF 100%);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
  transform: translateY(-1px);
}

.recording_dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  animation: pulse 1s infinite;
  margin-right: 5px;
}

.dropdown-uploader-btn {
  display: block;
  width: 100%;
  padding: 0 20px;
  line-height: 36px;
  border: none !important;
  background: none !important;
  color: #606266;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-uploader-btn:hover {
  background-color: #ecf5ff !important;
  color: #409EFF !important;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 5px rgba(255, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}
</style>
