<template>
    <div class="grand-section">
        <div class="grand-title">
            <span>{{ $t('work.screenRecordReview') }}</span>
            <div class="title-line"></div>
        </div>
        <div class="feature-row mb-10">
            <div class="grand-switch-grid mb-10">
                <div class="g-switch-item">
                    <span class="g-label">{{ $t('work.enableScreenRecord') }}</span>
                    <el-switch v-model="form.is_record"></el-switch>
                </div>
                <div class="g-switch-item" v-if="form.is_record">
                    <div class="flex-align-center">
                        <span class="g-label">{{ $t('work.printRecordLogo') }}</span>
                        <i v-if="form.is_print_logo" class="el-icon-picture ml-5 logo-icon-active"
                            title="luzhi.png"></i>
                    </div>
                    <el-switch v-model="form.is_print_logo"></el-switch>
                </div>
            </div>

            <div v-if="form.is_record" class="path-box-container">
                <div class="path-box">
                    <el-form-item :label="$t('work.recordPath')" label-width="110px">
                        <el-input v-model="form.record_path" :placeholder="$t('work.defaultPath')" size="small">
                            <el-button slot="append" icon="el-icon-folder-opened" @click="selectRecordPath"></el-button>
                        </el-input>
                    </el-form-item>

                    <div class="recording-actions mt-10">
                        <el-button type="danger" size="small" icon="el-icon-video-camera" plain @click="testRecording">
                            {{ $t('recorder.startRecording') }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RecordingSettings',
    props: {
        form: {
            type: Object,
            required: true
        },
        fileForm: {
            type: Number,
            default: 0
        }
    },
    methods: {
        selectRecordPath() {
            const { dialog } = require('@electron/remote')
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }).then(result => {
                if (!result.canceled && result.filePaths.length > 0) {
                    this.$set(this.form, 'record_path', result.filePaths[0])
                }
            })
        },
        testRecording() {
            this.$emit('test-recording', this.form.record_path);
        }
    }
}
</script>

<style scoped>
.flex-align-center {
    display: flex;
    align-items: center;
}

.logo-icon-active {
    color: #409EFF;
    font-size: 16px;
    animation: logo-glow 2s infinite ease-in-out;
}

@keyframes logo-glow {

    0%,
    100% {
        opacity: 0.6;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.1);
    }
}

.recording-tip {
    font-size: 12px;
    color: #909399;
    display: flex;
    align-items: center;
    background: #fdf6ec;
    padding: 6px 10px;
    border-radius: 4px;
    border-left: 3px solid #e6a23c;
}

.recording-tip i {
    margin-right: 5px;
    font-size: 14px;
    color: #e6a23c;
}

.divider-v {
    width: 1px;
    background-color: #e0e0e0;
}

.tips-text {
    font-size: 12px;
    color: #909399;
}
</style>
