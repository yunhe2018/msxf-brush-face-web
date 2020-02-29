<template>
    <div>
      <el-dialog
            :title="title"
            :visible.sync="visible"
            @close="$emit('update:show', false)"
            :close-on-click-modal="false"
            :before-close="handleClose"
            :show="show">
            <div style="height:420px;" class="dialogAndScrollbar">
              <el-scrollbar style="height:100%;" ref="myScrollbar">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="门禁类型" prop="acType">
                    <el-radio-group v-model="ruleForm.acType">
                      <el-radio :label="0">配合式</el-radio>
                      <el-radio :label="1">非配合式</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="门禁名称" prop="acName">
                    <el-input size="small" v-model.trim="ruleForm.acName" class="width_305"></el-input>
                  </el-form-item>
                  <el-form-item label="安装位置" prop="acPosition">
                    <el-input size="small" v-model.trim="ruleForm.acPosition" class="width_305"></el-input>
                  </el-form-item>
                  <template v-if="this.ruleForm.acType === 0">
                    <el-form-item label="智能一体机" prop="machines">
                      <el-select size="small" v-model="ruleForm.machines" clearable class="width_305">
                        <el-option v-for="(item, index) in this.machines" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                      </el-select>
                    </el-form-item>
                      <el-form-item label="识别主机" prop="hostIps">
                        <el-select size="small" v-model="ruleForm.hostIps" clearable class="width_305" @change="hostIpsChange">
                          <el-option v-for="(item, index) in this.hostIps" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="识别机制" prop="identifyStatus">
                        <el-radio-group v-model="ruleForm.identifyStatus" @change="identifyChange">
                          <el-radio :label="0">前端识别</el-radio>
                          <el-radio :label="1">后端识别</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="网络开关" v-if="this.ruleForm.identifyStatus === 1">
                      <el-checkbox v-model="ruleForm.networkStatus">开启</el-checkbox>
                    </el-form-item>
                    <el-form-item label="网络开关" prop="networkIdStatus" v-if="this.ruleForm.networkStatus && this.ruleForm.identifyStatus === 1">
                      <el-select size="small" v-model="ruleForm.networkIdStatus" clearable class="width_305">
                        <el-option v-for="(item, index) in this.networkIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="考勤开关" prop="attendanceStatus">
                        <el-radio-group v-model="ruleForm.attendanceStatus">
                          <el-radio :label="1">开启</el-radio>
                          <el-radio :label="0">关闭</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                  </template>
                  <template v-else>
                    <el-form-item label="识别主机" prop="hostIps">
                        <el-select size="small" v-model="ruleForm.hostIps" clearable class="width_305" @change="hostIpsChange">
                          <el-option v-for="(item, index) in this.hostIps" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                        </el-select>
                    </el-form-item>
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
                    <el-form-item label="网络开关" prop="networkIds">
                      <el-select size="small" v-model="ruleForm.networkIds" clearable class="width_305">
                        <el-option v-for="(item, index) in this.networkIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="迎宾开关" prop="greetingStatus">
                      <el-checkbox v-model="ruleForm.greetingStatus" @change="greetChange">开启</el-checkbox>
                  </el-form-item>
                   <el-form-item label="应用盒子" prop="boxIds" v-if="greetStatus">
                      <el-select size="small" v-model="ruleForm.boxIds" clearable class="width_305">
                        <el-option v-for="(item, index) in this.boxIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                   <!-- <el-form-item label="网络开关" v-if="this.networkStatus">
                      <el-checkbox v-model="ruleForm.networkStatus" @change="networkIdsChange">开启</el-checkbox>
                    </el-form-item>
                    <el-form-item label="网络开关" prop="networkIdStatus" v-if="networkIdStatus">
                      <el-select size="small" v-model="ruleForm.networkIdStatus" clearable class="width_305">
                        <el-option v-for="(item, index) in this.networkIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                      </el-select>
                    </el-form-item> -->
                <el-form-item label="业务状态" prop="acStatus">
                    <el-radio-group v-model="ruleForm.acStatus">
                      <el-radio :label="1">开启</el-radio>
                      <el-radio :label="0">关闭</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="选择规则" prop="ruleIds">
                      <el-select size="small" v-model="ruleForm.ruleIds" clearable class="width_305">
                        <el-option v-for="item in this.ruleIds" :key="item.id" :value="item.id" :label="item.ruleName"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="选择底库" prop="libraryIds">
                      <el-select size="small" v-model="ruleForm.libraryIds" clearable class="width_305">
                        <el-option v-for="item in this.libraryIds" :key="item.id" :value="item.id" :label="item.libraryName"></el-option>
                      </el-select>
                    </el-form-item>
                  <el-form-item label="备注">
                    <el-input type="textarea" v-model.trim="ruleForm.content" class="width_305" maxlength="100" show-word-limit></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="状态" prop="status"
                    :rules="{ required: true, message: '请选择状态', trigger: 'blur' }">
                    <el-radio v-model="ruleForm.status" :label="1">有效</el-radio>
                    <el-radio v-model="ruleForm.status" :label="0">无效</el-radio>
                  </el-form-item> -->
                  <!-- <el-form-item>
                    <el-button class="editBtn" size="small" type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  </el-form-item> -->
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
import { toAddAccessBusiness, toUpdateAccessBusiness, getCameraList } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
export default {
  name: 'ManageDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    id: {
      type: Number
    },
    btnDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      subdisabled: this.btnDisabled,
      visible: this.show,
      ruleForm: {},
      ruleIds: [],
      libraryIds: [],
      machines: [],
      hostIps: [],
      cameraIds: [],
      networkIds: [],
      deviceList: [],
      boxIds: [],
      videoDeviceId: 0,
      devicecameraIds: [],
      greetStatus: false,
      title: '',
      rules: {
        acType: { required: true, message: '请选择门禁类型', trigger: 'change' },
        acName:
          [{ required: true, message: '请输入门禁名称!', trigger: 'blur' },
            { min: 2, max: 30, message: '门禁名称长度为2-30个字符', trigger: 'blur' }],
        acPosition:
          [{ required: true, message: '请输入安装位置！', trigger: 'blur' },
            { min: 2, max: 30, message: '安装位置长度为2-30个字符', trigger: 'blur' }],
        acStatus: { required: true, message: '请选择业务状态！', trigger: 'change' },
        libraryIds: { required: true, message: '请选择底库！', trigger: 'change' },
        ruleIds: { required: true, message: '请选择规格！', trigger: 'change' },
        machines: { required: true, message: '请选择智能一体机！', trigger: 'change' },
        hostIps: { required: true, message: '请选择识别主机！', trigger: 'change' },
        identifyStatus: { required: true, message: '请选择识别机制！', trigger: 'change' },
        // status: { required: true, message: '请选择状态！', trigger: 'change' },
        cameraIds: { required: true, message: '请选择摄像头！', trigger: 'change' },
        networkIds: { required: true, message: '请选择网络开关！', trigger: 'change' },
        networkIdStatus: { required: true, message: '请选择网络开关！', trigger: 'change' },
        boxIds: { required: true, message: '请选择应用盒子！', trigger: 'change' }
        // attendanceStatus: { required: true, message: '请选择考勤开关！', trigger: 'change' }
      }
    }
  },
  created () {
  },
  methods: {
    hostIpsChange (e) {
      this.cameraIds = []
      this.ruleForm.cameraIdsAmount = []
      this.ruleForm.cameraIds = ''
      let data = {
        deviceId: e,
        businessType: 0
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.ruleForm.cameraIdsAmount)
        if (!valid) {
          return false
        }
        this.subdisabled = true
        let data = {
          status: false,
          value: this.ruleForm,
          greetingStatus: this.greetStatus
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    greetChange (e) {
      if (e === true) {
        this.greetStatus = true
      } else {
        this.greetStatus = false
      }
    },
    handleClose (done) {
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
      done()
    },
    toAddBusinessEvent () {
      toAddAccessBusiness().then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.libraryIds = result.value.libraryList || []
          this.ruleIds = result.value.ruleList || []
          this.deviceList = result.value.deviceList || []
        } else {
          this.libraryList = []
          this.deviceList = []
        }
      }).catch((res) => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    toUpdateBusinessEvent () {
      let data = {
        id: this.id
      }
      toUpdateAccessBusiness(getFormData(data)).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.ruleForm = {}
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.libraryList = result.value.libraryList || []
          this.deviceList = result.value.deviceList || []
          this.ruleForm = result.value.accessBusiness
          this.ruleIds = result.value.ruleList
          this.ruleForm.cameraIdsAmount = []
          this.devicecameraIds = []
          this.videoDeviceId = result.value.accessBusiness.videoDeviceId
          if (result.value.accessBusiness.greetingStatus === 1) {
            this.ruleForm.greetingStatus = true
            this.greetStatus = true
          } else {
            this.ruleForm.greetingStatus = false
            this.greetStatus = false
          }
          // 配合式 网络开关networkIdStatus
          if (result.value.accessBusiness.acType === 0) {
            if (result.value.accessBusiness.identifyStatus === 1) {
              if (result.value.accessBusiness.networkStatus === 1) {
                this.ruleForm.networkStatus = true
              } else {
                this.ruleForm.networkStatus = false
              }
            } else {
              this.ruleForm.networkStatus = false
            }
          }

          // if (result.value.accessBusiness.identifyStatus !== 0) {
          //   if (result.value.accessBusiness.networkStatus === 1) {
          //     this.ruleForm.networkStatus = true
          //   } else {
          //     this.ruleForm.networkStatus = false
          //   }
          // } else {
          //   this.ruleForm.networkStatus = false
          // }

          result.value.ruleList.map(item => {
            if (item.isChoose) {
              this.ruleForm.ruleIds = item.id
            }
          })
          this.libraryIds = result.value.libraryList
          result.value.libraryList.map(item => {
            if (item.isChoose) {
              this.ruleForm.libraryIds = item.id
            }
          })
        } else {
          this.libraryList = []
          this.deviceList = []
          this.ruleForm = {}
        }
      })
    },
    identifyChange (e) {
      if (e === 1) {
        this.networkStatus = true
      } else {
        this.networkStatus = false
      }
    }
    // acTypeChange (e) {
    //   this.ruleForm.acType = e
    // }
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

      if (this.type === 'modifiy') {
        this.title = '编辑门禁'
        this.toUpdateBusinessEvent()
      } else {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
        this.ruleForm = {
          acType: 0,
          identifyStatus: 0,
          acStatus: 1,
          cameraIdsAmount: [],
          videoType: 0
          // attendanceStatus: 1
        }
        this.title = '新增门禁'
        this.toAddBusinessEvent()
      }
    },
    deviceList () {
      this.machines = []
      this.hostIps = []
      this.networkIds = []
      this.boxIds = []
      if (this.deviceList) {
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
            this.networkIds.push({deviceId: item.deviceId, deviceName: item.deviceName})
            if (item.isChoose) {
              // 区分配合式、非配合式的网络开关
              if (this.ruleForm.acType === 0) {
                this.ruleForm.networkIdStatus = item.deviceId
              } else {
                this.ruleForm.networkIds = item.deviceId
              }
            }
          } else if (item.deviceType === 'deviceType:3') {
            this.boxIds.push({deviceId: item.deviceId, deviceName: item.deviceName})
            if (item.isChoose) {
              this.ruleForm.boxIds = item.deviceId
            }
          }
        })
      }
      if (this.libraryList) {
        this.libraryList.map(item => {
          if (item.isChoose) {
            this.ruleForm.libraryId = item.id
            this.ruleForm.libraryName = item.libraryName
          }
        })
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* .width_305{
    width:305px;
  } */
</style>
