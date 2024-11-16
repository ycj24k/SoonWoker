<template>
  <div class="dialog">
    <div class="progress">
      <el-progress
        :percentage="parseInt(fake.progress * 100)"
        :format="format"
      ></el-progress>
      <div class="txt">
        <div class="over">{{ overNumber }}</div>
        <div class="all">/{{ allNumber }}</div>
      </div>
    </div>
    <div class="records">
      <div class="record" v-for="(item, index) in progressList" :key="index">
        <div class="name">{{ item.name }}</div>
        <div class="state">
          <div v-if="item.state === true">{{ $t("dialog.haveOver") }}</div>
          <div v-else>{{ $t("dialog.notOver") }}</div>
        </div>
      </div>
    </div>

    <div class="last">
      <div class="text" v-if="allNumber === overNumber && isSucess">
        {{ $t("dialog.closeTips") }}
      </div>
      <div v-else-if="!isSucess" style="color: red">文件上传失败！！！</div>
      <div class="button">
        <el-button
          ref="btnStop"
          type="success"
          @click="stop()"
          :disabled="overNumber == allNumber || !isSucess"
          >{{ $t("dialog.stop") }}</el-button
        >
        <el-button
          ref="btnOver"
          type="success"
          @click="changevisiable(flase)"
          :disabled="overNumber != allNumber && isSucess"
          >{{ $t("dialog.over") }}</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import FakeProgress from "fake-progress";
export default {
  name: "progressdialog",
  props: {
    list: {
      type: Object | Array,
    },
    overNumber: {
      type: Number,
    },
    allNumber: {
      type: Number,
    },
    changevisiable: {
      type: Function,
    },
    changestate: {
      type: Function,
    },
    isSucess: {
      type: Boolean,
    },
  },
  data() {
    return {
      percentage: 0,
      progressList: [],
      fake: new FakeProgress({}),
      sub: null,
    };
  },
  methods: {
    format(percentage) {
      return;
    },
    getPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? "0" : Math.round((num / total) * 10000) / 10000.0;
    },
    stop() {
      this.changestate(false);
      this.isSucess = false;
      this.$message({offset:100,
        message: this.$t("dialog.haveStop"),
        type: "warning",
      });
    },
  },
  mounted() {
    //const aProgress = this.fake.createSubProgress({
    //          timeConstant: 1000,
    //          end: 0.1,
    //          autoStart: true
    //           })
  },
  watch: {
    overNumber: {
      // 数据发生变化就会调用这个函数
      handler(newVal, oldVal) {
        if (this.sub) {
          this.sub.end();
          //console.log("sub end");
        }
       
        const newlist = [];
        for (let i in this.list) {
          if (this.list[i].state == true) {
            newlist.push(this.list[i]);
          } else {
            newlist.unshift(this.list[i]);
          }
        }
        this.progressList = newlist;
        if (this.overNumber == this.allNumber) {
          return;
        }
        this.sub = this.fake.createSubProgress({
          timeConstant: 10000,
          end: this.getPercent(this.overNumber + 1, this.allNumber),
          autoStart: true,
        });
        //console.log(
        //  "overNumber/allNumber:" +
        //    this.getPercent(this.overNumber + 1, this.allNumber)
        //);
      },
      // 立即处理 进入页面就触发
      immediate: true,
      deep: true,
    },
    isSucess:{
      // 数据发生变化就会调用这个函数
      handler(newVal, oldVal) {
        if(!this.isSucess){
          this.sub.stop();
        }

    },
     // 立即处理 进入页面就触发
     immediate: true,
      deep: true,
  }

  },
};
</script>

<style lang="less" scoped>
.dialog {
}
.progress {
  // border: 1px black solid;
  /deep/ .el-progress-bar {
    width: 97%;
  }
  /deep/.el-progress__text {
    float: right;
  }
  .txt {
    position: absolute;
    top: 55px;
    right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;

    // border: 1px black solid;
    .over {
      // border: 1px black solid;
      color: rgb(103, 194, 58);
      font-size: 16px;
      font-weight: 600;
    }
    .all {
      // border: 1px black solid;
      color: black;
      font-size: 18px;
    }
  }
}

.records {
  max-height: 400px;
  overflow: auto;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c7c7cb;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
}
.record {
  margin-top: 15px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  .name {
  }
  .state {
    margin-right: 20px;
  }
}

.last {
  height: 30px;
  width: 100%;
  margin-top: 15px;
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
