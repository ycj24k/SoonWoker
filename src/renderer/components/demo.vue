<template>

<div>
                                      <div class="brief">
                                                <el-row :gutter="20" style="height: 100%;">
                                                        <el-col :span="12" style="height: 100%;">
                                                                <div class="grid-content bg-purple b_left" style="padding-top:1px !important">
                                                                <br></br><br></br>
                                                                      <p>1、开发接口——进卡、退卡、重置系统和清洁系统</p>
                                                                      <el-button icon="text" @click="move_usbReader()">读卡</el-button>
                                                                      <el-button icon="text" @click="move_Hopper()">退卡</el-button>
                                                                      <el-button icon="text" @click="reset_Printer()">重置系统</el-button>
                                                                      <el-button icon="text" @click="clean_Printer()">清洁系统</el-button>
                                                                </div>
                                                        </el-col>
                                                        <el-col :span="12" style="height: 100%;">
                                                                <div class="grid-content bg-purple b_mid" style="padding-top:1px !important;text-align: left"><br></br>
                                                                        <code>url: "/api/web/movetousbreader" //读卡<br>
                                                                        url: "/api/web/movetohopper" //退卡<br>
                                                                        url: "/api/web/resetprinter" //重置系统<br>
                                                                         url: "/api/web/cleanprinter" //清洁系统<br>
                                                                         url:"/api/web/cmd_getSummary" //获取系统状态<br>
                                                                         url:"/api/web/cspserver.log" //获取当前日志<br>
                                                                         url:"/api/web/cspserver“ //获取完整的日志信息</code>
                                                                </div>
                                                        </el-col>
                                                </el-row>
                                                <br>---------------------------------------------------------------------------------------------------------------</br>
                                                
                                                
                                        </div>


                                        <div class="brief">
                                                <el-row :gutter="20" style="height: 100%;">
                                                        <el-col :span="12" style="height: 100%;">
                                                                <div class="grid-content bg-purple b_left" style="padding-top:1px !important">
                                                                      <p>2、开发接口——打印Demo</p>
                                                                        <el-form ref="form" label-width="120px">
                                                                        <el-form-item label="路径">
                                                                          <el-input v-model="file1"></el-input>
                                                                        </el-form-item>
                                                                        <el-form-item label="CS模板文件名">
                                                                          <el-input v-model="file2"></el-input>
                                                                        </el-form-item>
                                                                        <el-form-item label="CSV文件名">
                                                                          <el-input v-model="file3"></el-input>
                                                                        </el-form-item>
                                                                        <el-form-item>
                                                                          <el-button type="primary" @click="onSubmitprint">提交</el-button>
                                                                        </el-form-item>
                                                                      </el-form>
                                                                </div>
                                                        </el-col>
                                                        <el-col :span="12" style="height: 100%;">
                                                                <div class="grid-content bg-purple b_mid" style="padding-top:1px !important;text-align: left"><br></br>
                                                                      <code>http://localhost:5080/api/rest/job/?CardSoon_File=0713&Json_File=1.soon&Udf_File=file:&print_flag=2&printCopys=1&&hasPrintTask=true&hasCopyTask=false</code><br><br>
                                                                      <code>
                                                                      CardSoon_File: 0713 //在缓存文件夹下的路径名<br>
                                                                      Json_File: 1.soon  //标签名称<br>
                                                                      Udf_File:  //csv字段名称<br>
                                                                      print_flag: 2 //指定打印标签的正反面，其中1是双面，2是正面，3是反面<br>
                                                                      printCopys: 1 //发行数量<br>
                                                                      hasPrintTask: true //是否打印<br>
                                                                      hasCopyTask: false //是否拷贝文件</code>
                                                                </div>
                                                        </el-col>
                                                </el-row>
                                        </div>
