<template>
    <el-dialog :title="$t('work.senior')" :visible.sync="visibleSync" width="780px" append-to-body
        custom-class="grand-dialog" :close-on-click-modal="false" top="5vh" @close="handleClose">
        <div class="grand-setting-content" style="max-height: 75vh; overflow-y: auto; padding-right: 10px;">
            <el-form :model="form" label-position="right" label-width="120px" size="small">

                <!-- 动态分模式渲染 -->
                <basic-config :form="form" :file-form="fileForm" :options="options" :printer-list="printerList"
                    :size-form="sizeForm" />

                <!-- 高级功能（ISO/ZIP/HASH/计数器） -->
                <advanced-features :form="form" :file-form="fileForm" />

                <!-- 屏幕录制 -->
                <recording-settings :form="form" :file-form="fileForm"
                    @test-recording="$emit('test-recording', $event)" />

            </el-form>
        </div>
        <span slot="footer" class="dialog-footer grand-footer">
            <div class="footer-buttons">
                <el-button @click="handleClose" size="medium" icon="el-icon-close">{{ $t('common.cancel') }}</el-button>
                <el-button type="primary" @click="handleSave" size="medium" icon="el-icon-check">{{ $t('common.confirm')
                    }}</el-button>
            </div>
        </span>
    </el-dialog>
</template>

<script>
import BasicConfig from './sections/BasicConfig.vue'
import AdvancedFeatures from './sections/AdvancedFeatures.vue'
import RecordingSettings from './sections/RecordingSettings.vue'

export default {
    name: 'AdvancedSettings',
    components: {
        BasicConfig,
        AdvancedFeatures,
        RecordingSettings
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        form: {
            type: Object,
            required: true
        },
        fileForm: {
            type: Number,
            default: 0
        },
        options: {
            type: Object,
            default: () => ({})
        },
        printerList: {
            type: Array,
            default: () => []
        },
        sizeForm: {
            type: [Number, String],
            default: null
        }
    },
    computed: {
        visibleSync: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        }
    },
    methods: {
        handleClose() {
            this.visibleSync = false
        },
        handleSave() {
            // 验证加密狗计数
            if (this.form.is_dongle_count) {
                if (!this.form.dongle_count || this.form.dongle_count <= 0 || !Number.isInteger(this.form.dongle_count)) {
                    this.$message.warning(this.$t('work.dongleCountRequired'))
                    return
                }
            }

            // 验证 ISO 文件名
            if (this.form.is_generate_iso && !this.form.iso_file_name) {
                this.$message.warning(this.$t('work.isoNameInput'))
                return
            }

            // 验证 ZIP 文件名
            if (this.form.is_generate_zip) {
                if (!this.form.zip_file_name) {
                    this.$message.warning(this.$t('work.zipNameInput'))
                    return
                }

                // 验证 ZIP 加密密码
                if (this.form.is_zip_encrypt) {
                    if (!this.form.zip_password) {
                        this.$message.warning(this.$t('work.pleasePassword'))
                        return
                    }
                    if (this.form.zip_password !== this.form.zip_repassword) {
                        this.$message.warning(this.$t('work.zipPassWrong'))
                        return
                    }
                }
            }

            this.$emit('save')
        }
    }
}
</script>

<style scoped>
/* 样式将包含在主组件中或按需引入 */
.grand-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
}

.footer-buttons {
    display: flex;
    gap: 10px;
}
</style>
