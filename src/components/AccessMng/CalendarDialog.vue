<template>
    <div>
      <el-dialog
            title="日历设置"
            :visible.sync="visible"
            @close="$emit('update:calendarShow', false)"
            :close-on-click-modal=false
            class="calendarDialog"
            :before-close="handleClose"
            :append-to-body='true'
            width="856px"
            :calendarShow="calendarShow">
            <div class="calendarBtn">
              <span :class='{currone: currIndexOne === item.code}'
                  v-for='(item, index) in month'
                  :key='index'
                  @click="toggleChart(item)"
                  >{{item.name}}</span>
            </div>
            <div class="calendarTime">
                <Calendar
                    ref="CalendarDays"
                    v-on:choseDay="clickDay"
                    v-on:changeMonth="changeDate"
                    :markDate=arrs
                    :agoDayHide="a"
                    :futureDayHide="b">
                </Calendar>
            </div>
             <span slot="footer" class="dialog-footer">
                <div class="calendar"><span class="blue">s</span>蓝色日期表示当日门禁开启，<span class="white">s</span>白色日期表示当日门禁关闭，点击日期可以在两种状态中切换。</div>
                <el-button size="small" type="primary" class="editBtn" @click="saveCalendar">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { toAddAccessBusiness, toUpdateAccessBusiness } from '../../axios/api.js'
