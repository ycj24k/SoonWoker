<template>
    <div class="grand-section">
        <div class="grand-title">
            <span>{{ $t('work.basicConfig') || '基础配置' }}</span>
            <div class="title-line"></div>
        </div>
        <el-row :gutter="20">
            <el-col :span="12" v-if="fileForm !== 2">
                <el-form-item :label="$t('work.better') || '优先级'">
                    <el-select v-model="form.priority" class="w-full" :disabled="fileForm === 4">
                        <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="fileForm !== 2">
                <el-form-item :label="$t('work.startWorkSpace') || '目标工作站'">
                    <el-select v-model="form.target_work" class="w-full" :disabled="fileForm === 4">
                        <el-option v-for="item in targetWorkOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="$t('work.ribbonType') || '色带类型'">
                    <el-select v-model="form.color_type" class="w-full">
                        <el-option v-for="item in colorTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="fileForm === 0 || fileForm === 2">
                <el-form-item :label="$t('work.formatFile') || '拷贝前格式化'">
                    <el-select v-model="form.formatFile" class="w-full">
                        <el-option v-for="item in formatOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'BasicConfig',
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
    computed: {
        priorityOptions() {
            return [
                { value: 1, label: this.$t("work.low") || '低' },
                { value: 0, label: this.$t("work.normal") || '中' },
                { value: 2, label: this.$t("work.high") || '高' }
            ]
        },
        targetWorkOptions() {
            // 这里原本是从父组件传入，或者硬编码
            return [{ value: 0, label: this.$t("work.any") || '任一' }]
        },
        colorTypeOptions() {
            return [
                { value: 0, label: this.$t("work.any") || '任一' },
                { value: 1, label: this.$t("work.sigleColor") || '单色' },
                { value: 2, label: this.$t("work.colorful") || '彩色' }
            ]
        },
        formatOptions() {
            return [
                { value: 0, label: this.$t('work.auto') || '不格式化' },
                { value: 1, label: 'FAT32' },
                { value: 2, label: 'exFAT' },
                { value: 3, label: 'NTFS' }
            ]
        }
    }
}
</script>
