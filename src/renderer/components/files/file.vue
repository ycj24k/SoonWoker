<template>
  <div class="files">
    <div class="btn-group" v-show="false">
      <div class="btn" @click="addFolder()" style="color: #67c23a">
        <i class="el-icon-folder" />
        {{ $t("file.addFolder") }}
      </div>
      <div class="btn" @click="addFile()" style="color: #67c23a">
        <i class="el-icon-files" />
        {{ $t("file.addFile") }}
      </div>
    </div>
    <fileEmpty v-if="allNumber == 0" />
    <fileList v-else :list="filesList" :del="delFile" :key="key" />
    <div v-if="progressVisible">
      <el-dialog
        :close-on-click-modal="false"
        width="500px"
        :visible.sync="progressVisible"
        :append-to-body="true"
        class="prodialog"
      >
        <progressdialog
          :list="filesList"
          :overNumber="overNumber"
          :allNumber="allNumber"
          :changevisiable="changeProgressvisible"
          :changestate="changestate"
          :isSucess="isSucess"
          ref="progressdialog"
        ></progressdialog>
      </el-dialog>
    </div>

    <div v-if="archiverVisible">
      <el-dialog
        :close-on-click-modal="false"
        width="500px"
        :visible.sync="archiverVisible"
        :append-to-body="true"
        class="archiverDialog"
        :show-close="false"
      >
        <archiverdialog
          :isOver="archiverIsover"
          :isFalse="archiverIsfalse"
          :changevisiable="changeArchivervisible"
        ></archiverdialog>
      </el-dialog>
    </div>
    <slot></slot>
  </div>
</template>
<script>
const { dialog } = require("@electron/remote");
const fs = require("fs");
const path = require("path");
import fileEmpty from "./fileEmpty";
import fileList from "./fileList";
import progressdialog from "./progressdialog";
import archiverdialog from "./archiverdialog";
import { calcSize, getFileName, isFolder } from "./calc";
import { copy } from "./copy";
import { zip } from "./archiver";

// 网络路径检测工具函数
const isNetworkPath = (path) => {
  // 检测是否为网络路径
  // Windows 网络路径: \\hostname\path 或 \\IP\path
  // Unix 网络路径: //hostname/path 或 //IP/path
  return path.startsWith('\\\\') || path.startsWith('//') || 
         (path.includes(':') && !path.includes('\\') && !path.includes('/'));
};

