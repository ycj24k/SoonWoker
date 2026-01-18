<template>
    <div class="work">
        <!-- 头部配置区 -->
        <!-- 顶部通栏：配置与按钮 -->
        <div class="top-header-bar">
            <!-- 左侧配置表单 -->
            <div class="header-settings">
                <task-header :file_form.sync="file_form" :size_form.sync="size_form" :type_form.sync="type_form"
                    :size-type="sizeType" :filter-passed-type="filterPassedType" :guide-step="guideStep"
                    :current-step="currentStep" @exit-guide="exitGuide" @prev-step="prevStep" @next-step="nextStep" />
            </div>

            <!-- 右侧功能按钮 -->
            <div class="header-buttons">
                <!-- 录制组件 (绿色圆形) -->
                <div class="recorder-wrapper"
                    v-if="isRecording || high_setting_form.record_screen || high_setting_form.print_record_logo">
                    <screen-recorder ref="screenRecorder" :task-id="upload_disk" :status-only="true"
                        @recording-started="onRecordingStarted" @recording-stopped="onRecordingStopped"
                        @recording-saved="onRecordingSaved" />

                </div>

                <!-- 高级设置按钮 (白色) -->
                <el-button size="medium" @click="highSettingVisible = true" class="senior-btn-white"
                    icon="el-icon-setting">
                    {{ $t('work.senior') }}
                </el-button>
            </div>

            <!-- 隐藏的组件 -->
            <advanced-settings :visible.sync="highSettingVisible" :form="high_setting_form" :file-form="file_form"
                :printer-list="printerList" :size-form="size_form" @save="saveHighSettings"
                @test-recording="handleTestRecording" />
            <network-auth-dialog :visible="networkAuthVisible" :network-paths="networkAuthPaths"
                @confirm="onNetworkAuthConfirm" @cancel="onNetworkAuthCancel" />
        </div>

        <!-- 主体：左内容 + 右标签 -->
        <el-row :gutter="20" class="main-content-row">
            <!-- 左：内容管理 -->
            <el-col :span="switch_cont && switch_tag ? 12 : 24" v-if="switch_cont">
                <file-management ref="files" :save-work-list="saveWorkList" :juanbiao="juanbiao_form"
                    @update:juanbiao="juanbiao_form = $event" @size-change="onSizeChange" @upload-over="upload_over"
                    @network-paths-changed="onNetworkPathsChanged">
                    <template slot="progress">
                        <el-progress :text-inside="true" :percentage="file_percent" :format="formatSize"
                            class="size-progress" :stroke-width="20" :color="customColors" />
                    </template>
                </file-management>
            </el-col>

            <!-- 右：标签管理 -->
            <el-col :span="switch_cont && switch_tag ? 12 : 24" v-if="switch_tag">
                <tag-metadata ref="tagRef" :templates="templates" :current-template.sync="currentTemplate"
                    :file-data="fileData" :print-flag.sync="print_flag" :table-data="tableData" :form="form"
                    :csv-is-exist="csvIsExist" :file_name="file_name" @template-change="changeTemplate"
                    @open-design="openDesign" @open-file="openFile" @open-csv="openFile2"
                    @image-change="onMetadataImageChange" />
            </el-col>
        </el-row>

        <!-- 底部操作栏 -->
        <div class="footer-actions">
            <div class="left-info">
                <div class="stat-item">
                    <label class="stat-label">{{ $t('work.num') }}:</label>
                    <el-input-number v-model="number" :min="1" size="mini" controls-position="right"
                        class="count-input-new" />
                </div>
            </div>
            <div class="right-buttons">
                <el-button type="success" size="small" @click="saveWork" class="footer-btn">
                    {{ $t('work.save') }}
                </el-button>
                <el-button type="success" size="medium" @click="upload" :loading="submitLoading"
                    class="footer-btn submit-btn">
                    {{ $t('work.submit') }}
                </el-button>
            </div>
        </div>


        <!-- 隐藏的文件选择器 -->
        <input type="file" accept=".cs,.soon" @change="fileLoad" ref="refFile" style="display: none" />
        <input type="file" accept=".csv" @change="fileLoad2" ref="refFile2" style="display: none" />
        <input type="file" accept="..zip,.rar" @change="fileLoad3" ref="refFile3" style="display: none" />
    </div>
</template>

<script>
import TaskHeader from './TaskHeader.vue'
import AdvancedSettings from './AdvancedSettings.vue'
import FileManagement from './FileManagement.vue'
import TagMetadata from './TagMetadata.vue'
import ScreenRecorder from '../recorder/ScreenRecorder.vue'
import NetworkAuthDialog from '../NetworkAuthDialog.vue'

import { extendStringPrototypes, getNowFormatDate, genTaskUUID } from './utils'

// Node/Electron imports
const fs = require('fs')
const path = require('path')
const remote = require('@electron/remote')
const { dialog } = remote
const { ipcRenderer } = require('electron')

