<template>
  <div class="dialogDiv">
    <el-dialog title="会议预约" :visible.sync="visible" :close-on-click-modal="false" @close="closeDialog">
      <div style="height:420px;" class="dialogAndScrollbar">
        <el-scrollbar style="height:100%;" ref="myDialog">
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
            <el-form-item label="会议名称" prop="maName">
              <el-input v-model.trim="form.maName" clearable class="width_428"></el-input>
            </el-form-item>
            <el-form-item label="会议主题" prop="maTopic">
              <el-input v-model.trim="form.maTopic" clearable class="width_428"></el-input>
            </el-form-item>
            <el-form-item label="会议时间" prop="timeRange">
              <el-time-select :editable='false' v-model="form.startTime" :picker-options="startOptions"
                style="width: 212px" placeholder="起始时间"></el-time-select>
              <el-time-select :editable='false' v-model="form.endTime" :picker-options="endOptions"
                style="width: 212px" placeholder="结束时间"></el-time-select>
              <p class="timeTyip">签到时间默认为会议开始时间前30分钟至会议截至时间</p>
            </el-form-item>
            <el-form-item label="会议室">
              <div class="room">
                <div class="roomName"><h3>{{mrName}}</h3><p class="address"><span>{{mrAddress}}</span><span> 容量： {{mrNums}}</span></p></div>
                <div class="roomTime">
                  <p v-for="(item, index) in appointmentList" :key="index" :class="['tableTime',{'unable': item.maName || item.maStatus === '无预约'}]">
                    <span>{{item.startTime+"~"+item.endTime}}</span>
                    <span v-if="!item.maName" class="icon" :style="{background:'url(' + timeIcon + ')'}"></span>
                  </p>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="参会人员" prop="libraryId">
              <el-select clearable v-model="form.libraryId" placeholder="请选择" style="width:428px;">
                <el-option v-for="item in libraryList" :key="item.id" :label="item.libraryName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="签到方式" prop="checkInMode">
              <el-select clearable v-model="form.checkInMode" placeholder="请选择" style="width:428px;">
                <el-option v-for="item in checkInModeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="btnDisabled">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { toAddMeetingAppointment, addMeetingAppointment, toUpdateMeetingAppointment, updateMeetingAppointment, getSysDictByParentCode } from '@/axios/api.js'
