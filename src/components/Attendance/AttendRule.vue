<template>
  <div class="mainDev">
    <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <div class="title">考勤时间</div>
      <el-form-item label="" prop="checkWeek">
        <el-input v-model="checkWeek" style="opacity:0;width: 0;"></el-input>
        <template v-for="(item, i) in this.week">
          <el-button size="small"
          :type="item.checked?abc: ''"
          :key="i"
          @click="item.checked = !item.checked">
          {{item.label}}
        </el-button>
        </template>
      </el-form-item>
      <el-form-item prop="workTime">
        <div class="title">时间设置</div>
          <span class="txt">上班时间</span>
          <el-time-picker :editable="false"
           style="width:128px;padding-right:56px;"
          v-model="form.onWorkTime">
        </el-time-picker>
          <span class="txt">下班时间</span>
          <el-time-picker :editable="false"
           style="width:128px;padding-right:56px;"
          v-model="form.outWorkTime">
        </el-time-picker>
      </el-form-item>
      <el-form-item prop="halfDay">
        <div class="title">旷工半天</div>
        <div class="inputWrap">
          <span class="txt02">迟到超过</span><el-input maxlength=3 v-model="form.lateTime01" style="width:128px;padding-right:56px;"><template slot="append">分钟</template></el-input>
          <span class="txt03">早退超过</span><el-input maxlength=3 v-model="form.leaveTime01" style="width:128px;padding-right:56px;"><template slot="append">分钟</template></el-input>
        </div>
      </el-form-item>
      <el-form-item prop="oneDay">
        <div class="title">旷工一天</div>
        <div class="inputWrap">
          <span class="txt02">迟到超过</span><el-input maxlength=3 v-model="form.lateTime02" style="width:128px;padding-right:56px;"><template slot="append">分钟</template></el-input>
          <span class="txt03">早退超过</span><el-input maxlength=3 v-model="form.leaveTime02" style="width:128px;padding-right:56px;"><template slot="append">分钟</template></el-input>
        </div>
      </el-form-item>
    </el-form>

    <div>
      <el-button size="small" type="primary" class="saveBtn" @click="submit('ruleForm')">保存</el-button>
    </div>
  </div>
</template>

