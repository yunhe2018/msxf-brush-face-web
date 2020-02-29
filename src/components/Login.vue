<template>
  <div class="container-fluid">
    <div class="loginTol row">
        <div class="loginLeft">
            <img v-if="isDefault" class="logo" src="../assets/login/defaultBigLogo.png">
            <img v-else class="logo" :src="apiPrefix + logoInfo.bigLogo">
            <div class="loginText">
                <div class="textTop">{{logoInfo.slogan}}</div>
                <!--logoInfo.id === '2'代表是马上金融，则显示下面txt-->
                <div v-if="logoInfo.id === 2" class="textBottom">银保监会批准持牌金融机构</div>
            </div>
        </div>
        <div class="loginRight">
            <div class="rightTitle">刷脸通管理平台</div>
            <el-form :model="numberValidateForm" ref="numberValidateForm" @submit.native.prevent>
              <el-form-item label="" prop="userInput" :rules="[
                { required: true, message: '用户名不能为空'}
                ]"
              >
                <el-input type="text" placeholder='用户名' class="loginuser width_256" v-model.trim="numberValidateForm.userInput" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="" prop="userInput" :rules="[
                { required: true, message: '密码不能为空'}
                ]"
              >
                <el-input class="loginpassword width_256" type="password" placeholder='密码' v-model.trim="numberValidateForm.loginpassword" autocomplete="off" @change="savePass"></el-input>
            </el-form-item>
            <div class="verifyInput">
              <el-form-item label="" prop="verifyCode" :rules="[
                  { required: true, message: '验证码不能为空'}
                  ]"
                >
                <el-input type="text" v-model.trim="numberValidateForm.verifyCode" class="width_146" @keyup.enter.native="submit('numberValidateForm')"></el-input>
              </el-form-item>
              <img :src="this.verifyCodeImg" class="verifyCodeImg" @click="changeImg"/>
            </div>
                <el-checkbox v-model="checked" class="loginCheck">记住密码</el-checkbox>
            <el-form-item>
                <el-button type="primary" class="loginBtn" @click="submit('numberValidateForm')">立即登录</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
    <div class="logincopy">{{logoInfo.copyright}}  {{logoInfo.icp}}</div>
  </div>
</template>