<br>---------------------------------------------------------------------------------------------------------------</br>

                                       <div class="brief">
                                                <el-row :gutter="20" style="height: 100%;">
                                                        <el-col :span="12" style="height: 100%;">
                                                                <div class="grid-content bg-purple b_left" style="padding-top:1px !important">
                                                                      <p>3、开发接口——拷贝Demo</p>
                                                                        <el-form ref="form" label-width="120px">
                                                                        <el-form-item label="路径">
                                                                          <el-input v-model="file4"></el-input>
                                                                        </el-form-item>
                                                                        <el-form-item label="卷标">
                                                                          <el-input v-model="file5"></el-input>
                                                                        </el-form-item>
                                                                        <el-form-item label="数量">
                                                                          <el-input v-model="file6"></el-input>
                                                                        </el-form-item>
                                                                        <el-form-item>
                                                                          <el-button type="primary" @click="onSubmitcopy">提交</el-button>
                                                                        </el-form-item>
                                                                      </el-form>
                                                                </div>
                                                        </el-col>
                                                        <el-col :span="12" style="height: 100%;">
                                                                <div class="grid-content bg-purple b_mid" style="padding-top:1px !important;text-align: left"><br></br>
                                                                      <code>
                                                                          http://192.168.3.74:5080/api/rest/job/?CardSoon_File=copydemo&file_type=0&label=2022-06-21&printCopys=1&disk_size=32&zone_type=0&hasPrintTask=false&hasCopyTask=true                   
                                                                     </code><br><br>
                                                                      <code>
                                                                      CardSoon_File: copydemo //在缓存文件夹下的路径名，拷贝文件需要放到该路径下data文件夹中<br>
                                                                      file_type: 0  //烧录内容<br>
                                                                      label: 2022-06-21  //卷标名<br>
                                                                      printCopys: 1 //发行数量<br>
                                                                      disk_size: 32 //U盘容量<br>
                                                                      zone_type: 0 //分区格式<br>
                                                                      hasPrintTask: false  //是否打印<br>
                                                                      hasCopyTask: true  //是否拷贝文件</code>
                                                                </div>
                                                        </el-col>
                                                </el-row>
                                        </div>

<br>---------------------------------------------------------------------------------------------------------------</br>


                                       <div class="brief">
                                                <el-row :gutter="20" style="height: 100%;">
                                                        <el-col :span="12" style="height: 100%;">
                                                                <div class="grid-content bg-purple b_left" style="padding-top:1px !important">
                                                                    <p>4、开发接口——拷贝+打印Demo</p>
                                                                      <el-form ref="form" label-width="120px">
                                                                      <el-form-item label="路径">
                                                                        <el-input v-model="file7"></el-input>
                                                                      </el-form-item>
                                                                      <el-form-item label="CS模板文件名">
                                                                        <el-input v-model="file8"></el-input>
                                                                      </el-form-item>
                                                                      <el-form-item label="CSV文件名">
                                                                        <el-input v-model="file9"></el-input>
                                                                      </el-form-item>
                                                                      <el-form-item>
                                                                        <el-button type="primary" @click="onSubmitprintcopy">提交</el-button>
                                                                      </el-form-item>
                                                                    </el-form>
                                                                </div>
                                                        </el-col>
                                                        <el-col :span="12" style="height: 100%;">
                                                                <div class="grid-content bg-purple b_mid" style="padding-top:1px !important;text-align: left"><br></br>
                                                                      <code>http://localhost:5080/api/rest/job/?CardSoon_File=0619&Json_File=1.soon&Udf_File=file:2.csv&file_type=0&print_flag=2&label=2022-06-19&printCopys=1&disk_size=32&zone_type=0&hasPrintTask=true&hasCopyTask=true
                                                                      </code><br><br>
                                                                      <code>
                                                                      CardSoon_File: 0619  //在缓存文件夹下的路径名<br>
                                                                      Json_File: 1.soon   //标签名称<br>
                                                                      Udf_File: file:2.csv  //csv字段名称<br>
                                                                      file_type: 0 //烧录内容<br>
                                                                      print_flag: 2 //指定打印标签的正反面，其中1是双面，2是正面，3是反面<br>
                                                                      label: 2022-06-19  //卷标名<br>
                                                                      printCopys: 1 //发行数量<br>
                                                                      disk_size: 32 //U盘容量<br>
                                                                      zone_type: 0 //分区格式<br>
                                                                      hasPrintTask: true  //是否打印<br>
                                                                      hasCopyTask: true  //是否拷贝文件</code>
                                                                </div>
                                                        </el-col>
                                                </el-row>
                                        </div>










