<template>
  <div
    class="log"
    @click="unfinger">
    <div class="user">
      <div class="title">{{ $t('login.userLogin') }}</div>
      <div class="user-form">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :rules="rules">
          <el-form-item
            :label="$t('admin.userName')"
            label-position="top"
            prop="name">
            <el-input
              v-model="ruleForm.name"
              size="small"
              @blur="ruleForm.name = $event.target.value.trim()"
              :validate-event="false"></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('work.password')"
            label-position="top"
            prop="pass">
            <el-input
              v-model="ruleForm.pass"
              show-password
              size="small"
              @blur="ruleForm.pass = $event.target.value.trim()"
              :validate-event="false"></el-input>
          </el-form-item>

          <div class="remember">
            <el-checkbox
              v-model="checked"
              class="rememberMe"
              fill="#58c2c5"
              text-color="#58c2c5"
              >{{ $t('login.remberPasss') }}</el-checkbox
            >
          </div>

          <div class="submit">
            <el-button @click="onSubmituser()">{{ $t('login.login') }}</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div
      class="finger"
      :class="{'finger1': input_state}"
      id="finger">
      <div class="title">{{ $t('login.fingerLogin') }}</div>
      <div class="icon">
        <!-- <img src="../assets/picture/finger.png" /> -->
        <finger
          ref="finger"
          :type="2"
          :isHave="false"
          class="finger_box"
          @changeStatus="(e) => input_state = e"
          @over="fingerLogin"
          @judgeOver="judgeOver" />
      </div>
      <!-- <el-button @click="onSubmitfinger()">登录</el-button> -->
    </div>
    <div class="maxtitle">
      <div class="p">{{ $t('login.title1') }}</div>
      <div class="p">{{ $t('login.title2') }}</div>
    </div>
  </div>
</template>