<script>
import { getLogin, verifyCode, getSysLogoInfo } from '../axios/api.js'
import { getFormData, filterObjNull } from '../lib/util.js'
import consts from '../lib/constant.js'
export default {
  name: 'Login',
  data () {
    return {
      sessionId: '',
      numberValidateForm: {
        userInput: '',
        loginpassword: ''
      },
      checked: true,
      verifyCodeImg: '',
      logoInfo: '',
      apiPrefix: consts.apiPrefix,
      isDefault: false,
      DefaultLogoInfo: {
        id: '1',
        name: '中科金',
        copyright: 'Copyright © 2019 北京中关村科金技术有限公司 版权所有',
        icp: '京ICP备16065273号-4',
        slogan: '让生活更轻松'
      }
    }
  },
  created () {
    this.sessionId = this.$store.state.sessionId
  },
  mounted () {
    this.getLocalStorage()
    this.verifyCode()
    // 获取Logo And Info
    this.getLogo()
  },
  methods: {
    changeImg () {
      this.verifyCode()
    },
    getLocalStorage () {
      this.numberValidateForm.userInput = localStorage.getItem('user') || ''
      this.numberValidateForm.loginpassword = localStorage.getItem('password') || ''
    },
    verifyCode () {
      verifyCode().then(res => {
        let imgUrl = 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        this.verifyCodeImg = imgUrl
      }).catch(res => {
        let message = (res && res.data && res.data.message) || '验证码获取失败'
        this.failMessage(message)
      })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        let userInfo = {userInput: this.numberValidateForm.userInput, loginpassword: this.numberValidateForm.loginpassword}
        if (this.checked) {
          localStorage.setItem('user', userInfo.userInput)
        } else {
          localStorage.removeItem('user')
          localStorage.removeItem('password')
        }
        let data = {
          userName: this.numberValidateForm.userInput,
          passWord: this.numberValidateForm.loginpassword,
          code: this.numberValidateForm.verifyCode
        }
        data = filterObjNull(data)
        getLogin(getFormData(data)).then(res => {
          if (res.data.success === true) {
            sessionStorage.setItem('sessionId', res.data.value.sessionId)
            sessionStorage.setItem('userName', res.data.value.userName)
            sessionStorage.setItem('recordTime', new Date().getTime())
            sessionStorage.setItem('templateId', res.data.value.templateId)
            this.$store.commit('modifySessionId', res.data.value.sessionId)
            // this.$router.push('/home')
            let redirect = this.$route.query.redirect || '/home'
            this.$router.push(redirect)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
            this.verifyCode()
          }
        }).catch(res => {
          this.failMessage('请求失败')
          this.verifyCode()
        })
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    savePass (e) {
      if (this.checked) {
        localStorage.setItem('password', e)
      }
    },
    getLogo () {
      getSysLogoInfo().then(res => {
        if (res.data.code === '1') {
          this.logoInfo = res.data.value
          localStorage.setItem('logoInfo', JSON.stringify(res.data.value))
        } else {
          // localStorage.removeItem('logoInfo')
          if (localStorage.getItem('logoInfo')) {
            this.logoInfo = JSON.parse(localStorage.getItem('logoInfo'))
          } else {
            this.isDefault = true
            this.logoInfo = this.DefaultLogoInfo
          }
        }
      }).catch(erro => {
        if (localStorage.getItem('logoInfo')) {
          this.logoInfo = JSON.parse(localStorage.getItem('logoInfo'))
        } else {
          this.isDefault = true
          this.logoInfo = this.DefaultLogoInfo
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-fluid {
    width: 100%;
    height: 100%;
    background: url(../assets/login/645645645@2x.png) no-repeat;
    background-size: 100% 100%;
    border: 1px solid white;
    position: relative;
}
.loginTol {
    height: 344px;
    display: flex;
    justify-content: center;
    margin-top: 10%;
}
/* login左边logo部分 */
.loginLeft {
    height: 100%;
    width:240px;
    background: url(../assets/login/img_zuotu@2x.png) no-repeat center;
    background-size:cover;
    position: relative;
}
.logo {
    width: 75px;
    position: absolute;
    top: 16px;
    left: 16px;
}
.loginText {
    width: 100%;
    position: absolute;
    bottom: 24px;
    left: 0;
    text-align: center;
    color: #FFFFFF;
}
.textTop {
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 17px;
}
.textBottom {
    opacity: 0.78;
    font-size: 12px;
    line-height: 12px;
}
/* login右边信息录入 */
.loginRight {
  box-sizing: border-box;
  height: 100%;
  width:352px;
  background-image: linear-gradient(-135deg, #FFFFFF 0%, rgba(255,255,255,0.98) 100%);
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.18);
  padding-top: 32px;
  border-radius: 4px;
}
.rightTitle {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #606266;
  letter-spacing: 0;
  line-height: 18px;
  font-weight: bold;
  text-align: center;
}
/* user的input */
.loginuser {
  width: 70%;
  margin: 32px 15% 0 15%;
}
.loginpassword {
  width: 70%;
  margin: 16px 15% 0 15%;
}
.el-form-item /deep/ .el-form-item__error {
  left: 15%;
}
.el-form-item, .is-required {
  margin-bottom: 0;
}
/* check */
.loginCheck {
  margin: 13px 0 13px 15%;
}
/* 立即登录 */
.loginBtn {
  width: 70%;
  margin-left: 15%;
  background: #4C7EE9;
  border-radius: 4px;
  /* font-family: PingFangSC-Medium; */
  font-weight:bold;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 14px;
}
/* 版权 */
.logincopy {
  opacity: 0.45;
  /* font-family: PingFangSC-Regular; */
  font-size: 14px;
  color: #333;
  margin-top: 53px;
  display: flex;
  justify-content: center;
}
.verifyCodeImg {
  width: 88px;
  height: 40px;
  margin-left: 15px;
}
.width_256 {
  width: 256px;
}
.width_146 {
  width: 146px;
  /* margin: 16px 22px 0 15%; */
}
.verifyInput {
  display: flex;
  margin-top: 16px;
  justify-content: center;
}
</style>
