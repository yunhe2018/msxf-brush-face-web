<template>
  <div class='box'>
    <h1>
      <span class="txt">今日访问记录</span>
      <span>{{new Date(date).getFullYear()+"年"+(1+new Date(date).getMonth())+"月"+new Date(date).getDate()+"日"}}</span>
      <b>/</b>
      <span>{{week[new Date(date).getDay()-1]}}</span>
      <b>/</b>
      <span>
        {{new Date(date).getHours()+":"+
        (Number(new Date(date).getMinutes())>9?new Date(date).getMinutes():"0"+new Date(date).getMinutes())+":"+
        (Number(new Date(date).getSeconds())>9?new Date(date).getSeconds():"0"+new Date(date).getSeconds())}}</span>
    </h1>
    <div class='listDiv'>
        <div class='listWrap'>
        <div class='list' v-for='(item, index) in todayList' :key='index'>
          <div class='list_item' @click='gotoRecord(item)'>
            <h2>{{item.name}}记录</h2>
            <p>
              <span>{{item.count}}</span>
              <span class='ren'>人</span>
            </p>
            <img :src="require(`@/assets/images/${item.code}.svg`)" />
          </div>
        </div>
      </div>
    </div>
    <div class='chatWrap'>
      <div class='pTypeWrap'>
        <h3>今日分析</h3>
        <div class='pType'>
            <span :class='{curr: currIndex === item.code}'
            v-for='(item, index) in todayList'
            :key='index'
            @click="toggleChart(item)"
            ><i>{{item.name}}</i></span>
        </div>
      </div>
    <div id='myChart' :style="{width: '100%', minWidth: '600px', background: '#fff', height: '297px', paddingBottom: '30px'}"></div>
    </div>
  </div>
