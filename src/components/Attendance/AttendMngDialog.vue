<template>
  <div class="dialogDiv">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :show="show"
    >
    <div style="height:420px;" class="dialogAndScrollbar">
        <el-scrollbar style="height:100%;" ref="myScrollbar">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="考勤类型" prop="atType">
              <el-radio-group v-model="ruleForm.atType">
                <el-radio :label="0">配合式</el-radio>
                <el-radio :label="1">非配合式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="考勤名称" prop="atName">
              <el-input v-model.trim="ruleForm.atName" clearable class="width_305"></el-input>
            </el-form-item>
            <el-form-item label="安装位置" prop="atPosition">
              <el-input v-model.trim="ruleForm.atPosition" clearable class="width_305"></el-input>
            </el-form-item>
            <template v-if="this.ruleForm.atType === 0">
              <el-form-item label="智能一体机" prop="machines">
                <el-select size="small" v-model="ruleForm.machines" clearable class="width_305">
                  <el-option v-for="(item, index) in this.machines" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="识别主机" prop="hostIps">
              <el-select size="small" v-model="ruleForm.hostIps" clearable class="width_305" @change="hostIpsChange">
                <el-option v-for="(item, index) in this.hostIps" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="this.ruleForm.atType === 0">
              <el-form-item label="识别机制" prop="identifyStatus">
                <el-radio-group v-model="ruleForm.identifyStatus">
                    <el-radio :label="0">前端识别</el-radio>
                    <el-radio :label="1">后端识别</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-if="this.ruleForm.atType === 1">
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
            <el-form-item label="考勤底库" prop="libraryIds">
                <el-select size="small" v-model="ruleForm.libraryIds" clearable class="width_305">
                <el-option v-for="item in this.libraryIds" :key="item.id" :value="item.id" :label="item.libraryName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务状态" prop="atStatus">
                <el-radio-group v-model="ruleForm.atStatus">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="content">
              <el-input
                type="textarea"
                maxlength="100"
                show-word-limit
                v-model.trim="ruleForm.content"
                class="width_305"
              ></el-input>
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
import { toAddAttendance, toUpdateAttendance, getCameraList } from '../../axios/api.js'
import { getFormData } from '../../lib/util'
export default {
  name: 'AttendMngDialog',
  props: {
    show: {
      type: Boolean
    },
    id: {
      type: Number
    },
    type: {
      type: String
    },
    btnDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      subdisabled: this.btnDisabled,
      visible: this.show,
      title: '',
      ruleForm: {},
      machines: [],
      hostIps: [],
      libraryIds: [],
      deviceList: [],
      cameraIds: [],
      devicecameraIds: [],
      videoDeviceId: 0,
      boxIds: [],
      rules: {
        atType: { required: true, message: '请选择考勤类型', trigger: 'change' },
        atName: [
          { required: true, message: '请输入考勤名称！', trigger: 'blur' },
          { min: 2, max: 30, message: '考勤名称长度为2-30个字符', trigger: 'blur' }],
        atPosition: [
          { required: true, message: '请输入安装位置！', trigger: 'blur' },
          { min: 2, max: 30, message: '安装位置长度为2-30个字符', trigger: 'blur' }],
        machines: { required: true, message: '请选择智能一体机！', trigger: 'change' },
        hostIps: { required: true, message: '请选择识别主机！', trigger: 'change' },
        atStatus: { required: true, message: '请选择业务状态！', trigger: 'change' },
        identifyStatus: { required: true, message: '请选择识别机制！', trigger: 'change' },
        libraryIds: { required: true, message: '请选择底库！', trigger: 'change' },
        cameraIds: { required: true, message: '请选择摄像头！', trigger: 'change' },
        boxIds: { required: true, message: '请选择应用盒子！', trigger: 'change' }
      }
    }
  },
  methods: {
    hostIpsChange (e) {
      this.cameraIds = []
      this.ruleForm.cameraIdsAmount = []
      this.ruleForm.cameraIds = ''
      let data = {
        deviceId: e,
        businessType: 2
      }
      if (this.type === 'modifiy') {
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
    toAddAttendance () {
      toAddAttendance().then(res => {
        if (res.data.success) {
          if (!res.data.value) {
            this.machines = []
            this.hostIps = []
            this.libraryIds = []
          } else {
            this.deviceList = res.data.value.deviceList
            this.libraryIds = res.data.value.libraryList
          }
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    toUpdateAttendance () {
      let data = {
        id: this.id
      }
      toUpdateAttendance(getFormData(data)).then(res => {
        if (!res.data.success) {
          this.ruleForm = {}
          this.failMessage(res.message)
          return false
        }
        if (res.data.value) {
          this.ruleForm = res.data.value.attendance
          this.libraryIds = res.data.value.libraryList
          this.ruleForm.cameraIdsAmount = []
          this.devicecameraIds = []
          this.videoDeviceId = res.data.value.attendance.videoDeviceId
          res.data.value.libraryList.map(item => {
            if (item.isChoose) {
              this.ruleForm.libraryIds = item.id
            }
          })
          this.deviceList = res.data.value.deviceList
        } else {
          this.ruleForm = []
          this.machines = []
          this.hostIps = []
          this.libraryIds = []
        }
      })
    },
    handleClose (done) {
      done()
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
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
        this.$emit('submit', data)
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  },
  watch: {
    show () {
      this.visible = this.show
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      })
      if (!this.visible) return
      this.subdisabled = false
      if (this.type === 'add') {
        this.ruleForm = {
          atType: 0,
          identifyStatus: 0,
          atStatus: 1,
          cameraIdsAmount: [],
          videoType: 0
        }
        this.title = '新增考勤'
        this.toAddAttendance()
      } else {
        this.title = '修改考勤'
        this.toUpdateAttendance()
      }
    },
    btnDisabled (newValue) {
      // if (!newValue) {
      //   this.subdisabled = newValue
      // }
      if (this.show) {
        this.subdisabled = newValue
      }
    },
    deviceList () {
      this.machines = []
      this.hostIps = []
      this.cameraIds = []
      this.boxIds = []
      this.deviceList.map(item => {
        if (item.deviceType === 'deviceType:5') {
          this.machines.push({deviceId: item.deviceId, deviceName: item.deviceName})
          if (item.isChoose) {
            this.ruleForm.machines = item.deviceId
          }
        } else if (item.deviceType === 'deviceType:1') {
          this.hostIps.push({deviceId: item.deviceId, deviceName: item.deviceName})
          if (item.isChoose) {
            this.ruleForm.hostIps = item.deviceId
            // 返显摄像头数组
            this.hostIpsChange(item.deviceId)
          }
        } else if (item.deviceType === 'deviceType:3') {
          this.boxIds.push({deviceId: item.deviceId, deviceName: item.deviceName})
          if (item.isChoose) {
            this.ruleForm.boxIds = item.deviceId
          }
        } else if (item.deviceType === 'deviceType:2') {
          // this.cameraIds.push({deviceId: item.deviceId, deviceName: item.deviceName})
          if (item.isChoose) {
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
        }
      })
      this.ruleForm = Object.assign({}, this.ruleForm)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
