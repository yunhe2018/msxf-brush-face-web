<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      :close-on-click-modal=false
      :show="show"
      :before-close="handleClose">
      <div style="height:320px;" class="dialogAndScrollbar">
        <el-scrollbar style="height:100%;" ref="myScrollbar">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="迎宾名称" prop="greetingName"
              :rules="[{ required: true, message: '名称不能为空', trigger: 'blur' },
            { min: 2, max: 30, message: '门禁名称长度为2-30个字符', trigger: 'blur' }]">
              <el-input size="small" v-model.trim="ruleForm.greetingName" class="width_305"></el-input>
            </el-form-item>
            <el-form-item label="安装位置" prop="greetingPosition"
              :rules="[{ required: true, message: '安装位置不能为空', trigger: 'blur' },
            { min: 2, max: 30, message: '安装位置长度为2-30个字符', trigger: 'blur' }]">
              <el-input size="small" v-model.trim="ruleForm.greetingPosition" class="width_305"></el-input>
            </el-form-item>
            <el-form-item label="应用盒子" prop="boxId"
              :rules="{ required: true, message: '应用盒子不能为空', trigger: 'blur'}">
              <el-select size="small" v-model="ruleForm.boxId" placeholder="请选择" class="width_305">
                <el-option
                  v-for="item in boxOpts"
                  :key="item.deviceId"
                  :value="item.deviceId"
                  :label="item.deviceName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="识别主机" prop="hostId"
              :rules="{ required: true, message: '识别主机不能为空', trigger: 'blur'}">
              <el-select size="small" v-model="ruleForm.hostId" placeholder="请选择" class="width_305" @change="initVideo(true)">
                <el-option
                  v-for="item in hostOpts"
                  :key="item.deviceId"
                  :value="item.deviceId"
                  :label="item.deviceName">
                </el-option>
              </el-select>
            </el-form-item>
            <!--摄像头-->
            <el-form-item label="摄像头" prop="cameraIds" :rules="{ required: true, message: '请选择摄像头！', trigger: 'change'}">
              <el-select size="small" v-model="ruleForm.cameraIds" clearable class="width_305" @change="cameraIdsChange">
                <el-option :disabled="item.disabled" v-for="(item, index) in cameraIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
              </el-select>
              <el-radio-group size="mini" v-model="ruleForm.videoType" prop="videoType" :rules="{ required: true, message: '请选择视频流', trigger: 'change' }">
                <el-radio :label="0">视频流</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-for="(item, index) in this.ruleForm.cameraIdsAmount" label="" :key="item.key" :prop="'cameraIdsAmount.' + index + '.value'" :rules="{ required: true, message: '请选择摄像头', trigger: 'change' }">
              <el-select v-model="item.value" size="small" clearable class="width_305" @change="cameraIdsChange">
                <el-option :disabled="item.disabled" v-for="(item, index) in cameraIds" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
              </el-select>
              <el-radio-group v-model="ruleForm.videoType" prop="videoType">
                <el-radio :label="index+1">视频流</el-radio>
              </el-radio-group>
              <el-link type="primary" class="opreationBtn" @click="deletecameraIds(item, index)">删除</el-link>
            </el-form-item>
            <el-form-item label="">
              <el-button size="small" class="editBtn" @click="addcameraIds">增加摄像头</el-button>
            </el-form-item>
            <!--摄像头end-->
            <el-form-item label="选择底库" prop="libraryId"
              :rules="{ required: true, message: '底库不能为空', trigger: 'blur'}">
              <el-select size="small" v-model="ruleForm.libraryId" placeholder="请选择" class="width_305">
                <el-option
                  v-for="item in libraryList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.libraryName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="content">
              <el-input size="small" type="textarea" v-model.trim="ruleForm.content" class="width_305" maxlength="100" show-word-limit></el-input>
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
import { getFormData, filterObjNull } from '../../lib/util'
import { toAddGreetingBusiness, toUpdateGreetingBusiness, getCameraList } from '../../axios/api.js'
export default {
  name: 'GreetDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    imgPrefix: {
      type: String,
      default: ''
    },
    greetId: Number,
    btnDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      subdisabled: this.btnDisabled,
      visible: this.show,
      ruleForm: {// 添加时，只传deviceIds和libraryIds两个集合，设备和底库相关的字段不用传
        deviceIds: [],
        libraryIds: [],
        cameraIdsAmount: [],
        cameraIds: '',
        boxId: '',
        hostId: '',
        libraryId: ''
      },
      cameraIds: [],
      title: '',
      popvisible: false,
      deviceList: [],
      libraryList: [],
      boxOpts: [],
      hostOpts: [],
      videoOpts: []
    }
  },
  created () {

  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.subdisabled = true
        this.ruleForm.deviceIds = this.ruleForm.deviceIds || []
        this.ruleForm.deviceIds.push(this.ruleForm.boxId, this.ruleForm.hostId, this.ruleForm.cameraIds)
        this.ruleForm.libraryIds = [this.ruleForm.libraryId]
        if (this.ruleForm.cameraIdsAmount || this.ruleForm.cameraIds) {
          let arr = []
          arr.push(this.ruleForm.cameraIds)
          this.ruleForm.cameraIdsAmount.map(item => {
            this.ruleForm.deviceIds.push(item.value)
            arr.push(item.value)
          })
          this.ruleForm.videoDeviceId = arr[this.ruleForm.videoType]
        }
        // this.ruleForm.videoDeviceId = this.ruleForm.videoType
        // this.ruleForm.hostId = null
        // this.ruleForm.cameraIds = ''
        // this.ruleForm.boxId = null;
        let data = {
          status: false,
          value: filterObjNull(this.ruleForm)
        }
        this.$emit('submit', data)
      })
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
    addcameraIds () {
      this.ruleForm.cameraIdsAmount.push({
        value: '',
        key: Date.now()
      })
    },
    handleClose (done) {
      done()
      this.ruleForm = {}
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
    },
    // 跳转新增迎宾信息
    toAddGreetingBusinessEvent () {
      // if ((this.deviceList && this.deviceList.length) || (this.libraryList && this.libraryList.length)) return
      toAddGreetingBusiness().then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.libraryList = result.value.libraryList || []
          this.deviceList = result.value.deviceList || []
        } else {
          this.libraryList = []
          this.deviceList = []
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    // 跳转编辑迎宾信息
    toUpdateGreetingBusinessEvent () {
      let reqData = getFormData({
        id: this.greetId
      })
      toUpdateGreetingBusiness(reqData).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.ruleForm = {}
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.libraryList = result.value.libraryList || []
          this.deviceList = result.value.deviceList || []
          this.ruleForm = result.value.greetingBusiness
          this.ruleForm.cameraIdsAmount = []
          this.ruleForm.cameraIds = ''
          this.devicecameraIds = []
          this.videoDeviceId = result.value.greetingBusiness.videoDeviceId
        } else {
          this.libraryList = []
          this.deviceList = []
          this.ruleForm = {}
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    initVideo (flag) {
      let data = {
        deviceId: this.ruleForm.hostId,
        businessType: 1 // 1代表迎宾
      }
      if (this.type === 'modify') {
        data.businessId = this.greetId
      }
      getCameraList(getFormData(data)).then(res => {
        if (res.data.success) {
          this.cameraIds = res.data.value
        }
        if (flag && this.type === 'modify') {
          this.ruleForm.cameraIdsAmount = []
          this.ruleForm.cameraIds = ''
        }
      })
    }

  },
  watch: {
    show () {
      this.visible = this.show
      if (!this.visible) return
      this.subdisabled = false
      this.$nextTick(() => {
        // console.log(this.$refs['myScrollbar'].wrap.scrollTop)
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      })
      if (this.type === 'modify') {
        this.title = '编辑迎宾'
        this.toUpdateGreetingBusinessEvent()
      } else {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
        this.ruleForm = {
          cameraIdsAmount: [],
          videoType: 0
        }
        this.title = '添加迎宾'
        this.toAddGreetingBusinessEvent()
      }
    },
    deviceList () {
      this.cameraIds = []
      this.boxOpts = []
      this.hostOpts = []
      this.videoOpts = []
      this.deviceList.forEach(item => {
        if (item.deviceType === 'deviceType:3') {
          this.boxOpts.push(item)
          if (item.isChoose) {
            this.ruleForm.boxId = item.deviceId
          }
        } else if (item.deviceType === 'deviceType:1') {
          this.hostOpts.push(item)
          if (item.isChoose) {
            this.ruleForm.hostId = item.deviceId
            this.initVideo() // 进入编辑页时根据识别主机ID获取摄像头
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
      this.libraryList.forEach(item => {
        if (item.isChoose) {
          this.ruleForm.libraryId = item.id
          this.ruleForm.libraryName = item.libraryName
        }
      })
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
  .el-radio{margin-right:15px}
  /* .width_305{width: 305px;} */
</style>