export default {
    name: 'WorkMain',
    components: {
        TaskHeader,
        AdvancedSettings,
        FileManagement,
        TagMetadata,
        ScreenRecorder,
        NetworkAuthDialog
    },
    props: {
        dice: Number,
        saveWorkList: Object,
        isNew: Boolean,
        printerList: Array,
        shareDisk: String,
        isCopy: { type: Boolean, default: false },
        filterPassedType: { type: Array, default: () => [] },
        sizeType: { type: Array, default: () => [] }
    },
    data() {
        return {
            // 业务状态
            juanbiao_form: '',
            file_form: 0,
            size_form: null,
            type_form: 0,
            number: 1,

            // 对话框与引导
            highSettingVisible: false,
            networkAuthVisible: false,
            networkAuthPaths: [],
            networkCredentials: {},

            // 录制状态
            isRecording: false,


            // 模板与数据
            templates: [],
            currentTemplate: '',
            fileData: {},
            tableData: [],
            form: {},
            fileLists: [],
            file_name: null,

            csvIsExist: false,
            metadataFiles: {},

            // 其他
            upload_disk: '',
            size: 0,
            print_flag: 1,
            switch_cont: true,
            switch_tag: true,
            submitLoading: false,
            sysAuthCode: '', // 系统配置授权码

            // 新手引导
            guideStep: null,
            currentStep: 0,

            // 文件相关
            file_name3: '',
            zip_attrs: { accept: '.zip' },
            iso_attrs: { accept: 'iso/img' },

            // 辅助字段
            flag: false,
            isPass: false,
            filter_rules: [[0], [1, 5], [0], [0], [3]],
            flag_cont_up: false,
            customColors: [
                { color: '#67C23A', percentage: 99 },
                { color: '#F56C6C', percentage: 100 }
            ],
            logoError: false,

            // 高级设置表单
            high_setting_form: {
                // 基础配置
                priority: 0,
                fileSystem: 0,
                target_work: 0,
                color_type: 0,
                formatFile: 0,

                // 开关选项
                s1: false, // 生成MD5 HASH文件
                s2: false, // 打印MD5到HASH字段
                s3: false, // 失败打印标签
                s4: false,
                s5: false,

                // 密码相关
                pass: '',
                repass: '',

                // 功能开关
                localfiles: false, // 本地文件
                Span_USBcard: false, // 允许跨卡
                hasAddFile: false, // 预设内容拷贝
                is_blend: false, // 混合模式

                // ISO/ZIP 生成
                is_generate_iso: false,
                iso_file_name: '',
                is_generate_zip: false,
                zip_file_name: '',
                is_zip_encrypt: false,
                zip_password: '',
                zip_repassword: '',
                copy_hash: false, // 拷贝HASH文件到存储卡

                // 屏幕录制（重要：确保字段名称一致）
                record_screen: false, // 启用屏幕录制
                record_screen_path: '', // 录制路径
                print_record_logo: false, // 打印录制标识

                // 硬件管控（重要：确保字段名称与提交逻辑一致）
                enable_dongle_counter: false, // 启用加密狗计数
                install_dongle_count: 0, // 安装次数（默认为0而不是1）
                auth_code: '' // 授权码
            }
        }
    },
    watch: {
        filterPassedType: {
            handler() { this.autoSelectCapacity() },
            immediate: true
        },
        sizeType: {
            handler() { this.autoSelectCapacity() },
            immediate: true
        }
    },
    computed: {
        // 容量选项 (从props同步或处理)
        sizeTypeOptions() {
            return this.sizeType
        },
        file_percent() {
            if (!this.size_form || isNaN(parseFloat(this.size_form))) return 0
            let mb = parseFloat(this.size_form) * 931.3
            if (mb <= 0) return 0
            let per = (this.size / (1024 * 1024) / mb) * 100
            if (isNaN(per) || !isFinite(per)) return 0
            return per > 100 ? 100 : parseFloat(per.toFixed(1))
        },
        // 打印选项
        print_op() {
            return [
                { value: 2, label: this.$t('work.front') },
                { value: 3, label: this.$t('work.back') },
                { value: 1, label: this.$t('work.double') }
            ]
        },
        // 分区类型
        type() {
            return [
                { value: 0, label: this.$t('work.diskPart') },
                { value: 1, label: this.$t('work.cdPart') },
                { value: 3, label: this.$t('work.forbidCopyPart') },
                { value: 5, label: this.$t('work.cdWithDisk') }
            ]
        },
        // 文件类型
        file_type() {
            return [
                { value: 0, label: this.$t('work.fileAnd') },
                { value: 1, label: this.$t('work.eCd') },
                { value: 2, label: this.$t('work.zip') },
                { value: 3, label: this.$t('work.passZip') },
                { value: 4, label: this.$t('work.forbidCopyU') }
            ]
        }
    },
    created() {
        // 重置后台录制状态，防止刷新后状态卡死
        ipcRenderer.invoke('reset-recording').catch(e => console.error('Reset recording failed:', e))
        extendStringPrototypes()
        this.upload_disk = genTaskUUID()
    },
    mounted() {
        this.initData()
    },
    beforeDestroy() {
        this.cancelRecordingIfActive()
    },
    methods: {
        autoSelectCapacity() {
            if (!this.sizeType || this.sizeType.length === 0) return

            // 获取有效选项
            let validOptions = this.sizeType
            if (this.filterPassedType && this.filterPassedType.length > 0) {
                validOptions = this.sizeType.filter(item =>
                    this.filterPassedType.indexOf(item.value) !== -1
                )
            }

            // 如果没有有效选项，直接返回
            if (validOptions.length === 0) return

            // 检查当前选中值是否有效
            const isCurrentValid = this.size_form && validOptions.find(o => o.value === this.size_form)

            // 如果当前值无效（或者未选中）且只有唯一有效选项，则自动选中
            // 或者：强制选中第一个有效选项（如果当前值无效）
            if (!isCurrentValid) {
                if (validOptions.length > 0) {
                    this.size_form = validOptions[0].value
                }
            }
        },
        exitGuide() {
            this.$emit('exit-guide')
        },
        initData() {
            const high = localStorage.getItem('high_setting_form')
            if (high) {
                try {
                    const savedForm = JSON.parse(high);
                    // 排除掉不需要持久化的字段，确保每次打开默认不选中
                    const defaults = {
                        is_generate_iso: false,
                        is_generate_zip: false,
                        is_zip_encrypt: false
                    };
                    this.high_setting_form = { ...this.high_setting_form, ...savedForm, ...defaults }

                    // 仅在路径为空时初始化默认路径（兼容三端）
                    if (!this.high_setting_form.record_screen_path) {
                        this.high_setting_form.record_screen_path = this.getDefaultRecordPath();
                    }
                } catch (e) {
                    console.error('Failed to parse high settings')
                }
            } else {
                // 无缓存时初始化默认路径
                this.high_setting_form.record_screen_path = this.getDefaultRecordPath();
            }
            this.juanbiao_form = getNowFormatDate()
            this.print_flag = this.dice === 1 ? 2 : 1
            this.loadNetworkCredentials()
            this.getTemplates()

            // 加载新手引导
            this.guideStep = JSON.parse(localStorage.getItem('guideStep'))
            this.currentStep = localStorage.getItem('currentStep')
            if (this.guideStep && this.guideStep[this.currentStep]) {
                this.guideStep[this.currentStep].show = false
                setTimeout(() => {
                    this.guideStep[this.currentStep].show = true
                }, 200)
            }
            this.getSystemConfig(); // 获取系统配置
        },

        getSystemConfig() {
            this.$axios.get('/web/get_config').then((res) => {
                if (res.data.code === 200 && res.data.data) {
                    this.sysAuthCode = res.data.data.AuthorizationCode || '';
                }
            }).catch(err => {
                console.error('Failed to get system config', err);
            });
        },

        // --- 高级设置与录制 ---
        getDefaultRecordPath() {
            try {
                let root = process.env.NODE_ENV === "development"
                    ? process.cwd()
                    : path.dirname(remote.app.getPath("exe"));
                return path.join(root, 'videos');
            } catch (e) {
                return path.join(process.cwd(), 'videos');
            }
        },
        saveHighSettings() {
            localStorage.setItem('high_setting_form', JSON.stringify(this.high_setting_form))
            // eslint-disable-next-line
            this.$message.success(this.$t('dispose.successReserve'))
            this.highSettingVisible = false
        },
        autoStartRecording() {
            // 已废弃，改为显式手动开始或提交时自动停止
        },
        async stopRecordingIfActive() {
            if (this.$refs.screenRecorder && this.$refs.screenRecorder.isRecording) {
                await this.$refs.screenRecorder.stopRecording(true); // 提交时保存
            }
        },
        async cancelRecordingIfActive() {
            if (this.$refs.screenRecorder && this.$refs.screenRecorder.isRecording) {
                await this.$refs.screenRecorder.cancelRecording(); // 环境关闭时取消
            }
        },
        onRecordingStarted() { this.isRecording = true },
        onRecordingStopped() { this.isRecording = false },
        onRecordingSaved(result) { this.$message.success(`录制已保存: ${result.fileName}`) },
        handleTestRecording(recordPath) {
            const recorder = this.$refs.screenRecorder;
            if (recorder) {
                if (recorder.isRecording) {
                    this.$message.warning(this.$t('recorder.recording'));
                } else {
                    this.highSettingVisible = false;
                    recorder.startRecording({
                        savePath: recordPath || this.getDefaultRecordPath()
                    });
                }
            } else {
                this.$message.error('未找到录像组件');
            }
        },
        onLogoError() {
            this.logoError = true;
        },

        // --- 文件管理回调 ---
        onSizeChange(size) { this.size = size },
        formatSize() {
            if (!this.size_form || isNaN(parseFloat(this.size_form))) return '0MB / 0MB'
            let mb = (parseFloat(this.size_form) * 931.3).toFixed(0)
            return (this.size / (1024 * 1024)).toFixed(1) + 'MB / ' + mb + 'MB'
        },

        // --- 标签页逻辑 ---
        openDesign() {
            ipcRenderer.send('openDesign')
        },
        openFile() { this.$refs.refFile.click() },
        openFile2() { this.$refs.refFile2.click() },
        fileLoad() {
            this.fileLists = this.$refs.refFile.files
            if (this.fileLists[0]) {
                const reader = new FileReader()
                reader.onload = (e) => this.readFile(e.target.result)
                reader.readAsText(this.fileLists[0])
            }
        },
        readFile(content) {
            try {
                const data = JSON.parse(content)
                this.fileData = data
                this.form = {}
                this.tableData = []

                // 解析正面数据字段
                if (data.frontData && Array.isArray(data.frontData)) {
                    data.frontData.forEach(item => {
                        if ([1, 3, 4, 5].includes(item.type)) {
                            const defaultVal = item.DefaultText !== undefined ? item.DefaultText : ''
                            this.tableData.push({
                                name: item.name,
                                sideLabel: this.$t('work.front_tag'),
                                val: defaultVal,
                                origin_name: item.name,
                                type: item.type,
                                default: item.DefaultText
                            })
                            this.$set(this.form, item.name, defaultVal)
                        }
                    })
                }

                // 解析背面数据字段
                if (data.backData && Array.isArray(data.backData)) {
                    data.backData.forEach(item => {
                        if ([1, 3, 4, 5].includes(item.type)) {
                            const defaultVal = item.DefaultText !== undefined ? item.DefaultText : ''
                            this.tableData.push({
                                name: item.name,
                                sideLabel: this.$t('work.back_tag'),
                                val: defaultVal,
                                origin_name: item.name,
                                type: item.type,
                                default: item.DefaultText
                            })
                            this.$set(this.form, item.name, defaultVal)
                        }
                    })
                }

                // 清空文件选择器
                if (this.$refs.refFile2) this.$refs.refFile2.value = ''
                if (this.$refs.refFile3) this.$refs.refFile3.value = ''
                this.csvIsExist = false
                this.file_name = null
                this.currentTemplate = ''
            } catch (e) {
                console.error('解析标签文件失败:', e)
                this.$message.error('无效的标签文件')
            }
        },
        fileLoad2() {
            this.file_name = this.$refs.refFile2.files[0].name
            this.csvLoad()
        },
        csvLoad() {
            const selectedFile = this.$refs.refFile2.files[0]
            const reader = new FileReader()
            reader.onload = (e) => {
                const lines = e.target.result.split('\n')
                if (lines.length >= 2) {
                    const headers = lines[0].replace('\r', '').split(',')
                    const values = lines[1].replace('\r', '').split(',')
                    headers.forEach((h, i) => {
                        if (h) this.$set(this.form, h, values[i])
                    })
                    this.csvIsExist = true
                }
            }
            reader.readAsText(selectedFile)
        },
        fileLoad3() {
            this.file_name3 = this.$refs.refFile3.files[0].name
        },
        getTemplates() {
            const templateDir = path.join(remote.app.getPath('userData'), 'User Templates')
            if (!fs.existsSync(templateDir)) {
                try { fs.mkdirSync(templateDir, { recursive: true }) } catch (e) { console.error(e) }
            }
            fs.readdir(templateDir, (err, files) => {
                if (!err) {
                    this.templates = files.filter(f => f.endsWith('.cs') || f.endsWith('.soon')).map(file => ({
                        label: file,
                        value: path.join(templateDir, file)
                    }))
                }
            })
        },
        changeTemplate(templatePath) {
            if (!templatePath) return
            fs.readFile(templatePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('读取模板文件时出错:', err)
                    this.$message.error('读取模板文件失败')
                    return
                }
                // 创建文件对象保存到fileLists，与手动导入保持一致
                const fileName = path.basename(templatePath)
                this.fileLists[0] = new File([data], fileName, { type: '' })
                this.readFile(data)
            })
        },

        onMetadataImageChange(fieldName, file) {
            if (fieldName && file) {
                this.$set(this.metadataFiles, fieldName, file)
            }
        },

        // --- 网络认证 ---
        loadNetworkCredentials() {
            try {
                const stored = localStorage.getItem('networkCredentials')
                if (stored) this.networkCredentials = JSON.parse(stored)
            } catch (e) { console.error(e) }
        },
        onNetworkPathsChanged(paths) {
            this.networkAuthPaths = paths || []
            this.networkAuthVisible = paths && paths.length > 0
        },
        onNetworkAuthConfirm(netInfo) {
            this.networkCredentials = netInfo
            this.networkAuthVisible = false
            this.performSubmit()
        },
        onNetworkAuthCancel() {
            this.networkAuthVisible = false
        },

        // --- 提交逻辑 ---
        async upload() {

            // 退出新手引导
            if (this.guideStep) {
                this.exitGuide()
            }

            // ========== 前置验证（所有场景共用）==========
            // 1. 容量选择验证
            if (!this.size_form) {
                return this.$message.warning(this.$t('work.size_form_error'))
            }

            // 2. 初始化文件状态（对齐 legacy）
            for (let i in this.$refs.files.filesList) {
                this.$refs.files.filesList[i].state = false
            }
            this.$refs.files.nowstate = true

            // ========== 核心分支：基于 allNumber 判断 ==========
            if (this.$refs.files.allNumber > 0) {
                // ============ 有内容文件的分支 ============
                console.log('检测到内容文件数量:', this.$refs.files.allNumber)

                // 容量限制检查（非跨卡模式）
                if (!this.high_setting_form.Span_USBcard && this.size > ((this.size_form * 1000) / 1.024 / 1.024 / 1.024) * 1024 * 1024) {
                    return this.$message.warning(this.$t('work.sizeExtra'))
                }

                // 双重校验（防御性编程，理论上不会触发）
                if (this.$refs.files.allNumber == 0) {
                    return this.$message.warning(this.$t('work.pleaseUploadContent'))
                }

                // 设置内容上传标志
                this.flag_cont_up = true
                this.upload_flag = true

                // 本地文件模式判断
                if (this.high_setting_form.localfiles) {
                    console.log('本地文件模式，跳过内容上传')
                    return  // 直接返回，等待外部触发或用户操作
                }

                // 检查文件计算状态
                let t = true
                for (let i in this.$refs.files.filesList) {
                    if (this.$refs.files.filesList[i].size == -1) {
                        t = false
                    }
                }
                if (!t) {
                    return this.$message.warning(this.$t('work.waitCalculate'))
                }

                // 设置上传参数并启动
                this.$refs.files.isCopy = this.isCopy
                this.$refs.files.copyPath = this.shareDisk + '\\\\' + this.upload_disk + '\\\\data\\\\'
                this.$refs.files.resume(this.file_form)

            } else {
                // ============ 无内容文件的分支（只有标签）============
                console.log('无内容文件，进入标签上传流程')

                // 构建 FormData
                let files_n_incr = 1
                let data1 = new FormData()

                // 标签文件校验与添加
                if (this.isNew) {
                    // 新建模式：必须有 CS 文件
                    if (this.fileLists[0]) {
                        data1.append(`file${files_n_incr}`, this.fileLists[0])
                        files_n_incr++
                    } else {
                        return this.$message.warning(this.$t('work.pleaseUploadTag'))
                    }
                } else {
                    // 编辑模式：必须有 fileData 或 fileLists[0]
                    if (this.fileData && !this.fileLists[0]) {
                        // 纯打开，上传 AS 文件（JSON）
                        let _file = new File([JSON.stringify(this.fileData)], this.saveWorkList.taskName, { type: 'text/plain' })
                        data1.append(`file${files_n_incr}`, _file)
                        files_n_incr++
                    } else if (this.fileData && this.fileLists[0]) {
                        // 打开后重新选择了 CS 文件
                        data1.append(`file${files_n_incr}`, this.fileLists[0])
                        files_n_incr++
                    } else {
                        return this.$message.warning(this.$t('work.pleaseUploadTag'))
                    }
                }

                // CSV 合并文件
                if (this.$refs.refFile2.files.length != 0) {
                    data1.append(`file${files_n_incr}`, this.$refs.refFile2.files[0])
                    data1.append(`csv`, true)
                    files_n_incr++
                } else {
                    data1.append(`csv`, false)
                }

                // 元数据字段（图片、文本、条码）
                for (let item of this.tableData) {
                    if (item.type == 1 && this.metadataFiles[item.origin_name] && this.$refs.refFile2.files.length != 0) {
                        // 有合并文件的图片
                        data1.append(`file${files_n_incr}`, this.metadataFiles[item.origin_name])
                        files_n_incr++
                    } else if (item.type == 1 && this.metadataFiles[item.origin_name] && this.$refs.refFile2.files.length == 0) {
                        // 无合并文件的图片
                        data1.append(item.origin_name, this.metadataFiles[item.origin_name])
                    } else if ((item.type == 3 || item.type == 5) && this.$refs.refFile2.files.length == 0) {
                        // 文本与条形码
                        let data = this.form[item.origin_name]
                        if (data == '' || data == undefined || data == null) {
                            data = item.default
                        }
                        data1.append(item.origin_name, data)
                    } else if (item.type == 4 && this.$refs.refFile2.files.length == 0) {
                        // 二维码
                        data1.append(item.origin_name, this.form[item.origin_name])
                    }
                }

                // 上传标签文件
                this.$message({ offset: 100, message: this.$t('work.uploadingTag') })
                this.$axios({
                    method: 'post',
                    url: '/upload/' + this.upload_disk,
                    headers: { 'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime() },
                    data: data1
                }).then((res) => {
                    this.submit()  // 调用提交函数
                })
            }
        },
        upload_over() {
            if (this.flag_cont_up) {
                // 检查是否需要上传标签（只有内容时不上传标签）
                let skipTagUpload = false

                // 1. 检查是否有标签文件
                let hasTagFile = false
                if (this.isNew) {
                    if (this.fileLists && this.fileLists.length > 0) {
                        hasTagFile = true
                    }
                } else {
                    if (this.fileData || (this.fileLists && this.fileLists.length > 0)) {
                        hasTagFile = true
                    }
                }

                // 2. 检查是否有 CSV 合并文件
                const hasCsv = this.$refs.refFile2 && this.$refs.refFile2.files && this.$refs.refFile2.files.length > 0


                // 3. 检查是否有实际的图片元数据文件
                const hasImageFiles = !!(this.metadataFiles && Object.keys(this.metadataFiles).length > 0)

                // 判断：如果没有任何标签相关内容，跳过标签上传
                if (!hasTagFile && !hasCsv && !hasImageFiles) {
                    skipTagUpload = true
                }

                if (skipTagUpload) {
                    this.performSubmit()
                } else {
                    this.submitAndTag()
                }
            } else {
                this.performSubmit()
            }
        },
        async submit() {
            // 停止录制（如果正在录制）
            await this.stopRecordingIfActive()

            // 检查是否有网络路径需要认证
            if (this.checkNetworkPaths && this.checkNetworkPaths()) {
                return // 等待用户完成网络认证
            }

            // 继续提交流程
            this.performSubmit()
        },
        async submitAndTag() {
            const data1 = new FormData()
            let files_n_incr = 1

            // 1. 标签文件 (Label File)
            let hasLabelFile = false
            if (this.isNew) {
                if (this.fileLists && this.fileLists[0]) {
                    data1.append(`file${files_n_incr}`, this.fileLists[0])
                    files_n_incr++
                    hasLabelFile = true
                }
            } else {
                if (this.fileData && !this.fileLists[0]) {
                    // 纯打开，上传 AS 文件 (JSON)
                    let _file = new File([JSON.stringify(this.fileData)], this.saveWorkList.taskName, { type: 'text/plain' })
                    data1.append(`file${files_n_incr}`, _file)
                    files_n_incr++
                    hasLabelFile = true
                } else if (this.fileData && this.fileLists[0]) {
                    // 重新选择了 CS 文件
                    data1.append(`file${files_n_incr}`, this.fileLists[0])
                    files_n_incr++
                    hasLabelFile = true
                }
            }

            // 校验：若开启标签但无文件且无内容区文件
            if (!hasLabelFile && this.switch_tag) {
                const hasContentFiles = this.$refs.files && this.$refs.files.allNumber > 0;
                if (!hasContentFiles) {
                    return this.$message.warning(this.$t('work.pleaseUploadTag'))
                }
            }

            // 2. CSV 合并文件
            const hasCsv = this.$refs.refFile2 && this.$refs.refFile2.files && this.$refs.refFile2.files.length > 0
            if (hasCsv) {
                data1.append(`file${files_n_incr}`, this.$refs.refFile2.files[0])
                data1.append(`csv`, true)
                files_n_incr++
            } else {
                data1.append(`csv`, false)
            }

            // 3. 元数据 (图片、文本、条码)
            if (this.tableData && this.tableData.length > 0) {
                for (let item of this.tableData) {
                    // 图片类型 (Type 1)
                    if (item.type == 1 && this.metadataFiles[item.origin_name]) {
                        const file = this.metadataFiles[item.origin_name]
                        if (hasCsv) {
                            // 有CSV时，图片按 file{n} 顺序添加
                            data1.append(`file${files_n_incr}`, file)
                            files_n_incr++
                        } else {
                            // 无CSV时，图片按字段名添加
                            data1.append(item.origin_name, file)
                        }
                    }
                    // 文本/条码类型 (Type 3, 5) - 仅在无CSV时添加
                    else if ((item.type == 3 || item.type == 5) && !hasCsv) {
                        let data = this.form[item.origin_name]
                        if (data == '' || data === undefined || data === null) {
                            data = item.default || ''
                        }
                        data1.append(item.origin_name, data)
                    }
                    // 二维码类型 (Type 4) - 仅在无CSV时添加
                    else if (item.type == 4 && !hasCsv) {
                        let data = this.form[item.origin_name] || ''
                        data1.append(item.origin_name, data)
                    }
                }
            }

            // 4. 发送请求
            this.$message.info(this.$t('work.uploadingTag'))
            let pathName
            if (this.high_setting_form.localfiles) {
                // 若开启本地文件，需获取本地路径名称
                const rootFile = this.$refs.files && this.$refs.files.getLists && this.$refs.files.getLists()[0]; // 假设逻辑
                // 这里实际上 work-副本 使用 upload_disk 或者 rootFile name，这里保持 upload_disk 除非是 pathName 逻辑差异
                // work-副本 逻辑: localfiles ? filePath.name : upload_disk
                if (this.high_setting_form.localfiles) {
                    // 获取根文件夹名
                    // 由于 fileManagement 封装，我们需要更稳健的获取方式
                    // 暂时使用 upload_disk，待 localUpload 逻辑覆盖
                    pathName = this.upload_disk // 这里的差异在 submit 逻辑中处理，Tag 上传通常还是到 upload_disk 临时目录?
                    // work-副本: localfiles ? filePath.name : this.upload_disk
                    // 这里保持一致性
                    pathName = this.upload_disk
                } else {
                    pathName = this.upload_disk
                }
            } else {
                pathName = this.upload_disk
            }

            // 修正：如果 localfiles 为真，work-副本 实际上是把 tag 文件上传到以 filePath.name 命名的目录
            // 但这里简化处理，先上传 tag，后续 localUpload 会处理 content
            // 实际上 submitAndTag 是为了上传 tag 文件，localUpload 是为了处理 content 文件的 path.json

            this.$axios.post('/upload/' + this.upload_disk, data1).then(() => {
                this.performSubmit()
            }).catch(err => {
                console.error(err)
                this.$message.error(this.$t('work.uploadFail'))
            })
        },
        async performSubmit() {
            let that = this;
            try {
                await this.stopRecordingIfActive()
            } catch (e) {
                console.error('停止录像失败:', e)
            }

            // 检查是否有网络路径需要认证
            if (this.checkNetworkPaths && this.checkNetworkPaths()) {
                return
            }

            // 1. 确定 pathName
            let pathName
            if (that.high_setting_form.localfiles) {
                //打开本地选项
                const uploader = this.$refs.files && this.$refs.files.uploader
                let rootFile = uploader && uploader.getRoot()
                if (!rootFile || rootFile.fileList.length != 1) {
                    this.$message.warning(this.$t('work.oneFolder'))
                    return
                }
                let filePath = rootFile.fileList[0]
                if (!filePath.isFolder) {
                    this.$message.warning(this.$t('work.notFolder'))
                    return
                }
                pathName = filePath.name
            } else {
                pathName = this.upload_disk
            }

            // 2. 构建 data_param
            let data_param = 'CardSoon_File=' + pathName

            // 3. 构建 data (严格按照 legacy 顺序)
            let data = ''

            // 3.1 ISO/ZIP 验证（仅在有内容文件时）
            if (this.$refs.files.allNumber > 0) {
                // ISO 文件名检查
                if (that.high_setting_form.is_generate_iso) {
                    if (!that.high_setting_form.iso_file_name) {
                        this.submitLoading = false
                        return this.$message.warning(this.$t('work.isoNameInput'))
                    }
                }

                // ZIP 文件名检查
                if (that.high_setting_form.is_generate_zip) {
                    if (!that.high_setting_form.zip_file_name) {
                        this.submitLoading = false
                        return this.$message.warning(this.$t('work.zipNameInput'))
                    }
                }

                // ZIP 加密密码检查
                if (that.high_setting_form.is_generate_zip && that.high_setting_form.is_zip_encrypt) {
                    if (!that.high_setting_form.zip_password || that.high_setting_form.zip_password !== that.high_setting_form.zip_repassword) {
                        this.submitLoading = false
                        return this.$message.warning(this.$t('work.zipPassWrong'))
                    }
                }
            }

            // 3.2 标签文件验证与参数构建（仅在有标签文件时）
            if ((!this.isNew && this.fileData) || (this.isNew && this.fileLists[0])) {
                // 标签开启校验
                if (this.isNew && this.fileLists.length == 0) {
                    this.submitLoading = false
                    return this.$message.warning(this.$t('work.pleaseUploadTag'))
                }
                if (!this.isNew && !this.fileData) {
                    this.submitLoading = false
                    return this.$message.warning(this.$t('work.pleaseUploadTag'))
                }

                if (this.fileData && !this.fileLists[0]) {
                    data_param += '&Json_File=' + this.saveWorkList.taskName
                } else if (this.fileData && this.fileLists[0]) {
                    data_param += '&Json_File=' + this.fileLists[0].name
                }

                if (this.$refs.refFile2.files.length != 0) {
                    data_param += '&Udf_File=file:' + this.$refs.refFile2.files[0].name
                }

                // 打印面数校验
                if (this.fileData) {
                    if ((this.print_flag == 1 && this.fileData.flag != 1) || (this.print_flag == 2 && this.fileData.flag == 3) || (this.print_flag == 3 && this.fileData.flag == 2)) {
                        this.submitLoading = false
                        return this.$message.warning(this.$t('work.print_flagError'))
                    }
                }
                data += '&print_flag=' + this.print_flag
            }

            // 3.3 卷标验证（所有场景必填）
            if (this.juanbiao_form == '') {
                this.submitLoading = false
                return this.$message.warning(this.$t('work.juanbiaoInput'))
            }

            const printStatus = this.fileLists[0] ? true : false
            const copyStatus = this.$refs.files.allNumber > 0 ? true : false

            data += '&label=' + encodeURIComponent(this.juanbiao_form)
            data += '&printCopys=' + this.number
            data += '&disk_size=' + this.size_form
            data += '&zone_type=' + this.type_form
            data += '&hasPrintTask=' + printStatus
            data += '&hasCopyTask=' + copyStatus
            data += '&copy_cache_data=' + this.isCopy
            data += '&SpanUcard=' + this.high_setting_form.Span_USBcard
            data += '&hasAddFile=' + this.high_setting_form.hasAddFile
            data += '&version=local'
            data += '&hash=' + this.high_setting_form.s1
            data += '&md5=' + this.high_setting_form.s2
            data += '&printer=' + this.high_setting_form.target_work

            if (this.high_setting_form.formatFile != 0) {
                data += '&formatFile=' + this.high_setting_form.formatFile
            }

            // 网络认证信息
            if (this.networkCredentials && (Array.isArray(this.networkCredentials) ? this.networkCredentials.length > 0 : Object.keys(this.networkCredentials).length > 0)) {
                data += '&net_info=' + JSON.stringify(this.networkCredentials)
            }

            // 高级设置参数 - New Fields Mapping
            data += '&is_generate_iso=' + (String(that.high_setting_form.is_generate_iso) || 'false') +
                '&iso_file_name=' + (that.high_setting_form.iso_file_name || '') +
                '&is_generate_zip=' + (String(that.high_setting_form.is_generate_zip) || 'false') +
                '&zip_file_name=' + (that.high_setting_form.zip_file_name || '') +
                '&is_zip_encrypt=' + (String(that.high_setting_form.is_zip_encrypt) || 'false') +
                '&zip_password=' + (that.high_setting_form.zip_password || '') +
                '&copy_hash=' + (String(that.high_setting_form.copy_hash) || 'false');

            data += '&is_blend=' + (String(that.high_setting_form.is_blend) || 'false');

            // Log path logic
            if (that.$refs.screenRecorder && that.$refs.screenRecorder.videoPath) {
                data += '&record_path=' + that.$refs.screenRecorder.videoPath;
            } else {
                data += '&record_path=';
            }
            data += '&is_printer_record_logo=' + (String(that.high_setting_form.print_record_logo) || 'false');

            if (that.high_setting_form.enable_dongle_counter) {
                data += '&dongle_install_count=' + (that.high_setting_form.install_dongle_count || 1);
            } else {
                data += '&dongle_install_count=-1';
            }

            // File Type Mapping
            const fileTypeMap = { 0: 1, 1: 2, 2: 3, 4: 4 };
            let apiFileType = fileTypeMap[that.file_form] || 1;
            // --- DEBUG: 输出提交数据 ---
            console.group('任务提交数据详情');

            // 将查询字符串解析为对象，方便查看
            const queryString = data_param + data;
            const params = {};
            queryString.split('&').forEach(part => {
                if (part) {
                    const [key, val] = part.split('=');
                    params[key] = decodeURIComponent(val || '');
                }
            });
            console.log('提交参数对象 (JSON):', params);

            console.log('高级设置表单:', JSON.parse(JSON.stringify(that.high_setting_form))); // 深拷贝打印
            console.groupEnd();

            // Submit Flow
            if (this.isCopy) {
                this.submitLoading = true
                this.$axios({
                    method: 'post',
                    url: '/rest/job/?' + data_param + data
                })
                    .then((res) => {
                        this.$message.success(this.$t('work.submitSuccess'))
                        that.submitLoading = false
                        this.$emit('jobPost')
                    })
                    .catch((err) => {
                        const resl = err.response.data
                        console.log(resl)
                        if (resl.ret && resl.ret === 9) {
                            that.$emit('addError', { code: resl.ret, tag: 'templateFile', err: 0 })
                        } else {
                            that.$emit('addError', { code: resl.ret, tag: 'workFail', err: 0 })
                        }
                        this.$message({ offset: 100, message: this.$t('work.submiting') })
                        that.submitLoading = false
                        that.$emit('jobPost')
                    })
            } else {
                that.localUpload(pathName, data_param, data)
            }
        },

        localUpload(pathName, data_param, data) {
            let file_path = []
            // FileManagement 组件不直接暴露 filesList，需使用 getLists()
            const list = this.$refs.files.getLists()
            for (let i in list) {
                file_path.push(list[i].path)
            }

            const jsonData = { files: file_path }
            const jsonFilePath = path.join(remote.app.getPath('userData'), 'filepath.json') // 使用 userData 目录更安全

            try {
                fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData), 'utf-8')

                // Legacy Stream Logic
                const fileStream = fs.createReadStream(jsonFilePath)
                const buffer = []
                fileStream.on('data', (chunk) => {
                    buffer.push(chunk)
                })
                fileStream.on('end', () => {
                    let that = this
                    const blob = new Blob([Buffer.concat(buffer)], { type: 'application/octet-stream' })

                    const formData = new FormData()
                    formData.append('file', blob, path.basename(jsonFilePath))

                    if (this.networkCredentials && (Array.isArray(this.networkCredentials) ? this.networkCredentials.length > 0 : Object.keys(this.networkCredentials).length > 0)) {
                        formData.append('net_info', JSON.stringify(this.networkCredentials))
                    }

                    that.submitLoading = true
                    that.$axios({
                        method: 'post',
                        url: `/upload/${pathName}`,
                        headers: { 'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime() },
                        data: formData
                    }).then(() => {
                        that.$axios({
                            method: 'post',
                            url: '/rest/job/?' + data_param + data
                        }).then((res) => {
                            this.$message.success(this.$t('work.submitSuccess'))
                            that.submitLoading = false
                            this.$emit('jobPost')
                        }).catch((err) => {
                            const resl = err.response && err.response.data
                            if (resl && resl.ret === 9) {
                                that.$emit('addError', { code: resl.ret, tag: 'templateFile', err: 0 })
                            } else {
                                that.$emit('addError', { code: resl ? resl.ret : -1, tag: 'workFail', err: 0 })
                            }
                            this.$message({ offset: 100, message: this.$t('work.submiting') })
                            that.submitLoading = false
                            that.$emit('jobPost')
                        })
                    }).catch(err => {
                        this.$message.error('Local upload failed')
                        that.submitLoading = false
                    })
                })
            } catch (e) {
                console.error(e)
                this.$message.error('File Write Error')
                this.submitLoading = false
            }
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

        // --- 新手引导功能 ---
        exitGuide() {
            for (let key in this.guideStep) {
                this.guideStep[key].show = false
            }
            this.currentStep = -1
            localStorage.setItem('currentStep', this.currentStep)
            localStorage.setItem('guideStep', JSON.stringify(this.guideStep))
        },
        prevStep() {
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
        nextStep() {
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

        // --- 工具方法 ---
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

        // --- 网络认证增强 ---
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
            const m = p.match(/^([^\\\\/: ]+)/)
            return (m && m[1]) ? m[1] : ''
        },
        checkNetworkPaths() {
            if (!(this.$refs.files && this.$refs.files.hasNetworkPaths())) {
                return false
            }
            const networkPaths = this.$refs.files.getNetworkPaths() || []
            if (networkPaths.length === 0) return false

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
                this.networkAuthPaths = missing.map(m => ({
                    path: m.path,
                    hostName: m.hostName,
                    userName: '',
                    password: ''
                }))
                this.networkAuthVisible = true
                this.networkCredentials = prepared
                return true
            }

            this.networkCredentials = prepared
            return false
        },

        // --- 文件管理方法 ---
        handleContentCommand(command) {
            if (command === 'folder') {
                this.addFolder()
            } else {
                this.addFile()
            }
        },
        addFolder() {
            if (this.$refs.files) {
                this.$refs.files.addFolder()
            }
        },
        addFile() {
            if (this.$refs.files) {
                this.$refs.files.addFile()
            }
        },
        fileLoad3() {
            if (this.$refs.refFile3 && this.$refs.refFile3.files[0]) {
                this.file_name3 = this.$refs.refFile3.files[0].name
            }
        },
        openFile3() {
            if (this.$refs.refFile3) {
                this.$refs.refFile3.click()
            }
        },
        sizeChange(size) {
            this.size = size
        },

        // --- 新手引导方法 ---
        exitGuide() {
            if (!this.guideStep) return
            for (let key in this.guideStep) {
                this.guideStep[key].show = false
            }
            this.currentStep = -1
            localStorage.setItem('currentStep', this.currentStep)
            localStorage.setItem('guideStep', JSON.stringify(this.guideStep))
        },
        prevStep() {
            if (!this.guideStep) return
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
        nextStep() {
            if (!this.guideStep) return
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
            const { ipcRenderer } = require('electron')
            ipcRenderer.send('open-help-file')
        }
    }
}
</script>

