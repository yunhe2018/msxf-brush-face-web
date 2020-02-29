<template>
  <div>
    <el-dialog
          :title="title"
          :visible.sync="visible"
          @close="$emit('update:show', false)"
          :before-close="handleClose"
          :close-on-click-modal=false
          :show="show">
          <div style="height:420px;" class="dialogAndScrollbar">
            <el-scrollbar style="height:100%;" ref="myScrollbar">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="签到设备类型" prop="mbType">
                  <el-radio-group v-model="ruleForm.mbType">
                    <!-- <el-radio :label="0">配合式</el-radio> -->
                    <el-radio :label="1">非配合式</el-radio>
                  </el-radio-group>
                </el-form-item>
               <el-form-item label="签到设备名称" prop="mbName">
                  <el-input size="small" v-model.trim="ruleForm.mbName" class="width_305"></el-input>
               </el-form-item>
               <el-form-item label="识别主机" prop="dataIp">
                    <el-select size="small" v-model="ruleForm.dataIp" clearable class="width_305" @change="hostIpsChange">
                      <el-option v-for="(item, index) in this.dataIp" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                    </el-select>
                 </el-form-item>
               <template v-if="this.ruleForm.mbType === 0">
                 <el-form-item label="智能一体机" prop="integratedIp">
                    <el-select size="small" v-model="ruleForm.integratedIp" clearable class="width_305">
                      <el-option v-for="(item, index) in this.integratedIp" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                    </el-select>
                 </el-form-item>
                 <el-form-item label="识别机制" prop="identifyStatus">
                  <el-radio-group v-model="ruleForm.identifyStatus">
                    <!-- <el-radio :label="0">前端识别</el-radio> -->
                    <el-radio :label="1">后端识别</el-radio>
                  </el-radio-group>
                </el-form-item>
               </template>
               <template v-if="this.ruleForm.mbType === 1">
                 <el-form-item label="摄像头" prop="cameraIds">
                    <el-select size="small" v-model="ruleForm.cameraIds" clearable class="width_305" @change="cameraIdsChange">
                      <el-option :disabled="item.disabled" v-for="(item, index) in this.cameraIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                    </el-select>
                    <el-radio-group v-model="ruleForm.videoType" prop="videoType" :rules="{ required: true, message: '请选择视频流', trigger: 'change' }">
                      <el-radio :label="0">视频流</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-for="(item, index) in this.ruleForm.cameraIdsAmount"  label="" :key="item.key" :prop="'cameraIdsAmount.' + index + '.value'" :rules="{ required: true, message: '请选择摄像头', trigger: 'change' }">
                    <el-select v-model="item.value" size="small" clearable class="width_305" @change="cameraIdsChange">
                      <el-option :disabled="item.disabled" v-for="(item, index) in cameraIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                    </el-select>
                    <el-radio-group v-model="ruleForm.videoType" prop="videoType">
                      <el-radio :label="index+1">视频流</el-radio>
                    </el-radio-group>
                    <el-link type="primary" class="opreationBtn" @click="deletecameraIds(item, index)">删除</el-link>
                  </el-form-item>
                  <el-form-item label="" v-if="this.ruleForm.cameraIdsAmount ? this.ruleForm.cameraIdsAmount.length < 9 : false">
                    <el-button size="small" class="editBtn" @click="addcameraIds">增加摄像头</el-button>
                  </el-form-item>
                <el-form-item label="应用盒子" prop="boxIds">
                  <el-select size="small" v-model="ruleForm.boxIds" clearable class="width_305">
                    <el-option v-for="(item, index) in this.boxIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                  </el-select>
                </el-form-item>
               </template>
               <template v-if="this.ruleForm.identifyStatus !== 0 || this.ruleForm.mbType === 1">
                  <el-form-item label="门禁开关">
                    <el-checkbox v-model="ruleForm.accessStatus">开启</el-checkbox>
                  </el-form-item>
                  <el-form-item label="网络开关" prop="networkIds" v-if="this.ruleForm.accessStatus">
                    <el-select size="small" v-model="ruleForm.networkIds" clearable class="width_305">
                      <el-option v-for="(item, index) in this.networkIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
               <el-form-item label="业务状态" prop="mbStatus">
                <el-radio-group v-model="ruleForm.mbStatus">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注" prop="content">
                <el-input class="width_305" size="small" type="textarea" v-model.trim="ruleForm.content" maxlength="100" show-word-limit></el-input>
              </el-form-item>
              </el-form>
            </el-scrollbar>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled">保存</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