<script>
import finger from './finger.vue'
const { ipcRenderer } = require('electron')
export default {
  name: 'login',
  components: {
    finger
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('addUser.enterUsername')))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('addUser.enterPassword')))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        name: '',
        pass: ''
      },
      input_state: false,
      checked: false,
      rules: {
        name: [{ validator: validateName }],
        pass: [{ validator: validatePass }]
      },
      onClose: false,
      tempUserList: [],
      loginSuccess: false,
      callBackNum: 0,
      fingerLogining: false
    }
  },
  mounted() {
    localStorage.setItem('loginrole', '')
    localStorage.setItem('loginname', '')
    let username = localStorage.getItem('name')
    if (username) {
      this.ruleForm.name = localStorage.getItem('name')
      this.ruleForm.pass = localStorage.getItem('pass')
      this.checked = true
    }

    ipcRenderer.on('end-frp-callback', (event, data) => {
      if (data) {
      } else {
      }
    })

    window.addEventListener('keydown', this.keyDown)
  },
  destroyed() {
    window.removeEventListener('keydown', this.keyDown, false)
  },
  methods: {
    fingerLogin(data) {
      if (this.fingerLogining) {
        return
      }
      console.log(data)
      this.callBackNum = 0
      this.tempUserList = []
      this.loginSuccess = false
      this.fingerLogining = true
      this.$axios({
        method: 'get',
        url: '/user/AllUserInfo'
      })
        .then((res) => {
          this.tempUserList = res.data.userInfoList
          //console.log(datalist);
          for (let i in this.tempUserList) {
            this.$refs.finger.judge(data, this.tempUserList[i].fingerprintValue)
          }
        })
        .catch((e) => {
          this.$message.error(this.$t('login.serviceShut'))
        })
    },
    judgeOver(data) {
      if (this.loginSuccess) {
        return
      }
      if (data.rate >= 0.9) {
        this.loginSuccess = true
        this.$axios({
          method: 'post',
          url: `/user/loginbyhand?fingerprint_value=${data.data2}`
        })
          .then((res) => {
            this.$message({ offset: 100, message: this.$t('login.successLogin'), type: 'success' })
            localStorage.setItem('loginrole', res.data.userRole)
            localStorage.setItem('loginname', res.data.userName)
            this.$router.push({
              path: '/main'
            })
          })
          .catch((e) => {
            this.loginSuccess = false
            this.handFail()
            //console.log(e);
            //if (res.data == 404) {
            //  this.$message.error("登录失败");
            //}
          })
      } else {
        this.callBackNum++
        this.handFail()
      }
    },
    handFail() {
      if (this.callBackNum == this.tempUserList.length) {
        this.fingerLogining = false
        if (!this.onClose) {
          this.onClose = true
          this.$message({
            offset: 100,
            message: this.$t('login.errorFingerlogin'),
            type: 'error',
            onClose: () => {
              this.onClose = false
            }
          })
        }
      }
    },
    onSubmituser() {
      if (this.ruleForm.name == '1') {
        this.setStep()
        this.$router.push({
          path: '/main'
        })
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.checked) {
            localStorage.setItem('name', this.ruleForm.name)
            localStorage.setItem('pass', this.ruleForm.pass)
          } else {
            localStorage.removeItem('name')
            localStorage.removeItem('pass')
          }

          this.$axios({
            method: 'post',
            url: `/user/loginbypassword?user_name=${this.ruleForm.name}&user_password=${this.ruleForm.pass}`
          })
            .then((res) => {
              if (res.data.resultcode === 0) {
                this.$message({ offset: 100, message: this.$t('login.successLogin'), type: 'success' })
                console.log(res.data)
                localStorage.setItem('loginrole', res.data.resultinfo.userRole)
                localStorage.setItem('loginname', res.data.resultinfo.userName)
                this.setStep()
                this.$router.push({
                  path: '/main'
                })
              } else {
                if (res.data.resultcode === 2) {
                  this.$message.error(this.$t('login.serviceOut'))
                  return
                }
                if (res.data.resultcode === -1) {
                  this.$message.error(this.$t('login.errorLogin'))
                  return
                }
                this.$message.error(res.data.resultstr)
              }
            })
            .catch((e) => {
              this.$message.error(e.data.resultstr)
            })
        } else {
          console.log('error user!!')
        }
      })
    },
    setStep() {
      const guideStep = [
        {
          show: false,
          placement: 'right',
          step: this.$t('guide.step1'),
        },
        {
          show: false,
          placement: 'right',
          step: this.$t('guide.step2'),
        },
        {
          show: false,
          placement: 'right',
          step: this.$t('guide.step3'),
        },
        {
          show: false,
          placement: 'left',
          step: this.$t('guide.step4'),
        },
        {
          show: false,
          placement: 'bottom',
          step: this.$t('guide.step5'),
        },
        {
          show: false,
          placement: 'bottom',
          step: this.$t('guide.step6'),
        },
        {
          show: false,
          placement: 'top',
          step: this.$t('guide.step7'),
        },
        {
          show: false,
          placement: 'right',
          step: this.$t('guide.step8'),
        },
        {
          show: false,
          placement: 'bottom',
          step: this.$t('guide.step9'),
        },
        {
          show: false,
          placement: 'bottom',
          step: this.$t('guide.step10'),
        },
        {
          show: false,
          placement: 'right',
          step: this.$t('guide.step11'),
        },
        {
          show: false,
          placement: 'right',
          step: this.$t('guide.step12'),
        },
        {
          show: false,
          placement: 'left',
          step: this.$t('guide.step13'),
        },
        {
          show: false,
          placement: 'bottom',
          step: this.$t('guide.step14'),
        },
        {
          show: false,
          placement: 'top',
          step: this.$t('guide.step15'),
        },
        {
          show: false,
          placement: 'top',
          step: this.$t('guide.step16'),
        },
        {
          show: false,
          placement: 'top',
          step: this.$t('guide.step17'),
        },
      ]
      localStorage.setItem('guideStep', JSON.stringify(guideStep))
      localStorage.setItem('currentStep', 0)
    },
    // 监听回车键执行事件
    keyDown(e) {
      // 回车则执行登录方法 enter键的ASCII是13
      if (e.keyCode === 13) {
        this.onSubmituser() // 需要执行的方法方法
      }
    },
    // onSubmitfinger() {
    //   if (this.$refs.finger.inputed_state) {
    //     this.$router.push({
    //       path: "/main",
    //     });
    //     console.log(" finger!!");
    //   } else {
    //     this.$message({offset:100,
    //       message: "请录入指纹",
    //       type: "warning",
    //     });
    //   }
    // },
    unfinger(event) {
      var sp = document.getElementById('finger')
      if (sp) {
        if (!sp.contains(event.target)) {
          this.$refs.finger.input_state = false
          ipcRenderer.send('end-frp')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.log {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  background-image: url('../assets/picture/01.jpg');
  background-size: 100% 100%;

  .user {
    margin-left: 6%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 260px;
    height: 380px;
    border-radius: 15px;
    box-shadow: 0px 0px 2px grey;
    background-color: white;

    .title {
      height: 10%;
      width: 100%;
      font-size: 25px;
      color: rgb(88, 194, 197);
    }

    .user-form {
      width: 70%;
      height: 65%;
      padding-top: 10%;

      .el-form-item {
        margin-bottom: 0px;

        /deep/.el-form-item__label {
          line-height: 30px;
          color: rgb(212, 212, 212);
          font-size: 13px;
          margin-top: 10px;
        }

        /deep/.el-form-item__content {
          line-height: 25px;
          margin-top: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .el-input {
          /deep/.el-input__inner {
            padding: 10px;
            text-align: left;
            width: 100%;
            height: 100%;
            border: 0;
            padding-bottom: 10px;
            border-bottom: 2px rgb(153, 153, 153) solid;
            border-radius: 0;
            color: rgb(63, 64, 66);
            font-size: 12px;
            font-weight: bold;
            /*
                            letter-spacing: 2px;
                             */
          }
        }
      }

      .remember {
        margin-top: 20px;
      }

      .submit {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        .el-button {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
          color: rgb(88, 194, 197);
          border: 2px rgb(88, 194, 197) solid;
          width: 125px;
          height: 35px;
          font-size: 15px;
          border-radius: 30px;
        }
      }
    }
  }

  .finger {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 260px;
    height: 350px;
    border-radius: 0px 15px 15px 0px;
    box-shadow: 0px 0px 2px grey;
    background-color: rgb(40, 49, 60);

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 10%;
      width: 100%;
      font-size: 25px;
      color: rgb(125, 126, 130);
    }

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 50%;
      margin-top: 10px;

      .finger_box {
      }
    }

    // .el-button {
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   color: rgb(122, 124, 121);
    //   border: 2px rgb(139, 140, 139) solid;
    //   width: 125px;
    //   height: 35px;
    //   font-size: 15px;
    //   border-radius: 30px;
    //   background: rgba(255, 255, 255, 0);
    // }
  }

  .maxtitle {
    color: white;
    font-size: 35px;
    margin-left: 7%;
    width: 500px;

    .p {
      margin-top: 10px;
    }
  }
}

.finger {
  transition: All 0.4s ease-in-out;
  -webkit-transition: All 0.4s ease-in-out;
  -moz-transition: All 0.4s ease-in-out;
  -o-transition: All 0.4s ease-in-out;
}

.finger1,
.finger:hover {
  transform: scale(1.2);
  -webkit-transform: scale(1.2);
  -moz-transform: scale(1.2);
  -o-transform: scale(1.2);
  -ms-transform: scale(1.2);
  border-radius: 15px;
}

// .finger:hover ~ .user{
//     height:45%;
//     background-color: antiquewhite;
// }
</style>
