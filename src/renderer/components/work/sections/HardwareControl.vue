<template>
    <div class="grand-section">
        <div class="grand-title">
            <span>{{ $t('work.hardwareControl') }}</span>
            <div class="title-line"></div>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="hardware-box">
                    <div class="mb-10">
                        <el-checkbox v-model="form.enable_dongle_counter">
                            {{ $t('work.installDongle') }}
                        </el-checkbox>
                    </div>
                    <transition name="el-zoom-in-top">
                        <div v-if="form.enable_dongle_counter" class="ml-20">
                            <el-form-item :label="$t('work.installCount')" label-width="80px">
                                <el-input-number size="small" v-model="form.install_dongle_count" :min="0" :max="999" />
                            </el-form-item>
                        </div>
                    </transition>
                </div>
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
