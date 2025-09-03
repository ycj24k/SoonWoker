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
    document.addEventListener("drop", (e) => {
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
    });
    document.addEventListener("dragover", (e) => {
      e.preventDefault();
      // e.stopPropagation();
    });
  },
  methods: {
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
    resume(file_form) {
      //if (file_form == 0) {
      if (1) {
        if (this.isCopy) {
          this.overNumber = 0;
          this.changeProgressvisible(true);
          for (let i in this.filesList) {
            // const path = "D:\\copytest\\1\\" + this.filesList[i].name;
            const path = this.copyPath + this.filesList[i].name;
            console.log(this.copyPath);
            console.log(path);
            copy(
              i,
              path,
              this.filesList[i].folder,
              this.fileBack,
              this.filesList[i]
            );
          }
        } else {
          //2023-04-24修改为所有都只上传文件路径，不需要压缩
          //文件和文件夹
          this.overNumber = 0;
          for (let i in this.filesList) {
            // const path = "D:\\copytest\\1\\" + this.filesList[i].name;
            // copy(i, path, this.filesList[i].folder, this.back, this.filesList[i]);
            this.fileBack(this.filesList[i], true);
          }
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
