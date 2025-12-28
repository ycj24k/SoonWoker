<template>
    <div class="grand-section">
        <div class="grand-title">
            <span>{{ $t('work.hardwareControl') || '硬件管控' }}</span>
            <div class="title-line"></div>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="hardware-box">
                    <div class="mb-10">
                        <el-checkbox v-model="form.is_dongle_count">
                            {{ $t('work.installDongle') || '加密狗计数' }}
                        </el-checkbox>
                    </div>
                    <transition name="el-zoom-in-top">
                        <div v-if="form.is_dongle_count" class="ml-20">
                            <el-form-item :label="$t('work.installCount') || '安装次数'" label-width="80px">
                                <el-input-number size="small" v-model="form.dongle_count" :min="1" :max="999" />
                            </el-form-item>
                        </div>
                    </transition>
                </div>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="$t('work.setAuthCode') || '授权码'" label-width="80px">
                    <el-input size="small" v-model="form.auth_code"
                        :placeholder="$t('work.inputAuthCode') || '输入授权码'" />
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'HardwareControl',
    props: {
        form: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.hardware-box {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 4px;
}
</style>