<style>
/* 全局辅助样式，用于处理对话框等 body 级元素 */
@import './styles/compact-layout.css';
</style>

<style scoped>
@import './styles/work-styles.css';

/* 全局辅助样式 */
.work {
    padding: 20px 25px;
    /* Increased padding */
    margin: 0 auto;
    width: 100%;
}

.top-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    /* Added spacing between header and cards */
    padding: 0 10px;
}

/* 响应式适配：小窗口高度压缩 */
@media (max-height: 850px) {
    .work {
        padding: 5px 15px;
    }

    .top-header-bar {
        margin-bottom: 8px;
    }

    .footer-actions {
        margin-top: 5px;
        padding: 5px 20px;
        border-top: 1px solid #eee;
    }
}

.header-settings {
    flex: 1;
}

.header-buttons {
    display: flex;
    align-items: center;
    padding-top: 5px;
    gap: 15px;
}

.recorder-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(109, 193, 76, 0.05);
    padding: 2px 8px 2px 2px;
    border-radius: 25px;
    border: 1px solid rgba(109, 193, 76, 0.1);
}

.print-logo-indicator {
    width: 30px;
    height: 30px;
    background: #fff;
    border: 1px dashed #409EFF;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #409EFF;
    font-size: 18px;
    box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
    transition: all 0.3s;
    overflow: hidden;
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 2px;
}