</div>

</template>
<script>
export
default {
    name: 'demo',
    data() {
      return {
        file1: "",
        file2: "",
        file3: "",
        file4: "",
        file5: "",
        file6: "",
        file7: "",
        file8: "",
        file9: "",
      }
    },
    methods: {
      onSubmitprint (){
        this.$axios({
          method: "post",
          url: "/api/rest/job/?CardSoon_File=" + this.file1 + "&Json_File=" + this.file2 + "&Udf_File=file:" + this.file3 + "&print_flag=2&printCopys=1&&hasPrintTask=true&hasCopyTask=false"
        }).then(res=>{
          this.$message("发送成功");
        })

      },
       onSubmitcopy(){
        this.$axios({
          method: "post",
          url: "/api/rest/job/?CardSoon_File=" + this.file4 + "&file_type=0&label=" + this.file5 + "&printCopys=" + this.file6 + "&disk_size=32&zone_type=0&hasPrintTask=false&hasCopyTask=true"
        }).then(res=>{
          this.$message("发送成功");
        })

      },
      
            onSubmitprintcopy(){
        this.$axios({
          method: "post",
          url: "/api/rest/job/?CardSoon_File=" + this.file7 + "&Json_File=" + this.file8 + "&Udf_File=file:" + this.file9 + "&file_type=0&print_flag=2&label=2022-06-20&printCopys=1&disk_size=32&zone_type=0&hasPrintTask=true&hasCopyTask=true"
        }).then(res=>{
          this.$message("发送成功");
        })

      },
  

        move_usbReader(){
                this.$confirm('此操作将移动卡片到读卡器，请确保卡树系统没有正在工作', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                      
                                        this.$axios({
                                            method: "get",
                                            url: "/api/web/movetousbreader",
                                        });
                   
                        this.$message({offset:100,
                                type: 'success',
                                message: '移动卡片到读卡器成功!'
                        });
                }).catch(() => {
                        this.$message({offset:100,
                                type: 'info',
                                message: '已取消移动'
                        });          
                });

        },

        move_Hopper(){
                this.$confirm('此操作退卡，请确保卡树系统读卡器内有卡片，否则将报错！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                      
                                        this.$axios({
                                            method: "get",
                                            url: "/api/web/movetohopper",
                                        });
                   
                        this.$message({offset:100,
                                type: 'success',
                                message: '退卡成功!'
                        });
                }).catch(() => {
                        this.$message({offset:100,
                                type: 'info',
                                message: '已取消退卡'
                        });          
                });

        },  

        reset_Printer(){
                this.$confirm('此操作将重置卡树硬件系统，请确保现在系统没有正在工作！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                      
                                        this.$axios({
                                            method: "get",
                                            url: "/api/web/resetprinter",
                                        });
                   
                        this.$message({offset:100,
                                type: 'success',
                                message: '重置系统成功!'
                        });
                }).catch(() => {
                        this.$message({offset:100,
                                type: 'info',
                                message: '已取消重置'
                        });          
                });

        },
        clean_Printer(){
                this.$confirm('此操作将清洁卡树系统走卡道，在点击确认前，请先将色带取出，然后将清洁卡放入进卡槽！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                      
                                        this.$axios({
                                            method: "get",
                                            url: "/api/web/cleanprinter",
                                        });
                   
                        this.$message({offset:100,
                                type: 'success',
                                message: '清洁成功!'
                        });
                }).catch(() => {
                        this.$message({offset:100,
                                type: 'info',
                                message: '已取消清洁'
                        });          
                });
 },
        }}
</script>