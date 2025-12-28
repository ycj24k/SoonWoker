<template>
    <div class="file">
        <div class="section-title">
            <div class="title-left">
                <i class="el-icon-folder-opened"></i>
                <span class="title-text">{{ $t('work.contentTitle') }}</span>
            </div>
            <div class="content-header-actions">
                <el-button size="small" @click="$refs.files.addFolder()">{{ $t("file.addFolder") }}</el-button>
                <el-button size="small" @click="$refs.files.addFile()">{{ $t("file.addFile") }}</el-button>
                <div class="volume-label-group">
                    <span class="label-text">{{ $t('work.sign') }}</span>
                    <el-input :value="juanbiao" @input="$emit('update:juanbiao', $event)" size="small"
                        :placeholder="$t('work.pleaseInput')" class="volume-input" />
                </div>
            </div>
        </div>

        <!-- 列表容器 -->
        <div class="content-container mt-10">
            <files ref="files" :onSizechange="onSizeChange" :complete="onUploadOver" :saveWorkList="saveWorkList"
                class="flex-1-files" @network-paths-changed="$emit('network-paths-changed', $event)">
                <slot name="progress"></slot>
            </files>
        </div>
    </div>

</template>

<script>
import Files from '../files/file.vue'

export default {
    name: 'FileManagement',
    components: { Files },
    props: {
        saveWorkList: Object,
        juanbiao: String
    },
    methods: {
        handleCommand(command) {
            if (command === 'folder') {
                this.$refs.files.addFolder()
            } else {
                this.$refs.files.addFile()
            }
        },
        onSizeChange(size) {
            this.$emit('size-change', size)
        },
        onUploadOver() {
            this.$emit('upload-over')
        },
        // 将父组件需要的 ref 方法公开
        hasNetworkPaths() { return this.$refs.files.hasNetworkPaths() },
        getNetworkPaths() { return this.$refs.files.getNetworkPaths() },
        resume(form) { this.$refs.files.resume(form) },
        getLists() { return this.$refs.files.getLists() }
    },
    computed: {
        // 暴露 allNumber 供父组件校验
        allNumber() {
            return (this.$refs && this.$refs.files) ? this.$refs.files.allNumber : 0
        }
    }
}
</script>

<style scoped>
@import './styles/work-styles.css';

.file {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.content-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.flex-1-files {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.content-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.volume-label-group {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: 10px;
}

.label-text {
    font-size: 13px;
    color: #606266;
    white-space: nowrap;
}

.volume-input {
    width: 140px;
}
</style>
