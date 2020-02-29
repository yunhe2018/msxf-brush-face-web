<template>
  <div id="logooption">
    <h3 class="title">项目标识设置</h3>
    <div id="passwordBox" class="box" v-if="!isVerify">
      <el-form ref="pwd-form" :model="pwdForm" label-width="100px" @submit.native.prevent>
        <el-form-item
          label="请输入密码"
          prop = "pwd"
          :rules="[
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]"
        >
          <el-input placeholder="请输入密码" type="password" autocomplete="off" v-model="pwdForm.pwd" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('pwd-form')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="logoBox" class="box" v-if="isVerify">
      <el-form label-width="100px">
        <el-form-item label="品牌主体">
          <el-radio-group v-model="logoId">
            <el-radio :label="1">中科金</el-radio>
            <el-radio :label="2">马上消费金融</el-radio>
            <el-radio :label="3">有限元</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSysLogoRecord">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getFormData } from '../../lib/util'
import { loginLogo, saveSysLogoRecord } from '../../axios/api'
export default {
  name: 'Logooption',
  data () {
    return {
      pwdForm: {
        pwd: ''
      },
      logoId: 1,
      isVerify: false
    }
  },
  methods: {
    verifyLogin () {
      let reqData = getFormData({
        password: this.pwdForm.pwd
      })
      loginLogo(reqData)
        .then(res => {
          if (res.data.success) {
            this.isVerify = true
            if (res.data.value) {
              this.logoId = res.data.value.logoId
            }
          } else {
            this.failMessage(res.data.message)
          }
        })
        .catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    saveSysLogoRecord () {
      let reqData = {
        logoId: this.logoId
      }
      saveSysLogoRecord(reqData)
        .then(res => {
          if (res.data.success) {
            this.successMessage(res.data.message)
          } else {
            this.failMessage(res.data.message)
          }
        })
        .catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.verifyLogin()
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
    }
  }
}
</script>

<style sceoped>
html,
body {
  height: 100%;
  overflow: hidden;
  padding: 30px;
}
.title {
  margin-bottom: 30px;
}
label {
  padding: 0;
}
.el-input {
  width: 256px;
}

#logooption{
  background-color:#edeff4;
  padding:20px;
  border:solid 1px #ccc;
}
.loading{
  text-align: center;
  padding:30px;
}
</style>