</template>
<script>
import { getTodayLog, getTime } from '../axios/api.js'
import {mapState} from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      diffTime: '',
      date: '',
      timer: '',
      timer02: '',
      currIndex: 'staff',
      week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      todayList: [
        {
          name: '员工',
          code: 'staff',
          value: '1',
          count: 0
        },
        {
          name: '访客',
          code: 'visitorNormal',
          value: '2',
          count: 0
        },
        {
          name: 'VIP',
          code: 'visitorVip',
          value: '4',
          count: 0
        },
        {
          name: '黄名单',
          code: 'blacklist',
          value: '3',
          count: 0
        },
        {
          name: '陌生人',
          code: 'stranger',
          value: '0',
          count: 0
        }
      ],
      todayChartList: '',
      chartList: [],
      currCount: 0 // 每种访客的总人数
    }
  },
  computed: {
    ...mapState(['chartFlag'])
  },
  methods: {
    getData () {
      getTodayLog().then(res => {
        this.todayChartList = res.data.value
        this.currCount = res.data.value.staffCount
        this.resetTodayList()
        this.reChart(this.currIndex)
      })
    },
    resetTodayList () {
      this.todayList.forEach((i) => {
        for (const j in this.todayChartList) {
          if (j.indexOf('Count') !== -1 && j.indexOf(i.code) !== -1) {
            i.count = this.todayChartList[j]
          }
        }
      })
    },
    gotoRecord (item) {
      this.$router.push({
        path: '/record',
        query: {
          userType: item.value
        }
      })
      sessionStorage.setItem('menuName', '记录管理')
      // sessionStorage.setItem('menuOrder', 5)
      this.reload()
    },
    toggleChart (item) {
      this.currIndex = item.code
      this.currCount = item.count
      this.reChart(item.code)
    },
    reChart (code) {
      let arr = []
      this.todayChartList[`${code}List`].forEach(i => {
        arr.push(i.count)
      })
      this.chartList = arr
      this.drawLine(this.currCount)
    },
    drawLine (count) {
      const total = count
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        label: {
          show: true,
          interval: 'auto',
          rotate: 0,
          formatter: null,
          textStyle: {
            color: '#333'
          }
        },
        tooltip: {
          backgroundColor: '#eee',
          borderColor: '#666',
          borderWidth: 1,
          padding: 0,
          borderRadius: 3,
          color: '#333',
          trigger: 'axis',
          formatter: function (params, ticket, callback) {
            let showHtm = ''
            for (var i = 0; i < params.length; i++) {
              // x轴名称
              const name = Number(params[i]['name']) - 1
              let namePre = ''
              let namePo = ''
              if (name === 0) {
                namePre = '00:00'
                namePo = '00:59'
              } else if (name === -1) {
                namePre = '23:00'
                namePo = '23:59'
              } else if (name < 10) {
                namePre = '0' + name + ':00'
                namePo = '0' + name + ':59'
              } else {
                namePre = name + ':00'
                namePo = name + ':59'
              }
              // 名称
              // var text = params[i][3]
              // 值
              var value = params[i]['value']
              const num = (value / total * 100).toFixed(2)
              showHtm += `<div style="color:#fff; padding:5px 10px; background: rgba(0,0,0,.7)">
                ${namePre} - ${namePo}<br>
                <div>人数(UV)：${value}&nbsp;&nbsp;|&nbsp;&nbsp;占比：${num}%</div>
                </div>`
            }
            return showHtm
          }
        },

        grid: {
          zlevel: 0,
          z: 0,
          x: 35,
          y: 20,
          x2: 17,
          y2: 20,
          // width: '100%',
          // height: <自适应>,
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 1,
          borderColor: '#ccc'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            axisLine: {
              show: true,
              onZero: true,
              lineStyle: {
                color: '#e5e5e5',
                type: 'solid',
                width: 1,
                shadowColor: 'rgba(0,0,0,0)',
                shadowBlur: 5,
                shadowOffsetX: 3,
                shadowOffsetY: 3
              }
            },
            axisTick: {
              show: true,
              inside: false,
              length: 5,
              lineStyle: {
                color: '#f90',
                type: 'solid',
                width: 0, // Y轴横线
                shadowColor: 'rgba(0,0,0,0)',
                shadowBlur: 5,
                shadowOffsetX: 3,
                shadowOffsetY: 3
              }
            },
            splitLine: { // 纬度线设置
              show: true,
              lineStyle: {
                color: '#e5e5e5',
                type: 'solid',
                width: 1,
                shadowColor: 'rgba(0,0,0,0)',
                shadowBlur: 5,
                shadowOffsetX: 3,
                shadowOffsetY: 3
              }
            },
            axisLabel: {
              show: true,
              interval: 'auto',
              rotate: 0,
              margin: 8,
              clickable: false,
              formatter: null,
              textStyle: {
                color: '#909399',
                // align: 'right',
                // baseline: <各异>,
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal'
              }
            }
          }],
        yAxis: [{
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: true,
            onZero: true,
            lineStyle: {
              color: '#e5e5e5',
              type: 'solid',
              width: 1,
              shadowColor: 'rgba(0,0,0,0)',
              shadowBlur: 5,
              shadowOffsetX: 3,
              shadowOffsetY: 3
            }
          },
          axisTick: {
            show: true,
            inside: false,
            length: 5,
            lineStyle: {
              color: '#e5e5e5',
              type: 'solid',
              width: 0, // Y轴横线
              shadowColor: 'rgba(0,0,0,0)',
              shadowBlur: 5,
              shadowOffsetX: 3,
              shadowOffsetY: 3
            }
          },
          splitLine: { // 经度线设置
            show: true,
            lineStyle: {
              color: '#e5e5e5',
              type: 'solid',
              width: 1,
              shadowColor: 'rgba(0,0,0,0)',
              shadowBlur: 5,
              shadowOffsetX: 3,
              shadowOffsetY: 3
            }
          },
          axisLabel: {
            show: true,
            interval: 'auto',
            rotate: 0,
            margin: 8,
            clickable: false,
            formatter: null,
            textStyle: {
              color: '#909399',
              align: 'right',
              // baseline: <各异>,
              fontFamily: 'Arial, Verdana, sans...',
              fontSize: 12,
              fontStyle: 'normal',
              fontWeight: 'normal'
            }
          }
        }],
        series: [
          {
            name: '访客数（UV） ',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#4C7EE9',
                areaStyle: {type: 'default'}
              }
            },
            data: this.chartList
            // data: [100, 11, 200, 31, 400, 65, 300, 7, 38, 9, 40, 11, 72, 13, 54, 15, 16, 17, 88, 19, 21, 21, 62, 23]
          }
        ]
      })
      window.addEventListener('resize', () => { myChart.resize() }) // 屏幕尺寸发生变化时触发
      myChart.resize() // 主要是当开合菜单时触发
    }
  },
  mounted () {
    getTime().then(res => {
      // 记录管理存储时间
      sessionStorage.setItem('time', res.data.value)
      this.diffTime = new Date().getTime() - res.data.value
      this.date = new Date(new Date().getTime() - this.diffTime)
    })
    this.getData()
    // 轮询/60秒
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.getData()
    }, 60000)
    // 钟表
    clearInterval(this.timer02)
    this.timer02 = setInterval(() => {
      this.date = new Date(new Date().getTime() - this.diffTime)
    }, 1000)
  },
  watch: {
    chartFlag (newVal, oldVal) {
      this.reChart(this.currIndex)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timer02)
  }