// import { getFormData, filterObjNull } from '../../lib/util.js'
import Calendar from 'vue-calendar-component'
export default {
  name: 'CalendarDialog',
  components: {
    Calendar
  },
  props: {
    calendarShow: {
      type: Boolean,
      default: false
    },
    calendarArr: {
      type: Array
    },
    appointTime: {
      type: String
    },
    chooseItem: {
      type: Array
    }
  },
  data () {
    return {
      visible: this.calendarShow,
      currIndexOne: '1',
      month: [
        { name: '1月', code: '1' },
        { name: '2月', code: '2' },
        { name: '3月', code: '3' },
        { name: '4月', code: '4' },
        { name: '5月', code: '5' },
        { name: '6月', code: '6' },
        { name: '7月', code: '7' },
        { name: '8月', code: '8' },
        { name: '9月', code: '9' },
        { name: '10月', code: '10' },
        { name: '11月', code: '11' },
        { name: '12月', code: '12' }
      ],
      arrs: [],
      a: (Date.parse(new Date((new Date().getFullYear() - 1) + '-12-31')).toString()).substr(0, 10),
      b: (Date.parse(new Date((new Date().getFullYear()) + '-12-31')).toString()).substr(0, 10),
      chooseArr: []
    }
  },
  methods: {
    time (y, m) {
      var tempTime = new Date(y, m, 0)
      var time = new Date()
      //   var saturday = []
      //   var sunday = []
      //   var Monday = []
      //   var Tuesday = []
      //   var Wednesday = []
      //   var Thursday = []
      //   var Friday = []
      var nowYear = new Date().getFullYear()
      for (var i = 1; i <= tempTime.getDate(); i++) {
        time.setFullYear(y, m - 1, i)
        var day = time.getDay()
        let sa, su, mu, tu, we, th, fr
        if (this.calendarArr.indexOf('5') >= 0 && day === 6) {
        //   saturday.push(i)
          sa = nowYear + '/' + m + '/' + i
          //   console.log(sa)
          this.arrs.push(sa)
        } else if (this.calendarArr.indexOf('6') >= 0 && day === 0) {
        //   sunday.push(i)
          su = nowYear + '/' + m + '/' + i
          //   console.log(su)
          this.arrs.push(su)
        } else if (this.calendarArr.indexOf('0') >= 0 && day === 1) {
        //   Monday.push(i)
          mu = nowYear + '/' + m + '/' + i
          this.arrs.push(mu)
        } else if (this.calendarArr.indexOf('1') >= 0 && day === 2) {
        //   Tuesday.push(i)
          tu = nowYear + '/' + m + '/' + i
          this.arrs.push(tu)
        } else if (this.calendarArr.indexOf('2') >= 0 && day === 3) {
        //   Wednesday.push(i)
          we = nowYear + '/' + m + '/' + i
          this.arrs.push(we)
        } else if (this.calendarArr.indexOf('3') >= 0 && day === 4) {
        //   Thursday.push(i)
          th = nowYear + '/' + m + '/' + i
          this.arrs.push(th)
        } else if (this.calendarArr.indexOf('4') >= 0 && day === 5) {
        //   Friday.push(i)
          fr = nowYear + '/' + m + '/' + i
          this.arrs.push(fr)
        }
      }
    //   var text = y + '年' + m + '月份' + '<br />' +
    //             '周六：' + saturday.toString() + '<br />' +
    //             '周日：' + sunday.toString() +
    //             '周一：' + Monday.toString() +
    //             '周二：' + Tuesday.toString() +
    //             '周三：' + Wednesday.toString() +
    //             '周四：' + Thursday.toString() +
    //             '周五：' + Friday.toString()
    //   console.log(text)
    },
    clickDay (data) {
    //   console.log(data) // 选中某天
      if (this.chooseArr.indexOf(data) !== -1) {
        this.chooseArr.splice(this.chooseArr.indexOf(data), 1)
      } else {
        this.chooseArr.push(data)
      }
      if (this.arrs.indexOf(data) !== -1) {
        this.arrs.splice(this.arrs.indexOf(data), 1)
      } else {
        this.arrs.push(data)
      }
    },
    changeDate (data) {
    //   console.log(data.split('/')) // 左右点击切换月份
      let month = data.split('/')
      this.currIndexOne = month[1]
    },
    toggleChart (item) {
      this.currIndexOne = item.code
      let data = ''
      if (item.code.length > 1) {
        data = (new Date().getFullYear()) + '-' + item.code + '-01'
      } else {
        data = (new Date().getFullYear()) + '-0' + item.code + '-01'
      }
      this.$refs.CalendarDays.ChoseMonth(data, false)
    },
    handleClose (done) {
      done()
      this.arrs = []
      this.chooseArr = []
    },
    saveCalendar () {
      let data = {
        status: false,
        chooseArr: this.chooseArr
      }
      this.$emit('submit', data)
    }
  },
  watch: {
    calendarShow () {
      this.visible = this.calendarShow
      this.$nextTick(() => {
        this.arrs = []
        this.chooseArr = []
        this.$refs.CalendarDays.ChoseMonth((new Date().getFullYear()) + '-01-01', false)
        this.time(new Date().getFullYear(), 1)
        this.time(new Date().getFullYear(), 2)
        this.time(new Date().getFullYear(), 3)
        this.time(new Date().getFullYear(), 4)
        this.time(new Date().getFullYear(), 5)
        this.time(new Date().getFullYear(), 6)
        this.time(new Date().getFullYear(), 7)
        this.time(new Date().getFullYear(), 8)
        this.time(new Date().getFullYear(), 9)
        this.time(new Date().getFullYear(), 10)
        this.time(new Date().getFullYear(), 11)
        this.time(new Date().getFullYear(), 12)
        if (this.chooseItem.length > 0) {
          this.chooseItem.map(item => {
            this.chooseArr.push(item)
            if (this.arrs.indexOf(item) !== -1) {
              this.arrs.splice(this.arrs.indexOf(item), 1)
            } else {
              this.arrs.push(item)
            }
          })
        } else {
          let arr = this.appointTime.split(',')
          if (arr.length > 1) {
            arr.pop()
            arr.map(item => {
              this.chooseArr.push(item)
              if (this.arrs.indexOf(item) !== -1) {
                this.arrs.splice(this.arrs.indexOf(item), 1)
              } else {
                this.arrs.push(item)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blue {
  display: inline-block;
  background: #4C7EE9;
  color: #4C7EE9;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  line-height: 18px;
  margin-right: 5px;
  border: 1px solid black;
}
.white {
  display: inline-block;
  background: #fff;
  color: #fff;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  line-height: 18px;
  margin-right: 5px;
  border: 1px solid black;
}
.calendarBtn {
    width: 396px;
    border-right: 1px solid #EBEEF5;
}
.calendarBtn .currone{
    background: #4C7EE9 !important;
    color: #FFFFFF !important;
    border: 1px solid #4C7EE9 !important;
}
.calendarBtn span {
    display: inline-block;
    text-align: center;
    line-height: 32px;
    width: 48px;
    height: 32px;
    background: #FFFFFF;
    border: 1px solid #C6CAD1;
    border-radius: 4px;
    margin: 0 12px 12px 0;
    cursor: pointer;
}
.calendarDialog /deep/ .el-dialog__body {
    display: flex;
}
.calendarTime {
    padding-left: 23px;
}
.dialog-footer {
    display: flex;
    position: relative;
    justify-content: space-between;
}
.calendarDialog /deep/ .el-dialog__footer {
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
/* 日历样式 */
.calendarDialog /deep/ .wh_content_all {
    background: #FFFFFF !important;
}
.calendarDialog /deep/ .wh_item_date {
    color: #606266 !important;
    width: 24px !important;
    height: 24px !important;
}

/*日历划过*/
.calendarDialog /deep/ .wh_item_date:hover {
    background: #fff !important;
}
.calendarDialog /deep/ .wh_isMark:hover {
    background: #4C7EE9 !important;
    color: #fff !important;
    border-radius: 50%;
}
.calendarDialog /deep/ .wh_isToday {
    background: #FFFFFF !important;
    color: #606266 !important;
}
.calendarDialog /deep/ .wh_chose_day {
    background: #FFFFFF !important;
    color: #606266 !important;
}
.calendarDialog /deep/ .wh_other_dayhide {
    color: #C0C4CC !important;
}
.calendarDialog /deep/ .wh_want_dayhide {
    color: #C0C4CC !important;
}
.calendarDialog /deep/ .wh_isMark {
    background: #4C7EE9 !important;
    color: #fff !important;
}
.calendarDialog /deep/ .wh_top_tag {
    color: #606266 !important;
}
.calendarDialog /deep/ .wh_content_li {
    color: #C0C4CC !important;
}
.calendarDialog /deep/ .wh_jiantou2 {
    border-top: 2px solid #606266 !important;
    border-right: 2px solid #606266 !important;
}
.calendarDialog /deep/ .wh_jiantou1 {
    border-top: 2px solid #606266 !important;
    border-left: 2px solid #606266 !important;
}

</style>