import { getFormData, filterObjNull } from '@/lib/util.js'
import timeIcon from '@/assets/images/icon_shijian_white.svg'
export default {
  data () {
    var validateTimeRange = (rule, value, callback) => {
      if (!this.form.startTime) {
        callback(new Error('请选择开始时间'))
      } else if (!this.form.endTime) {
        callback(new Error('请选择结束时间'))
      } else {
        const startTime = this.getTimeByStr(this.form.startTime)
        const endTime = this.getTimeByStr(this.form.endTime)
        const activeTime = this.appointmentList_validate.some(i => {
          const activeStartTime = this.getTimeByStr(i.startTime)
          const activeEndTime = this.getTimeByStr(i.endTime)
          return (startTime === activeStartTime && endTime === activeEndTime) ||
            (startTime > activeStartTime && startTime < activeEndTime) ||
            (endTime > activeStartTime && endTime < activeEndTime) ||
            (activeStartTime > startTime && activeStartTime < endTime) ||
            (activeEndTime > startTime && activeEndTime < endTime)
        })
        if (startTime >= endTime) {
          callback(new Error('开始时间不能大于等于结束时间'))
        } else if (activeTime) {
          callback(new Error('请选择可用时间'))
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,
      opType: '',
      timeIcon: timeIcon,
      startOptions: {},
      endOptions: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      idArr: [],
      signinOptions: [],
      mrName: '', // 会议室名称
      mrAddress: '', // 会议室Address
      mrNums: '', // 会议室容量
      appointmentList: [], // 会议预约list
      appointmentList_validate: [], // 会议预约list-校验用（当编辑时，过滤掉当前时间）
      libraryList: [], // 参会人员options（底库）
      checkInModeList: [], // 签到方式options
      form: {
        id: '', // 预约ID
        mrId: '', // 会议ID
        maName: '', // 会议名称
        maTopic: '',
        libraryId: '', // 底库
        checkInMode: '', // 签到方式
        maTime: '', // 会议日期（哪天）
        startTime: '', // 会议开始时间
        endTime: '' // 会议结束时间
      },
      rules: {
        maName: [
          { required: true, message: '请输入会议名称', trigger: 'blur' },
          { min: 2, max: 20, message: '会议名称长度为2-20个字符', trigger: 'blur' }
        ],
        maTopic: [
          { required: true, message: '请输入会议主题', trigger: 'blur' },
          { min: 2, max: 20, message: '会议主题长度为2-20个字符', trigger: 'blur' }
        ],
        timeRange: [
          { required: true, validator: validateTimeRange, trigger: 'change' }
        ],
        libraryId: { required: true, message: '请选择参会人员', trigger: 'change' },
        checkInMode: { required: true, message: '请选择签到方式', trigger: 'change' }
      },
      btnDisabled: false
    }
  },
  methods: {
    showData (data) {
      this.visible = true
      this.initAppointment(data)
      this.$nextTick(() => {
        this.$refs.myDialog.wrap.scrollTop = 0
      })
    },
    initAppointment (data) {
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
      this.opType = data.type
      this.form.mrId = data.mrId // 会议室ID
      this.form.maTime = data.maTime // 初始化日期（天）
      if (this.opType === 'add') {
        this.form.startTime = data.startTime
        this.form.endTime = data.endTime
        const formData = getFormData({
          mrId: data.mrId,
          maTime: data.maTime
        })
        toAddMeetingAppointment(formData).then(res => {
          if (res.data.success) {
            this.startOptions = {
              start: res.data.value.room.startTime,
              step: '00:30',
              end: res.data.value.room.endTime
            }
            this.endOptions = {
              start: res.data.value.room.startTime,
              step: '00:30',
              end: res.data.value.room.endTime
            }
            this.mrName = res.data.value.room.mrName
            this.mrAddress = res.data.value.room.mrAddress
            this.mrNums = res.data.value.room.mrNums
            this.appointmentList = res.data.value.appointmentList
            this.appointmentList_validate = res.data.value.appointmentList.filter(v => v.maStatus !== '可预约')
            this.libraryList = res.data.value.libraryList
          } else {
            this.failMessage(res.data.message)
          }
        })
      } else {
        const formData = getFormData({
          mrId: data.mrId,
          maId: data.maId,
          maTime: data.maTime
        })
        toUpdateMeetingAppointment(formData).then(res => {
          if (res.data.success) {
            this.startOptions = {
              start: res.data.value.room.startTime,
              step: '00:30',
              end: res.data.value.room.endTime
            }
            this.endOptions = {
              start: res.data.value.room.startTime,
              step: '00:30',
              end: res.data.value.room.endTime
            }
            this.form.id = res.data.value.appointmentInfo.id
            this.form.maName = res.data.value.appointmentInfo.maName
            this.form.maTopic = res.data.value.appointmentInfo.maTopic
            this.form.libraryId = res.data.value.appointmentInfo.libraryId
            this.form.checkInMode = res.data.value.appointmentInfo.checkInMode
            this.form.startTime = res.data.value.appointmentInfo.startTime
            this.form.endTime = res.data.value.appointmentInfo.endTime
            this.mrName = res.data.value.room.mrName
            this.mrAddress = res.data.value.room.mrAddress
            this.mrNums = res.data.value.room.mrNums
            this.appointmentList = res.data.value.appointmentList
            // 編輯時，過濾掉當前時間，不做校驗
            this.appointmentList_validate = res.data.value.appointmentList.filter(v => v.maStatus !== '可预约' && (v.startTime !== res.data.value.appointmentInfo.startTime && v.endTime !== res.data.value.appointmentInfo.endTime))
            this.libraryList = res.data.value.libraryList
          } else {
            this.failMessage(res.data.message)
          }
        })
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.btnDisabled = true
        if (this.opType === 'add') {
          addMeetingAppointment(filterObjNull({...this.form})).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.$emit('updateList')
              this.visible = false
            } else {
              this.failDialog(res.data.message)
            }
            this.btnDisabled = false
          }).catch((res) => {
            this.failDialog(res && res.data && res.data.message)
            this.btnDisabled = false
          })
        } else {
          updateMeetingAppointment({...this.form}).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.$emit('updateList')
              this.visible = false
            } else {
              this.failDialog(res.data.message)
            }
            this.btnDisabled = false
          }).catch((res) => {
            this.failDialog(res && res.data && res.data.message)
            this.btnDisabled = false
          })
        }
      })
    },
    getTimeByStr (str) {
      return new Date(1970, 1, 1, str.slice(0, 2), str.slice(3, 5)).getTime()
    },
    closeDialog () {
      this.form = {
        id: '', // 预约ID
        mrId: '', // 会议ID
        maName: '', // 会议名称
        maTopic: '',
        libraryId: '', // 底库
        checkInMode: '', // 签到方式
        maTime: '', // 会议日期（哪天）
        startTime: '', // 会议开始时间
        endTime: '' // 会议结束时间
      }
      this.appointmentList_validate = []
    },
    failDialog (txt) {
      this.$alert(txt || '操作失败！', '提示', {
        confirmButtonText: '确定',
        type: 'error'
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
  },
  mounted () {
    let data = {
      parentCode: 'checkInMode'
    }
    getSysDictByParentCode(getFormData(data)).then(res => { // 获取字典数据-签到方式
      if (res.data.success) {
        this.checkInModeList = res.data.value
      } else {
        this.failMessage(res.data.message)
      }
    })
  }
}
</script>

<style scoped>
.width_428 {
  width: 428px;
}
.room{
  width: 426px;
  border: 1px solid #DCDFE6;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 10px 0;
}
.roomName{
  width: 50%;
  padding : 0 0 0 16px;
  box-sizing: border-box;
  font-size: 14px;
  color: #606266;
}
.roomName h3{
  font-size: 15px;
  line-height: 15px;
  padding-bottom: 10px;
  color: #606266;
}
.roomName p{
  line-height: 14px;
}
.roomTime{
  width: 50%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.roomTime .tableTime{
  display: flex;
  justify-content: space-between;
  margin: 5px 10px 5px 0;
  width: 200px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  padding-left: 10px;
  color: #fff;
  box-sizing: border-box;
  background-color: #4C7EE9;
}
.roomTime .unable{
  background-color: #F2F6FC;
  color: #606266;
}
.roomTime .tableTime .icon{
  width: 12px;
  height: 12px;
  margin: 10px 10px;
}
.timeTyip{
  font-size: 12px;
  line-height: 12px;
  color: #909399;
}
</style>
