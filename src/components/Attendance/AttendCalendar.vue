<template>
  <div class="mainDev">
    <div class="headerTxt">
      {{attend.userName}}的考勤
      <span class="monthTxt">{{form.month}}</span>
      <div class="btnDiv">
        <el-button size="small" @click="goback">返回</el-button>
        <el-button size="small" :loading="attendDetailloading" @click="attendExport">导出</el-button>
      </div>
    </div>
    <div class="calendarDiv">
      <div class="calendar-header">
        <span v-for="(item, index) in weeks" :key="index">{{item.label}}</span>
      </div>
      <div class="calendar-body">
        <div class="item" v-for="(item, index) in showData" :key="index">
          <p class="date" v-if="item.date">{{item.date}}</p>
          <p class="status">
            <span class="late" v-if="item.workStatus&&item.workStatus.indexOf('迟到') !== -1">迟</span>
            <span class="leave" v-if="item.workStatus&&item.workStatus.indexOf('早退') !== -1">退</span>
            <span class="away" v-if="item.workStatus&&item.workStatus.indexOf('全旷') !== -1">全旷</span>
            <span class="away" v-if="item.workStatus&&item.workStatus.indexOf('半旷') !== -1">半旷</span>
          </p>
          <p class="time">
            <span>{{item.onWorkTime}}</span>
            <span v-if="item.onWorkTime && item.offWorkTime">~</span>
            <span>{{item.offWorkTime}}</span></p>
        </div>
      </div>
    </div>
    <div class="btmTxt">
      <span>姓名：<b>{{attend.userName}}</b></span>
      <span>应出勤：<b>{{attend.attendanceNums}}</b>天</span>
      <span>实际出勤：<b>{{attend.realNum}}</b>天</span>
      <span>迟到：<b>{{attend.lateNum}}</b>次</span>
      <span>早退：<b>{{attend.earlyNum}}</b>次</span>
      <span>旷工：<b>{{attend.lackNum}}</b>天</span>
      <!-- <span>缺卡：<b>{{attend.onLackNum + attend.offLackNum}}</b>次</span> -->
    </div>
  </div>
</template>

<script>
import { attendanceDetails, detailsExport } from '../../axios/api.js'
import { getFormData } from '../../lib/util.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'AttendMng',
  components: {
  },
  data () {
    return {
      form: {
        userId: '',
        month: ''
      },
      weeks: [
        {label: '周一', code: '2'},
        {label: '周二', code: '3'},
        {label: '周三', code: '4'},
        {label: '周四', code: '5'},
        {label: '周五', code: '6'},
        {label: '周六', code: '7'},
        {label: '周日', code: '1'}
      ],
      attend: [],
      showData: []
    }
  },
  computed: {
    ...mapState(['attendDetailloading'])
  },
  created () {
    this.form.userId = this.$route.query.userId
    this.form.month = this.$route.query.month
    this.attend.userName = this.$route.query.userName
    this.attend.attendanceNums = this.$route.query.attendanceNums
    this.attend.realNum = this.$route.query.realNum
    this.attend.lateNum = this.$route.query.lateNum
    this.attend.earlyNum = this.$route.query.earlyNum
    this.attend.lackNum = this.$route.query.lackNum
    // this.attend.onLackNum = this.$route.query.onLackNum
    // this.attend.offLackNum = this.$route.query.offLackNum
  },
  mounted () {
    const currDate = new Date(this.form.month + '-01')
    const weekDay = currDate.getDay() - 1 // 1号weekDay - 1 = 前面空几天，注意星期日是1
    const dates = this.getDaysOfMonth(currDate.getFullYear(), currDate.getMonth() + 1) // 当月总天数
    const afterDay = 7 - (weekDay + dates) % 7 // ’日历‘尾部空的天数
    const pre = this.setEmpty(weekDay)
    const after = this.setEmpty(afterDay)

    const userId = this.form.userId
    const month = this.form.month + '-01'
    let data = getFormData({
      userId: userId,
      month: month
    })
    attendanceDetails(data).then(res => {
      if (res.data.code === '1') {
        res.data.value.forEach((i, index) => {
          i.date = index + 1
        })
        this.showData = pre.concat(res.data.value, after)
      } else {
        this.$message({
          message: res.data.message,
          type: 'error'
        })
      }
    })
  },
  methods: {
    ...mapMutations(['attendDetailloadingShow', 'attendDetailloadingHide']),
    attendExport () {
      // console.log(this.form)
      // 二次确认
      this.$confirm('是否确认导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.attendDetailloadingShow()
        const userId = this.form.userId
        const month = this.form.month + '-01'
        let data = getFormData({
          userId: userId,
          month: month
        })
        detailsExport(data).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '考勤详情.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
          this.attendDetailloadingHide()
          this.$message({
            message: '导出成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
    },
    setEmpty (num) {
      let arr = []
      for (let i = 0; i < num; i++) {
        arr.push({date: ''})
      }
      return arr
    },
    getDaysOfMonth (year, month) {
      /* 获取某个月的总天数 */
      var date = new Date(year, month, 0)
      var days = date.getDate()
      return days
    },
    goback () {
      this.$router.push({
        path: '/attendance/statistic',
        query: {cacheCondition: true}
      })
    }
  }
}
</script>

<style scoped>
.mainDev{
  padding: 0 16px 20px 16px;
  background: #fff;
  border-radius: 4px;
  /* height: 100%; */
}
.headerTxt{
  font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #303133;
    line-height: 16px;
    font-weight: bold;
    padding: 20px 0;
    position: relative;
}

.btnDiv{
  position: absolute;
  right: 0px;
  top: 10px;
}
.monthTxt{
  font-size: 14px;
  color: #606266;
  padding-left: 10px;
}
.calendarDiv{
  border: 1px solid #EBEEF5;
  border-bottom: 1px none;
}
.calendar-header{
  display: flex;
  background: #F2F6FC;
}
.calendar-header span{
  text-align: center;
  width: 14.28%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #606266;
  box-sizing: border-box;
  border-bottom: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
}
.calendar-header span:last-child{
  border-right: none;
}

.calendar-body{
  display: flex;
  flex-wrap: wrap;
}
.calendar-body .item{
  position: relative;
  width: 14.28%;
  height: 74px;
  /* text-align: center; */
  box-sizing: border-box;
  border-bottom: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
  box-sizing: border-box;
  padding: 9px;
}
.calendar-body .item:nth-child(7n){
  border-right: none;
  /* background: #dadada; */
}
/* .calendar-body .item:nth-child(1), .calendar-body .item:nth-child(8), .calendar-body .item:nth-child(15), .calendar-body .item:nth-child(22), .calendar-body .item:nth-child(29), .calendar-body .item:nth-child(36){
  background: #dadada;
} */
.calendar-body .date{
  font-size: 16px;
  color: #606266;
}
.calendar-body .status{
  position: absolute;
  top: 9px;
  right: 9px;
  font-size: 12px;
}
.calendar-body .status span{
  display: inline-block;
  border-radius: 20px;
  /* width: 20px; */
  height:20px;
  padding: 0 4px;
  line-height: 20px;
  text-align: center;
  color: #fff;
}
.late{
  background: #4C7EE9;
}
.leave{
  background: #3BC602;
}
.away{
  background: #F05F32;
}
.calendar-body .time{
  position: absolute;
  bottom: 9px;
  left: 9px;
  font-size: 12px;
  color:#909399;
}
.btmTxt{
  font-size: 14px;
  color: #606266;
  padding: 20px 0;
}
.btmTxt span{
  padding-right: 35px;
}
.btmTxt span b{
  padding: 0 5px 0 1px;
}
</style>
