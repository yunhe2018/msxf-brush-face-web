<template>
    <div>
      <el-dialog
        :title="title"
        :visible.sync="visible"
        @close="$emit('update:show', false)"
        :close-on-click-modal=false
        :before-close="handleClose"
        :show="show">
          <div style="height:420px;" class="dialogAndScrollbar">
              <el-scrollbar style="height:100%;" ref="myScrollbar">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="设备种类" style="margin-bottom: 18px" v-if="changeSix && type === 'modifiy'">
                  <div>{{ruleForm.deviceName}}</div>
                </el-form-item>
                <el-form-item label="设备种类" prop="deviceType" v-else>
                  <el-select size="small" v-model="ruleForm.deviceType" clearable @change="changeType" class="width_305">
                    <el-option v-for="item in this.deviceType" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="设备型号" prop="deviceNorms">
                <el-select v-model="ruleForm.deviceNorms" clearable class="width_305">
                  <el-option v-for="item in this.deviceNorms" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
                </el-select>
              </el-form-item>
                <el-form-item size="small" label="安装位置" prop="deviceAddress">
                  <el-input v-model.trim="ruleForm.deviceAddress" class="width_305"></el-input>
                </el-form-item>
                <el-form-item size="small" label="IP地址" prop="deviceIp">
                  <div v-if="changeSix && type === 'modifiy'">{{ruleForm.deviceIp}}</div>
                  <el-input v-model.trim="ruleForm.deviceIp" class="width_305" v-else></el-input>
                </el-form-item>
                <template v-if="this.changeFive">
                  <el-form-item size="small" label="识别阈值" prop="algorithmDegree">
                    <el-input v-model.trim="ruleForm.algorithmDegree" class="width_305"></el-input>
                  </el-form-item>
                  <!-- <el-form-item size="small" label="陌生人阈值" prop="strangerAlgorithmDegree">
                    <el-input v-model.trim="ruleForm.strangerAlgorithmDegree" class="width_305"></el-input>
                  </el-form-item> -->
                </template>
                <template v-if="changeSix">
                  <el-form-item size="small" label="子网掩码" prop="subnet">
                    <div v-if="type === 'modifiy'">{{ruleForm.subnet}}</div>
                    <el-input v-model.trim="ruleForm.subnet" class="width_305" v-else></el-input>
                  </el-form-item>
                  <el-form-item size="small" label="网关" prop="gateway">
                    <div v-if="type === 'modifiy'">{{ruleForm.gateway}}</div>
                    <el-input v-model.trim="ruleForm.gateway" class="width_305" v-else></el-input>
                  </el-form-item>
                  <el-form-item size="small" label="DNS1" prop="dns1">
                    <div v-if="type === 'modifiy'">{{ruleForm.dns1}}</div>
                    <el-input v-model.trim="ruleForm.dns1" class="width_305" v-else></el-input>
                  </el-form-item>
                  <el-form-item size="small" label="DNS2" prop="dns2">
                    <div v-if="type === 'modifiy'">{{ruleForm.dns2}}</div>
                    <el-input v-model.trim="ruleForm.dns2" class="width_305" v-else></el-input>
                  </el-form-item>
                </template>
                <template v-if="this.changeSix">
                  <el-form-item size="small" label="当前主机时间" style="margin-bottom: 0">
                    <el-date-picker
                      v-model="ruleForm.hostTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :disabled="this.ntpStateBtn"
                      placeholder="选择日期时间">
                    </el-date-picker>
                    <el-button size="small" class="editBtn" :disabled="this.ntpStateBtn" @click="modifyTime">更新时间</el-button>
                  </el-form-item>
                   <el-form-item label="" style="margin-bottom: 18px;line-height: 32px;">
                    <div>注:点击更新时间后，主机时间会实时更新</div>
                   </el-form-item>
                   <el-form-item label="NTP服务" prop="ntpState">
                  <el-radio-group v-model="ruleForm.ntpState" @change="ntpStateChange" class="width_305">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                  </el-form-item>
                  <div style="display: flex;">
                    <el-form-item size="small" label="NTP地址" prop="ntpAddress">
                      <el-input v-model.trim="ruleForm.ntpAddress" class="width_305" :disabled="this.ntpDisabled"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="端口" label-width="50px">
                      <el-input v-model.trim="ruleForm.ntpPort" style="width: 60px" :disabled="this.ntpDisabled"></el-input>
                    </el-form-item>
                  </div>
                </template>
                <el-form-item size="small" label="视频流地址" prop="videoIp" v-if="this.changeTwo">
                  <el-input v-model.trim="ruleForm.videoIp" class="width_305"></el-input>
                </el-form-item>
                <el-form-item size="small" label="备注">
                  <el-input type="textarea" v-model.trim="ruleForm.content" class="width_305" maxlength="100" show-word-limit></el-input>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </div>
          <span slot="footer" class="dialog-footer">
             <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled">提交</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import { getSysDictByParentCode, toUpdateDevice, modifyTime } from '../../axios/api.js'
