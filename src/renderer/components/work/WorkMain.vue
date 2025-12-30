<template>
    <div class="work">
        <!-- 头部配置区 -->
        <!-- 顶部通栏：配置与按钮 -->
        <div class="top-header-bar">
            <!-- 左侧配置表单 -->
            <div class="header-settings">
                <task-header :file_form.sync="file_form" :size_form.sync="size_form" :type_form.sync="type_form"
                    :size-type="sizeType" />
            </div>

            <!-- 右侧功能按钮 -->
            <div class="header-buttons">
                <!-- 录制组件 (绿色圆形) -->
                <div class="recorder-wrapper" v-if="isRecording || high_setting_form.is_print_logo">
                    <screen-recorder ref="screenRecorder" :task-id="upload_disk" :status-only="true"
                        @recording-started="onRecordingStarted" @recording-stopped="onRecordingStopped"
                        @recording-saved="onRecordingSaved" />
                    <el-tooltip content="打印" placement="top">
                        <div v-if="high_setting_form.is_print_logo" class="print-logo-indicator">
                            <img src="static/images/luzhi.png" @error="onLogoError" v-if="!logoError"
                                class="logo-img" />
                            <i v-else class="el-icon-printer"></i>
                        </div>
                    </el-tooltip>
                </div>

                <!-- 高级设置按钮 (白色) -->
                <el-button size="medium" @click="highSettingVisible = true" class="senior-btn-white"
                    icon="el-icon-setting">
                    {{ $t('work.senior') }}
                </el-button>
            </div>

            <!-- 隐藏的组件 -->
            <advanced-settings :visible.sync="highSettingVisible" :form="high_setting_form" :file-form="file_form"
                @save="saveHighSettings" @test-recording="handleTestRecording" />
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
                localfiles: false,
                formatFile: 0,
                Span_USBcard: false,
                hasAddFile: false,
                is_blend: false,
                is_record: false,
                record_path: '',
                is_print_logo: false,
                is_generate_iso: false,
                iso_file_name: '',
                is_generate_zip: false,
                zip_file_name: '',
                is_zip_encrypt: false,
                zip_password: '',
                zip_repassword: '',
                copy_hash: false,
                is_dongle_count: false,
                dongle_count: 1
            }
        }
    },
    computed: {
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
                    if (!this.high_setting_form.record_path) {
                        this.high_setting_form.record_path = this.getDefaultRecordPath();
                    }
                } catch (e) {
                    console.error('Failed to parse high settings')
                }
            } else {
                // 无缓存时初始化默认路径
                this.high_setting_form.record_path = this.getDefaultRecordPath();
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
                    recorder.stopRecording(true);
                } else {
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
                                name: item.name + this.$t('work.front_tag'),
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
                                name: item.name + this.$t('work.back_tag'),
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
            console.log('--- 开始提交作业 ---')
            if (!this.size_form) {
                console.warn('未选择容量')
                return this.$message.warning(this.$t('work.size_form_error'))
            }

            // 检查容量限制
            if (!this.high_setting_form.Span_USBcard) {
                const maxSize = (this.size_form * 1000 / 1.024 / 1.024 / 1.024) * 1024 * 1024
                if (this.size > maxSize) return this.$message.warning(this.$t('work.sizeExtra'))
            }

            // ISO/ZIP 前置验证
            if (this.high_setting_form.is_generate_iso && !this.high_setting_form.iso_file_name) {
                return this.$message.warning(this.$t('work.isoNameInput'))
            }
            if (this.high_setting_form.is_generate_zip) {
                if (!this.high_setting_form.zip_file_name) return this.$message.warning(this.$t('work.zipNameInput'))
                if (this.high_setting_form.is_zip_encrypt) {
                    if (!this.high_setting_form.zip_password) return this.$message.warning(this.$t('work.pleasePassword'))
                    if (this.high_setting_form.zip_password !== this.high_setting_form.zip_repassword) {
                        return this.$message.warning(this.$t('work.zipPassWrong'))
                    }
                }
            }

            const hasFiles = this.$refs.files && this.$refs.files.allNumber > 0;
            if (hasFiles) {
                console.log('检测到待上传文件数量:', this.$refs.files.allNumber)
                this.flag_cont_up = true
                this.$refs.files.resume(this.file_form)
            } else {
                console.log('无待上传文件或未打开内容管理，直接执行提交')
                this.upload_over()
            }
        },
        upload_over() {
            console.log('文件上传/准备就绪, flag_cont_up:', this.flag_cont_up)
            if (this.flag_cont_up) {
                this.submitAndTag()
            } else {
                this.performSubmit()
            }
        },
        async submitAndTag() {
            console.log('--- 执行 submitAndTag ---')
            // 这里的逻辑处理标签文件的上传
            const data1 = new FormData()
            let hasFile = false
            if (this.isNew) {
                if (this.fileLists[0]) {
                    data1.append('file1', this.fileLists[0])
                    hasFile = true
                }
            } else if (this.fileData) {
                const _file = new File([JSON.stringify(this.fileData)], this.saveWorkList.taskName, { type: 'text/plain' })
                data1.append('file1', _file)
                hasFile = true
            }

            if (!hasFile && this.switch_tag) {
                console.warn('标签管理已打开但未上传标签文件')
                return this.$message.warning(this.$t('work.pleaseUploadTag'))
            }

            // 添加 CSV 文件
            if (this.$refs.refFile2 && this.$refs.refFile2.files[0]) {
                data1.append('file2', this.$refs.refFile2.files[0])
            }
            // 添加 Bin/Img 文件 (refFile3)
            if (this.$refs.refFile3 && this.$refs.refFile3.files[0]) {
                data1.append('file3', this.$refs.refFile3.files[0])
            }

            // 添加元数据图片
            if (this.tableData && this.tableData.length > 0) {
                this.tableData.forEach(row => {
                    if (row.type == 1 && this.metadataFiles[row.origin_name]) {
                        data1.append(row.origin_name, this.metadataFiles[row.origin_name])
                    }
                })
            }

            this.$message.info(this.$t('work.uploadingTag'))
            const pathName = this.high_setting_form.localfiles ? 'local' : this.upload_disk

            this.$axios.post('/upload/' + pathName, data1).then(() => {
                this.performSubmit()
            }).catch(err => {
                this.$message.error(this.$t('work.uploadFail'))
            })
        },
        async performSubmit() {
            console.log('--- 执行 performSubmit ---')
            try {
                await this.stopRecordingIfActive()
                console.log('录像停止检查完成')
            } catch (e) {
                console.error('停止录像失败:', e)
            }
            this.submitLoading = true
            console.log('submitLoading 已设为 true')

            // 构建原始参数字符串
            let data_param = 'CardSoon_File=' + (this.high_setting_form.localfiles ? 'local' : this.upload_disk)
            console.log('--- 提交作业数据预览 ---')
            console.log('任务ID:', this.upload_disk)
            console.log('高级设置:', JSON.parse(JSON.stringify(this.high_setting_form)))

            // 拼接标签文件、CSV等参数（简化演示，实际应完整复制）
            let data = `&label=${encodeURIComponent(this.juanbiao_form)}`
            data += `&printCopys=${this.number}`
            data += `&disk_size=${this.size_form}`
            data += `&zone_type=${this.type_form}`
            data += `&hasPrintTask=${!!this.switch_tag}`
            data += `&hasCopyTask=${this.$refs.files ? this.$refs.files.allNumber > 0 : false}`
            data += `&copy_cache_data=${this.isCopy}`
            data += `&SpanUcard=${this.high_setting_form.Span_USBcard}`
            data += `&hash=${this.high_setting_form.s1}`
            data += `&md5=${this.high_setting_form.s2}`
            data += `&printer=${this.high_setting_form.target_work}`

            if (this.high_setting_form.formatFile !== 0) {
                data += `&formatFile=${this.high_setting_form.formatFile}`
            }

            // --- 兼容旧版字段与新增强制提交字段 ---
            // 基础开关
            data += `&local=${!!this.high_setting_form.localfiles}`
            data += `&version=local` // 单机版标识
            data += `&hasAddFile=${!!this.high_setting_form.hasAddFile}` // 拷贝附加文件

            // ISO/ZIP 高级功能
            data += `&is_generate_iso=${!!this.high_setting_form.is_generate_iso}`
            data += `&iso_file_name=${encodeURIComponent(this.high_setting_form.iso_file_name || '')}`
            data += `&is_generate_zip=${!!this.high_setting_form.is_generate_zip}`
            data += `&zip_file_name=${encodeURIComponent(this.high_setting_form.zip_file_name || '')}`
            data += `&is_zip_encrypt=${!!this.high_setting_form.is_zip_encrypt}`
            data += `&zip_password=${encodeURIComponent(this.high_setting_form.zip_password || '')}`

            // 硬件与安全
            data += `&copy_hash=${!!this.high_setting_form.copy_hash}`
            data += `&enable_dongle_counter=${!!this.high_setting_form.is_dongle_count}`
            data += `&donglel_install_count=${this.high_setting_form.dongle_count || 0}`

            // 录像与标识
            data += `&is_blend=${!!this.high_setting_form.is_blend}`
            data += `&is_printer_record_logo=${!!this.high_setting_form.is_print_logo}`

            // 录像路径逻辑：如果正在录像或已结束，则传递路径
            if (this.high_setting_form.is_record) {
                // 优先使用录像组件反馈的路径，否则使用配置路径
                const videoPath = (this.$refs.screenRecorder && this.$refs.screenRecorder.videoPath) || this.high_setting_form.record_path
                data += `&record_path=${encodeURIComponent(videoPath || '')}`
            } else {
                data += `&record_path=`
            }

            // 文件类型映射 (0:File -> 1, 1:ISO -> 2, 2:Encrypt -> 3, 4:Forbid -> 4)
            const fileTypeMap = { 0: 1, 1: 2, 2: 3, 4: 4 }
            let apiFileType = fileTypeMap[this.file_form] || 1
            data += `&file_type=${apiFileType}`

            // 网络路径认证信息 (若存在)
            if (this.networkCredentials && (Array.isArray(this.networkCredentials) ? this.networkCredentials.length > 0 : Object.keys(this.networkCredentials).length > 0)) {
                data += `&net_info=${encodeURIComponent(JSON.stringify(this.networkCredentials))}`
            }

            console.log('--- 最终提交 URL 参数 ---')
            console.log(data_param + data)

            const url = '/rest/job/?' + data_param + data

            if (!this.isCopy) {
                console.log('执行本地路径提交 (Local Mode)')
                this.localUpload(this.upload_disk, data_param, data)
            } else {
                console.log('执行普通网络提交 (Copy Mode)')
                this.$axios.post(url)
                    .then(() => {
                        this.$message.success(this.$t('work.submitSuccess'))
                        this.$emit('jobPost')
                    })
                    .catch((err) => {
                        console.error('提交任务失败:', err)
                        this.$message.error(this.$t('index.fail'))
                    })
                    .finally(() => this.submitLoading = false)
            }
        },

        localUpload(pathName, data_param, data) {
            const filesList = this.$refs.files.getLists()
            let file_path = []
            for (let i in filesList) {
                file_path.push(filesList[i].path)
            }

            const jsonData = { files: file_path }
            const jsonFilePath = path.join(remote.app.getPath('userData'), 'filepath.json')
            try {
                fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData), 'utf-8')
                const fileContent = fs.readFileSync(jsonFilePath)
                const blob = new Blob([fileContent], { type: 'application/json' })

                const formData = new FormData()
                formData.append('file', blob, 'filepath.json')

                if (this.networkCredentials && (Array.isArray(this.networkCredentials) ? this.networkCredentials.length > 0 : Object.keys(this.networkCredentials).length > 0)) {
                    formData.append('net_info', JSON.stringify(this.networkCredentials))
                }

                this.submitLoading = true
                this.$axios.post(`/upload/${pathName}`, formData).then(() => {
                    this.$axios.post('/rest/job/?' + data_param + data).then(() => {
                        this.$message.success(this.$t('work.submitSuccess'))
                        this.$emit('jobPost')
                    }).catch(err => {
                        this.$message.error(this.$t('index.fail'))
                    }).finally(() => this.submitLoading = false)
                }).catch(err => {
                    this.$message.error('Local upload failed')
                    this.submitLoading = false
                })
            } catch (e) {
            }
        },
        saveWork() {
            const save = {
                fileData: this.fileData,
                tableData: this.tableData,
                juanbiao: this.juanbiao_form,
                size_form: this.size_form,
                type_form: this.type_form,
                high_setting: this.high_setting_form
            }
            dialog.showSaveDialog({
                title: 'Save Task',
                filters: [{ name: 'Soon Work', extensions: ['swk'] }]
            }).then(result => {
                if (result.filePath) fs.writeFileSync(result.filePath, JSON.stringify(save))
            })
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
