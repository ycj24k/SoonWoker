<template>
    <div class="task-header-container">
        <div class="task-header-flex">
            <!-- 容量选择 - 步骤8 -->
            <guide-popover :step="8" :guide-step="guideStep" :current-step="currentStep"
                @exit-guide="$emit('exit-guide')" @prev-step="$emit('prev-step')" @next-step="$emit('next-step')">
                <div class="header-item">
                    <label class="inline-label">{{ $t('work.size') }}</label>
                    <el-select v-model="sizeFormLocal" class="header-select size-select" size="small"
                        @change="$emit('update:size_form', $event)" :placeholder="$t('work.pleaseSelect')">
                        <el-option v-for="item in sizeTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value"
                            :disabled="filterPassedType && filterPassedType.length > 0 && filterPassedType.indexOf(item.value) == -1" />
                    </el-select>
                </div>
            </guide-popover>

            <!-- 拷贝类型 - 步骤9 -->
            <guide-popover :step="9" :guide-step="guideStep" :current-step="currentStep"
                @exit-guide="$emit('exit-guide')" @prev-step="$emit('prev-step')" @next-step="$emit('next-step')">
                <div class="header-item">
                    <label class="inline-label">{{ $t('work.content') }}</label>
                    <el-select v-model="fileFormLocal" class="header-select" size="small"
                        @change="$emit('update:file_form', $event)">
                        <el-option v-for="item in fileTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
            </guide-popover>

            <!-- 分区模式 (如果需要显示) -->
            <div class="header-item" v-if="false">
                <!-- Screenshot doesn't show partition mode clearly or it might be hidden/dynamic. 
                  Users previous layout had it. I will keep it but maybe conditional or just append? 
                  The screenshot only shows 2 selects clearly. Keeping it visible for functionality but later in flow?
                  Actually I'll keep it but ensure flex flow handles it. -->
                <label class="inline-label">{{ $t('work.partType') }}:</label>
                <el-select v-model="typeFormLocal" class="header-select" size="small"
                    @change="$emit('update:type_form', $event)">
                    <el-option v-for="item in partitionOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </div>
        </div>
    </div>


</template>

<script>
import GuidePopover from './GuidePopover.vue'

export default {
    name: 'TaskHeader',
    components: {
        GuidePopover
    },
    props: {
        juanbiao_form: String,
        file_form: Number,
        size_form: [Number, String],
        type_form: Number,
        sizeType: Array,
        filterPassedType: Array,
        guideStep: [Object, Array],
        currentStep: [Number, String]
    },
    data() {
        return {
            fileFormLocal: this.file_form,
            sizeFormLocal: this.size_form,
            typeFormLocal: this.type_form
        }
    },
    watch: {
        file_form(val) { this.fileFormLocal = val },
        size_form(val) { this.sizeFormLocal = val },
        type_form(val) { this.typeFormLocal = val }
    },
    computed: {
        juanbiao: {
            get() { return this.juanbiao_form },
            set(val) { this.$emit('update:juanbiao_form', val) }
        },
        fileTypeOptions() {
            return [
                { label: this.$t('work.fileAnd'), value: 0 },
                { label: this.$t('work.eCd'), value: 1 },
                { label: this.$t('work.encryptCard'), value: 2 },
                { label: this.$t('work.forbidCopyU'), value: 4 }
            ]
        },
        sizeTypeOptions() {
            // 如果没有传入 sizeType，则提供默认
            if (this.sizeType && this.sizeType.length > 0) return this.sizeType
            return [
                { value: 0.512, label: "512MB" },
                { value: 4, label: "4GB" },
                { value: 32, label: "32GB" },
                { value: 64, label: "64GB" },
                { value: 128, label: "128GB" },
                { value: 256, label: "256GB" }
            ]
        },
        partitionOptions() {
            return [
                { value: 0, label: this.$t("work.diskPart") },
                { value: 1, label: this.$t("work.cdPart") },
                { value: 3, label: this.$t("work.forbidCopyPart") },
                { value: 5, label: this.$t("work.cdWithDisk") }
            ]
        }
    }
}
</script>

<style scoped>
.task-header-container {
    padding: 0;
    border-bottom: none;
    margin-bottom: 0;
}

.task-header-flex {
    display: flex;
    align-items: center;
    gap: 20px;
    height: 100%;
    padding-top: 5px;
    /* Alignment tweak */
}

.header-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.inline-label {
    font-size: 13px;
    font-weight: 600;
    color: #303133;
    white-space: nowrap;
    position: relative;
    padding-left: 2px;
}

.header-select {
    width: 160px;
    /* Wider selects */
}

.header-select.size-select {
    width: 220px;
    /* Capacity select needs even more width for placeholders */
}
</style>