import { filterObjNull, getFormData } from '../../lib/util.js'
export default {
  name: 'DeviceDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    region: {
      type: Array,
      default: function () {}
    },
    type: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    },
    btnDisabled: {
      type: Boolean
    }
  },
  data () {
    var newReg1 = (rule, value, callback) => {
      console.log(typeof (value))
      if (isNaN(value)) {
        callback(new Error('识别阈值必须为数字'))
      }
      if (value) {
        if (toString(value).indexOf('.') !== -1 && toString(value).substring(value.indexOf('.'), toString(value).length).length > 3) {
          callback(new Error('识别阈值必须小数点后为两位'))
        }
        if (value > 1 || value < 0) {
          callback(new Error('识别阈值不能大于1小于0'))
        } else {
          callback()
        }
      }
    }
    return {
      subdisabled: this.btnDisabled,
      visible: this.show,
      deviceType: this.region,
      changeTwo: false,
      changeOne: false,
      changeFive: false,
      changeSix: false,
      ntpStateBtn: false,
      ntpDisabled: false,
      deviceNorms: [],
      ruleForm: {},
      title: '',
      invalidStatus: true,
      rules: {
        deviceType: { required: true, message: '请选择设备种类', trigger: 'change' },
        deviceNorms: { required: true, message: '请选择设备规格!', trigger: 'change' },
        deviceAddress:
          [{ required: true, message: '请输入安装位置！', trigger: 'blur' },
            { min: 2, max: 30, message: '安装位置长度为2-30个字符', trigger: 'blur' }],
        deviceIp:
          [{ required: true, message: '请输入IP地址！', trigger: 'blur' },
            { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: '请输入正确的IP地址', trigger: 'blur' }],
        videoIp:
          [{ required: true, message: '请输入视频流地址！', trigger: 'blur' },
            { pattern: /(rtsp):\/\/([\w.]+\/?)\S*/, message: '请正确输入rtsp://开头的视频流地址', trigger: 'blur' }],
        // subnet:
        //   [{ required: true, message: '请输入子网掩码！', trigger: 'blur' },
        //     { min: 2, max: 30, message: '子网掩码长度为2-30个字符', trigger: 'blur' }],
        // gateway:
        //   [{ required: true, message: '请输入网关！', trigger: 'blur' },
        //     { min: 2, max: 30, message: '网关长度为2-30个字符', trigger: 'blur' }],
        // dns1:
        //   [{ required: true, message: '请输入DNS1！', trigger: 'blur' },
        //     { min: 2, max: 30, message: 'DNS1长度为2-30个字符', trigger: 'blur' }],
        // dns2:
        //   [{ required: true, message: '请输入DNS2！', trigger: 'blur' },
        //     { min: 2, max: 30, message: 'DNS2长度为2-30个字符', trigger: 'blur' }],
        algorithmDegree: [
          { required: true, message: '请输入识别阈值', trigger: 'blur' },
          { validator: newReg1, trigger: 'blur' }],
        // strangerAlgorithmDegree:
        //   [{ required: true, message: '请输入陌生人阈值！', trigger: 'blur' },
        //     { min: 2, max: 30, message: '陌生人阈值长度为2-30个字符', trigger: 'blur' }],
        ntpState:
          { required: true, message: '请输入NTP服务！', trigger: 'blur' },
        ntpAddress:
          [{ required: true, message: '请输入NTP地址！', trigger: 'blur' },
            { min: 2, max: 30, message: '陌生人阈值长度为2-30个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ntpStateChange (e) {
      if (e === 1) {
        this.ntpStateBtn = true
        this.ntpDisabled = false
      } else {
        this.ntpDisabled = true
        this.ntpStateBtn = false
        this.$nextTick(() => {
        // 移除校验结果
          this.$refs.ruleForm.clearValidate()
        })
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.subdisabled = true
        let data = {
          status: false,
          value: this.ruleForm
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
      })
    },
    changeType (e) {
      if (this.ruleForm.deviceNorms) {
        this.ruleForm.deviceNorms = ''
      }
      if (e === 'deviceType:2') {
        this.changeTwo = true
      } else {
        this.changeTwo = false
      }
      if (e === 'deviceType:1') {
        this.changeOne = true
      } else {
        this.changeOne = false
      }
      if (e === 'deviceType:5') {
        this.changeFive = true
      } else {
        this.changeFive = false
      }
      this.renderDevice(e)
      this.ruleForm = {
        deviceType: e
      }
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    renderDevice (e) {
      let parentCode = ''
      if (e === 'deviceType:6') {
        parentCode = 'deviceNorms6'
      } else {
        let obj = {}
        obj = this.deviceType.find((item) => {
          return item.dictCode === e
        })
        parentCode = 'deviceNorms' + obj.dictValue
      }
      let data = getFormData({
        parentCode: parentCode
      })
      getSysDictByParentCode(data).then(res => {
        if (res.data.success === true) {
          this.deviceNorms = res.data.value
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    handleClose (done) {
      done()
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    modifyTime () {
      let data = {
        time: this.ruleForm.hostTime
      }
      modifyTime(getFormData(data)).then(res => {
        if (res.data.success === true) {
          this.successMessage(res.data.message)
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
    },
    resetRules () {
      if (this.changeSix) { // 当前为‘管理主机’时deviceIp、subnet、gateway、dns1、dns2，非必填。
        this.rules.deviceIp = []
      } else {
        this.rules.deviceIp = [{ required: true, message: '请输入IP地址！', trigger: 'blur' },
          { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: '请输入正确的IP地址',
            trigger: 'blur' }]
      }
    }
  },
  watch: {
    show () {
      this.changeOne = false
      this.changeTwo = false
      this.changeFive = false
      this.changeSix = false
      this.visible = this.show
      this.deviceType = this.region
      if (!this.visible) return
      this.subdisabled = false
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      })
      if (this.type === 'modifiy') {
        this.title = '编辑设备'
        let data = {
          id: this.id
        }
        toUpdateDevice(getFormData(data)).then(res => {
          this.ruleForm = res.data.value
          this.renderDevice(res.data.value.deviceType)
          if (res.data.value.ntpState === 1) {
            this.ntpStateBtn = true
            this.ntpDisabled = false
          } else {
            this.ntpStateBtn = false
            this.ntpDisabled = true
          }
          if (res.data.value.deviceType === 'deviceType:2') {
            this.changeTwo = true
          } else {
            this.changeTwo = false
          }
          if (res.data.value.deviceType === 'deviceType:1') {
            this.changeOne = true
          } else {
            this.changeOne = false
          }
          if (res.data.value.deviceType === 'deviceType:5') {
            this.changeFive = true
          } else {
            this.changeFive = false
          }
          this.invalidStatus = true
          if (res.data.value.deviceType === 'deviceType:6') {
            this.changeSix = true
            // this.changeOne = true
          }
        })
      } else {
        this.ruleForm = {
          isAdmin: 1
        }
        this.title = '新增设备'
        this.invalidStatus = false
        this.changeTwo = false
        this.changeSix = false
        this.changeOne = false
        this.changeFive = false
      }
      this.ruleForm = Object.assign({}, this.ruleForm)
    },
    btnDisabled (newValue) {
      // if (!newValue) {
      //   this.subdisabled = newValue
      // }
      if (this.show) {
        this.subdisabled = newValue
      }
    },
    changeSix () { // 监听this.changeSix，重置rules
      this.resetRules()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .headerUser {
    font-size: 22px;
    border-bottom: 1px solid #E5E7ED;
    height: 30px;
    line-height: 30px;
  }
  .el-form-item /deep/ .el-form-item__content {
    width: 60%;
  }
  /* .el-form-item /deep/ .el-button {
    margin-left: 30%;
  } */
  /* .width_305{
    width:305px;
  } */
</style>
