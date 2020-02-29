<template>
    <div class="screen">
      <el-dialog
        title="屏幕配置"
        :visible.sync="visible"
        class="ruleDialog"
        @close="$emit('update:showModifiy', false)"
        :close-on-click-modal=false
        :before-close="handleClose"
        :showModifiy="showModifiy">
        <div style="height: 380px;width: 100%;">
          <el-scrollbar style="height:100%" ref="myScrollbar">
            <el-form :model="formVal" :rules="rules" ref="formVal" label-width="130px" class="demo-ruleForm">
              <el-form-item label="弹窗时间" prop="remainTime">
                <el-slider v-model="formVal.remainTime" :max="10"></el-slider>
              </el-form-item>
            <el-form-item label="主题选择" prop="greetingTopic">
              <el-radio-group v-model="formVal.greetingTopic" @change="screenChange" :disabled="greetCheck">
                <el-radio :label="0">科技</el-radio>
                <el-radio :label="1">蓝色</el-radio>
                <el-radio :label="2">静谧</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="视频流" prop="videoType">
              <el-radio-group v-model="formVal.videoType">
                <el-radio @click.native.prevent="clickitem('1')" :label="'1'">全屏</el-radio>
                <el-radio @click.native.prevent="clickitem('2')" :label="'2'">缩略图</el-radio>
              </el-radio-group>
            </el-form-item> -->
              <el-form-item label="弹窗样式" prop="popupStyle">
                <el-checkbox v-model="formVal.popupStyle">默认</el-checkbox>
              </el-form-item>
            <el-form-item label="logo上传"  prop="logoImg">
                <el-upload
                accept=".png,.PNG"
                class="screen_logo"
                ref="upload1"
                :action="upload_url1"
                list-type="picture"
                :name="upload_name1"
                :on-exceed="handleExceed1"
                :file-list="logoImg"
                :limit="1"
                :before-remove="beforeRemove1"
                :http-request="uploadSectionFile1">
                  <span class="font-14" style="color: #409EFF">选择文件</span>
                  <div slot="tip" class="el-upload__tip">PNG格式,大小1M内,316*100像素</div>
            </el-upload>
            </el-form-item>
            <el-form-item label="背景图上传" prop="bgImg" style="margin-bottom: 18px">
              <el-upload
              accept=".png,.PNG"
              class="screen_logo"
              ref="upload2"
              :action="upload_url2"
              list-type="picture"
              :name="upload_name2"
              :on-exceed="handleExceed2"
              :limit="1"
              :file-list="bgImg"
              :before-remove="beforeRemove2"
              :http-request="uploadSectionFile2">
                <span class="font-14" style="color: #409EFF">选择文件</span>
                <div slot="tip" class="el-upload__tip">PNG格式,大小6M内,1920*1080像素</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="">
              <el-link type="primary" @click="restClick">重置背景</el-link>
            </el-form-item>
            <el-form-item label="陌生人弹框开关">
              <el-checkbox v-model="formVal.strangerStatus" @change="audioCtrl('strangerStatus')">弹窗</el-checkbox>
              <el-checkbox v-model="formVal.strangerAudio" @change="audioCtrl('strangerAudio')">警示音</el-checkbox>
            </el-form-item>
            <template v-if="this.screenType !== 'attendMng'">
              <el-form-item label="黄名单弹框开关">
                <el-checkbox v-model="formVal.yellowStatus" @change="audioCtrl('yellowStatus')">弹窗</el-checkbox>
                <el-checkbox v-model="formVal.yellowAudio" @change="audioCtrl('yellowAudio')">警示音</el-checkbox>
              </el-form-item>
              <div class="screen_title">VIP设置</div>
              <el-form-item label="欢迎语" prop="welcomeContent">
                  <el-input class="width_305" size="small" v-model.trim="formVal.welcomeContent" maxlength="10" show-word-limit></el-input>
              </el-form-item>
            </template>
            <!-- <el-form-item>
              <el-button size="small" type="primary" @click="submitForm('formVal')">提交</el-button>
            </el-form-item> -->
            </el-form>
            <div class="screen_div" :style="{backgroundImage: 'url(' + this.screenImg + ')', backgroundSize:'100%'}">
              <div class="logoImg">
                <img :src="this.logo_img" class="logo_img" />
                <div class="timeImg">
                  <div class="leftTime">
                    <div class="timeTip">{{this.renderDays(new Date().getDay())}}</div>
                    <div class="timeTip">{{this.renderDay}}</div>
                  </div>
                  <div class="timeTips">{{this.renderTime}}</div>
              </div>
              </div>
              <div class="copyImg">
                <div class="copyTitle">{{poweredBy ? poweredBy : 'Powered by 中科金'}}</div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button  size="small" class="editBtn" @click="restClick">重置配置</el-button>
          <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="btnDisabled">保存</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { imgUpload, toShowScreenConfig, saveScreenConfig } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'

