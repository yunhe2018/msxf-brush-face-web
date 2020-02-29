<template>
    <div>
      <el-dialog
        :title="title"
        :visible.sync="visible"
        class="RuleDialog"
        @close="$emit('update:show', false)"
        :close-on-click-modal=false
        :before-close="handleClose"
        :show="show">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm" style="margin-left:10px">
            <el-form-item label="规则名称" prop="ruleName">
                <el-input size="small" v-model.trim="ruleForm.ruleName" class="width_305"></el-input>
            </el-form-item>
            <el-form-item label="门禁开放时间" prop="time">
              <el-time-picker
               size="small"
                style="width:305px"
                is-range
                v-model="ruleForm.time"
                value-format="HH:mm:ss"
                format="HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :disabled="checkDay"
                placeholder="选择时间范围">
              </el-time-picker>
            </el-form-item>
            <el-form-item label="二十四小时" prop="dayTime">
              <el-switch
                @change="dayTimeChange"
                v-model="ruleForm.dayTime"
                active-color="#4C7EE9">
              </el-switch>
            </el-form-item>
            <el-form-item label="门禁开放日期" prop="openTime">
              <template v-for="(item, i) in this.week">
                <el-button size="small"
                :type="item.checked?abc: ''"
                :key="i"
                @click="item.checked = !item.checked">
                {{item.label}}
              </el-button>
              </template>
            </el-form-item>
            <!-- <el-form-item label="状态" prop="status">
               <el-radio-group v-model="ruleForm.status">
                    <el-radio :label="1">有效</el-radio>
                    <el-radio :label="0">无效</el-radio>
                  </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item>
              <el-button size="small" class="submitRight" type="primary" @click="submit('ruleForm')">提交</el-button>
            </el-form-item> -->
          </el-form>
           <span slot="footer" class="dialog-footer">
              <div class="calendar">如有个别日历调整，请点击<span @click="calendarClick" class="calendarClick">日历设置</span></div>
              <el-button size="small" class="editBtn" @click="submit('ruleForm')" :disabled="this.subdisabled">提交</el-button>
           </span>
          <CalendarDialog :chooseItem="chooseArr" :calendarShow.sync="calendarShow" :calendarArr="calendarArr" :appointTime="appointTime" @submit="submitCalendar"></CalendarDialog>
        </el-dialog>
    </div>
</template>

<script>
import { toUpdateRule } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
import CalendarDialog from './CalendarDialog'