import { toAddMeetingBusiness, getCameraList, toUpdateMeetingBusiness } from '../../axios/api.js'
import { filterObjNull, getFormData } from '../../lib/util.js'
export default {
  name: 'MeetdeviceDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    btnDisabled: {
      type: Boolean
    },
    type: {
      type: String,
      default: ''
    },
    id: {
      type: Number
    }
  },
  data () {
    return {
      title: '',
      visible: this.show,
      ruleForm: {},
      dataIp: [],
      integratedIp: [],
      networkIds: [],
      cameraIds: [],
      subdisabled: this.btnDisabled,
      deviceList: [],
      boxIds: [],
      rules: {
        mbType: { required: true, message: '请选择签到设备类型', trigger: 'change' },
        mbName:
          [{ required: true, message: '请输入签到设备名称!', trigger: 'blur' },
            { min: 2, max: 30, message: '签到设备名称长度为2-30个字符', trigger: 'blur' }],
        integratedIp: { required: true, message: '请选择智能一体机！', trigger: 'change' },
        dataIp: { required: true, message: '请选择识别主机！', trigger: 'change' },
        identifyStatus: { required: true, message: '请选择识别机制！', trigger: 'change' },
        mbStatus: { required: true, message: '请选择启用状态状态！', trigger: 'change' },
        cameraIds: { required: true, message: '请选择摄像头！', trigger: 'change' },
        networkIds: { required: true, message: '请选择网络开关地址！', trigger: 'change' },
        boxIds: { required: true, message: '请选择应用盒子', trigger: 'change' }
      }
    }
  },
  created () {

  },
  methods: {
    addcameraIds () {
      this.ruleForm.cameraIdsAmount.push({
        value: '',
        key: Date.now()
      })
    },
    deletecameraIds (item, idx) {
      var index = this.ruleForm.cameraIdsAmount.indexOf(item)
      if (index !== -1) {
        this.ruleForm.cameraIdsAmount.splice(index, 1)
      }
      this.cameraIds.map((childItem, index) => {
        if (childItem.deviceId === item.value) {
          childItem.disabled = false
        }
      })
      if (idx + 1 === this.ruleForm.videoType) {
        this.ruleForm.videoType = 0
      }
    },
    cameraIdsChange (e) {
      let arr = []
      this.ruleForm.cameraIdsAmount.map(item => {
        arr.push(item.value)
      })
      if (this.ruleForm.cameraIds) {
        arr.push(this.ruleForm.cameraIds)
      }
      this.cameraIds.map((item, index) => {
        if (arr.indexOf(item.deviceId) >= 0) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.ruleForm.cameraIdsAmount)
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
    toAddMeetingBusiness () {
      toAddMeetingBusiness().then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.deviceList = result.value.deviceList || []
        } else {
          this.deviceList = []
        }
      }).catch((res) => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    toUpdateMeetingBusiness () {
      let data = {
        id: this.id
      }
      toUpdateMeetingBusiness(getFormData(data)).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.ruleForm = {}
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.deviceList = result.value.deviceList || []
          this.ruleForm = result.value.meetingBusiness
          this.ruleForm.cameraIdsAmount = []
          this.devicecameraIds = []
          this.videoDeviceId = result.value.meetingBusiness.videoDeviceId
          if (result.value.meetingBusiness.accessStatus === 1) {
            this.ruleForm.accessStatus = true
          } else {
            this.ruleForm.accessStatus = false
          }
        } else {
          this.deviceList = []
          this.ruleForm = {}
        }
      })
    },
    hostIpsChange (e) {
      this.cameraIds = []
      this.ruleForm.cameraIdsAmount = []
      this.ruleForm.cameraIds = ''
      let data = {
        deviceId: e,
        businessType: 3
      }
      if (this.type === 'modify') {
        data.businessId = this.id
      }
      getCameraList(getFormData(data)).then(res => {
        if (res.data.success) {
          res.data.value.map(item => {
            this.cameraIds.push({deviceId: item.deviceId, deviceName: item.deviceName})
          })
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
      this.ruleForm = Object.assign({}, this.ruleForm)
    },
    handleClose (done) {
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
      done()
    }
  },
  watch: {
    show () {
      this.visible = this.show
      if (!this.visible) return
      this.subdisabled = false
      this.$nextTick(() => {
        console.log(this.$refs['myScrollbar'].wrap.scrollTop)
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      })
      if (this.type === 'add') {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
        this.title = '新增签到设备'
        this.ruleForm = {
          mbType: 1,
          identifyStatus: 1,
          cameraIdsAmount: [],
          videoType: 0,
          mbStatus: 1
        }
        this.toAddMeetingBusiness()
      } else {
        this.title = '修改签到设备'
        this.toUpdateMeetingBusiness()
      }
    },
    deviceList () {
      this.integratedIp = []
      this.dataIp = []
      this.networkIds = []
      this.boxIds = []
      if (this.deviceList) {
        this.deviceList.map(item => {
          if (item.deviceType === 'deviceType:5') {
            // 智能一体机
            this.integratedIp.push({deviceId: item.deviceId, deviceName: item.deviceName})
            if (item.isChoose) {
              this.ruleForm.integratedIp = item.deviceId
            }
          } else if (item.deviceType === 'deviceType:1') {
            // 识别主机
            this.dataIp.push({deviceId: item.deviceId, deviceName: item.deviceName})
            if (item.isChoose) {
              this.ruleForm.dataIp = item.deviceId
              // 返显摄像头数组
              this.hostIpsChange(item.deviceId)
            }
          } else if (item.deviceType === 'deviceType:2') {
            if (item.isChoose) {
              // console.log(item.deviceId)
              // this.ruleForm.cameraIds = item.deviceId
              // 返显摄像头数组
              this.ruleForm.cameraIdsAmount.push({
                value: item.deviceId
              })
              this.devicecameraIds.push(item.deviceId)
              // 返显第一个摄像头
              this.ruleForm.cameraIds = this.devicecameraIds[0]
              // 删除第一个摄像头
              this.ruleForm.cameraIdsAmount.map((item, index) => {
                if (item.value === this.devicecameraIds[0]) {
                  this.ruleForm.cameraIdsAmount.splice(index, 1)
                }
              })
              // 返显选中视频流
              this.ruleForm.videoType = this.devicecameraIds.indexOf(this.videoDeviceId)
              this.cameraIds.map(childItem => {
                if (childItem.deviceId === item.deviceId) {
                  childItem.disabled = true
                }
              })
            }
          } else if (item.deviceType === 'deviceType:4') {
            // 网络开关
            this.networkIds.push({deviceId: item.deviceId, deviceName: item.deviceName})
            if (item.isChoose) {
              this.ruleForm.networkIds = item.deviceId
            }
          } else if (item.deviceType === 'deviceType:3') {
            // 应用盒子
            this.boxIds.push({deviceId: item.deviceId, deviceName: item.deviceName})
            if (item.isChoose) {
              this.ruleForm.boxIds = item.deviceId
            }
          }
        })
      }
      this.ruleForm = Object.assign({}, this.ruleForm)
    },
    btnDisabled (newValue) {
      if (this.show) {
        this.subdisabled = newValue
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
