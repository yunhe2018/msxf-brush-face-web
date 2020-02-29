<template>
    <div class="header">
        <i class="icon-menu" :class="[isCollapse?'icon-menu-unfold':'icon-menu-fold']" @click="foldEvent"></i>
        <div class="headerBtn" @click="logout"><i class="el-icon-switch-button mgr-5"></i>退出</div>
        <div class="headerUser">{{this.userName}}</div>
        <div class="headerWarn mgr-30">
          <span class="header_img"><img src="@/assets/images/icon_jinggao@2x.png" /></span>
          陌生人警告：
          <!-- <el-link type="primary" @click="recordTo()" class="fs-t5">{{warnNum}}</el-link> -->
          <span class="warnNum" @click="recordTo()" >{{warnNum}}</span>
        </div>
        <div class="headerWarn mgr-30">
          <span class="header_img"><img src="@/assets/images/icon_jinggao@2x.png" /></span>
          黄名单警告：
          <!-- <el-link type="primary" @click="recordTo()" class="fs-t5">{{warnNum}}</el-link> -->
          <span class="warnNum" @click="recordTo('yellow')" >{{yellowWarnNum}}</span>
        </div>
    </div>
</template>

<script>
import {strangerCount, blackCount, getTime} from '../../axios/api.js'
import {getFormData} from '../../lib/util.js'
import {mapMutations} from 'vuex'
export default {
  name: 'Header',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      userName: '',
      warnNum: 0,
      yellowWarnNum: 0,
      flag: 0,
      yellowFlag: 0,
      time: '',
      yellowTime: '',
      diffTime: 0
    }
  },
  created () {
    this.userName = sessionStorage.getItem('userName')
    var self = this
    this.getServeTime(function () {
      self.time = sessionStorage.getItem('recordTime') || (new Date().getTime() - self.diffTime).toString()
      self.yellowTime = self.time
      self.getRecordCount()
    })
  },
  methods: {
    ...mapMutations(['setChartFlag']),
    logout () {
      this.$confirm('确认退出?', '提示', {})
        .then(() => {
          clearTimeout(this.timeOut)
          sessionStorage.removeItem('sessionId')
          this.$router.push('/login')
        })
        .catch(() => { })
    },
    foldEvent () {
      this.$emit('handleCollapse', !this.isCollapse)
      this.setChartFlag()
    },
    getRecordCount () {
      let reqData = getFormData({
        flag: this.flag,
        time: this.time
      })
      // 陌生人警告
      strangerCount(reqData).then(res => {
        if (res.data && res.data.value !== undefined) {
          this.warnNum = res.data.value
        }
      }).catch(() => {})

      let yellowReqData = getFormData({
        flag: this.yellowFlag,
        time: this.yellowTime
      })
      // 黄名单警告
      blackCount(yellowReqData).then(res => {
        if (res.data && res.data.value !== undefined) {
          this.yellowWarnNum = res.data.value
        }
      }).catch(() => {})

      // 定时查找警告
      this.intervalCount()
    },
    intervalCount () {
      this.flag = 1
      this.yellowFlag = 1
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.getRecordCount()
      }, 10000)
    },
    recordTo (type) {
      let userType = '0'
      if (type === 'yellow') {
        userType = '3'
        this.yellowFlag = 0
        this.yellowTime = (new Date().getTime() - this.diffTime).toString()
        sessionStorage.setItem('recordTime', this.yellowTime)
      } else {
        this.flag = 0
        this.time = (new Date().getTime() - this.diffTime).toString()
        sessionStorage.setItem('recordTime', this.time)
      }
      this.getRecordCount()
      this.$router.push({name: 'Record', query: {userType: userType}})
      sessionStorage.setItem('menuName', '记录管理')
      // this.reload()
    },
    getServeTime (callback) {
      getTime().then(res => {
        // 记录管理存储时间
        if (res.data.value) {
          this.diffTime = new Date().getTime() - res.data.value
          sessionStorage.setItem('diffTime', this.diffTime)
        }
        callback()
      }).catch(res => {
        callback()
      })
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row-reverse;
  padding: 14px 0 10px 0;
  /* border-bottom: 1px solid #E5E7ED; */
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  color: #606266;
  position: relative;
}
.headerBtn {
  cursor: pointer;
  width: 92px;
  text-align: center;
  border-left: 1px solid #E3E3E3;
  margin-left: 16px;
}
.headerUser{
    background: url("../../assets/images/icon_admin@2x.png") left center no-repeat;
    background-size:20px 20px;
    padding-left:30px;
    height: 20px;
}
.icon-menu{
    cursor: pointer;
    position: absolute;
    left:0;
    top:0;
    padding:16px 9px;
    width:16px;
    height: 16px;
    display: inline-block;
    background-size: 16px;
    background-position: center;
    background-repeat: no-repeat;
}
.icon-menu-fold{
    background-image: url("../../assets/images/icon_menu_fold@2x.png");
}
.icon-menu-unfold{
    background-image: url("../../assets/images/icon_menu_unfold@2x.png")
}
.header_img{
  /* display: inline-block; */
  float: left;
  margin: 1px 10px 0 0;
  width: 18px;
}
.header_img img{
  width: 100%;
}
.warnNum{
  cursor: pointer;
}
</style>
