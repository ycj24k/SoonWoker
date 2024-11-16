<template>
<div style="width:500px;height:auto">
  <el-form ref="form" label-width="120px">
  <el-form-item label="拷贝路径">
    <el-input v-model="file1"></el-input>
  </el-form-item>
  <el-form-item label="CS模板文件名">
    <el-input v-model="file2"></el-input>
  </el-form-item>
  <el-form-item label="CSV文件名">
    <el-input v-model="file3"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">提交</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
import work from "./work"
export
default {
    name: 'Test',
    data() {
      return {
        file1: "",
        file2: "",
        file3: "",
      }
    },
    methods: {
      onSubmit(){
        this.$axios({
          method: "get",
          url: "/api/rest/job/?CardSoon_File=" + this.file1 + "&Json_File=" + this.file2 + "&Udf_File=file:" + this.file3 + "&file_type=0&print_flag=2&label=1970-01-01&printCopys=1&disk_size=32&zone_type=0&hasPrintTask=true&hasCopyTask=true"
        }).then(res=>{
          this.$message("发送成功");
        })
/*
http://localhost:8080/api/rest/job/?CardSoon_File=20220619144836-WEB-3enb0btn094&Json_File=0605.cs&Udf_File=file:0605%20-%20%E5%89%AF%E6%9C%AC.csv&file_type=0&print_flag=2&label=2022-06-19&printCopys=1&disk_size=32&zone_type=0&hasPrintTask=true&hasCopyTask=true
CardSoon_File: 20220619144836-WEB-3enb0btn094
Json_File: 0605.cs
Udf_File: file:0605 - 副本.csv
file_type: 0
print_flag: 2
label: 2022-06-19
printCopys: 1
disk_size: 32
zone_type: 0
hasPrintTask: true
hasCopyTask: true
        */
      }
  },

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.wLog{
    max-height: 600px;
    overflow: auto;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.left{
  background-color: #E8E7EE;
  height: 100%;
  padding: 20px 5px;
  border-right: #B8B8B8 solid 1px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  .title {
    color: #999999;
    font-size: 28px;
  }
  .card{
    background-color: #F5F5F5;
    height: 50px;
    line-height: 55px;
    color: #3A3A3A;
    border: #B8B8B8 solid 1px;
    margin-top: 10px;
  }
}

.mid{
  background-color: #F5F5F5;
  height: 100%;
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  overflow-y: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
      background   : #C7C7CB;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background   : #ededed;
    }
  .title{
    font-size: 32px;
    .add{
      float: left;
    }
  }
  .brief{
    height: 300px;
    width: 100%;
    background-color: #FFFFFF;
    box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;

    .item{
      margin-top: 12px;
    }
    .b_title{
      position: absolute;
      font-weight: bold;
    }
    .b_left{
      position: relative;
      height: 100%;
      border-right: #B8B8B8 solid 1px;
      text-align: left;
    }
    .b_mid{
      position: relative;
      height: 100%;
      text-align: left;
      //border-right: #B8B8B8 solid 1px;
    }
    .b_right{
      position: relative;
      height: 100%;
    }
  }
  .work{
    height: 550px;
    width: 100%;
    background-color: #FFFFFF;
    box-shadow: 6px 3px 11px 0px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    .w_title{
      font-size: 24px;
      font-weight: bold;
      text-align: left;
      .w_right{
    float: right;
      }
    }
  }
}
.right{
  background-color: #C8CFD7;
  height: 100%;
  padding: 20px 10px;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  .title{
    color: #999999;
    font-size: 28px;
  }
  .log{
    padding: 20px;
    font-size: 18px;
    background-color: #e2e2e2;
    border: #B8B8B8 solid 1px;
    color: #333333;
    margin-top: 10px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
}

.c_log{
    height: 410px;
    border-top: #dddddd solid 1px;
    border-bottom: #dddddd solid 1px;
    margin-top : 20px;
    padding: 20px;
    text-align : left;
    color: #999999;
    overflow-y : auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
      background   : #C7C7CB;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background   : #ededed;
    }
}

/deep/ .el-dialog__body{
  padding: 30px 20px 30px !important;
}
</style>