// ,
// beforeRouteLeave (to, from, next) {
//   clearInterval(this.timer)
//   clearInterval(this.timer02)
//   next()
// }
}
</script>

<style scoped>
.box{
  /* padding:0px 24px; */
  /* margin-top: 28px; */
  color: #333;
  background-color: #EBF0F5;
}
b{
  font-weight: normal;
  font-size: 17px;
  color: #666;
}
h1 span{
  font-weight: normal;
  font-size: 14px;
  color: #606266;
}
h1 .txt{
  font-weight: bold;
  font-size: 16px;
  color: #303133;
  padding: 0 20px 0 0;
}
.listDiv{
  overflow: hidden;
}
.listWrap{
  display: flex;
  justify-content:space-between;
  flex-wrap:wrap;
  margin: 14px -16px 0 0;
}
.list{
  width: 20%;
  padding: 0 16px 0 0;
  box-sizing: border-box;
  margin-bottom: 16px;
  min-width: 190px;
}
.list_item{
  padding: 20px 0 0 16px;
  box-sizing: border-box;
  height:114px;
  background-color: #fff;
  position: relative;
  border-radius: 4px;
  cursor: pointer;

}
.list h2{
  font-size: 16px;
  line-height: 16px;
  color: #606266;
}
.list p{
  font-family: Avenir-Medium;
  display: flex;
  font-size: 40px;
  line-height: 40px;
  color: #4C7EE9;
  position: absolute;
  left: 20px;
  bottom: 11px;
  z-index: 99;
}
.list p .ren{
  font-family: Avenir-Medium;
  font-size: 20px;
  margin: 3px 0 0 2px
}
.list img{
  width: 55px;
  position: absolute;
  right: 10px;
  bottom: 10px;
}
.chatWrap{
  background-color: #fff;
  border-radius: 4px;
  padding: 0 0 0px 16px;
}
.pTypeWrap{
  overflow: hidden;
}
.pTypeWrap h3{
  color: #606266;
  float: left;
  font-size: 16px;
  line-height: 16px;
  padding-top: 28px;
}
.pTypeWrap .pType{
  float: right;
  margin-top: 20px;
  margin-right: 16px;
  display: flex;
  justify-content:flex-end;
  border-radius: 4px;
  /* overflow: hidden; */
  border: 1px solid #dcdfe6;
}
.pTypeWrap .pType span{
  position: relative;
  cursor: pointer;
  display: inline-block;
  height: 30px;
  border-right: 1px solid #dcdfe6;
  background: #fff;
  line-height: 30px;
  width: 64px;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  color: #606266;
}
.pTypeWrap .pType span i{
  position: absolute;
  font-style: normal;
  width:65px;
  height:32px;
  left: -1px;
  top: -1px;
}
.pTypeWrap .pType span:first-child{
  border-top-left-radius:4px;
  border-bottom-left-radius:4px;
}
.pTypeWrap .pType span:first-child i{
  border-top-left-radius:4px;
  border-bottom-left-radius:4px;
}
.pTypeWrap .pType span:last-child{
  border-right: none;
}
.pTypeWrap .pType span:last-child{
  border-top-right-radius:4px;
  border-bottom-right-radius:4px;
}
.pTypeWrap .pType span:last-child i{
  border-top-right-radius:4px;
  border-bottom-right-radius:4px;
}
.pTypeWrap .pType .curr i{
  background: #4C7EE9;
  color: #fff;
  /* border: 1px solid #4C7EE9; */
}
</style>
