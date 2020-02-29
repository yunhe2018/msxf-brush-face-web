<template>
  <div class="meetingMngDia">
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
                <el-form-item label="会议室名称" prop="mrName">
                  <el-input size="small" v-model.trim="ruleForm.mrName" class="width_305"></el-input>
                </el-form-item>
                <el-form-item label="会议室位置" prop="mrAddress">
                  <el-input size="small" v-model.trim="ruleForm.mrAddress" class="width_305"></el-input>
                </el-form-item>
                <el-form-item label="会议室容量" prop="mrNums">
                  <el-input size="small" v-model.trim="ruleForm.mrNums" class="width_305"></el-input>
                </el-form-item>
                <!-- <el-form-item label="可用开始时间" prop="startTime">
                  <el-time-select
                      style="width:305px"
                      placeholder="起始时间"
                      v-model="ruleForm.startTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00'
                      }">
                    </el-time-select>
                  </el-form-item>
                  <el-form-item label="可用结束时间" prop="endTime">
                    <el-time-select
                      style="width:305px"
                      placeholder="结束时间"
                      v-model="ruleForm.endTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '24:00',
                        minTime: ruleForm.startTime
                      }">
                    </el-time-select>
                  </el-form-item> -->
                <el-form-item label="签到设备" prop="deviceIds"
                :rules="{ required: deviceStatus ? true : false, message: '请选择签到设备！', trigger: 'change' }">
                  <el-transfer
                    filterable
                    filter-placeholder="搜索关键字"
                    :titles="['未选签到设备', '已选签到设备']"
                    v-model="ruleForm.deviceIds"
                    :right-default-checked="ruleForm.deviceIds"
                    :data="data3"
                    @change="handleChange"
                    :props="{
                      key: 'mbId',
                      label: 'mbName'
                    }">
                  </el-transfer>
                </el-form-item>
                <el-form-item label="业务状态" prop="mrStatus">
                  <el-radio-group v-model="ruleForm.mrStatus">
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
import { toAddMeetingRoom, toUpdateMeetingRoom } from '../../axios/api.js'
import { filterObjNull, getFormData } from '../../lib/util.js'
export default {
  name: 'AddAccount',
  props: {
    show: {
      type: Boolean
    },
    btnDisabled: {
      type: Boolean
    },
    type: {
      type: String
    },
    id: {
      type: Number
    }
  },
  data () {
    const validateTags = (rule, value, callback) => {
      if (value) {
        if (!(/^[0-9]*$/).test(value)) {
          return callback(new Error('请输入1-10000之间的整数'))
        } else if (value <= 0 || value > 10000) {
          return callback(new Error('请输入1-10000之间的整数'))
        }
        callback()
      } else {
        return callback(new Error('请输入会议容量'))
      }
    }
    return {
      title: '',
      visible: this.show,
      ruleForm: {},
      deviceStatus: false,
      rules: {
        mrName:
          [{ required: true, message: '请输入会议室名称!', trigger: 'blur' },
            { min: 2, max: 30, message: '会议室名称长度为2-30个字符', trigger: 'blur' }],
        mrAddress:
          [{ required: true, message: '请输入会议室位置!', trigger: 'blur' },
            { min: 2, max: 30, message: '会议室位置长度为2-30个字符', trigger: 'blur' }],
        mrNums: {validator: validateTags, required: true, trigger: 'blur'},
        // startTime: { required: true, message: '请选择开始时间！', trigger: 'change' },
        // endTime: { required: true, message: '请选择结束时间！', trigger: 'change' },
        mrStatus: { required: true, message: '请选择启用状态！', trigger: 'change' }
      },
      subdisabled: '',
      data3: [],
      value: []
    }
  },
  created () {
  },
  methods: {
    handleChange (value, direction, movedKeys) {
      if (direction === 'left') {
        this.ruleForm.deviceIds = value
        if (this.ruleForm.deviceIds.length < 1) {
          this.deviceStatus = true
        }
      }
      this.ruleForm = Object.assign({}, this.ruleForm)
    },
    submitForm (formName) {
      this.deviceStatus = true
      if (!this.ruleForm.deviceIds) {
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.subdisabled = true
        let data = {
          status: false,
          value: this.ruleForm,
          data3: this.data3
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
      })
    },
    handleClose (done) {
      done()
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
    },
    toAddMeetingRoom () {
      toAddMeetingRoom().then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.data3 = result.value.list
        } else {
          this.data3 = []
        }
      }).catch((res) => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    toUpdateMeetingRoom () {
      let data = {
        id: this.id
      }
      toUpdateMeetingRoom(getFormData(data)).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.ruleForm = {}
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.ruleForm = result.value.roomInfo
          this.ruleForm.mrNums = (result.value.roomInfo.mrNums).toString()
          this.data3 = []
          this.ruleForm.deviceIds = []
          result.value.list.map(item => {
            this.data3.push(item)
            if (item.isChoose) {
              this.ruleForm.deviceIds.push(item.mbId)
            }
          })
        } else {
          this.ruleForm = {}
          this.data3 = []
        }
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
      if (!this.visible) return
      this.deviceStatus = false
      this.$nextTick(() => {
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      })
      this.subdisabled = false
      if (this.type === 'add') {
        this.title = '新增会议室'
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
        this.ruleForm = {
          mrStatus: 1
        }
        this.toAddMeetingRoom()
      } else {
        this.title = '修改会议室'
        this.toUpdateMeetingRoom()
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
.meetingMngDia /deep/ .el-transfer-panel__item .el-checkbox__input {
  top: 0;
}
.meetingMngDia /deep/ .el-transfer-panel__item.el-checkbox .el-checkbox__label {
  line-height: 17px;
}
/*滚动条样式*/
/*滚动条整体样式*/
.meetingMngDia /deep/ .el-transfer-panel__list::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
/*滚动条里面小方块*/
.meetingMngDia /deep/ .el-transfer-panel__list::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
/*滚动条里面轨道*/
.meetingMngDia /deep/ .el-transfer-panel__list::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
/*修改签到设备的右标题*/
.meetingMngDia /deep/ .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span {
  display: none;
}
</style>
