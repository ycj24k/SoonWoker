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
                    {{ $t('work.design') || '创建标签' }}
                </el-button>
                <el-button size="small" @click="$emit('open-file')">
                    {{ $t('work.import') || '选择标签' }}
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
                <span>{{ $t('work.metadataEdit') || '标签内容编辑' }}</span>
            </div>
            <el-table v-if="tableData && tableData.length > 0" :data="tableData" class="metadata-table flex-grow-table"
                :empty-text="$t('work.nodata')" :show-header="false">

                <el-table-column prop="name" min-width="110"></el-table-column>
                <el-table-column min-width="240">
                    <template slot-scope="scope">
                        <div v-if="scope.row.type == 1">
                            <input type="file" title="" accept="image/*" :ref="scope.row.origin_name"
                                :data-name="scope.row.origin_name"
                                @change="(e) => $emit('image-change', scope.row.origin_name, e.target.files[0])" />
                        </div>
                        <div v-else-if="scope.row.type == 3 || scope.row.type == 4 || scope.row.type == 5">
                            <el-input v-model="form[scope.row.origin_name]" clearable size="mini"
                                :disabled="csvIsExist" />
                        </div>
                        <div v-else>{{ scope.row.origin_name }}</div>
                    </template>
                </el-table-column>
                <el-table-column min-width="90">
                    <template slot-scope="scope">
                        <div v-if="scope.row.type == 3 || scope.row.type == 4 || scope.row.type == 5">
                            <el-button size="mini" icon="el-icon-upload2" @click="$emit('open-csv')">
                                {{ file_name ? file_name : $t('work.binfile') }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 空状态占位框 (当无数据时显示) -->
            <div v-else class="empty-placeholder-box">
                <span class="empty-text">{{ $t('work.nodata') }}</span>
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
</style>
