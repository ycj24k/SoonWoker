<template>
  <div>
    <div class="scanner">
      <div
        class="fingarprint"
        @click="handleFp"
        :class="is_have ? 'fp-over' : input_state ? 'fp-an' : inputed_state ? 'fp-over' : ''"></div>
      <h3 :class="inputed_state ? 'h3-over' : input_state ? 'h3-an' : ''">
        {{ fp_tip }}
      </h3>
      <img
        :src="imgurl"
        v-if="false" />
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron')
export default {
  name: 'finger',
  props: {
    isHave: {
      type: Boolean
    },
    // 1: 录入指纹 2: 验证指纹
    type: {
      type: Number,
      default: 1
    },
    user_uuid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      init_state: null,
      input_state: false,
      inputed_state: false,
      imgdata: '',
      imgurl: '',
      fingerdata: [],
      is_have: false,
      step: 1
    }
  },
  methods: {
    init() {
      ipcRenderer.send('init-frp')
    },
    input() {
      ipcRenderer.send('input-frp')
    },
    ok() {
      ipcRenderer.send('ok-frp', this.imgdata)
    },
    judge(data1, data2) {
      ipcRenderer.send('judge-frp', data1, data2)
      //console.log("judge");
      //console.log(data1, data2);
    },
    judgeBack() {
      ipcRenderer.on('judge-frp-callback', (event, data) => {
        return data
      })
    },
    output() {
      console.log(this.fingerdata)
    },
    handleFp() {
      if (this.type === 2) {
        this.input_state = true
        this.inputed_state = false
        this.$axios({
          method: 'post',
          timeout: 120000,
          url: '/user/loginbyhand'
        })
          .then((res) => {
            this.input_state = false
            if (res.data.resultcode === 0) {
              this.$message({ offset: 100, message: this.$t('login.successLogin'), type: 'success' })
              console.log(res.data)
              localStorage.setItem('loginrole', res.data.resultinfo.userRole)
              localStorage.setItem('loginname', res.data.resultinfo.userName)
              const guideStep = [
                {
                  show: false,
                  placement: 'right',
                  step: this.$t('guide.step1')
                },
                {
                  show: false,
                  placement: 'right',
                  step: this.$t('guide.step2')
                },
                {
                  show: false,
                  placement: 'right',
                  step: this.$t('guide.step3')
                },
                {
                  show: false,
                  placement: 'left',
                  step: this.$t('guide.step4')
                },
                {
                  show: false,
                  placement: 'bottom',
                  step: this.$t('guide.step5')
                },
                {
                  show: false,
                  placement: 'bottom',
                  step: this.$t('guide.step6')
                },
                {
                  show: false,
                  placement: 'top',
                  step: this.$t('guide.step7')
                },
                {
                  show: false,
                  placement: 'right',
                  step: this.$t('guide.step8')
                },
                {
                  show: false,
                  placement: 'bottom',
                  step: this.$t('guide.step9')
                },
                {
                  show: false,
                  placement: 'bottom',
                  step: this.$t('guide.step10')
                },
                {
                  show: false,
                  placement: 'right',
                  step: this.$t('guide.step11')
                },
                {
                  show: false,
                  placement: 'right',
                  step: this.$t('guide.step12')
                },
                {
                  show: false,
                  placement: 'left',
                  step: this.$t('guide.step13')
                },
                {
                  show: false,
                  placement: 'bottom',
                  step: this.$t('guide.step14')
                },
                {
                  show: false,
                  placement: 'top',
                  step: this.$t('guide.step15')
                },
                {
                  show: false,
                  placement: 'top',
                  step: this.$t('guide.step16')
                },
                {
                  show: false,
                  placement: 'top',
                  step: this.$t('guide.step17')
                }
              ]
              localStorage.setItem('guideStep', JSON.stringify(guideStep))
              localStorage.setItem('currentStep', 0)
              this.$router.push({
                path: '/main'
              })
            } else {
              this.$message.error(this.$t(`addUser.fingerCode${res.data.resultcode}`))
            }
          })
          .catch((e) => {
            this.input_state = false
            this.$message.error(res.data.resultstr)
          })
      } else {
        if (this.is_have) {
          this.delete()
        } else {
          this.input_state = true
          this.inputed_state = false
          if (this.step === 1) {
            this.$axios({
              method: 'post',
              timeout: 120000,
              url: `/user/frist_entry_hand?user_uuid=${this.user_uuid}`
            })
              .then((res) => {
                console.log(res)
                this.input_state = false
                if (res.data.resultcode === 0) {
                  this.step++
                  this.$message({ offset: 100, message: this.$t('addUser.fingerSuccess1'), type: 'success' })
                } else {
                  this.$message.error(this.$t(`addUser.fingerCode${res.data.resultcode}`))
                }
              })
              .catch((e) => {
                this.input_state = false
                this.$message.error(res.data.resultstr)
              })
          } else {
            this.$axios({
              method: 'post',
              timeout: 120000,
              url: `/user/second_entry_hand?user_uuid=${this.user_uuid}`
            })
              .then((res) => {
                this.input_state = false
                if (res.data.resultcode === 0) {
                  this.step++
                  this.$message({ offset: 100, message: this.$t('addUser.fingerSuccess2'), type: 'success' })
                } else {
                  this.$message.error(this.$t(`addUser.fingerCode${res.data.resultcode}`))
                }
              })
              .catch((e) => {
                this.input_state = false
                this.$message.error(res.data.resultstr)
              })
          }
        }
      }
    },
    delete() {
      this.$confirm(this.$t('finger.deleteTips'), this.$t('index.tips'), {
        confirmButtonText: this.$t('admin.confirm'),
        cancelButtonText: this.$t('index.cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          timeout: 120000,
          url: `/user/delete_finger?user_uuid=${this.user_uuid}`
        })
          .then((res) => {
            if (res.data.resultcode === 0) {
              this.$message({ offset: 100, type: 'success', message: this.$t('admin.successDeleted') })
              this.is_have = false
              this.$emit('over', '_DELETE_')
            } else {
              this.$message.error(this.$t(`addUser.fingerCode${res.data.resultcode}`))
            }
          })
          .catch((e) => {
            this.$message.error(res.data.resultstr)
          })
      })
    }
  },
  computed: {
    fp_tip() {
      if (this.is_have) {
        return this.$t('finger.deleteFingerclick')
      }
      if (!this.input_state) {
        if (this.type == 2) {
          return this.$t('finger.begingScanclick')
        }
        if (this.type == 1) {
          if (this.step == 1) {
            return this.$t('finger.firstInting')
          }
          if (this.step == 2) {
            return this.$t('finger.点击开始第二次扫描')
          }
        }
      } else {
        return this.$t('finger.scaning')
      }
    }
  },
  mounted() {
    this.is_have = this.isHave
    this.step = 1
    // ipcRenderer.on("init-frp-callback", (event, data) => {
    //   if (data) {
    //     this.init_state = true;
    //   } else {
    //     this.init_state = false;
    //     if (this.init_state != null) {
    //       //防止多次弹出
    //       //this.$message.error("指纹模块初始化失败，请检查接口连接！");
    //     }
    //   }
    // });

    // ipcRenderer.on("input-frp-callback", (event, data1, data2) => {
    //   this.imgdata = data2;
    //   let blob = new Blob([data1], { type: "image/jpeg" });
    //   let url = URL.createObjectURL(blob);
    //   this.imgurl = url;
    //   this.input_state = false;
    //   this.ok();
    // });

    // ipcRenderer.on("ok-frp-callback", (event, data) => {
    //   //特征值提取
    //   this.input_state = false;
    //   this.inputed_state = true;
    //   this.fingerdata.push(data);
    //   this.output();
    // });

    // ipcRenderer.on("judge-frp-callback", (event, data) => {
    //   //监听检测结果
    //   this.$emit("judgeOver", data);
    // });
    // // ipcRenderer.on("judge-frp-callback", (event, data) => {
    // //   console.log(data);
    // // });
    // this.init();
  },

  watch: {
    inputed_state: {
      immediate: true,
      handler(val) {
        if (this.inputed_state) {
          this.$emit('over', this.fingerdata[this.fingerdata.length - 1])
        }
      }
    },
    input_state: {
      immediate: true,
      handler(val) {
        this.$emit('changeStatus', val)
      }
    }
  }
}
</script>
<style scoped>
body {
  position: absolute;
  height: 100%;
  width: 100%;
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background: #d8dee8;
}
body:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(150% 150% at 0% 20%, #d8dee8 20%, #788daf);
}
.scanner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.scanner .fingarprint {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAH5dJREFUeF7tXQmYHUW1Pqfvnck+09WTBAi7LEJA5bGFLHP7hiXIJgio4L4gCIj6FEUEFZVFAZXnwvZwBQQEFZMoBANz6yYhIETxKSiouERCwuR29Z0JSZi5t8/7qu/tnu66vd3JTMjze/V982UyXV1dVadO1Vn+cwrh/0DpHRycAVu37o75/G6oabsBkfzZHQB2AwD3XwJ4BQEqAFAhxIr7O1GFHMeCXK5cHx5+YtWMGYM7+nBxR+xgUQidABYCwCkA8CYA6BmTfhI9hoirSNPW1BHXrOzqem5M2h3DRnYYghSFOAQAikS0CBBPGMMxxjdF9CgBLAbHWVyePv2P2+WbKR95VQlSEOI/AODdCFAEAEmQLGUIADbIHyLaoGnaepK/A2hINJkAprj/Ik5GgMkAsC8A7J2h4aXgOEuwXl9cmjlzfYb641LlVSHIwsHBg+rDw+cj4ocAIBc7MsQ/A9ESBFji1OsbnHx+/UpdF+3ORFGIvRyi+ahp88FxCoB4UEIbVUC8k4aGbijPnPnndr+1rfW3K0EW9Pfvn8vnJRHkz6SYzq8koqUa4rISY09t6wCj3u+tVGbncrkTCeAMIDoq8huIG8lxbpg4NHTDQzvv/PJ49COqze1CELlCAfFDRCQJ0d3SEcQHkOghp15ftr338kKlsggRzwBNk8RpFR6Ifg+IX+eMfW97EGVcCTK/v39WvsER5wPAdHVAiLgMiG4uMXb/9hhs0jeO2bRpp+GhoTMR8VwAeL1al4iWYT7/Bd7VtXo8+zquBCnY9mNINCdiAH2EeHNZ1388noMbTdtziSZ1VqsXgeN8BBB3VdoYBMRPcF3/79G0neWdcSOIlKAQ4DehThA9igA3lQzjjiydezXrHL158671rVs/AgAXAaJ63n2DM/bR8ejfuBHksHXrJk+dNOnXACAlmicJ4KYyY9/dlkEUhSgSAJM/AMA0Iv93+X9ArAGAFFlfBCkOO856LZd7ptTV9afRfrfXsl6vadolQPR2pY1HOGPHjLbduPfGjSDeB3sHB2evmDbtmdF0/JgNG3aqdXaeCAAnAtHxgDhtNO0A4q+B6A7UtAdK3d1/GU0bpmV9BRA/pbz7Emdsp9G096oRpN3OLrTtw8hxjgNNO5aIxnwFAuIDAHA/1/Vb2+1b0bbPISL1/HhlaNMmtnr33be0215U/W3mkAUbN87J5fN7YGfn6tLkyf8abacKtr0IiC5AgFMT2yCSA7cAURoSLf+HSP4+FRBnN7fJGSl9WQOIt7ZLGCmN1Wq1p4BoZ799xP6hwcEDVu++u+zDNpVtIogpxMcB4KvNHizhjElDYFulIEQBEc8HorMSXiwB0QNaPv/zvq6uZ7N8QFqIc7WaPL9OI4A3A8AeMe+NijCmEA8BwHFemwTw/ITOzt5fTZmyLkv/xnzLMi3rbED8UaDhv3PGstiM3FfMjRuPgFxO6ifvi+jc3wGghAActmxZWpo1a+O2DFK+u9C2j6kTnYwAbwWAWRHtrdA07aq+7u5lWb9VFOI+V9sfKU/lEM98RNf/mrUNtd6oOKRg20cjwC+BaIK/QhznC+WeniuydKRgWech4s0tdYmeBoAbuWHcmKWd0dTpffnlXXBo6FwEkApgC2EI4AYtl7uq1NWVaRGYQkgN/r2BvvwBAU4pMSYXVdulbYIUBwcPplptsWJB/SZnTMrsqcUU4osA8Fml4vMIcOPgli03rZk1a3NqI2NQwSXM1q3noaZ9sIUwiH9Ex7k6q74UQZTbOWPvHk032yaIaduSM3x/BQLcWWLsnWkfLxLlqVpdHHwXELcC0dX5XO7Gh7u65CG93cvRQuxZA/gsAnxA/TgRXV82jE9m6VTRtu8morf5dR3nPN7T07Yk1xZBWlY34oOTu7tPewDxlaROF6vVfclxwqZsxOfAcc7hhrEiy4DHu07Rss4ixMubElrwcz/kjL0n7fvFzZt3o6Ghh4Fof7cu4nqq1Y5u11iamSAFId6EAD8PdOwJp7Pz1BVTpryY1NmF1eocx3EeC9VBXI6adnbWfTr4rnTvIsCedYA95b9AtB9o2r5AJLV0gQDCcRxby+WWlnT9ybSJDLU9MDAd6vXLCSBsFiF6kBtGqhfTtO23AFHQPncfZ+wt7fQhE0GaVttfAYCU8WXZRACFMmO/TfpYYXDwQKzVwlo64ne5rrdsD1k6bVrWpwDxK1nqNuv8ExCXg+Msx1ptSWnmzE1Z3i3Y9iVI9GWlbokzJv38icUU4msA8J+BSh/ljH0j7T3veSaCmJZ1KyDKw88tRHR52TCuSvpIsVLZjTRNOph8HwO1IYlFtW1a1lpAlEiT0ZQXSHofc7nFvLtbauvJE2vbUjcKSXsI8IMSY0GJqqWNprVYbl1zmw835ADmPMLYP9K+KZ+nEqRQqcxDTVsVaOzRhbreewWiE/eBOZVK10RNKwPAGwJ1FnPGkrXwtEmyrG8A4kWBanUAeAEQXwCiiU3iS7+L9KUnlXsJ4FtlxmQfY0tTV5IGUr8QwMfKjP1X0nuuWkD0sFcHAb5aYuziMSGIKcTtAOBLUZjLnVLq6lqaOBAhlgDAyYE6mdi9uG7ddJg06eASY6W49qWxEur1iZ35/AsPT50qwQ4tpXnAzpWrlBDnxfhk5Hu35Ts6Lo9rx2vYFIKCH0HEc0q6/p3EObCsW6Dh7AICGNIA5mRxSSdyiNRuHaLl3oeJ6OayYUjtOrYUbftiIrrOr4D4a67rUU6qUBuh94hu5YZxXpYVlaWOtLdpiCegpkkOVdEtfyfHOa/c0yNNIZElUkrUtLfz7u674t6RRlKHKChUfJczlnp2JhLEFOInAHC6+1HEDTXHOXKVYfwzqeOO46xCgJluHaKn6/n86WmANFOIHwLAu4LtcsZSt9MsxAjWmd/fP62jo+MyIrpEfRcRP1nS9evj2jQt6wRA/GXguaXl84W+adOkdSGymAEuaVY4mjPWl9Tv2EGb1eoJ4DjBDnyNM/aJRO6wrJsJ0V/Zrmjb3X13CkctbzGzI57XrhW2HeI09/jPA0Ah9F7KqjeFkOfXiMREdBc3DNVx5TcZwSU/5YwFbV8t3Y4lSMG2b8IGSsQtDuJhK3Q97JINNFesVN5ImjYivRDdzQ3j7KSJKlQqV6CmyYkJlk9wxqToOK7lsCef7Jj6mtdc2eJ0Qnwr1/V7Y1e9ED+Q4D7vOQG8p8yY5PBMXJI2j5EEkaydz+el29M1viHiPSVdTzKPQ0GI5QjgOZQ2E8CCJD2lIMT7ESB0MNbr9aNWTp/++LhSQmm8YNtvRaJ7lD+fzhn7WVQ/CtXqfug4UujwDJPP5Ts6CnGCQW+1eqTmOCNjIrqEG8a1cWOMJEjBst6BiCNAhFzuTbyrS0pOkaUghISDypXjljR9Y6EQpzoAIejPkK5PXo04Jl63dgkaYX3+aw7x+DgzumlZ5wNiUEdJBD0UhFiJAPPdfiE+xHX9+LYIEjSUEdGqsmEsSBqkKcRPoeEEkuW3m7ZsWRBntT2FaPJAtcqB6HCvTYfoDSsM43/ancixrF+wrMsQ8cpAmz/jjDUEmogSEngAhh3HOWRFT08kdqBo258momvcxQrg5AFeE6cotnDIfMvaI48otysP+pK4pxcHBg6get1HjiPRpSXDUM0O/pBM274aiC71uQngjDJjkqCZS3FgYDo5zkJynCMRcSeQP44jY0KedwDWQi63ttzdHRRIMrVtCiHtUL7tKYnTi7Z9OBE94Y8D8ctlXffHFfxgwbJeh4j+giPHOafc0xOpx7QQpGhZHybEb3oNakQL+gwjqKmHBmda1qWAeHWTHet1TZsdJ+aaQkhb0CNeA1lMEaGBNTRgafjL4ipu2zXrYo9zuYcD5plKDnFO3NZVsO27ccTkvs7J5w9ZMW1afwxHSVvgsc15uovreqR01kKQkLMFcQPX9RFnfhTr2vbjQHRk81GidbNo2/cRUUPsI5IGynllw/h92vJdYNssRyQPwnPS6kY8X0Oa9rVyd3fQ3RzbjGnb5wLRLQEOvqHMWNBY6L+7sFo9yXGcoNUidjcpCPFRBLih+fI/OWN7RnUiiiBSImhMMNESbhixq1HV5CFBjm9h8YyGRleWl4NGjF4YiE8A0UoAkCgTqYUfHDVQ6eso63qiQdR7zxRCatiHNf9fcxDnxIn8phBS0ZPxLbL8jjMWGeciA5IIwLeOO7XaYStmzGhRI6IIMgAALiAtTXstWNZ1iOgZzf6Gtj27tPfeW2NYNmSWJqLXp3FH02K8NqK92wng/on5/MqHpk17Kfi898UXZ+QmTpzvHqKIB4TezWiSaeESx7my3NOjup3dpiPE90ht/Aoirc+2JUyogf7XtAt5d3cLdiBEEGm402o13xSQpsSYtv0AEL2xyU0/4obxjihiHGtZ3cOa9iwQeSi/VMvv7Kef7pyx665LgciH2mRZJMHvm4oS5z5DvIbr+mfStj5TiD8EvIdPccZktFdLKb700s5OR8c/EKDT3VQAriwzFkk807Yf9c3yRLdzw2jxu4cIoni8XuGMSZN2bDGFkKuzAUgjuowbRuNwV8pCyzrJQfT3WgJ4b5kxX2+J5CjbvgqIRiYO8TGu656PIW0+/edH2/Y+daIgfPQVp1abF7VdBBstCPF5BPBRNBrisX267pvUFcL7BzYBrCozFqkmmEJIyer9zYXxLNf1MAer/hDFlPFXzpiMz4ssLeIuwJvj4jwKtn0NEn3aa6iOuM9KXX8+tu0GskW6fad4dSbr+sQ0331se9XqUeQ4wbiOOzhjIWOm+q66W0h4UNzhXrSsTxOiq2fIUtP1rlWILSHYphASmeP7Upx8fqYqlYU5JCyHJ/owVP8xadr+5e7uyJg8UwgJZPBWTSKh5YBMxRElwWjt6irqBBeE+BICSBBDY4E6zgmlnp4Hk1hN0Ut+zxlrCeSR7xc3bjyAcrkRXSzGZ2RaVi8g+k6xqD6oBAlOXOIqMi3rWkD0IDIvc8amxg0u6OAhgJ+UGTszZSIkYRvcuQ0++OA3FhFNecW25fgaZwHRddwwVDR7qFtF25ZheDd5f3Q6O2fFgTpMISSwznVXxymUxZdemkodHT7nSAhtSddDgEGVIFLzbJg0Ug4/Rdx7gjPm6SKhQbkHOqLt/THNH+/GYyD+zq+f4bxJIm7wmQJAWMMZ8803UW2Ylcpc0LRHfa5K8JaalvUoIHpnXCzO2RRCAtIbkVlE13LDCPlmVIJIJa0hx8eIZV7nFILEbm9NU8yIg5/oAm4Y/qpTJ0IVOcfSztXONhsYp1zRLvcnmVIU9OI6zpgaDuc2WRSiRABmc9H/mOv6CLhOPdRNIfytggBOLTMmIaORJStBWuw4iG9Lii1UvGxVzpiexAFmpSJjSaQ01s8Zk0Dq2CJ99jRpkm/aQKKLSobxrcT2hZBmo3nNOvErP2hCkv6jmO0tJGkBtOwsKodIJcyF2SDicSVd9/3pLSs5rKHGckjRshYQoo9OTG3XtmVk7qLm91LBEcrCSPVqhnQBgNQQCmWbe5ozFmkJ6LXtMzSi+/x5QlzEdV2Kw6ESsv01FlHD3d0sKkHk6mmEL6f4QLJyiGoyQYCFSagSxb+eGuJg2vYvgEiGvclS5ow1toOYYtr2V4DIPcyJaHPZMHzROuoVs1q9ABzn281nsRzbMk6id0WBtVWHGA4PTwsC+FSCjOyXaVtLRg5petj8rDtpBFHMMZAGdlBW8BbOWCImq7nF+QiT1P4oEFrU9WklxBYEZKFS2R01zQeAEMDFZca8YCaf1qoHEYleVzIMaRVwi0qQYQDINx+8r8TY92NXWkaCLBocnPlKrebjp9ImQD3UEWDvpFgL1dunIR7ep+trErkkjLNKhHr29vcfquXzfnuYyx0YFdXrmnpmzRoBnSNey3W9Bd0yb/36mR0TJozMhyK5hQhSEKKKAF3uYNKkIcu6CxA9P3vLXuhNyAlEEzbbtm9wTCOIitRIq98MlQ5Ca97NGZPgvvhtSwhpdXWtsoj4nZKux5r1ZWicVqv5BsykM9AUQhoPZci2XOmxsFPTtjcAkXd2fIQz5vufVA4JGtQSPYUq8DnKDODNiGnb6z3DYhwrB2cvpEgSfahsGL5/Qp1lNwhzeNhPp4SIV5V03dfII8+FcNTTk5yxI1IIKBeUGy2GALE7h2nbzwDRgc0FHYuYV3SWkCAS5hDbfhBlPHgGQHU7e7Fp278Cooa3LAXLJKuYliUTvnjSjEz8IoNLk1a8vzKzWAKKQnyMAL7ebHCIM+aH5sUQUBon93G7n+BXUQSd33DGPJ9KqNmiEHcQgGcZD/nu1S3rNj+SiEjG+l0YNwuqTJ+kSCoH73OcsdcmTrBt/wiIGpguxF9yXT8ppf6IWRvgD5yx1yXVV7c5qtdnJwXWBCe6maMlEk6ruHRf4IxFIvWLtn0lEV3W7ONvOWOHev1VCRI0OWfRAaQG3gg3TiCgKYSMtPXTatQRjaREZKZlfQYQPe/e85wxd3XGFVMI2bYXzTvMGXN9E7GLqZHT0U+ERo5zVrmnR8Vm+a+HAOdES7lhyFyQLcUUQlpyvVjLGmesI6qekoDA5oy55467/oIvFGz7A0h0W/NvsQe1905RiPulRt/8fywB1YM6bQLUaK1Nut65BlFKgJHFtO1PSruQ9zDNvC/rmUL8DQD2aswCXs113VuxrRMdRsqEVnSwsrKQYKKm9Szr7m5JJlC0bZmlwlMaQ7pW2GNYqRyvaZpvkk46qGVHQk4coq3cMOKyxMkJ8CH9aZJNwbb3RiLfX6LK6uqMmZZ1CiD6Zh4iOqlsGIkwIFMIiUw8TbZFRL8oG0YwfCL0iZByiNjPdT2kXXuVVXcu5fOzy9OmRSbXDJiI4qUs1SmTJnL22vYxWiBcQQM4pI8x31IbWj1B4ADRs9wwWrxlofq2PQRELstrRCf3GcYv4jhEVT4B4OOcMe/QjnxNccbFghOaCy8UX8l1XQPEUMyIrKeiUNLmL6pjIQ5pRj5V/YopFt/ZRJ0zbNtXhmQKvzgRVYXmb9qyZUpSTLoiKn8gLbWTKYQM+nQTaiLRLSXD8IHiUQNXfB2x1tkmQQpuVolmidtCCwMD87BeH8GwOc4i3tPTYs+KW1hu31vYXwip/sts0YkHtc+m4axx3+OMNXzGSlE18FQAXkCmR8RLS7oei4aUnzKFGHEdAGQRSCT0tYGYRKxxXY88gN22BwbmQr3u+0XiFpMK9cmydarz1EoQy7oHED0zdurACkJcjwBe3MgznLHIFKwtGniK6btgWSsR0QUoJ/mzvQEpRsZYlIi/kJTYySFN61kdcQC7BGnkZfFjDbc6TvfjPT0SLhUq6tapAZzWx1gwlDyJORprQ60RVJpkbFw5RWnqFeJULYBkT5KIlFi9xBAv07IWA2JDvMyiTIYhP6lWYhWNEmejkp9XV36c9HT0xo271nM5P0UVIr6lpOsjJvlUckQQRI26TTPWmdXqEeA4/uqp1Wq7rpoxIzJFkYIIjBUfm1uQn9QFER8u6XpD048pphDSsupp9IIzZiTVV/3b0osXF5VbtKyDCdGHvOaHhnZ+eKedWgJOmznrRxI9p0RkRfWvlUOIJpJtS/Oyl3E6JJapjSwcGHitU6/7OQ3rAIesjJO0lJi7JNO6MsGp2reiAxBnTEtbkKYQvrshaTWrqJJcvb7bI9Onv6C2fxhRx1QpHTZLWnRVJoI0V6eEqvQ2NjWMRWrLx739/bto+bzPEUmAMsWGBNjRsUtp6tTIPOtKvEaqkmpWKueCpvlGyA4ifblhjEiMEaM3hfBtVEB0YVxaKHV7ywHsFRffYQohCeIKCFnCp9VuRUZQFYW4nkYO6n9wxhoabURZtH79lFcmTPAdNkh0dskwIgM9TSFGJJvGYX1oXNibGqUUJ/t7XSoIcToCyKhht3QQ7bk8IWK4ufB8f3kSgEFmDKoD+PmvcHh4v9LMmZHJNE0h5JbVwAGkuDAyc0ihWn07Os6d3gtxLOo9N217GIhcx5a05QTt+8GP9tr2oRrRiPOI6ERuGJFpLlpcnQncJL/hpgoM6ApZ0CpmwH9PCQE3x7388qyhoSF/i8J6/cDS9OmRqWdDMB+AtvKcuFwVRSU1aUyatGAKIXNdeYfoFzljamSt+5lj/vWvntqUKcFMbe+Py6mu2HsgyQrgbp2VymxN03ygeNIh7S8kIaRI6oZbJInW8wYHZ3YEvZ6K2zU4h6YQ0l29X7PNSDduzGbj/jk2LNoUQtqS3ByKaUGcIUMd0U3cMC6I+6hpWTJddwPliPgZrus+JjbETZY1X0OUcR9eSQy6VyctDaQhGzVt+x4gcnWupCwVc9euNTqnTvUTrCVutUFvZEp4X+Ytq7kF+Kb4DASR9qsG7hXxXq7rsfiokEZN9E1uGJGpAVUUB8TAavxBEWmmbctkNF7J4soNxpzHWhmaYeIjiqCmHcm7u/34wuDEFoVYSV7ELcDnOGNfSuII9Vksh8iKxWr1LKdWOyAtuaUCpk7U7otCLCUAz+F0bxy4rQVgl82CG9w6E8X1JofcAkRugpgkaXLu2rWTOqdOHckFmcvNi7slwRRiREIda4JkpaySNCANNf9tKX00217BGQunt2g+WDAwsH+uXvdz9DoAp61IMUOYQsj6jRR7GSbDFEKmyfDSPcWGQbv5IqXg0ixJ55Np26u9S2LSIpLb2rKyEsPd3izrQUT0guHTCPIpIPKywv2FM+YegGqRl8AQgHQiuUVDPLNP132xNuodMwD7zJKjKoQBI3qAG4YHuGtpXkHwx2r1QWtEFkBHW1tWVqIULGspInrbUPKWZdtvIyJPT9nEGYtMsK8qnEn6jddPMyA1ybQdJcYSo3aVmJHY2w5UKJNDtGBFTKi4KcTIeTpWYm9WQgQmwve+yYzUSbkJ1aCVuMioudWq0ek4vmSDmvauUnd34r0jQSBzFvRJUFFtZpgLZqvzp0H1E2madlRfd3dkThbTsv7oB5uOlWI4CoLI7DleEE4yh/T3H075vC+hxLmJmwE2QchmrM7iL4wAblcmv+S6HgoYjdkai4C4b0nXPSxBS7UIsNwRcRlPg+aYMTOdtE2QMIoxkSCqApdD3DcqU4KbPmmffXxDHWRITGwKIaNfZeZsWVZyxhr2uG0sang2DQ8fWp45MzIjqymEj8QZM+Niu/1XEOtpYm/osI4LoJd9KAhRR5BKenoAkVvfsi5BxIZnMWNqwSxjVY2LSTH2phDS0LpLs8+JaQCjvp2oh2TprKyj4KISCdK8NWcE+pkQnmBa1mbv/qcs2UBNIWQKDC/5WarXMOv4VK52HOeguMw/pm33A5Eb0pFmcho/goTz+iYSRNV6kyK1gpZTBLi4FAHvDw6qYFkXIqIXERXrTs5KCK+eesGZVqsd0DdjRuQ9JgXLqiKiC1gfExduu511OcSybgR5KUujJG9ZfX15OuQQX8nCmMAWt90ASDuLkmVWKh8ETfMS4MfqOMExSn0n7WqJYqVyFGmaH+ced+4152KEqzNYF9T5HpstKxxXngqMMIWQ0KEG3DMBamRalkwV3kDAZNC8C0K8BwG8mJZEP45ssDgwcDLV626mvHxHx85xafoWCmE6AH4u4aSYFVMIP8YGxgIGNCoOCfuzsxDEd+IkQXyCQahSeooz63t9Vm79eZEzFnWTjj9EBa3+Jc7Y56LG717Pqmn+zTvkOHuUe3qikuKEIKrbDJQbDTGabBq8Ui6dIJa1DhAbkkhCPHwoAQzRNdwwEpPGKIGXFc5Yy3WvwTGGUO0JqTNUqGpSAgEfEZlgyU6a57Hasq6Svo0sZ4hLwLAvOzbswRRCehcbUH3E67iuJ2ZeUCZukDPWiAaLKSEOQbyN67p/4UDonLHtM4nITx07nM/v9KiSFmq0i3lczpCiEFcQgOclTOcQIWT+QS+GIzaFRzCEOQtYbmG1erzjOB5YPEs2Iz/5GBHdUzaMyFS4apbWfC43fbxuBBoTDnHvMszlGpe2RKSLUFeBKcRI1jqA2NxZBSHkTW1umDMRfbtsGB9OWfHBnI6pUKDQlpWAgFdR7QjASoz56ULGijvcjWCsGpNRSXXHmTAEsDoKZhm3dyeJyaZlLZOewsaOhbeUdD0ZQL1x47GUy3ng5tiAGV8IyBhJrCJg4kKjx2Iux4wg7XSmaFnvpGYiYiS6IO42NFMIGfPhRSul3i6gJMxPj1nPSBAVTza0adPksbpqdVzOkHaI4dWV12PL3x+ZPLkFAeivYNu+F4g8K3Lq5VxK5NUAZ6yR3zDLoZ6g0IZsZDKpyrp1E5456KARw+doJiDmnVeFQ7L237SsOwGxkd82BUEpq2yL2Ju4dQoh9ZMveP1eqOu5pBuGso4vqt6OTZBgMGcKmkUOrnn1XeOSFaL13DAaus42coiSNyt16/y3JYhyZcb9nDEvv3zkmE0hZB7FxtURRGu5YcRdSOxWyZpAx60rL3TRtN3H814TdyPYFmqO97tFIW7w7hRMC8yUfQmKp/L25nJ6OHUwCXKq/jTe493hCRLM64iIy0q63sgRHFOKtn2eRCC6jxH/xHW9keZiG7es7UEI7xs7NIdkRYV4gylWqx8mx/ESucRmEfXqt7NlbS+i7NAECabAyGI6UTyGsblGfIIEkpMloU62FzF2+C1LdtAliqbtknRFnTdhQX2BEB8v6/pRSZMpoUYd9foJmMt1U0fHkvLkyZEm9f8nyChnoCiEvFjYAzePGepklN0Z1Ws79JbV7oiKQryXAGSwqCzf54x5CWnabepVq/9vRZAm2lHif/dqhpOlXkL8qs18zIf/F2oOElUgjKUhAAAAAElFTkSuQmCC);
  background-size: 100px 100px;
}
.fp-an::before {
  animation: animate 4s ease-in-out infinite;
}
.fp-an::after {
  animation: animate_line 4s ease-in-out infinite;
}

.fp-over::before {
  height: 0px !important;
}

.scanner .fingarprint::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(data:image/png;base64,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);
  background-size: 100px 100px;
}

@keyframes animate {
  0%,
  100% {
    height: 100%;
  }

  50% {
    height: 0%;
  }
}
.scanner .fingarprint::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #3fefef;
  border-radius: 8px;
  filter: drop-shadow(0 0 20px #3fefef) drop-shadow(0 0 60px #3fefef);
}
@keyframes animate_line {
  0%,
  100% {
    top: 100%;
    height: 3px;
  }
  50% {
    top: 0%;
    height: 3px;
  }
}
.h3-an {
  animation: animate_text 1s steps(1) infinite;
  color: #3fefef !important;
}
.h3-over {
  color: #67c23a !important;
}
.scanner h3 {
  text-transform: uppercase;
  font-size: 1em;
  letter-spacing: 2px;
  margin-top: 20px;
  color: #111;
  filter: drop-shadow(0 0 20px #3fefef) drop-shadow(0 0 60px #3fefef);
}

@keyframes animate_text {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
