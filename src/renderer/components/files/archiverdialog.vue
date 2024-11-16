<template>
  <div>
    <div class="progress">
      <div class="zip_text" v-if="isFalse" style="color: rgb(245, 31, 31)">
        {{ $t("dialog.compressFailed") }}
      </div>
      <div class="zip_text" v-else-if="isOver" style="color: rgb(103, 194, 58)">
        {{ $t("dialog.compressOver") }}
      </div>
      <div class="zip_text" v-else style="color: rgb(77, 77, 77)">
        {{ $t("dialog.compressing") }}
      </div>

      <el-progress :percentage="percentage" :status="status"></el-progress>
    </div>
    <!-- status="success" -->
    <!-- <el-progress :percentage="100" status="warning"></el-progress>
          <el-progress :percentage="50" status="exception"></el-progress> -->
    <div class="last">
      <div class="text" v-if="isOver || isFalse">
        {{ $t("dialog.closeTips") }}
      </div>
      <div class="text" v-else>{{ $t("dialog.waitTips") }}</div>
      <div class="button">
        <el-button
          type="success"
          @click="changevisiable(false)"
          :disabled="!isOver"
          >{{ $t("dialog.over") }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
let interval;
export default {
  name: "archiverdialog",
  props: {
    isOver: {
      type: Boolean,
    },
    isFalse: {
      type: Boolean,
    },
    changevisiable: {
      type: Function,
    },
  },
  data() {
    return {
      percentage: 0,
      status: "",
    };
  },
  mounted() {
    interval = setInterval(() => {
      this.percentage++;
    }, 250);
  },
  watch: {
    percentage: {
      handler(val) {
        if (this.percentage > 98) {
          clearInterval(interval);
        }
      },
      immediate: true,
      deep: true,
    },
    isOver: {
      handler(val) {
        if (this.isOver) {
          clearInterval(interval);
          this.percentage = 100;
          this.status = "success";
        }
      },
      immediate: true,
      deep: true,
    },
    isFalse: {
      handler(val) {
        if (this.isFalse) {
          clearInterval(interval);
          this.status = "exception";
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .zip_text {
    font-size: 17px;
    font-weight: bold;
  }
  .el-progress {
    width: 80%;
  }
}

.last {
  height: 30px;
  width: 100%;
  margin-top: 35px;
  .button {
    float: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    width: 50%;
    .el-button {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 50px;
    }
  }
  .text {
    line-height: 30px;
    float: left;
    width: 50%;
    font-size: 12px;
    color: gray;
  }
}
</style>
