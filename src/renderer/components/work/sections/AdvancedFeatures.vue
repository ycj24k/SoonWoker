<template>
    <div class="grand-section">
        <div class="grand-title">
            <span>{{ $t('work.advancedFeatures') }}</span>
            <div class="title-line"></div>
        </div>

        <!-- ISO / ZIP (仅模式 0 和 2) -->
        <template v-if="fileForm === 0 || fileForm === 2">
            <!-- ISO 生成组 -->
            <div class="feature-group" :class="{ active: form.is_generate_iso }">
                <div class="feature-header">
                    <el-checkbox v-model="form.is_generate_iso">
                        {{ $t('work.generateISO') }}
                    </el-checkbox>
                </div>
                <div v-if="form.is_generate_iso" class="feature-content">
                    <el-form-item :label="$t('work.isoFileName')" label-width="100px">
                        <el-input v-model="form.iso_file_name" :placeholder="$t('work.inputIsoName')" size="small" />
                    </el-form-item>
                </div>
            </div>

            <!-- ZIP 生成组 -->
            <div class="feature-group" :class="{ active: form.is_generate_zip }">
                <div class="feature-header">
                    <el-checkbox v-model="form.is_generate_zip">
                        {{ $t('work.generateZIP') }}
                    </el-checkbox>
                </div>
                <div v-if="form.is_generate_zip" class="feature-content">
                    <el-form-item :label="$t('work.zipFileName')" label-width="100px">
                        <el-input v-model="form.zip_file_name" :placeholder="$t('work.inputZipName')" size="small" />
                    </el-form-item>

                    <!-- 嵌套加密设置 -->
                    <div class="sub-feature">
                        <el-checkbox v-model="form.is_zip_encrypt">{{ $t('work.isEncrypt') }}</el-checkbox>
                        <div v-if="form.is_zip_encrypt" class="mt-10">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item :label="$t('work.inputPassword')" label-width="80px">
                                        <el-input type="password" v-model="form.zip_password" show-password
                                            size="small" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="$t('work.confirmPassword')" label-width="80px">
                                        <el-input type="password" v-model="form.zip_repassword" show-password
                                            size="small" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>

            <div class="divider-h mb-15" v-if="form.is_generate_iso || form.is_generate_zip"></div>

            <div class="grand-switch-grid" v-if="form.is_generate_iso || form.is_generate_zip">
                <div class="g-switch-item">
                    <span class="g-label">{{ $t('work.genMD5') }}</span>
                    <el-switch v-model="form.s1"></el-switch>
                </div>
                <div class="g-switch-item">
                    <span class="g-label">{{ $t('work.copyHash') }}</span>
                    <el-switch v-model="form.copy_hash"></el-switch>
                </div>
                <div class="g-switch-item">
                    <span class="g-label">{{ $t('work.printMD5') }}</span>
                    <el-switch v-model="form.s2"></el-switch>
                </div>
            </div>
            <div class="divider-h mt-15 mb-15" v-if="form.is_generate_iso || form.is_generate_zip"></div>
        </template>

        <!-- 通用开关组 -->
        <div class="grand-switch-grid">
            <div class="g-switch-item">
                <span class="g-label">{{ $t('work.fail') }}</span>
                <el-switch v-model="form.s3"></el-switch>
            </div>
            <div class="g-switch-item" v-if="fileForm !== 4">
                <span class="g-label">{{ $t('work.allowSpanCard') }}</span>
                <el-switch v-model="form.Span_USBcard"></el-switch>
            </div>
            <div class="g-switch-item" v-if="fileForm !== 4">
                <span class="g-label">{{ $t('work.presetContent') }}</span>
                <el-switch v-model="form.hasAddFile"></el-switch>
            </div>
            <div class="g-switch-item highlight" v-if="fileForm === 1">
                <span class="g-label">{{ $t('work.mixMode') }}</span>
                <el-switch v-model="form.is_blend"></el-switch>
            </div>
            <div class="g-switch-item">
                <span class="g-label">{{ $t('work.installDongle') }}</span>
                <el-switch v-model="form.is_dongle_count"></el-switch>
            </div>
        </div>

        <!-- 计数器详细 -->
        <div v-if="form.is_dongle_count" class="mt-10 p-10"
            style="background: #fdf6ec; border-radius: 6px; border: 1px solid #faecd8;">
            <el-form-item :label="$t('work.installCount')" label-width="140px" class="mb-5">
                <el-input-number v-model="form.dongle_count" :min="1" :step="1" :precision="0" size="mini" />
            </el-form-item>
            <el-form-item :label="$t('work.authCode')" label-width="140px" class="mb-0">
                <el-input v-model="form.auth_code" size="mini" :placeholder="$t('work.inputAuthCode')" />
            </el-form-item>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdvancedFeatures',
    props: {
        form: {
            type: Object,
            required: true
        },
        fileForm: {
            type: Number,
            default: 0
        }
    }
}
</script>
