<template>
  <div>
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-row :gutter="0">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span style="font-size: 18px; line-height: 40px; float: left">
                  {{ $t("work.size") }}
                </span>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">
                <el-select
                  :placeholder="$t('work.pleaseSelect')"
                  style="width: 160px"
                  v-model="size_form"
                >
                  <el-option
                    v-for="item in size_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <!--
					<el-input v-model="juanbiao_form" :placeholder="$t('work.pleaseInput')" style="width:280px;float:left">
						<template slot="prepend">
							{{$t("work.sign")}}
						</template>
					</el-input>
                    -->
        </el-col>
        <el-col :span="6">
          <el-row :gutter="0">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span style="font-size: 18px; line-height: 40px; float: left">
                  {{ $t("work.content") }}
                </span>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">
                <el-select
                  :placeholder="$t('work.pleaseSelect')"
                  style="float: left; margin-left: 10px"
                  v-model="file_form"
                >
                  <el-option
                    v-for="item in file_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row :gutter="0">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span style="font-size: 18px; line-height: 40px">
                  {{ $t("work.partType") }}
                </span>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">
                <el-select
                  :placeholder="$t('work.pleaseSelect')"
                  v-model="type_form"
                >
                  <el-option
                    v-for="item in type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-popover
            style="float: right"
            placement="left"
            width="600"
            trigger="click"
          >
            <div>
              <el-form :label-position="'right'" label-width="250px">
                <el-form-item :label="$t('work.better')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.priority"
                  >
                    <el-option
                      v-for="item in high_setting.priority"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item :label="$t('work.gshType')">
									<el-select :placeholder="$t('work.pleaseSelect')" v-model="high_setting_form.fileSystem">
										<el-option v-for="item in high_setting.fileSystem" :key="item.value" :label="item.label"
										:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>-->
                <el-form-item :label="$t('work.startWorkSpace')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.target_work"
                  >
                    <el-option
                      v-for="item in high_setting.target_work"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.ribbonType')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.color_type"
                  >
                    <el-option
                      v-for="item in high_setting.color_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.formatFile')">
                  <el-select
                    :placeholder="$t('work.pleaseSelect')"
                    v-model="high_setting_form.formatFile"
                  >
                    <el-option
                      v-for="item in high_setting.formatFile"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.hash')">
                  <el-switch v-model="high_setting_form.s1"> </el-switch>
                </el-form-item>
                <el-form-item :label="$t('work.md5')">
                  <el-switch v-model="high_setting_form.s2"> </el-switch>
                </el-form-item>
                <el-form-item :label="$t('work.fail')">
                  <el-switch v-model="high_setting_form.s3"> </el-switch>
                </el-form-item>
                <!--<el-form-item :label="$t('work.disk')">
									<el-switch v-model="high_setting_form.s4">
									</el-switch>
								</el-form-item>
								<el-form-item :label="$t('work.bitlocker')">
									<el-switch v-model="high_setting_form.s5">
									</el-switch>
								</el-form-item>-->
                <el-form-item :label="$t('work.localFiles')">
                  <el-switch v-model="high_setting_form.localfiles">
                  </el-switch>
                </el-form-item>
              </el-form>
              <!--<el-descriptions :column="2" v-if="high_setting_form.s5">
								<el-descriptions-item :label="$t('work.password')">
									<el-input placeholder="$t('work.pleasePassword')" v-model="high_setting_form.pass" show-password
									size="mini">
									</el-input>
								</el-descriptions-item>
								<el-descriptions-item :label="$t('work.comfirm')">
									<el-input placeholder="$t('work.pleasePassword')" v-model="high_setting_form.repass" show-password
									size="mini">
									</el-input>
								</el-descriptions-item>
							</el-descriptions>-->
            </div>
            <el-button slot="reference" size="medium" style="height: 40px">
              {{ $t("work.senior") }}
            </el-button>
          </el-popover>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12">
        <el-switch
          v-model="switch_cont"
          :active-text="$t('work.addContent')"
          style="float: left"
        >
        </el-switch>
      </el-col>
      <el-col :span="12">
        <el-switch
          v-model="switch_tag"
          style="float: right"
          :active-text="$t('work.addTag')"
        >
        </el-switch>
      </el-col>
    </el-row>
    <el-row :gutter="0" style="margin-top: 10px">
      <el-col
        :span="
          switch_tag && switch_cont ? 12 : switch_tag && !switch_cont ? 0 : 24
        "
      >
        <div class="grid-content bg-purple">
          <div class="file">
            <el-row :gutter="20">
              <el-col :span="3">
                <span
                  style="
                    font-size: 18px;
                    font-weight: 700;
                    height: 40px;
                    line-height: 40px;
                    text-align: left;
                  "
                  >{{ $t("work.contentTitle") }}</span
                >
              </el-col>
              <el-col :span="11">
                <el-input
                  v-model="juanbiao_form"
                  :placeholder="$t('work.pleaseInput')"
                  style="width: 200px; float: left"
                >
                  <template slot="prepend">
                    {{ $t("work.sign") }}
                  </template>
                </el-input>
              </el-col>
              <el-col :span="10">
                <el-progress
                  :text-inside="true"
                  :percentage="file_percent"
                  :format="format"
                  style="line-height: 40px"
                  :stroke-width="20"
                  :color="customColors"
                ></el-progress>
              </el-col>
            </el-row>
            <div style="clear: both"></div>
            <uploader
              :options="options"
              class="uploader-example"
              ref="uploader"
              @file-added="onFileAdded"
              @file-removed="onFileRemoved"
              :autoStart="false"
              @complete="upload_over"
              @drop.prevent="onDrag"
            >
              <uploader-unsupport> </uploader-unsupport>
              <uploader-drop
                style="height: 405px"
                class="drag-bg"
                :style="'background-image:url(' + bgi + ');'"
              >
                <uploader-btn> {{ $t("work.selectFile") }}</uploader-btn>
                <uploader-btn :directory="true">{{
                  $t("work.selectFloder")
                }}</uploader-btn>
                <uploader-list> </uploader-list>
              </uploader-drop>
            </uploader>
            <!--<uploader :options="options" class="uploader-example" v-else-if="file_form==2
						">
						<uploader-unsupport></uploader-unsupport>
						<uploader-drop style="height:405px">
						<p>拖放文件或</p>
						<uploader-btn :attrs="zip_attrs">选择ZIP文件</uploader-btn>
						</uploader-drop>
						<uploader-list style=""></uploader-list>
						</uploader>
						<uploader :options="options" class="uploader-example" v-else-if="file_form == 1">
						<uploader-unsupport></uploader-unsupport>
						<uploader-drop style="height:405px">
						<p>拖放文件或</p>
						<uploader-btn :attrs="iso_attrs">选择映像文件</uploader-btn>
						<uploader-list style="min-height:290px;margin-top: 10px;"></uploader-list>
						</uploader-drop>
						</uploader>
						<uploader :options="options" class="uploader-example" v-else-if="file_form == 3">
						<uploader-unsupport></uploader-unsupport>
						<uploader-drop style="height:405px">
						<p>拖放文件或</p>
						<uploader-btn>选择文件</uploader-btn>
						<uploader-btn :directory="true">选择文件夹</uploader-btn>
						<uploader-list style="margin-top: 10px;"></uploader-list>
						</uploader-drop>
						</uploader>-->
          </div>
        </div>
      </el-col>
      <el-col
        :span="
          switch_cont && switch_tag ? 12 : switch_cont && !switch_tag ? 0 : 24
        "
      >
        <div class="grid-content bg-purple">
          <div class="label">
            <div class="title" style="width: 100%">
              <div style="display: inline-block; float: left">
                {{ $t("work.tag") }}
                <el-button
                  type="text"
                  icon="el-icon-upload2"
                  style="margin-left: 10px; font-size: 14px"
                  @click="openFile"
                >
                  {{ $t("work.importTag") }}
                </el-button>
              </div>
              <!--<el-checkbox v-model="flag">单面打印</el-checkbox>-->
              <div style="display: inline-block; float: right; right: 0px">
                <span
                  style="font-size: 14px; color: #606266; font-weight: normal"
                >
                  {{ $t("work.print") }}
                </span>
                <el-select
                  v-model="print_flag"
                  :placeholder="$t('work.pleaseSelect')"
                  size="mini"
                >
                  <el-option
                    v-for="item in print_op"
                    v-if="!(flag && item.value == 1)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div style="float: right"></div>
            <input
              type="file"
              accept=".soon,.cs"
              @change="fileLoad"
              ref="refFile"
              style="display: none"
            />
            <div style="clear: both"></div>
            <div class="display">
              <img
                v-if="print_flag == 1 || print_flag == 2"
                :src="fileData.frontDisplayPic"
                style="
                  height: 120px;
                  position: relative;
                  top: 50%;
                  transform: translateY(-50%);
                "
              />
              <img
                v-if="print_flag == 1 || print_flag == 3"
                :src="fileData.backDisplayPic"
                style="
                  height: 120px;
                  position: relative;
                  top: 50%;
                  transform: translateY(-50%);
                "
              />
            </div>
            <el-table
              :data="tableData"
              height="185"
              style="width: 100%"
              :empty-text="$t('work.nodata')"
            >
              <el-table-column prop="name" :label="$t('work.fieldName')">
              </el-table-column>
              <el-table-column prop="val" width="400">
                <template slot="header" slot-scope="scope">
                  <input
                    type="file"
                    accept=".csv"
                    @change="fileLoad2"
                    ref="refFile2"
                    style="display: none"
                  />
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      file_name == null
                        ? $t('work.binfile')
                        : file_name.strLen() > 12
                        ? file_name.subCHStr(0, 12) + '...'
                        : file_name
                    "
                    placement="top-start"
                  >
                    <el-button
                      type="text"
                      icon="el-icon-upload2"
                      style="margin-left: 10px; font-size: 14px"
                      @click="openFile2"
                    >
                      {{
                        file_name == null
                          ? $t("work.binfile")
                          : file_name.strLen() > 12
                          ? file_name.subCHStr(0, 12) + "..."
                          : file_name
                      }}
                    </el-button>
                  </el-tooltip>

                  <input
                    type="file"
                    accept="..zip,.rar"
                    @change="fileLoad3"
                    ref="refFile3"
                    style="display: none"
                  />
                  <!--<el-tooltip class="item" effect="dark" :content="file_name3" placement="top-start">
									    <el-button type="text" icon="el-icon-upload2" style="margin-left: 10px;font-size: 14px"
									    @click="openFile3">
									    	{{ file_name3.strLen() > 12 ? file_name3.subCHStr(0,12) + '...' : file_name3 }}
									    </el-button>
                                    </el-tooltip>-->
                </template>
                <template slot-scope="scope">
                  <div v-if="scope.row.type == 1">
                    <input
                      type="file"
                      accept="image/*"
                      :ref="scope.row.origin_name"
                      :data-name="scope.row.origin_name"
                    />
                  </div>
                  <div
                    v-if="
                      scope.row.type == 3 ||
                      scope.row.type == 4 ||
                      scope.row.type == 5
                    "
                  >
                    <!--合成文本-->
                    <el-input
                      :placeholder="$t('work.pleaseInput')"
                      v-model="form[scope.row.origin_name]"
                      clearable
                      style="width: calc(100% - 30px) !important"
                      :disabled="csvIsExist"
                    >
                    </el-input>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="height: 30px; margin-top: 20px">
      <el-col :span="14">
        <div v-if="file_form == 3 && switch_cont">
          <el-input
            :placeholder="$t('work.pleasePassword')"
            style="width: 25%; float: left"
            show-password
            v-model="p1"
          >
            <template slot="prepend">
              {{ $t("work.password") }}
            </template>
          </el-input>
          <el-input
            :placeholder="$t('work.pleasePassword')"
            style="width: 25%; float: left; margin-left: 10px"
            show-password
            v-model="p2"
          >
            <template slot="prepend">
              {{ $t("work.comfirm") }}
            </template>
          </el-input>
          <el-input
            :placeholder="$t('work.addContent')"
            style="width: 40%; float: left; margin-left: 10px"
            v-model="zip_name"
          >
            <template slot="prepend">
              {{ $t("work.name") }}
            </template>
          </el-input>
        </div>
        <div v-else-if="file_form == 2 && switch_cont">
          <el-input
            :placeholder="$t('work.addContent')"
            style="width: 40%; float: left"
            v-model="zip_name"
          >
            <template slot="prepend">
              {{ $t("work.name") }}
            </template>
          </el-input>
        </div>
        <div style="width: 100%" v-else>&nbsp;</div>
      </el-col>
      <el-col :span="10">
        <el-input
          :placeholder="$t('work.addContent')"
          v-model="number"
          style="width: 200px; float: left"
        >
          <template slot="prepend">
            {{ $t("work.num") }}
          </template>
        </el-input>
        <el-button type="primary" style="float: right" @click="upload">
          {{ $t("work.submit") }}
        </el-button>
        <!--<el-button type="primary" style="float: right;margin-right:10px" @click="upload">
					上传
				</el-button>-->
      </el-col>
    </el-row>
  </div>
