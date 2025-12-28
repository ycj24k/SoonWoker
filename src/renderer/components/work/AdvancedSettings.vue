<template>
    <el-dialog :title="$t('work.senior') || '高级设置'" :visible.sync="visibleSync" width="780px" append-to-body
        custom-class="grand-dialog" :close-on-click-modal="false" top="5vh" @close="handleClose">
        <div class="grand-setting-content" style="max-height: 75vh; overflow-y: auto; padding-right: 10px;">
            <el-form :model="form" label-position="right" label-width="120px" size="small">

                <!-- 动态分模式渲染 -->
                <basic-config :form="form" :file-form="fileForm" :options="options" />

                <!-- 高级功能（ISO/ZIP/HASH/计数器） -->
                <advanced-features :form="form" :file-form="fileForm" />

                <!-- 屏幕录制 -->
                <recording-settings :form="form" :file-form="fileForm"
                    @test-recording="$emit('test-recording', $event)" />

            </el-form>
        </div>
        <span slot="footer" class="dialog-footer grand-footer">
            <div class="footer-left">
                <el-button type="warning" size="medium" plain icon="el-icon-key" @click="setAuthCode">
                    设置授权码
                </el-button>
            </div>
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
            this.$emit('save')
        },
        setAuthCode() {
            this.$prompt(this.$t('work.inputAuthCode') || '请输入作业授权码', this.$t('work.setAuthCode') || '授权码设置', {
                confirmButtonText: this.$t('common.ok') || '确定',
                cancelButtonText: this.$t('common.cancel') || '取消',
                inputValue: this.form.auth_code || '',
                inputPattern: /^[a-zA-Z0-9]*$/,
                inputErrorMessage: '授权码格式不正确'
            }).then(({ value }) => {
                this.$set(this.form, 'auth_code', value);
                this.$message({
                    type: 'success',
                    message: '授权码已设置'
                });
            }).catch(() => { });
        }
    }
}
</script>

<style scoped>
/* 样式将包含在主组件中或按需引入 */
.grand-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.footer-buttons {
    display: flex;
    gap: 10px;
}
</style>