export default {
  name: 'RuleDialog',
  components: {
    CalendarDialog
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
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
    return {
      subdisabled: this.btnDisabled,
      visible: this.show,
      abc: 'primary',
      checkDay: true,
      title: '',
      week: [
        {label: '周一', code: '0', checked: false},
        {label: '周二', code: '1', checked: false},
        {label: '周三', code: '2', checked: false},
        {label: '周四', code: '3', checked: false},
        {label: '周五', code: '4', checked: false},
        {label: '周六', code: '5', checked: false},
        {label: '周日', code: '6', checked: false}
      ],
      ruleForm: {
        ruleName: '',
        time: [],
        dayTime: true
      },
      rules: {
        ruleName: { required: true, message: '请选择规则名称', trigger: 'blur' },
        time: { required: true, message: '请输入开放时间!', trigger: 'change' }
        // status: { required: true, message: '请输入状态!', trigger: 'change' }
      },
      calendarShow: false,
      calendarArr: [],
      chooseArr: [],
      appointTime: ''
    }
  },
  methods: {
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.subdisabled = true
        const weeks = []
        this.week.forEach(i => {
          if (i.checked) {
            weeks.push(i.code)
          }
        })
        let data = {
          status: false,
          value: this.ruleForm,
          isAdd: weeks,
          chooseArr: this.chooseArr
        }
        if (this.time) {
          data.ruleTime = this.time
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
        // this.$nextTick(() => {
        //   this.$refs[formName].resetFields()
        // })
      })
    },
    dayTimeChange (e) {
      if (e === true) {
        this.checkDay = true
        let year = new Date().getFullYear()
        let month = new Date().getMonth()
        let data = new Date().getDate()
        this.ruleForm.time = [new Date(year, month, data, 0, 0, 0), new Date(year, month, data, 23, 59, 59)]
      } else {
        this.checkDay = false
      }
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
    calendarClick () {
      this.calendarShow = true
      this.calendarArr = []
      this.week.forEach(i => {
        if (i.checked) {
          this.calendarArr.push(i.code)
        }
      })
    },
    submitCalendar (e) {
      this.calendarShow = e.status
      this.chooseArr = e.chooseArr
    }
  },
  watch: {
    show () {
      let year = new Date().getFullYear()
      let month = new Date().getMonth()
      let data = new Date().getDate()
      this.visible = this.show
      if (!this.visible) return
      this.subdisabled = false
      this.chooseArr = []
      if (this.type === 'add') {
        this.title = '添加规则'
        this.checkDay = true
        this.week.forEach(i => { i.checked = true })
        this.ruleForm = {
          time: [new Date(year, month, data, 0, 0, 0), new Date(year, month, data, 23, 59, 59)],
          dayTime: true
        }
      } else {
        let amount = {
          id: this.id
        }
        this.title = '修改规则'
        toUpdateRule(getFormData(amount)).then(res => {
          if (res.data.success === true) {
            let openTime = res.data.value.openTime
            if (openTime !== '') {
              openTime = openTime.substring(0, openTime.length - 1)
              this.week.forEach(i => {
                const v = openTime.split(',').some(j => {
                  return j === i.code
                })
                i.checked = v
              })
            } else {
              this.week.forEach(i => { i.checked = false })
            }
            if (res.data.value.appointStatus === 1) {
              this.appointTime = res.data.value.appointTime
            } else {
              this.appointTime = ''
            }
            this.ruleForm = res.data.value
            if (res.data.value.dayStatus === 1) {
              this.ruleForm.dayTime = true
              this.checkDay = true
            } else {
              this.ruleForm.dayTime = false
              this.checkDay = false
            }
            const startTime = res.data.value.startTime.split(':')
            const endTime = res.data.value.endTime.split(':')
            const a = new Date(year, month, data, startTime[0], startTime[1], startTime[2])
            const b = new Date(year, month, data, endTime[0], endTime[1], endTime[2])
            this.ruleForm.time = [a, b]
            this.time = [a, b]
            this.ruleForm = Object.assign({}, this.ruleForm)
          } else {
            this.failMessage(res.data.message)
          }
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
      }
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
/* .submitRight {
  text-align: right;
} */
/* .checkedItem {
  background: #409eff;
  color: #fff;
} */
.width_305{
  width:305px;
}
/* .RuleDialog /deep/ .el-dialog__body {
  padding-bottom: 0;
}
.calendar {
  height: 56px;
  line-height: 56px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #606266;
} */
.calendarClick {
  color: #4C7EE9;
  cursor: pointer;
}
/* .calendar ::before{
    content: '';
    height: 1px;
    background: #EBEEF5;
    display: inline-block;
    position: absolute;
    bottom: 56px;
    left: 0;
    right: 0;
} */
.RuleDialog /deep/ .el-button--primary {
  background: #4C7EE9;
  color: #fff;
}
.dialog-footer {
    display: flex;
    position: relative;
    justify-content: space-between;
}
.RuleDialog /deep/ .el-dialog__footer {
    padding: 10px 20px 10px 20px;
}
.calendar {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #606266;
  line-height: 35px;
}
.dialog-footer ::before{
    content: '';
    height: 1px;
    background: #EBEEF5;
    display: inline-block;
    position: absolute;
    top: -10px;
    left: -20px;
    right: -20px;
}
</style>