</template>
<script>
String.prototype.strLen = function () {
  var len = 0;
  for (var i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2;
    else len++;
  }
  return len;
};
String.prototype.strToChars = function () {
  var chars = new Array();
  for (var i = 0; i < this.length; i++) {
    chars[i] = [this.substr(i, 1), this.isCHS(i)];
  }
  String.prototype.charsArray = chars;
  return chars;
};
String.prototype.isCHS = function (i) {
  if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) return true;
  else return false;
};
String.prototype.subCHString = function (start, end) {
  var len = 0;
  var str = "";
  this.strToChars();
  for (var i = 0; i < this.length; i++) {
    if (this.charsArray[i][1]) len += 2;
    else len++;
    if (end < len) return str;
    else if (start < len) str += this.charsArray[i][0];
  }
  return str;
};
String.prototype.subCHStr = function (start, length) {
  return this.subCHString(start, start + length);
};
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
export default {
  name: "work",
  props: {
    dice: {
      type: Number,
    },
    printerList: {
      type: Object | undefined,
    },
  },
  data() {
    return {
      flag: false,
      switch_cont: true,
      switch_tag: true,
      print_flag: null,
      //print_op: [{
      //    value: 2,
      //  label: this.$t("work.front")
      //}, {
      //    value: 3,
      //    label: this.$t("work.back")
      //}, {
      //    value: 1,
      //    label: this.$t("work.double")
      //}],
      size_type: [
        {
          value: 0.5,
          label: "512MB|2.0",
        },
        {
          value: 4,
          label: "4GB|2.0",
        },
        {
          value: 32,
          label: "32GB|2.0",
        },
        {
          value: 64,
          label: "64GB|3.0",
        },
        {
          value: 128,
          label: "128GB|3.0",
        },
        {
          value: 256,
          label: "256GB|3.0",
        },
      ],
      //type: [{
      //    value: 0,
      //    label: this.$t("work.diskPart")
      //}, {
      //    value: 1,
      //    label: this.$t("work.cdPart")
      //}, {
      //
      //   // -- value: 2,
      //   //  label: '加密分区'
      ////  }, {

      //    value: 3,
      //    label: this.$t("work.forbidCopyPart")
      //}, {
      //   // -- value: 4,
      // //    label: '普普分区'
      ////  }, {

      //    value: 5,
      //    label: this.$t("work.cdWithDisk")
      //}],
      //file_type: [{
      //    value: 0,
      //    label: this.$t("work.fileAnd")
      //}, {
      //    value: 1,
      //    label: this.$t("work.eCd")
      //}, {
      //     value: 2,
      //     label: this.$t("work.zip")
      //  }, {
      //     value: 3,
      //     label: this.$t("work.passZip")
      // }, {
      //    value: 4,
      //    label: this.$t("work.forbidCopyU")
      //}],
      size_form: 0.5,
      type_form: 0,
      file_form: 0,
      number: 1,
      juanbiao_form: "",
      options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target: "http://localhost:5080/upload/",
        testChunks: false,
      },
      zip_attrs: {
        accept: ".zip",
      },
      iso_attrs: {
        accept: "iso/img",
      },
      fileData: {},
      tableData: [],
      //high_setting: {
      //    priority: [{
      //        value: 1,
      //        label: this.$t("work.low")
      //    }, {
      //        value: 0,
      //        label: this.$t("work.normal")
      //    }, {
      //        value: 2,
      //        label: this.$t("work.high")
      //    }],
      //    fileSystem: [{
      //        value: 0,
      //        label: this.$t("work.auto")
      //    }, {
      //        value: 1,
      //        label: 'FAT32'
      //    }, {
      //        value: 2,
      //        label: 'exFAT'
      //    }, {
      //        value: 3,
      //        label: 'NTFS'
      //    }],
      //    target_work: [{
      //        value: 0,
      //        label: this.$t("work.any")
      //    }, ],
      //    color_type: [{
      //        value: 0,
      //        label: this.$t("work.any")
      //    }, {
      //        value: 1,
      //        label: this.$t("work.sigleColor")
      //    }, {
      //        value: 2,
      //        label: this.$t("work.colorful")
      //    }, ],
      //},
      high_setting_form: {
        priority: 0,
        fileSystem: 0,
        target_work: 0,
        color_type: 0,
        s1: false,
        s2: false,
        s3: false,
        s4: false,
        s5: false,
        pass: "",
        repass: "",
        localfiles: false, //本地文件
        formatFile: 0, // auto
      },
      file_name: null,
      file_name3: this.$t("work.binImg"),
      upload_disk: "",
      p1: "",
      p2: "",
      size: 0,
      zip_name: "",
      flag_cont_up: false,
      filter_rules: [[0], [1, 5], [0], [0], [3]],
      form: {},
      fullscreenLoading: false,
      file_len: 0,
      customColors: [
        { color: "#67C23A", percentage: 99 },
        { color: "#F56C6C", percentage: 100 },
      ],
      csvIsExist: false,
      upload_flag: false,
      fileLists: [], //上传文件列表
    };
  },
  created() {
    this.upload_disk = this.genTaskUUID();
    this.options.target += this.upload_disk + "/data";
    //this.options.target = "/api";
  },
  mounted() {
    //alert(this.dice);
    this.juanbiao_form = getNowFormatDate();
    if (this.dice == 1) {
      this.flag = true;
      this.print_flag = 2;
    } else {
      this.print_flag = 1;
    }
  },
  methods: {
    openFile() {
      this.$refs.refFile.dispatchEvent(new MouseEvent("click"));
    },
    openFile2() {
      this.$refs.refFile2.dispatchEvent(new MouseEvent("click"));
    },
    openFile3() {
      this.$refs.refFile3.dispatchEvent(new MouseEvent("click"));
    },
    fileLoad() {
      let selectedFile = this.$refs.refFile.files[0];
      let reader = new FileReader();
      reader.readAsText(selectedFile);
      let _this = this;
      reader.onload = function () {
        let json = JSON.parse(this.result);
        _this.fileData = json;
        _this.form = {};
        _this.tableData = [];
        for (let item of _this.fileData.frontData) {
          if (
            item.type == 1 ||
            item.type == 3 ||
            item.type == 4 ||
            item.type == 5
          ) {
            _this.tableData.push({
              name: item.name + _this.$t("work.front_tag"),
              val: item.DefaultText == undefined ? "" : item.DefaultText,
              origin_name: item.name,
              type: item.type,
              default:
                item.DefaultText == undefined ? undefined : item.DefaultText,
            }); //前
            _this.$set(
              _this.form,
              item.name,
              item.DefaultText == undefined ? "" : item.DefaultText
            );
          }
        }
        for (let item of _this.fileData.backData) {
          if (
            item.type == 1 ||
            item.type == 3 ||
            item.type == 4 ||
            item.type == 5
          ) {
            _this.tableData.push({
              name: item.name + _this.$t("work.back_tag"),
              val: item.DefaultText == undefined ? "" : item.DefaultText,
              origin_name: item.name,
              type: item.type,
              default:
                item.DefaultText == undefined ? undefined : item.DefaultText,
            });
            _this.$set(
              _this.form,
              item.name,
              item.DefaultText == undefined ? "" : item.DefaultText
            );
          }
        }
        _this.$refs.refFile2.value = "";
        _this.$refs.refFile3.value = "";

        _this.csvIsExist = false;
        _this.file_name = null;
        _this.file_name3 = _this.$t("work.binImg");
      };
    },
    fileLoad2() {
      this.file_name = this.$refs.refFile2.files[0].name;
      this.csvLoad();
    },
    fileLoad3() {
      this.file_name3 = this.$refs.refFile3.files[0].name;
    },
    csvLoad() {
      let selectedFile = this.$refs.refFile2.files[0];
      let reader = new FileReader();
      reader.readAsText(selectedFile);
      let _this = this;
      reader.onload = function () {
        //let flag = true; //校验结果
        let first_line = this.result
          .split("\n")[0]
          .replace("\r", "")
          .split(","); //第一行
        let second_line = this.result
          .split("\n")[1]
          .replace("\r", "")
          .split(","); //第二行
        let i = 0;
        for (let item of first_line) {
          _this.$set(_this.form, item, second_line[i]);
          i++;
        }
        _this.csvIsExist = true;

        //let ava_num = 0; //实际数量，去除空
        //let str_len = this.result.split("\n").length - 1;
        //for (let item of arr) {
        //    if (item != "") {
        //        ava_num++;
        //    }
        //}
        //if (ava_num != _this.tableData.length) {
        //    flag = false; //参数量不相等
        //    _this.$message({offset:100,
        //        message: '请检查，合并文件csv数据跟cs字段数不匹配！',
        //        type: 'warning'
        //    });
        //    return;
        //}
        //if (str_len < _this.number) {
        //
        //    flag = false; //数量不匹配
        //    _this.$message({offset:100,
        //        message: '请检查，合并文件csv数据组跟usb卡片发行数字num不匹配！',
        //        type: 'warning'
        //    });
        //    return;
        //}
        //let warn_arr = [];
        //for (let item of _this.tableData) {
        //    console.log(item)
        //    if (arr.indexOf(item.origin_name + '') == -1) {
        //        warn_arr.push(item.origin_name + '');
        //    }
        //}
        //if (warn_arr.length != 0) { //参数名不匹配
        //    _this.$message({offset:100,
        //        message: '未发现' + warn_arr + "字段！",
        //        type: 'warning'
        //    });
        //}
      };
    },
    format(percentage) {
      let mb = (this.size_form * 931.3).toFixed(0);
      return (this.size / (1024 * 1024)).toFixed(1) + "MB / " + mb + "MB";
    },

    getPrintName1(id) {
      for (let i = 0; i < this.printerList.length; i++) {
        if (this.printerList[i].PrinterID == id) {
          return `工作站` + this.toChar(i);
        }
      }
    },
    getPrintName(id) {
      return this.$t("index.wordSpace") + id.substr(-5);
    },

    toChar(n) {
      return String.fromCharCode(65 + parseInt(n));
    },
    genTaskUUID() {
      var myDate = new Date();
      var dateStr =
        myDate.getFullYear().toString() +
        (myDate.getMonth() >= 9
          ? (myDate.getMonth() + 1).toString()
          : "0" + (myDate.getMonth() + 1).toString()) +
        (myDate.getDate() > 9
          ? myDate.getDate().toString()
          : "0" + myDate.getDate().toString()) +
        (myDate.getHours() > 9
          ? myDate.getHours().toString()
          : "0" + myDate.getHours().toString()) +
        (myDate.getMinutes() > 9
          ? myDate.getMinutes().toString()
          : "0" + myDate.getMinutes().toString()) +
        (myDate.getSeconds() > 9
          ? myDate.getSeconds().toString()
          : "0" + myDate.getSeconds().toString());

      return dateStr + "-WEB-" + Math.random().toString(36).substr(2);
    },
    async upload_over() {
      //左侧内容上传结束
      if (!this.upload_flag) {
        return;
      }
      this.upload_flag = false;
      if (this.flag_cont_up) {
        //如果是点击按钮开启的上传，则进行上传右侧
        if (this.switch_tag) {
          //开启了标签则检测并上传
          let files_n_incr = 1;
          let data1 = new FormData();
          if (this.$refs.refFile.files[0]) {
            data1.append(`file${files_n_incr}`, this.$refs.refFile.files[0]); //标签cs文件
            files_n_incr++;
          } else {
            this.$message({offset:100,
              message: this.$t("work.pleaseUploadTag"),
              type: "warning",
            });
            return;
          }
          if (this.$refs.refFile2.files.length != 0) {
            // 有csv合并文件
            data1.append(`file${files_n_incr}`, this.$refs.refFile2.files[0]); //csv文件
            data1.append(`csv`, true); //csv文件flag
            //console.log(this.$refs.refFile2.files);
            files_n_incr++;
          } else {
            data1.append(`csv`, false); //csv文件flag
          }
          for (let item of this.tableData) {
            if (
              item.type == 1 &&
              this.$refs[item.origin_name].files[0] != undefined &&
              this.$refs.refFile2.files.length != 0
            ) {
              //有合并文件
              //data1.append(item.origin_name, this.$refs[item.origin_name].files[0]);//图片文件
              data1.append(
                `file${files_n_incr}`,
                this.$refs[item.origin_name].files[0]
              ); //图片文件
              files_n_incr++;
            } else if (
              item.type == 1 &&
              this.$refs[item.origin_name].files[0] != undefined &&
              this.$refs.refFile2.files.length == 0
            ) {
              //无合并文件
              data1.append(
                item.origin_name,
                this.$refs[item.origin_name].files[0]
              ); //图片文件
              //data1.append(`file${files_n_incr}`, this.$refs[item.origin_name].files[0]);//图片文件
              files_n_incr++;
            } else if (
              (item.type == 3 || item.type == 5) &&
              this.$refs.refFile2.files.length == 0
            ) {
              //无合并文件
              let data = this.form[item.origin_name];
              if (data == "" || data == undefined || data == null) {
                data = item.default;
              }
              data1.append(item.origin_name, data); //合成文字与条形码 有默认值的
            } else if (
              item.type == 4 &&
              this.$refs.refFile2.files.length == 0
            ) {
              //二维码
              data1.append(item.origin_name, this.form[item.origin_name]);
            }
          }

          this.$message({offset:100,
            message: this.$t("work.uploadingTag"),
          });
          let pathName;
          if (this.high_setting_form.localfiles) {
            //打开本地选项
            let rootFile = this.$refs.uploader.uploader.getRoot();
            if (rootFile.fileList.length != 1) {
              this.$message({offset:100,
                message: this.$t("work.oneFolder"),
                type: "warning",
              });
              return;
            }
            let filePath = rootFile.fileList[0];
            if (!filePath.isFolder) {
              this.$message({offset:100,
                message: this.$t("work.notFolder"),
                type: "warning",
              });
              return;
            }
            pathName = filePath.name;
          } else {
            pathName = this.upload_disk;
          }
          this.$axios({
            method: "post",
            url: "/upload/" + pathName,
            headers: {
              "Content-Type":
                "multipart/form-data;boundary=" + new Date().getTime(),
            },
            data: data1,
          }).then((res) => {
            this.submit(); //调用提交函数
          });
          //if (this.$refs.refFile.files[0]) {
          //    data1.append("file1", this.$refs.refFile.files[0]);
          //}else{
          //    this.$message({offset:100,
          //        message: "请上传标签！",
          //        type: 'warning'
          //    });
          //    return;
          //}
          //if (this.$refs.refFile3.files[0]) {//添加了图片就上传图片文件
          //    data1.append("file3", this.$refs.refFile3.files[0]);
          //}
          //if( this.tableData.length != 0 ){
          //    //需要上传数据文件
          //
          //    if (this.$refs.refFile2.files[0]) {
          //        //有数据文件
          //        data1.append("file2", this.$refs.refFile2.files[0]);
          //        //需要进一步判断是否有合成图片，有则上传
          //        if(isExistBinPic()){
          //            //存在合成图片，则上传合成图片
          //            let f1 = this.check_compressed();
          //            let f2;
          //            await f1.then((res)=>{
          //                f2 = res;
          //            })
          //            if(res){
          //                //校验合并图片成功
          //            }else{
          //                return;
          //            }
          //        }
          //    }else{
          //        let flag_1 = false;//如果全部是合成图片，则false；如果有 非合成图片 ，那么就是true
          //        for( let value of this.tableData){
          //            if(value.type != 1){
          //                flag_1 = true;
          //                break;
          //            }
          //        }
          //        if(flag_1){
          //            //需要上传csv则校验，否则
          //            this.$message({offset:100,
          //                message: "请上传标签合并文件！",
          //                type: 'warning'
          //            });
          //            return;
          //        }
          //    }
          //
          //}
          //
          //this.$message({offset:100,
          //    message: "正在上传标签文件...",
          //});
          //
          //this.$axios({
          //    method: "post",
          //    url: "/upload/" + this.upload_disk,
          //    headers: {
          //        "Content-Type": "multipart/form-data;boundary=" + new Date().getTime()
          //    },
          //    data: data1,
          //}).then(res=>{
          //    this.submit();//调用提交函数
          //});
        } else {
          //未开启标签则直接提交
          this.submit();
        }
      }
      this.flag_cont_up = false;
    },
    isExistBinPic() {
      let flag_1 = false;
      for (let value of this.tableData) {
        if (value.type == 1) {
          flag_1 = true;
          break;
        }
      }
      return flag_1; //如果存在合成图片，就返回true
    },
    async check_compressed() {
      console.log(this.$refs);
      let flag = true; //全部选择
      for (let item in this.$refs) {
        if (item.search("compress") != -1) {
          //出现compress
          if (this.$refs[item].files.length == 0) {
            flag = false; //有未选择的，报错
            break;
          }
        }
      }
      if (!flag) {
        //报错内容
        this.$message({offset:100,
          message: this.$t("work.pleaseUploadingImgBin"),
          type: "warning",
        });
        return false;
      } else {
        //开始上传合并图片压缩文件

        let data1 = new FormData(); // 创建一个表单数据
        let i = 0;
        for (let item in this.$refs) {
          if (item.search("compress") != -1) {
            //出现compress
            data1.append(
              this.$refs[item].dataset.name,
              this.$refs[item].files[0]
            );
          }
          i++;
        }
        this.$message({offset:100,
          message: this.$t("work.UploadingImgBin"),
        });
        let re;
        await this.$axios({
          method: "post",
          url: "/upload/" + this.upload_disk,
          headers: {
            "Content-Type":
              "multipart/form-data;boundary=" + new Date().getTime(),
          },
          data: data1,
        })
          .then((res) => {
            re = true;
          })
          .catch(() => {
            this.$message({offset:100,
              message: this.$t("work.UploadingImgBinFail"),
              type: "warning",
            });
            re = false;
          });
        return re;
      }
    },
    async upload() {
      //console.log(this.$refs.filesss.files);return;
      if (this.switch_cont) {
        //开启了左边内容则先左边
        if (this.size == 0) {
          this.$message({offset:100,
            message: this.$t("work.pleaseUploadContent"),
            type: "warning",
          });
          return;
        }
        this.flag_cont_up = true;
        if (this.$refs.uploader.uploader.isComplete()) {
          //如果已经上传成功了，直接开始下一步
          this.upload_over();
          return;
        }
        this.upload_flag = true;
        if (this.high_setting_form.localfiles) {
          //如果开启本地文件，则只上传路径，不上传文件
          this.upload_over();
          return;
        } else {
          this.$refs.uploader.uploader.resume();
          this.$message({offset:100,
            message: this.$t("work.uploadingContent"),
          });
        }
      } else {
        //没开启左边，则右边一定开启了

        let files_n_incr = 1;
        let data1 = new FormData();
        if (this.$refs.refFile.files[0]) {
          data1.append(`file${files_n_incr}`, this.$refs.refFile.files[0]); //标签cs文件
          files_n_incr++;
        } else {
          this.$message({offset:100,
            message: this.$t("work.pleaseUploadTag"),
            type: "warning",
          });
          return;
        }

        if (this.$refs.refFile2.files.length != 0) {
          // 有csv合并文件
          data1.append(`file${files_n_incr}`, this.$refs.refFile2.files[0]); //csv文件
          data1.append(`csv`, true); //csv文件flag
          files_n_incr++;
        } else {
          data1.append(`csv`, false); //csv文件flag
        }
        for (let item of this.tableData) {
          if (
            item.type == 1 &&
            this.$refs[item.origin_name].files[0] != undefined &&
            this.$refs.refFile2.files.length != 0
          ) {
            //有合并文件
            //data1.append(item.origin_name, this.$refs[item.origin_name].files[0]);//图片文件
            data1.append(
              `file${files_n_incr}`,
              this.$refs[item.origin_name].files[0]
            ); //图片文件
            files_n_incr++;
          } else if (
            item.type == 1 &&
            this.$refs[item.origin_name].files[0] != undefined &&
            this.$refs.refFile2.files.length == 0
          ) {
            //无合并文件
            data1.append(
              item.origin_name,
              this.$refs[item.origin_name].files[0]
            ); //图片文件
            //data1.append(`file${files_n_incr}`, this.$refs[item.origin_name].files[0]);//图片文件
            files_n_incr++;
          } else if (
            (item.type == 3 || item.type == 5) &&
            this.$refs.refFile2.files.length == 0
          ) {
            //无合并文件
            let data = this.form[item.origin_name];
            if (data == "" || data == undefined || data == null) {
              data = item.default;
            }
            data1.append(item.origin_name, data); //合成文字与条形码 有默认值的
          } else if (item.type == 4 && this.$refs.refFile2.files.length == 0) {
            //二维码
            data1.append(item.origin_name, this.form[item.origin_name]);
          }
        }

        this.$message({offset:100,
          message: this.$t("work.uploadingTag"),
        });
        this.$axios({
          method: "post",
          url: "/upload/" + this.upload_disk,
          headers: {
            "Content-Type":
              "multipart/form-data;boundary=" + new Date().getTime(),
          },
          data: data1,
        }).then((res) => {
          this.submit(); //调用提交函数
        });
        // 创建一个表单数据

        //if (this.$refs.refFile.files[0]) {
        //    data1.append("file1", this.$refs.refFile.files[0]);
        //}else{
        //    this.$message({offset:100,
        //        message: "请上传标签！",
        //        type: 'warning'
        //    });
        //    return;
        //}
        //if (this.$refs.refFile3.files[0]) {//添加了图片就上传图片文件
        //    data1.append("file3", this.$refs.refFile3.files[0]);
        //}
        //if( this.tableData.length != 0 ){
        //    //需要上传数据文件
        //    if (this.$refs.refFile2.files[0]) {
        //        //有数据文件，需要检测是否有合并图片
        //        data1.append("file2", this.$refs.refFile2.files[0]);
        //        if(isExistBinPic()){
        //            //存在合成图片，则上传合成图片
        //            let f1 = this.check_compressed();
        //            let f2;
        //            await f1.then((res)=>{
        //                f2 = res;
        //            })
        //            if(res){
        //                //校验合并图片成功
        //            }else{
        //                return;
        //            }
        //        }
        //    }else{
        //        //没有选择数据文件，判断是否全是合并文件
        //        let flag_1 = false;
        //            for( let value of this.tableData){
        //                if(value.type != 1){
        //                    flag_1 = true;
        //                    break;
        //                }
        //            }
        //        if(flag_1){
        //            //需要上传csv则校验，否则
        //            this.$message({offset:100,
        //                message: "请上传标签合并文件！",
        //                type: 'warning'
        //               });
        //            return;
        //        }
        //            let f1 = this.check_compressed();
        //            let f2;
        //            await f1.then((res)=>{
        //                f2 = res;
        //            })
        //            if(res){
        //                //校验合并图片成功
        //            }else{
        //                return;
        //            }
        //    }
        //}
      }
    },
    onFileAdded(e) {
      //console.log(e);
      //this.fileLists.push(e);
      //console.log(this.size_form << 20)
      this.file_len++;
      this.$nextTick(() => {
        this.size = this.$refs.uploader.uploader.getSize();
      });
      //this.size += e.size / (1024*1024);
      //this.file_percent = (this.size) / (this.size_form*1024) * 100;
      //console.log(this.file_percent);
      //if(this.file_percent > 100){
      //    this.$message({offset:100,
      //        message: "文件大小已超过磁盘容量！",
      //        type: 'warning'
      //    });
      //}
    },
    onFileRemoved(e) {
      //console.log(e);
      //if(e.isFolder){
      //    //如果是文件夹
      //    let tempLists = [];
      //    for(let item of this.fileLists){
      //        if(e.path + item.name != item.relativePath){
      //            tempLists.push(item);
      //        }
      //    }
      //    this.fileLists = tempLists;
      //    console.log(this.fileLists);
      //}else{
      //    //如果不是文件夹
      //    let _i = 0;
      //    for(let item of this.fileLists){
      //        if(e.relativePath == item.relativePath){
      //            this.fileLists.splice(_i, 1);
      //            break;
      //        }
      //        _i++;
      //    }
      //    console.log(this.fileLists);
      //}
      this.size = this.$refs.uploader.uploader.getSize();
      //this.size -= e.size / (1024*1024);
      //this.file_percent = (this.size) / (this.size_form*1024) * 100;
      //this.size -= parseInt((e.size / 1048576)) * 100;
      //this.file_percent = (this.size) / (this.size_form * 1024);
    },
    onDrag(e) {
      this.file_len = 0;
      //const loading = this.$loading({
      //  lock: true,
      //  text: 'Loading',
      //  spinner: 'el-icon-loading',
      //  background: 'rgba(0, 0, 0, 0.7)'
      //});
      //setTimeout(() => {
      //    console.log(2);
      //}, 0);
      //console.log(1);
    },
    submit() {
      let data = "";
      let pathName;
      if (this.high_setting_form.localfiles) {
        //打开本地选项
        let rootFile = this.$refs.uploader.uploader.getRoot();
        console.log(rootFile);
        if (rootFile.fileList.length != 1) {
          this.$message({offset:100,
            message: this.$t("work.oneFolder"),
            type: "warning",
          });
          return;
        }
        let filePath = rootFile.fileList[0];
        if (!filePath.isFolder) {
          this.$message({offset:100,
            message: this.$t("work.notFolder"),
            type: "warning",
          });
          return;
        }
        pathName = filePath.name;
      } else {
        pathName = this.upload_disk;
      }
      let data_param = "CardSoon_File=" + pathName;
      if (this.switch_cont) {
        //内容开启 则内容项必须要填写。
        /* delete 2022-06-15*/
        //if (this.$refs.uploader.uploader.getSize() == 0) {
        //    this.$message({offset:100,
        //        message: "请添加内容！",
        //        type: 'warning'
        //    });
        //    return;
        //}
        if (
          !this.$refs.uploader.uploader.isComplete() &&
          !this.high_setting_form.localfiles
        ) {
          this.$message({offset:100,
            message: this.$t("work.uploadFail"),
            type: "warning",
          });
          return;
        }
        /*
                    2022-06-24
                    */
        //选择的是电子光盘，则名称一定要填写
        //if (this.file_form == 1) {
        //    if (this.zip_name == "") {
        //        this.$message({offset:100,
        //            message: this.$t("work.isoNameInput"),
        //            type: 'warning'
        //        });
        //        return;
        //    }
        //    data += "&diskLabel=" + this.zip_name;
        //}
        //选择的是zip文档，则名称一定要填写
        if (this.file_form == 2) {
          if (this.zip_name == "") {
            this.$message({offset:100,
              message: this.$t("work.zipNameInput"),
              type: "warning",
            });
            return;
          }
          data += "&zip_name=" + this.zip_name;
        }
        //选择的是zip加密，名称和密码需要校验
        if (this.file_form == 3) {
          if (this.zip_name == "") {
            this.$message({offset:100,
              message: this.$t("work.zipNameInput"),
              type: "warning",
            });
            return;
          }
          data += "&zip_name=" + this.zip_name;
          if (this.p1 == "" || this.p1 != this.p2) {
            this.$message({offset:100,
              message: this.$t("work.zipPassWrong"),
              type: "warning",
            });
            return;
          }
          data += "&zip_pw=" + this.p1;
        }
        data += "&file_type=" + this.file_form;
      }
      if (this.switch_tag) {
        //标签开启，则标签文件一定要上传
        if (this.$refs.refFile.files.length == 0) {
          this.$message({offset:100,
            message: this.$t("work.pleaseUploadTag"),
            type: "warning",
          });
          return;
        }
        data_param += "&Json_File=" + this.$refs.refFile.files[0].name; //标签不为空给get参数加上json_file
        if (this.$refs.refFile2.files.length != 0) {
          //数据文件不为空给get参数加上udf_File
          data_param += "&Udf_File=file:" + this.$refs.refFile2.files[0].name;
        }
        console.log(this.print_flag, this.fileData.flag);
        if (
          (this.print_flag == 1 && this.fileData.flag != 1) ||
          (this.print_flag == 2 && this.fileData.flag == 3) ||
          (this.print_flag == 3 && this.fileData.flag == 2)
        ) {
          //打印面数print_flag为1 - 双面的时候，模板flag必须为1 - 双面
          //打印面数print_flag为2 - 正 的时候 模板正面必须有内容 (flag != 3)
          //打印面数print_flag为3 - 反 的时候 模板背面必须有内容 (flag != 2)
          this.$message({offset:100,
            message: this.$t("work.print_flagError"),
            type: "warning",
          });
          return;
        }
        data += "&print_flag=" + this.print_flag; //打印面数需要在开启了标签时，1双 2正3背
      }
      if (this.juanbiao_form == "") {
        this.$message({offset:100,
          message: this.$t("work.juanbiaoInput"),
          type: "warning",
        });
        return;
      }
      data += "&label=" + this.juanbiao_form; //卷标
      //校验完毕，拼接剩余参数

      data += "&printCopys=" + this.number; //份数
      data += "&disk_size=" + this.size_form; //容量，512，4，32
      data += "&zone_type=" + this.type_form; //按照界面顺序从0到5
      data += "&hasPrintTask=" + this.switch_tag; //标签开关
      data += "&hasCopyTask=" + this.switch_cont; //内容开关
      data += "&local=" + this.high_setting_form.localfiles; //本地文件开关
      data += "&hash=" + this.high_setting_form.s1; //hash
      data += "&md5=" + this.high_setting_form.s2; //md5
      data += "&print=" + this.high_setting_form.target_work; //目标打印机id，若0则全部
      if (this.high_setting_form.formatFile != 0) {
        data += "&formatFile=" + this.high_setting_form.formatFile; //拷贝前类型
      }
      //let post_data = [];
      //for(let _item of this.fileLists){
      //    post_data.push(_item.relativePath);
      //}
      //console.log(data);
      //console.log(data_param)
      this.$message({offset:100,
        message: this.$t("work.submiting"),
      });
      this.$emit("jobPost");
      this.$axios({
        method: "post",
        url: "/rest/job/?" + data_param + data,
        //data: post_data
      }).then((res) => {});
    },
  },
  computed: {
    file_percent() {
      let t =
        (this.size /
          (((this.size_form * 1000) / 1.024 / 1.024 / 1.024) * 1024 * 1024)) *
        100;
      return t > 100 ? 100.1 : t;
    },
    print_op() {
      return [
        {
          value: 2,
          label: this.$t("work.front"),
        },
        {
          value: 3,
          label: this.$t("work.back"),
        },
        {
          value: 1,
          label: this.$t("work.double"),
        },
      ];
    },
    type() {
      return [
        {
          value: 0,
          label: this.$t("work.diskPart"),
        },
        {
          value: 1,
          label: this.$t("work.cdPart"),
        },
        {
          // -- value: 2,
          //  label: '加密分区'
          //  }, {

          value: 3,
          label: this.$t("work.forbidCopyPart"),
        },
        {
          // -- value: 4,
          //    label: '普普分区'
          //  }, {

          value: 5,
          label: this.$t("work.cdWithDisk"),
        },
      ];
    },
    file_type() {
      return [
        {
          value: 0,
          label: this.$t("work.fileAnd"),
        },
        {
          value: 1,
          label: this.$t("work.eCd"),
        },
        {
          value: 2,
          label: this.$t("work.zip"),
        },
        {
          value: 3,
          label: this.$t("work.passZip"),
        },
        {
          value: 4,
          label: this.$t("work.forbidCopyU"),
        },
      ];
    },
    high_setting() {
      let target_work = this.printerList.map((item) => {
        return {
          value: item.PrinterID,
          label: this.getPrintName(item.PrinterID),
        };
      });
      target_work.push({
        value: 0,
        label: this.$t("work.any"),
      });
      return {
        priority: [
          {
            value: 1,
            label: this.$t("work.low"),
          },
          {
            value: 0,
            label: this.$t("work.normal"),
          },
          {
            value: 2,
            label: this.$t("work.high"),
          },
        ],
        fileSystem: [
          {
            value: 0,
            label: this.$t("work.auto"),
          },
          {
            value: 1,
            label: "FAT32",
          },
          {
            value: 2,
            label: "exFAT",
          },
          {
            value: 3,
            label: "NTFS",
          },
        ],
        target_work: target_work,
        color_type: [
          {
            value: 0,
            label: this.$t("work.any"),
          },
          {
            value: 1,
            label: this.$t("work.sigleColor"),
          },
          {
            value: 2,
            label: this.$t("work.colorful"),
          },
        ],
        formatFile: [
          {
            value: 0,
            label: this.$t("work.auto"),
          },
          {
            value: "FAT",
            label: "FAT",
          },
          {
            value: "FAT32",
            label: "FAT32",
          },
          {
            value: "NTFS",
            label: "NTFS",
          },
          {
            value: "EXFAT",
            label: "EXFAT",
          },
        ],
      };
    },
    bgi() {
      if (this.size != 0) {
        return "";
      }
      return this.$t("work.dropBg");
    },
  },
  watch: {
    switch_cont() {
      if (!this.switch_cont && !this.switch_tag) {
        //转换
        this.switch_tag = true;
      }
    },
    switch_tag() {
      if (!this.switch_cont && !this.switch_tag) {
        //转换
        this.switch_cont = true;
      }
    },
    file_percent(val) {
      if (val == 100.1) {
        this.$message({offset:100,
          message: this.$t("work.sizeExtra"),
          type: "warning",
        });
      }
    },
    file_form: {
      immediate: true,
      handler(val) {
        if (this.filter_rules[val].indexOf(this.type_form) == -1) {
          //现在选择的是不可选择的。
          this.type_form = this.filter_rules[val][0];
        }
        for (let item of this.type) {
          if (this.filter_rules[val].indexOf(item.value) == -1) {
            //设置disable
            this.$set(item, "disabled", true);
          } else {
            //取消disabled
            this.$set(item, "disabled", false);
          }
        }
        if (val == 2 || val == 3) {
          this.zip_name = getNowFormatDate();
          this.p1 = "123";
          this.p2 = "123";
        }
      },
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
}

.file {
  height: 500px;
  width: 100%;
  background-color: #e8e7ee;
  border: #c8cfd7 solid 1px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding: 10px;
  .title {
    float: left;
    font-size: 18px;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
  }
}
.label {
  height: 500px;
  width: 100%;
  background-color: #e8e7ee;
  border: #c8cfd7 solid 1px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding: 10px;

  .title {
    float: left;
    font-size: 18px;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
  }
}

.uploader-example {
  width: 100%;
  margin: 10px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.uploader-example .uploader-btn {
}

.uploader-example .uploader-list {
  max-height: 405px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.uploader-list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.uploader-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c7c7cb;
}
.uploader-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.display {
  margin-top: 10px;
  background-color: #212830;
  height: 240px;
  overflow-x: auto;
  overflow-y: auto;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;

  img {
    background-color: #1e252d;
  }
}

/deep/ .uploader-file-name {
  text-align: left;
}
/deep/ .el-progress-bar__outer {
  background-color: #bac2d7;
}

/deep/ .uploader-file-progress {
  background-color: #b0ee91;
}

.drag-bg {
  background-repeat: no-repeat;
  background-position: center;
}
</style>