export default {
  name: 'RuleDialog',
  components: {
  },
  props: {
    showModifiy: {
      type: Boolean,
      default: false
    },
    modifiyType: {
      type: String,
      default: ''
    },
    business: {
      type: Object
    },
    screenType: {
      type: String
    }
  },
  data () {
    const poweredBy = (JSON.parse(localStorage.getItem('logoInfo')) || {}).poweredBy ? JSON.parse(localStorage.getItem('logoInfo')).poweredBy : ''
    return {
      btnDisabled: false,
      visible: this.showModifiy,
      screenImg: require('../../assets/images/111.jpg'),
      science: require('../../assets/images/111.jpg'),
      blue: require('../../assets/images/333.png'),
      quiet: require('../../assets/images/222.png'),
      formVal: {},
      rules: {},
      renderTime: new Date().getHours() + ':' + this.getDay(new Date().getMinutes()) + ':' + this.getDay(new Date().getSeconds()),
      renderDay: new Date().getFullYear() + '.' + this.getMonth(new Date().getMonth()) + '.' + this.getDay(new Date().getDate()),
      logImg: require('../../assets/login/defaultBigLogo.png'),
      timeImg: require('../../assets/images/time@2x.png'),
      logo_img: '',
      poweredBy: poweredBy,
      upload_url1: '', // 上传URL
      upload_name1: '', // 图片名称
      ad_url: '', // 上传后的图片URL
      upload_url2: '', // 上传URL
      upload_name2: '', // 图片名称
      ad_url2: '', // 上传后的图片URL
      logoImg: [],
      bgImg: [],
      greetCheck: false,
      tableImgUrl: this.$globalConst.apiPrefix
    }
  },
  created () {
  },
  methods: {
    getMonth (amount) {
      return amount + 1 < 10 ? '0' + (amount + 1) : amount + 1
    },
    getDay (amount) {
      return amount < 10 ? '0' + amount : amount
    },
    renderDays (day) {
      if (day === 1) {
        return '星期一'
      } else if (day === 2) {
        return '星期二'
      } else if (day === 3) {
        return '星期三'
      } else if (day === 4) {
        return '星期四'
      } else if (day === 5) {
        return '星期五'
      } else if (day === 6) {
        return '星期六'
      } else if (day === 0) {
        return '星期日'
      }
    },
    handleClose (done) {
      done()
      this.ad_url1 = ''
      this.ad_url2 = ''
      this.bgImg = []
      this.logoImg = []
      this.$refs['formVal'].clearValidate()
    },
    handleExceed1 () {
      this.$message({
        message: '请先删除选择的图片或视频，再上传',
        type: 'warning'
      })
    },
    uploadSectionFile1 (params) {
      let self = this
      let file = params.file
      let fileType = file.type
      let isImage = fileType.indexOf('image') !== -1
      let fileUrl = self.$refs.upload1.uploadFiles[0].url
      var isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message({
          message: '上传图片大小不能超过 1MB!',
          type: 'warning'
        })
        self.$refs.upload1.uploadFiles = []
        return
      }

      if (!isImage) {
        this.$message({
          message: '请选择图片!',
          type: 'error'
        })
        self.$refs.upload.uploadFiles = []
        return
      }

      var img = new Image()
      img.src = fileUrl
      img.onload = function () {
        if (img.width > 316 || img.height > 100) {
          self.$message({
            message: '图片大小不合适',
            type: 'error'
          })
          self.logoImg = []
          return
        }
        // 图片上传
        self.upload_url1 = ''
        self.upload_name1 = 'file_img[]'
        var reqData = getFormData({
          file: file
        })

        imgUpload(reqData).then(res => {
          if (res.data && res.data.success) {
            self.ad_url1 = res.data.value
            self.logo_img = self.tableImgUrl + res.data.value
          } else {
            this.$message({
              message: '上传失败，请重新上传',
              type: 'error'
            })
            self.$refs.upload1.uploadFiles = []
          }
        }).catch((res) => {
          this.failMessage(res && res.data && res.data.message)
        })
      }
    },
    handleExceed2 () {
      this.$message({
        message: '请先删除选择的图片或视频，再上传',
        type: 'warning'
      })
    },
    uploadSectionFile2 (params) {
      let self = this
      let file = params.file
      let fileType = file.type
      let isImage = fileType.indexOf('image') !== -1
      let fileUrl = self.$refs.upload2.uploadFiles[0].url
      var isLt1M = file.size / 1024 / 1024 < 6
      if (!isLt1M) {
        this.$message({
          message: '上传图片大小不能超过 6MB!',
          type: 'warning'
        })
        self.$refs.upload2.uploadFiles = []
        return
      }

      if (!isImage) {
        this.$message({
          message: '请选择图片!',
          type: 'error'
        })
        self.$refs.upload2.uploadFiles = []
        return
      }

      var img = new Image()
      img.src = fileUrl
      img.onload = function () {
        // console.log(img.width)
        if (img.width > 1920 || img.height > 1080) {
          self.$message({
            message: '图片大小不合适',
            type: 'error'
          })
          self.bgImg = []
          return
        }
        // 图片上传
        self.upload_url2 = ''
        self.upload_name2 = 'file_img[]'
        var reqData = getFormData({
          file: file
        })
        imgUpload(reqData).then(res => {
          if (res.data && res.data.success) {
            self.ad_url2 = res.data.value
            self.screenImg = self.tableImgUrl + res.data.value
            self.formVal.greetingTopic = ''
            self.greetCheck = true
          } else {
            this.$message({
              message: '上传失败，请重新上传',
              type: 'error'
            })
            self.$refs.upload2.uploadFiles = []
          }
        }).catch((res) => { // 请求失败返回的数据
          this.failMessage(res && res.data && res.data.message)
        })
      }
    },
    beforeRemove1 (file, fileList) {
      this.logoImg = []
      this.ad_url1 = ''
      if (localStorage.getItem('logoInfo')) {
        this.logo_img = this.tableImgUrl + JSON.parse(localStorage.getItem('logoInfo')).bigLogo
      } else {
        this.logo_img = this.logImg
      }
    },
    beforeRemove2 (file, fileList) {
      this.bgImg = []
      this.ad_url2 = ''
      this.screenImg = this.science
      this.formVal.greetingTopic = 0
      this.greetCheck = false
    },
    restClick () {
      if (localStorage.getItem('logoInfo')) {
        this.logo_img = this.tableImgUrl + JSON.parse(localStorage.getItem('logoInfo')).bigLogo
        this.poweredBy = JSON.parse(localStorage.getItem('logoInfo')).poweredBy
      } else {
        this.logo_img = this.logImg
        this.poweredBy = 'Powered by 中科金'
      }
      this.screenImg = this.science
      this.logoImg = []
      this.ad_url1 = ''
      this.bgImg = []
      this.ad_url2 = ''
      this.greetCheck = false
      this.formVal = {
        strangerStatus: false,
        strangerAudio: false,
        yellowStatus: false,
        yellowAudio: false,
        // videoType: '',
        remainTime: 3,
        popupStyle: true,
        status: true,
        welcomeContent: '欢迎领导莅临检查',
        greetingTopic: 0
      }
    },
    screenChange (e) {
      // console.log(e)
      if (e === 0) {
        this.screenImg = this.science
      } else if (e === 1) {
        this.screenImg = this.blue
      } else if (e === 2) {
        this.screenImg = this.quiet
      }
    },
    // clickitem (e) {
    //   e === this.formVal.videoType ? this.formVal.videoType = '' : this.formVal.videoType = e
    //   this.formVal = Object.assign({}, this.formVal)
    // },
    submitForm (format) {
      this.btnDisabled = true
      let popupStyle = 0
      let status = 0
      if (this.formVal.popupStyle === true) {
        popupStyle = 0
      } else {
        popupStyle = null
      }
      if (this.formVal.status === true) {
        status = 1
      } else {
        status = 0
      }
      let strangerStatus = ''
      let yellowStatus = ''
      if (this.formVal.strangerStatus) {
        strangerStatus += '1,'
      }
      if (this.formVal.strangerAudio) {
        strangerStatus += '2,'
      }
      if (this.formVal.yellowStatus) {
        yellowStatus += '1,'
      }
      if (this.formVal.yellowAudio) {
        yellowStatus += '2,'
      }
      let data = {
        remainTime: this.formVal.remainTime,
        greetingTopic: this.formVal.greetingTopic,
        popupStyle: popupStyle,
        logoImg: this.ad_url1,
        bgImg: this.ad_url2,
        welcomeContent: this.formVal.welcomeContent,
        businessId: this.business.businessId,
        businessType: this.business.businessType,
        status: status,
        // videoType: this.formVal.videoType,
        strangerStatus: strangerStatus,
        yellowStatus: yellowStatus
      }
      this.logoImg = []
      this.bgImg = []
      data = filterObjNull(data)
      saveScreenConfig(data).then(res => {
        if (res.data.success === true) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.logoImg = []
          this.bgImg = []
          this.$emit('renderScreen', false)
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
          this.logoImg = []
          this.bgImg = []
        }
        this.btnDisabled = false
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
        this.btnDisabled = false
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    toShowScreen () {
      toShowScreenConfig(this.business).then(res => {
        let resData = res.data || {}
        if (resData.success === true) {
          if (resData.value) {
            let result = resData.value
            this.formVal = result
            if (result.popupStyle === 0) {
              this.formVal.popupStyle = true
            } else {
              this.formVal.popupStyle = false
            }
            if (result.status === 1) {
              this.formVal.status = true
            } else {
              this.formVal.status = false
            }
            if (result.bgImg) {
              this.screenImg = this.tableImgUrl + result.bgImg
              this.bgImg = [{url: this.tableImgUrl + result.bgImg}]
              this.ad_url2 = result.bgImg
              this.greetCheck = true
              this.formVal.greetingTopic = ''
            } else {
              this.bgImg = []
              this.greetCheck = false
              if (result.greetingTopic === 0) {
                this.screenImg = this.science
              } else if (result.greetingTopic === 1) {
                this.screenImg = this.blue
              } else if (result.greetingTopic === 2) {
                this.screenImg = this.quiet
              }
            }
            if (result.logoImg) {
              this.logoImg = [{url: this.tableImgUrl + result.logoImg}]
              // this.ad_url1 = this.tableImgUrl + result.logoImg
              this.ad_url1 = result.logoImg
              this.logo_img = this.tableImgUrl + result.logoImg
            } else if (localStorage.getItem('logoInfo')) {
              this.logoImg = []
              this.logo_img = this.tableImgUrl + JSON.parse(localStorage.getItem('logoInfo')).bigLogo
              this.poweredBy = JSON.parse(localStorage.getItem('logoInfo')).poweredBy
            } else {
              this.logoImg = []
              this.logo_img = this.logImg
            }
            if (result.strangerStatus) {
              let strangerStatus = result.strangerStatus.split(',')
              strangerStatus.pop()
              if (strangerStatus.length > 0) {
                this.formVal.strangerStatus = false
                this.formVal.strangerAudio = false
                strangerStatus.map(item => {
                  if (item === '1') {
                    this.formVal.strangerStatus = true
                  }
                  if (item === '2') {
                    this.formVal.strangerAudio = true
                  }
                })
              }
            } else {
              this.formVal.strangerStatus = false
              this.formVal.strangerAudio = false
            }
            if (result.yellowStatus) {
              let yellowStatus = result.yellowStatus.split(',')
              yellowStatus.pop()
              if (yellowStatus.length > 0) {
                this.formVal.yellowStatus = false
                this.formVal.yellowAudio = false
                yellowStatus.map(item => {
                  if (item === '1') {
                    this.formVal.yellowStatus = true
                  }
                  if (item === '2') {
                    this.formVal.yellowAudio = true
                  }
                })
              }
            } else {
              this.formVal.yellowStatus = false
              this.formVal.yellowAudio = false
            }
          } else {
            this.formVal.remainTime = 3
            this.formVal.greetingTopic = 0
            this.formVal.popupStyle = true
            this.formVal.status = true
            this.formVal.welcomeContent = '欢迎领导莅临检查'
          }
          this.formVal = Object.assign({}, this.formVal)
        } else {
          this.failMessage(resData.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },

    audioCtrl (type) { // 警告弹窗不显示时，去掉警告音提示；勾选警告音时，自动勾选警告弹窗
      // 去掉警告弹窗时，需要关闭提示音
      if (type === 'strangerStatus' && !this.formVal.strangerStatus) {
        this.formVal.strangerAudio = false
      }
      if (type === 'yellowStatus' && !this.formVal.yellowStatus) {
        this.formVal.yellowAudio = false
      }
      // 勾选提示音时，自动勾选弹窗
      if (type === 'strangerAudio' && this.formVal.strangerAudio) {
        this.formVal.strangerStatus = true
      }
      if (type === 'yellowAudio' && this.formVal.yellowAudio) {
        this.formVal.yellowStatus = true
      }
    }
  },
  watch: {
    showModifiy () {
      this.visible = this.showModifiy
      this.$nextTick(() => {
        // console.log(this.$refs['myScrollbar'].wrap.scrollTop)
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      })
      if (!this.visible) return false
      if (this.modifiyType === 'manageModifiy') {
        this.bgImg = []
        this.logoImg = []
        this.toShowScreen()
      }
      this.formVal = Object.assign({}, this.formVal)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 输入框的下间距 */
.ruleDialog /deep/ .el-form-item {
  margin-bottom: 32px;
}
.ruleDialog /deep/ .el-form-item__label {
  line-height: 14px;
}
.ruleDialog /deep/ .el-form-item__content {
  line-height: 14px;
}
.ruleDialog /deep/ .el-input--small .el-input__inner {
  margin-top: -9px;
}
/* 滚动条 */
.ruleDialog /deep/ .el-scrollbar__wrap {
  position: relative;
}
.ruleDialog /deep/ .el-dialog {
  width: 856px;
  /* height: 488px; */
}
/* 弹窗时间 */
.ruleDialog /deep/ .el-slider__runway {
  width: 220px;
  background: #EBEEF5;
  border-radius: 3px;
}
.ruleDialog /deep/ .el-slider__button {
  width: 16px;
  height: 16px;
  background-image: linear-gradient(-112deg, #83B5F6 0%, #4C7EE9 100%);
  box-shadow: 0 0 4px 0 #B9B9B9;
  border: none;
}
.ruleDialog /deep/ .el-dialog__body {
  /* display: flex; */
  padding: 24px;
}
.submitRight {
  text-align: right;
}
.tavActive {
  background: #409eff;
  color: #fff;
  font-size: 13px;
}
.el-slider {
  width: 60%;
  height: 14px;
  margin-top: -10px;
}
.el-upload__tip {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #C0C4CC;
  line-height: 4px;
  float: right;
}
.screen_logo /deep/ .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.screen_logo /deep/ .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.screen_logo {
  width: 270px;
}
.screen_title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #303133;
  line-height: 14px;
  width: 130px;
  padding: 0 8px 16px 10px;
}
.screen_div {
  width: 400px;
  height: 225px;
  position: absolute;
  right: 0;
  top: 0;
}
.logoImg {
  /* width: 97px;
  height: 38px;
  margin: 10px;
  padding: 10px;
  box-sizing: border-box;
  background: url('../../assets/images/logo-bg@2x.png') no-repeat;
  background-size: 100%;
  position: relative; */
  display: flex;
  justify-content: space-between;
  margin: 15px 15px 0 15px;
}
.logo_img {
  height: 28px;
  display: inline-block;
}
.leftTime {
}
.timeImg {
    display: flex;
  /* width: 97px;
  height: 68px;
  margin: 10px 0 10px 10px;
  padding: 10px 0;
  box-sizing: border-box;
  background: url('../../assets/images/time@2x.png') no-repeat;
  background-size: 100%;
  position: relative; */
}
.timeTips {
  font-family: DINAlternate-Bold;
  color: #FFFFFF;
  text-align: center;
  font-size: 28px;
  line-height: 29px;
}
.timeTip {
  font-family: PingFangSC-Regular;
  color: #FFFFFF;
  text-align: center;
  font-size: 12px;
  line-height: 14px;
}
.copyImg {
  /* width: 97px; */
  /* height: 27px;
  line-height: 26px; */
  /* margin: 10px 0 10px 10px; */
  /* background: url('../../assets/images/版权bg@2x.png') no-repeat; */
  background-size: 100%;
  position: absolute;
  bottom: 15px;
  left: 35%;
}
.copyTitle {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #FFFFFF;
  text-align: center;
}
</style>