const extractHostName = (path) => {
  if (path.startsWith('\\\\')) {
    // Windows 网络路径 \\hostname\path
    const parts = path.substring(2).split('\\')
    return parts[0]
  } else if (path.startsWith('//')) {
    // Unix 网络路径 //hostname/path
    const parts = path.substring(2).split('/')
    return parts[0]
  } else if (path.includes(':')) {
    // 可能包含 IP 地址
    const match = path.match(/^([^\\\/:]+)/)
    return match ? match[1] : 'unknown'
  }
  return 'unknown'
};
export default {
  name: "Files",
  props: {
    onSizechange: {
      type: Function,
    },
    complete: {
      type: Function,
    },
    saveWorkList: {
      type: Object | undefined,
    },
  },
  components: {
    fileEmpty,
    fileList,
    progressdialog,
    archiverdialog,
  },
  data() {
    return {
      filesList: {},
      key: 0,
      allSize: 0,
      progressVisible: false,
      archiverVisible: false,
      overNumber: 0,
      allNumber: 0,
      nowstate: true,
      archiverIsover: false,
      archiverIsfalse: false,
      zip_path: "",
      isCopy: false,
      isSucess: true,
      copyPath: "",
      networkPaths: [], // 存储检测到的网络路径
    };
  },
  mounted() {
    // this.$set(this, filesList, this.saveWorkList)
    const _this = this;
    this._handleDrop = (e) => {
      e.preventDefault();
      // e.stopPropagation();
      for (const f of e.dataTransfer.files) {
        const isFolder = _this.dropFolderCheck(f);
        _this.insertList({
          name: getFileName(f.path),
          path: f.path,
          size: isFolder ? -1 : f.size,
          folder: isFolder,
        });

        if (isFolder) {
          calcSize(f.path, _this.folderCalcCallback);
        }
      }
    };
    this._handleDragOver = (e) => {
      e.preventDefault();
      // e.stopPropagation();
    };
    document.addEventListener("drop", this._handleDrop);
    document.addEventListener("dragover", this._handleDragOver);
  },
  beforeDestroy() {
    if (this._handleDrop) {
      document.removeEventListener("drop", this._handleDrop);
      this._handleDrop = null;
    }
    if (this._handleDragOver) {
      document.removeEventListener("dragover", this._handleDragOver);
      this._handleDragOver = null;
    }
  },
  methods: {
    reset() {
      this.filesList = {};
      this.key++;
      this.allSize = 0;
      this.progressVisible = false;
      this.archiverVisible = false;
      this.overNumber = 0;
      this.allNumber = 0;
      this.nowstate = true;
      this.archiverIsover = false;
      this.archiverIsfalse = false;
      this.zip_path = "";
      this.isCopy = false;
      this.isSucess = true;
      this.copyPath = "";
      this.networkPaths = [];
      this.$emit('network-paths-changed', []);
    },
    insertList(f) {
      if (!this.filesList[f.path]) {
        this.allNumber++;
        this.$set(this.filesList, f.path, f);
        if (f.size != -1) {
          // 是文件夹
          this.sizeChange(f.size);
        }
        
        // 检测是否为网络路径
        if (isNetworkPath(f.path)) {
          this.addNetworkPath(f.path);
        }
        
        return true;
      } else {
        //有了，不用加入
        return false;
      }
    },
    addFile() {
      const _this = this;
      dialog
        .showOpenDialog({
          properties: ["multiSelections"],
        })
        .then(async (res) => {
          console.log(res)
          for (const item of res.filePaths) {
            await fs.stat(item, function (err, res) {
              if (err) {
                return false;
              }
              _this.insertList({
                name: getFileName(item),
                path: item,
                size: res.size,
                folder: false,
              });
            });
          }
        });
    },
    addFolder() {
      const _this = this;
      dialog
        .showOpenDialog({
          properties: ["openDirectory", "multiSelections"],
        })
        .then((res) => {
          console.log(res)
          for (const item of res.filePaths) {
            const result = _this.insertList({
              name: getFileName(item),
              path: item,
              size: -1,
              folder: true,
            });
            if (result) {
              calcSize(item, _this.folderCalcCallback);
            }
          }
        });
    },
    folderCalcCallback(err, res, path) {
      if (this.filesList[path]) {
        this.filesList[path].size = res;
        this.$set(this.filesList, path, this.filesList[path]);
        this.sizeChange(this.filesList[path].size);
      }
    },
    delFile(path) {
      this.sizeChange(-this.filesList[path].size);
      delete this.filesList[path];
      this.key++;
      this.allNumber--;
      // 若为网络路径，则同步按主机清理认证项
      if (isNetworkPath(path)) {
        const hostName = extractHostName(path)
        this.networkPaths = this.networkPaths.filter(p => p.hostName !== hostName)
      }
      this.$emit('network-paths-changed', this.getNetworkPaths());
    },
    dropFolderCheck(f) {
      //T是文件夹 F不是文件夹
      //拖放无法从参数判断是否为文件夹，需要额外处理
      if (f.size != 0 && f.size != 4096) {
        //返回大小不是0，则不是文件夹
        return false;
      }
      if (f.type != "") {
        //如果type不是空，则不是文件夹
        return false;
      }
      return isFolder(f.path);
    },
    sizeChange(size) {
      this.allSize = this.allSize + size;
      if (this.allSize <= 0) {
        this.allSize = 0;
      }
      this.onSizechange(this.allSize);
    },
    fileBack(fileList, Sucess) {
      if (Sucess) {
        if (this.nowstate) {
          this.isSucess = true;
          fileList.state = true;
          this.overNumber++;
          if (this.overNumber == this.allNumber) {
            setTimeout(() => {
              this.changeProgressvisible(false);
              this.complete();
            }, 500);
          }
        } else {
          console.log("终止！！！！");
        }
      } else {
        this.isSucess = false;
        if (this.nowstate) {
          fileList.state = false;
        } else {
          console.log("终止！！！！");
        }
      }
    },
    archiverBack(state) {
      if (state) {
        this.archiverIsover = true;
        this.complete();
      } else {
        this.archiverIsfalse = true;
      }

      setTimeout(() => {
        this.changeArchivervisible(false);
      }, 500);
    },
    async resume(file_form) {
      // 统一走优化流程
      const entries = Object.values(this.filesList || {});
      if (entries.length === 0) {
        return;
      }
      if (this.isCopy) {
        // 拷贝到共享目录：确保目标目录存在，顺序执行避免过多并发导致卡顿
        try {
          if (!this.copyPath || typeof this.copyPath !== 'string') {
            console.warn('Invalid copyPath');
            // 回退为直接完成，避免卡住
            entries.forEach((f) => this.fileBack(f, true));
            return;
          }
          // 确保目录以分隔符结尾拼接正确
          const targetDir = this.copyPath;
          try {
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
          } catch (e) {
            console.error('ensure target dir failed', e);
          }
          this.overNumber = 0;
          this.changeProgressvisible(true);

          for (const file of entries) {
            const dest = path.join(targetDir, file.name);
            await new Promise((resolve) => {
              copy(
                file.path,
                dest,
                file.folder,
                (fl, ok) => {
                  this.fileBack(fl, ok);
                  resolve();
                },
                file
              );
            });
          }
        } catch (err) {
          console.error('copy flow error', err);
          // 出错时也推进为完成，避免停滞
          entries.forEach((f) => this.fileBack(f, false));
        }
      } else if (file_form == 1) {
        //电子光盘
      } else if (file_form == 2) {
        //zip
        this.archiverIsover = false;
        this.archiverIsfalse = false;
        this.zip_path = "D:/archivertest/1.zip";
        zip(this.filesList, this.zip_path, this.archiverBack, false);
      } else if (file_form == 3) {
        //加密zip
        this.archiverIsover = false;
        this.archiverIsfalse = false;
        this.zip_path = "D:/archivertest/2.zip";
        let password = "123456";
        zip(this.filesList, this.zip_path, this.archiverBack, true, password);
      } else if (file_form == 4) {
        //u盘
      } else {
        // 默认路径上传：不实际拷贝，仅回调推进流程
        this.overNumber = 0;
        for (const file of entries) {
          this.fileBack(file, true);
        }
      }
    },
    changeProgressvisible(visiable) {
      this.progressVisible = visiable;
    },
    changeArchivervisible(visiable) {
      this.archiverVisible = visiable;
    },
    changestate(state) {
      this.nowstate = state;
    },
    getLists() {
      return this.filesList;
    },
    
    // 添加网络路径到列表（按主机去重，仅认证根目录，如 \\\\NAS）
    addNetworkPath(path) {
      const hostName = extractHostName(path);
      const existingIndex = this.networkPaths.findIndex(p => p.hostName === hostName);

      if (existingIndex === -1) {
        // 尝试从本地存储获取已保存的认证信息
        let userName = '';
        let password = '';

        try {
          const stored = localStorage.getItem('networkCredentials');
          if (stored) {
            const credentials = JSON.parse(stored);
            if (credentials[hostName]) {
              userName = credentials[hostName].userName;
              password = credentials[hostName].password;
            }
          }
        } catch (error) {
          console.log('无法获取已保存的认证信息');
        }

        // 仅保存根路径用于展示与认证
        const rootPath = `\\\\${hostName}`;
        this.networkPaths.push({
          path: rootPath,
          hostName: hostName,
          userName: userName,
          password: password
        });
        this.$emit('network-paths-changed', this.getNetworkPaths());
      }
    },
    
    // 获取网络路径列表（按主机去重，返回根路径）
    getNetworkPaths() {
      const uniqueByHost = {};
      for (const item of this.networkPaths) {
        if (!uniqueByHost[item.hostName]) {
          uniqueByHost[item.hostName] = {
            path: `\\\\${item.hostName}`,
            hostName: item.hostName,
            userName: item.userName || '',
            password: item.password || ''
          };
        }
      }
      return Object.values(uniqueByHost);
    },
    
    // 检查是否有网络路径
    hasNetworkPaths() {
      return this.networkPaths.length > 0;
    },
    
    haveFolderIsCalc() {},
  },
  computed: {},
  watch: {},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.prodialog {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.archiverDialog {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  /deep/.el-dialog__header {
    padding: 10px;
  }
}

.files {
  width: 100%;
  background-color: #f5f5f5;
  margin: 10px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
  height: 375px;
}

.btn-group {
  height: 30px;
  background-color: #e7e7ec;

  .btn {
    color: #53809f;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;

    &:hover {
      background-color: #dfdfe4;
    }

    &:active {
      background-color: #d1d1d7;
    }
  }
}
</style>
