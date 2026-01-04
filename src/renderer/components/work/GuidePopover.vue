<template>
    <el-popover v-if="guideStep && guideStep[step]" :placement="guideStep[step].placement" width="250" trigger="manual"
        v-model="guideStep[step].show">
        <div class="guide_box">
            <div class="guide_title">
                {{ $t('guide.title') }}<span>（{{ parseInt(currentStep) + 1 }}/{{ guideStep.length }}）</span>
            </div>
            <div class="guide_desc">{{ $t(`guide.step${step + 1}`) }}</div>
            <div class="guide_btns">
                <el-button @click="$emit('exit-guide')" class="guide_btn1" size="mini" type="text">
                    {{ $t('guide.skip') }}
                </el-button>
                <el-button v-if="parseInt(currentStep) > 0" @click="$emit('prev-step')" class="guide_btn1" size="mini">
                    {{ $t('guide.prev') }}
                </el-button>
                <el-button @click="$emit('next-step')" class="guide_btn2" size="mini" type="primary">
                    {{ currentStep == guideStep.length - 1 ? $t('guide.complete') : $t('guide.next') }}
                </el-button>
            </div>
        </div>
        <div slot="reference" :class="{ guide_body: currentStep == step }">
            <slot></slot>
        </div>
    </el-popover>
    <div v-else>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'GuidePopover',
    props: {
        step: {
            type: Number,
            required: true
        },
        guideStep: {
            type: [Object, Array],
            default: null
        },
        currentStep: {
            type: [Number, String],
            default: 0
        }
    }
}
</script>

<style scoped>
.guide_body {
    position: relative;
    z-index: 9999;
    background-color: white;
    border-radius: 4px;
}

.guide_box {
    padding: 10px;
}

.guide_title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
}

.guide_title span {
    font-size: 12px;
    color: #909399;
    font-weight: normal;
}

.guide_desc {
    font-size: 14px;
    color: #606266;
    line-height: 1.5;
    margin-bottom: 15px;
}

.guide_btns {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.guide_btn1 {
    color: #909399;
}

.guide_btn2 {
    background-color: #409EFF;
    border-color: #409EFF;
}
</style>