.print-logo-indicator:hover {
    border-style: solid;
    transform: scale(1.05);
}

.senior-btn-white {
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.senior-btn-white:hover {
    color: #409eff;
    border-color: #409eff;
    background-color: #fff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
    transform: translateY(-1px);
}

.main-content-row {
    margin: 0 !important;
    /* Reset margin */
}

/* Footer alignment */
.footer-actions {
    margin-top: 15px;
    padding: 15px 25px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    border-top: 1px solid #ebeef5;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
}

.left-info {
    margin-right: 15px;
}

.count-input-new {
    width: 100px;
    /* Wider input */
    margin-left: 10px;
}

.footer-btn {
    min-width: 90px;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
}

.footer-btn.el-button--success {
    background: #67c23a;
    border-color: #67c23a;
    box-shadow: none;
    color: white;
}

.footer-btn.el-button--success:hover {
    background: #85ce61;
    border-color: #85ce61;
    transform: none;
}

.submit-btn {
    min-width: 120px;
}

/* 深度选择器穿透 */
.work ::v-deep .uploader-file-name {
    text-align: left;
}

.work ::v-deep .el-progress-bar__outer {
    background-color: #bac2d7;
}

.work ::v-deep .uploader-file-progress {
    background-color: #b0ee91;
}

.work ::v-deep .el-input__inner {
    height: 32px;
    line-height: 32px;
}

.work ::v-deep .el-input__suffix .el-input__icon {
    height: 32px;
    line-height: 32px;
}
</style>
