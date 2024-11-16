<template>
  <div class="form">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      status-icon>
      <el-form-item
        :label="$t('admin.userName')"
        prop="name">
        <el-input
          v-model="form.name"
          @blur="form.name = $event.target.value.trim()"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('work.password')"
        prop="pass1">
        <el-input
          v-model="form.pass1"
          show-password
          @blur="form.pass1 = $event.target.value.trim()"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('work.passwordConfirm')"
        prop="pass2">
        <el-input
          v-model="form.pass2"
          show-password
          @blur="form.pass2 = $event.target.value.trim()"></el-input>
      </el-form-item>
      <!--
      <el-form-item label="描述">
        <el-input type="textarea" :rows="3" v-model="form.text"></el-input>
      </el-form-item>
      -->
    </el-form>

    <div class="finger">
      <finger
        :user_uuid="form.user_uuid"
        :isHave="false"
        @over="fingerChange" />
    </div>

    <div class="bu">
      <el-button
        type="success"
        style="margin-right: 10px"
        @click="submit"
        >{{ $t('index.comfirm') }}</el-button
      >
      <el-button
        type="danger"
        @click="changevisiable(false)"
        >{{ $t('index.cancel') }}</el-button
      >
    </div>
  </div>
</template>

<script>
import finger from './finger.vue'
export default {
  name: 'adduser',
  props: {
    changevisiable: {
      type: Function
    }
  },
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
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('addUser.enterPassword')))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('addUser.enterPassword')))
      } else if (this.form.pass1 != this.form.pass2) {
        callback(new Error(this.$t('addUser.errorPassword')))
      } else {
        callback()
      }
    }
    return {
      form: {
        user_uuid: '',
        name: '',
        pass1: '',
        pass2: '',
        fingerprint_value: '',
        text: ''
      },
      rules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        pass1: [{ validator: validatePass1, trigger: 'blur' }],
        pass2: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.form.user_uuid = new Date().getTime()
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = `/user/Add?user_uuid=${this.form.user_uuid}&user_name=${this.form.name}&user_password=${this.form.pass1}`
          // if (this.form.fingerprint_value) {
          //   url += '&fingerprint_value=' + this.form.fingerprint_value
          // }
          this.$axios({
            method: 'post',
            url: url
          })
            .then((res) => {
              this.$message({ offset: 100, message: this.$t('addUser.addSuccess'), type: 'success' })
              this.changevisiable(false)
            })
            .catch((e) => {
              this.$message.error(this.$t('addUser.errorAdd'))
            })
        } else {
          console.log('error user!!')
        }
      })
      //changevisiable(false);
    },
    fingerChange(val) {
      this.form.fingerprint_value = val
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .el-form {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    .el-form-item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0px;
      margin-bottom: 20px;
      width: 100%;

      /deep/.el-form-item__label {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: black;
        width: 20%;
      }
      /deep/ .el-form-item__content {
        width: 70%;
        .el-input {
          .el-input__inner {
          }
        }
      }
    }
  }

  .finger {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    // margin-top: 20px;
    img {
      width: 70px;
      height: 70px;
    }
    p {
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      color: black;
    }
  }
  .bu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
    width: 100%;
    margin-right: 20px;
    .el-button {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
