<template>
    <div class="grand-section">
        <div class="grand-title">
            <span>{{ $t('work.basicConfig') }}</span>
            <div class="title-line"></div>
        </div>
        <el-row :gutter="20">
            <el-col :span="12" v-if="fileForm !== 2">
                <el-form-item :label="$t('work.better')">
                    <el-select v-model="form.priority" class="w-full" :disabled="fileForm === 4">
                        <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="fileForm !== 2">
                <el-form-item :label="$t('work.startWorkSpace')">
                    <el-select v-model="form.target_work" class="w-full" :disabled="fileForm === 4">
                        <el-option v-for="item in targetWorkOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="$t('work.ribbonType')">
                    <el-select v-model="form.color_type" class="w-full">
                        <el-option v-for="item in colorTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="fileForm === 0 || fileForm === 2">
                <el-form-item :label="$t('work.formatFile')">
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
        priorityOptions() {
            return [
                { value: 1, label: this.$t("work.low") },
                { value: 0, label: this.$t("work.normal") },
                { value: 2, label: this.$t("work.high") }
            ]
        },
        targetWorkOptions() {
            let list = [{ value: 0, label: this.$t("work.any") }]

            if (this.printerList && this.printerList.length > 0) {
                const requiredSize = parseFloat(this.sizeForm)
                let filtered = this.printerList

                // Filter by capacity if size is selected
                if (requiredSize && requiredSize > 0) {
                    filtered = this.printerList.filter(p => {
                        if (!p.PrinterType) return false
                        const type = p.PrinterType.toUpperCase()

                        if (requiredSize < 1) {
                            // MB case (e.g. 0.512 -> 512M)
                            const mb = Math.round(requiredSize * 1000)
                            return type.includes(mb + "M")
                        } else {
                            // GB case (e.g. 4 -> 4G)
                            return type.includes(requiredSize + "G")
                        }
                    })
                }

                // Map to options
                if (filtered.length > 0) {
                    list = list.concat(filtered.map(p => ({
                        value: p.PrinterID,
                        label: `${p.PrinterID} (${p.PrinterType})`
                    })))
                }
            }
            return list
        },
        colorTypeOptions() {
            return [
                { value: 0, label: this.$t("work.any") },
                { value: 1, label: this.$t("work.sigleColor") },
                { value: 2, label: this.$t("work.colorful") }
            ]
        },
        formatOptions() {
            return [
                { value: 0, label: this.$t('work.auto') },
                { value: 1, label: 'FAT32' },
                { value: 2, label: 'exFAT' },
                { value: 3, label: 'NTFS' }
            ]
        }
    }
}
</script>