<script>
import { attendanceRuleInfo, saveAttendanceRule } from '../../axios/api.js'
export default {
  name: 'AttendRule',
  data () {
    let validateWeek = (rule, value, callback) => {
      if (this.checkWeek === '') {
        return callback(new Error('请选择考勤时间'))
      } else {
        callback()
      }
    }
    let validateWorkTime = (rule, value, callback) => {
      if (!this.form.onWorkTime) {
        callback(new Error('请选择上班时间'))
      } else if (!this.form.outWorkTime) {
        callback(new Error('请选择下班时间'))
      } else if (this.form.onWorkTime.getTime() >= this.form.outWorkTime.getTime()) {
        callback(new Error('上班时间不可晚于或等同下班时间'))
      } else {
        callback()
      }
    }
    let validateHalfDay = (rule, value, callback) => {
      const reg = /^[0-9]*$/
      if (this.form.lateTime01 === '') {
        callback(new Error('请输入旷工半天迟到分钟参数'))
      } else if (this.form.leaveTime01 === '') {
        callback(new Error('请输入旷工半天早退分钟参数'))
      } else if (!reg.test(this.form.lateTime01) || !reg.test(this.form.leaveTime01)) {
        callback(new Error('请输入1-3位正整数'))
      } else {
        callback()
      }
    }
    let validateOneDay = (rule, value, callback) => {
      const reg = /^[0-9]*$/
      if (this.form.lateTime02 === '') {
        callback(new Error('请输入旷工一天迟到分钟参数'))
      } else if (this.form.leaveTime02 === '') {
        callback(new Error('请输入旷工一天早退分钟参数'))
      } else if (!reg.test(this.form.lateTime02) || !reg.test(this.form.leaveTime02)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      form: {
        id: '',
        inVal: '',
        onWorkTime: new Date(2016, 9, 10, 9, 0),
        outWorkTime: new Date(2016, 9, 10, 18, 0),
        lateTime01: 30,
        leaveTime01: 30,
        lateTime02: 120,
        leaveTime02: 120
      },
      abc: 'primary',
      week: [
        {label: '周一', code: '2', checked: true},
        {label: '周二', code: '3', checked: true},
        {label: '周三', code: '4', checked: true},
        {label: '周四', code: '5', checked: true},
        {label: '周五', code: '6', checked: true},
        {label: '周六', code: '7', checked: false},
        {label: '周日', code: '1', checked: false}
      ],
      rules: {
        checkWeek: { validator: validateWeek, trigger: 'change' },
        workTime: { validator: validateWorkTime, trigger: 'change' },
        halfDay: { validator: validateHalfDay, trigger: 'change' },
        oneDay: { validator: validateOneDay, trigger: 'change' }
      }
    }
  },
  computed: {
    checkWeek: function () {
      return this.week.filter(i => i.checked).length > 0 ? 1 : ''
    }
  },
  mounted () {
    this.getRule()
  },
  methods: {
    failDialog (txt) {
      this.$alert(txt || '操作失败！', '提示', {
        confirmButtonText: '确定',
        type: 'error'
      })
    },
    submit (formName) {
      this.$refs['ruleForm'].validate((valid, object) => {
        if (valid) {
          const onWorkTime = this.form.onWorkTime.getHours() + ':' + this.add0(this.form.onWorkTime.getMinutes()) + ':' + this.add0(this.form.onWorkTime.getSeconds())
          const outWorkTime = this.form.outWorkTime.getHours() + ':' + this.add0(this.form.outWorkTime.getMinutes()) + ':' + this.add0(this.form.outWorkTime.getSeconds())
          const weekStr = []
          this.week.forEach(i => {
            if (i.checked) {
              weekStr.push(i.code)
            }
          })
          saveAttendanceRule({
            id: this.form.id,
            workDay: weekStr.join(','),
            startTime: onWorkTime,
            endTime: outWorkTime,
            halfDayEarly: this.form.lateTime01,
            halfDayLate: this.form.leaveTime01,
            oneDayEarly: this.form.lateTime02,
            oneDayLate: this.form.leaveTime02
          }).then(res => {
            if (res.data.success) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.getRule()
            } else {
              this.failDialog(res && res.data && res.data.message)
            }
          }).catch(erro => {
            this.failDialog('保存失败')
          })
        }
      })
    },
    getRule () {
      attendanceRuleInfo().then(res => {
        if (res.data.success) {
          this.form.id = res.data.value.id
          // workDay
          const weekStr = res.data.value.workDay
          this.week.forEach(i => {
            // if (weekStr.indexOf(i.code) !== -1) {
            //   i.checked = true
            // }
            i.checked = weekStr.indexOf(i.code) !== -1
          })
          // time
          let year = new Date().getFullYear()
          let month = new Date().getMonth()
          let data = new Date().getDate()
          const startTime = res.data.value.startTime.split(':')
          const endTime = res.data.value.endTime.split(':')
          this.form.onWorkTime = new Date(year, month, data, startTime[0], startTime[1], startTime[2])
          this.form.outWorkTime = new Date(year, month, data, endTime[0], endTime[1], endTime[2])
          // 旷工
          this.form.lateTime01 = res.data.value.halfDayEarly
          this.form.leaveTime01 = res.data.value.halfDayLate
          this.form.lateTime02 = res.data.value.oneDayEarly
          this.form.leaveTime02 = res.data.value.oneDayLate
        }
      })
    },
    add0 (num) {
      return num > 9 ? num : '0' + num
    }
  }
}
</script>

<style scoped>
.mainDev{
  padding: 0 16px 20px 24px;
  height: 100%;
  border-radius: 4px;
  background: #fff;
  /* position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  box-sizing: border-box; */
}
.mainDev /deep/ .el-button{
  font-weight: normal;
  background: #FFFFFF;
  border: 1px solid #C6CAD1;
  border-radius: 4px;
  color: #606266;
}
.mainDev /deep/ .el-button--small{
  padding: 9px 11px;
  margin-left: 0;
  margin-right: 12px;
}
.mainDev /deep/ .el-button--primary {
  background: #4C7EE9;
  color: #fff;
  border: 1px solid #4C7EE9;
}
.mainDev /deep/ .el-input-group__append{
  padding: 0 8px;
}
.mainDev /deep/ .el-input__suffix{
  right: 60px;
}
.title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 16px;
  font-weight: bold;
  padding: 20px 0;
  margin-top: 24px;
}
.title:first-child {
  margin-top: 0;
}
.txt{
  padding-right: 32px;
}
.inputWrap{
  display: flex;
}
.txt02{
  padding-right: 36px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
}
.txt03{
  padding-right: 36px;
  padding-left: 5px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
}
</style>
