<template>
    <div class="label">
        <div class="section-title">
            <div class="title-left">
                <i class="el-icon-collection-tag"></i>
                <span class="title-text">{{ $t('work.tag') }}</span>
            </div>
            <div class="header-right-actions">
                <el-select v-model="currentTemplateLocal" :placeholder="$t('work.pleaseSelect')" size="small"
                    class="template-select" @change="onTemplateChange" clearable filterable>
                    <el-option v-for="(item, index) in templates" :key="index" :label="item.label"
                        :value="item.value" />
                </el-select>
                <el-button size="small" @click="$emit('open-design')">
                    {{ $t('work.design') }}
                </el-button>
                <el-button size="small" @click="$emit('open-file')">
                    {{ $t('work.import') }}
                </el-button>
            </div>
        </div>


        <!-- 预览区域 -->
        <div class="display_box" v-if="fileData.frontDisplayPic || fileData.backDisplayPic">
            <el-tooltip effect="light" content="打印正面" placement="bottom">
                <div class="display_item" @click="setPrintFlag(2)">
                    <div class="display_bg" v-if="printFlag === 3"></div>
                    <img :src="fileData.frontDisplayPic" />
                </div>
            </el-tooltip>
            <el-tooltip effect="light" content="打印反面" placement="bottom">
                <div class="display_item" @click="setPrintFlag(3)">
                    <div class="display_bg" v-if="printFlag === 2"></div>
                    <img :src="fileData.backDisplayPic" />
                </div>
            </el-tooltip>
        </div>
        <div class="display_box display_box_placeholder" v-else>
            <span class="empty-text-dark">{{ $t('work.nodata') }}</span>
        </div>

        <!-- 详细参数列表 -->
        <div class="metadata-container mt-10">
            <div class="sub-title">
                <i class="el-icon-edit-outline"></i>
                <span>{{ $t('work.metadataEdit') }}</span>
                <span class="field-count" v-if="tableData && tableData.length > 0">({{ tableData.length }})</span>
            </div>

            <!-- 卡片式布局替代表格 -->
            <div v-if="tableData && tableData.length > 0" class="metadata-fields-list">
                <div v-for="(item, index) in tableData" :key="index" class="field-item"
                    :class="{ 'field-disabled': csvIsExist && (item.type == 3 || item.type == 4 || item.type == 5) }">

                    <!-- 左侧：字段名称区域 -->
                    <div class="field-label-area">
                        <div class="field-info">
                            <div class="field-name-row">
                                <span class="field-name" :title="item.name">{{ item.name }}</span>
                                <span v-if="item.sideLabel" class="side-badge"
                                    :class="{ 'side-front': item.sideLabel.includes('正'), 'side-back': item.sideLabel.includes('背') }">
                                    {{ item.sideLabel.replace('[', '').replace(']', '') }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧：输入区域 -->
                    <div class="field-input-area">
                        <!-- 图片类型 -->
                        <div v-if="item.type == 1" class="image-upload-wrapper">
                            <label :for="'upload-' + item.origin_name" class="upload-label">
                                <i class="el-icon-picture-outline"></i>
                                <span>{{ $t('work.selectImage') }}</span>
                            </label>
                            <input :id="'upload-' + item.origin_name" type="file" accept="image/*"
                                :ref="item.origin_name" :data-name="item.origin_name" class="hidden-file-input"
                                @change="(e) => $emit('image-change', item.origin_name, e.target.files[0])" />
                        </div>

                        <!-- 文本/条码类型 -->
                        <div v-else-if="item.type == 3 || item.type == 4 || item.type == 5" class="text-input-wrapper">
                            <el-input v-model="form[item.origin_name]" :placeholder="$t('work.pleaseInput')" clearable
                                size="small" :disabled="csvIsExist" class="modern-input" />
                            <el-button size="small" icon="el-icon-upload2" @click="$emit('open-csv')"
                                class="csv-import-btn" :title="$t('work.binfile')">
                                <span class="btn-text">{{ file_name || $t('work.binfile') }}</span>
                            </el-button>
                        </div>

                        <!-- 其他类型 -->
                        <div v-else class="field-value-display">
                            {{ item.origin_name }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 空状态占位框 (当无数据时显示) -->
            <div v-else class="empty-state-modern">
                <i class="el-icon-document"></i>
                <p class="empty-title">{{ $t('work.noTemplate') }}</p>
                <p class="empty-hint">{{ $t('work.selectTemplateHint') }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TagMetadata',
    props: {
        templates: Array,
        currentTemplate: String,
        fileData: Object,
        printFlag: Number,
        tableData: Array,
        form: Object,
        csvIsExist: Boolean,
        file_name: String
    },
    data() {
        return {
            currentTemplateLocal: this.currentTemplate
        }
    },
    watch: {
        currentTemplate(val) { this.currentTemplateLocal = val }
    },
    methods: {
        onTemplateChange(val) {
            this.$emit('update:current-template', val)
            this.$emit('template-change', val)
        },
        setPrintFlag(flag) {
            this.$emit('update:print-flag', flag)
        }
    }
}
</script>

<style scoped>
@import './styles/work-styles.css';

.header-right-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-right-actions ::v-deep .el-button {
    border-radius: 8px;
    font-weight: 500;
}

.label {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.metadata-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.flex-grow-table {
    flex: 1;
}

.template-select {
    width: 240px;
}

/* ================== 现代化卡片式字段列表 ================== */
.metadata-fields-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* 字段项卡片 */
.field-item {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.field-item:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
}

.field-disabled {
    opacity: 0.6;
    pointer-events: none;
}

/* 左侧：字段名称区域 */
.field-label-area {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 180px;
    flex-shrink: 0;
}

.field-info {
    flex: 1;
    min-width: 0;
}

.field-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.field-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.side-badge {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 500;
}

.side-front {
    background-color: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
}

.side-back {
    background-color: #fce7f3;
    color: #be185d;
    border: 1px solid #fbcfe8;
}

/* 右侧：输入区域 */
.field-input-area {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* 图片上传样式 */
.image-upload-wrapper {
    width: 100%;
}

.upload-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: #4b5563;
    font-weight: 500;
    transition: all 0.2s;
}

.upload-label:hover {
    background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
    border-color: #9ca3af;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.upload-label i {
    font-size: 16px;
    color: #6b7280;
}

.hidden-file-input {
    display: none;
}

/* 文本输入样式 */
.text-input-wrapper {
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
}

.modern-input {
    flex: 1;
}

.csv-import-btn {
    border-radius: 8px;
    border-color: #d1d5db;
    background: #ffffff;
    transition: all 0.2s;
    max-width: 140px;
    overflow: hidden;
}

.csv-import-btn:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
}

.csv-import-btn .btn-text {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;
    display: inline-block;
}

.field-value-display {
    padding: 7px 12px;
    background: #f9fafb;
    border-radius: 6px;
    font-size: 13px;
    color: #6b7280;
}

/* ================== 字段计数 ================== */
.field-count {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 600;
    margin-left: 4px;
    padding: 2px 8px;
    background: #f3f4f6;
    border-radius: 12px;
}

/* ================== 现代化空状态 ================== */
.empty-state-modern {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
}

.empty-state-modern i {
    font-size: 56px;
    color: #cbd5e1;
    margin-bottom: 16px;
}

.empty-title {
    font-size: 15px;
    font-weight: 600;
    color: #64748b;
    margin: 0 0 8px 0;
}

.empty-hint {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
}

/* ================== 滚动条美化 ================== */
.metadata-fields-list::-webkit-scrollbar {
    width: 6px;
}

.metadata-fields-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.metadata-fields-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.metadata-fields-list::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}
</style>
