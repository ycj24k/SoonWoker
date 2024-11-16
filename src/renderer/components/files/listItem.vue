<template>
  <div class="listItem">
    <div class="item-body">
      <el-row :gutter="10" class="row">
        <el-col class="col file-name" :span="16">
          <img :src="getIcon(info.name)" class="icon" />
          <div class="name">{{ info.name }}</div>
        </el-col>
        <el-col class="col file-size" :span="5">{{
          getSize(info.size)
        }}</el-col>
        <el-col class="col file-delete" :span="3">
          <i class="el-icon-close close" @click="del(info.path)"></i>
        </el-col>
      </el-row>
      <div></div>
    </div>
  </div>
</template>
<script>
import folder from "../../assets/files/folder.png";
import pdf from "../../assets/files/pdf.png";
import compress from "../../assets/files/compress.png";
import unknown from "../../assets/files/unknown.png";
import { bytesToSize, getExtension } from "./calc";
const types = { compress: ["zip", "rar", "7z"], pdf: ["pdf"] };
export default {
  name: "listItem",
  props: {
    info: {
      type: Object,
    },
    del: {
      type: Function,
    },
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.info);
  },
  methods: {
    getSize(size) {
      if (size == -1) {
        return this.$t("file.calculate");
      }
      return bytesToSize(size);
    },
    getIcon(name) {
      if (this.info.folder) {
        return folder;
      }
      console.log(getExtension(name));
      const ext = getExtension(name);

      let icon = unknown;
      for (const typeName in types) {
        if (types[typeName].indexOf(ext) != -1) {
          //属于这个分类
          icon = this.typeToObj(typeName);
          break;
        }
      }
      return icon;
    },
    typeToObj(typeName) {
      if (typeName == "compress") {
        return compress;
      } else if (typeName == "pdf") {
        return pdf;
      } else if (typeName == "unknown") {
        return unknown;
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.listItem {
  height: 50px;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}
.item-body {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #cdcdcd;
}
.row {
  height: 100%;
}
.col {
  height: 100%;
}
.file-name {
  padding-left: 20px !important;
  display: flex;
  align-items: center;
  .icon {
    width: 30px;
    height: 30px;
  }
  .name {
    font-size: 14px;
    margin-left: 10px;
  }
}
.file-size {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.file-delete {
  display: flex;
  align-items: center;
  .close {
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
    &:hover {
      color: red;
    }
  }
}
</style>
