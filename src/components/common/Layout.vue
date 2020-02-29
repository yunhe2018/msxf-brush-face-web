<template>
  <el-container class="homeContainer">
  <el-aside :width="isCollapse? '64px' : '200px'" style="position:relative;">
    <div class="homeTitle" @click="gohome">
      <img v-if="isDefault" src="../../assets/images/default_logo.svg" class="logo" >
      <img v-else-if="logoInfo.smallLogo" class="logo" :src="apiPrefix + logoInfo.smallLogo">
      <span v-show="!isCollapse">刷脸通管理平台</span>
    </div>
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="this.$route.path.replace(/Detail$/,'')"
      router
      :collapse="isCollapse"
      :collapse-transition="false"
      unique-opened>
      <Menu :menuList="menuList"></Menu>
    </el-menu>
  </el-aside>
  <el-container>
    <el-header height="48px">
      <Header :isCollapse="isCollapse" @handleCollapse="collapseEvent"></Header>
    </el-header>
    <el-main>
      <div style="height:100%;" class="dialogAndScrollbar">
        <el-scrollbar style="height:100%;">
          <router-view></router-view>
        </el-scrollbar>
      </div>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import Menu from './Menu'
import Header from './Header'
// import menuData from './menu.json'
import { menuList, getSysLogoInfo } from '@/axios/api.js'
import consts from '@/lib/constant.js'

export default {
  name: 'Layout',
  components: {
    Menu,
    Header
  },
  data () {
    return {
      msg: '',
      menuList: [],
      isCollapse: false,
      curActive: 'home',
      logoInfo: '',
      apiPrefix: consts.apiPrefix,
      isDefault: false,
      unCollapse: {
        width: '220px'
      },
      collapse: {
        width: '50px'
      },
      unCollapseMain: {
        paddingLeft: '220px'
      },
      collapseMain: {
        paddingLeft: '50px'
      }
    }
  },
  created () {
    menuList({}).then(res => {
      this.menuList = res.data.value
    })
  },
  mounted () {
    this.getLogo()
  },
  methods: {
    collapseEvent (isCollapse) {
      this.isCollapse = isCollapse
    },
    gohome () {
      this.$router.push({
        path: '/home'
      })
    },
    getLogo () {
      getSysLogoInfo().then(res => {
        if (res.data.code === '1') {
          this.logoInfo = res.data.value
          localStorage.setItem('logoInfo', JSON.stringify(res.data.value))
        } else {
          // localStorage.removeItem('logoInfo')
          if (localStorage.getItem('logoInfo')) {
            this.logoInfo = JSON.parse(localStorage.getItem('logoInfo'))
          } else {
            this.isDefault = true
            this.logoInfo = this.DefaultLogoInfo
          }
        }
      }).catch(erro => {
        if (localStorage.getItem('logoInfo')) {
          this.logoInfo = JSON.parse(localStorage.getItem('logoInfo'))
        } else {
          this.isDefault = true
          this.logoInfo = this.DefaultLogoInfo
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .homeContainer {
    height: 100%;
  }
  .logo {
    display: inline-block;
    height: 25px;
    margin-right: 5px;
  }
  .el-header {
    color:#606266;
    height:48px;
    line-height: 48px;
    background-color:#fff;
  }
  .el-aside {
    text-align: center;
    line-height: 200px;
    height: 100%;
    background-color:#1E283C
  }
  .el-menu{
    border:0 none;
    background-color: #1E283C;
  }
  .el-main {
    color: #606266;
    margin: 16px;
    padding: 0px;
    /* background-color: #fff; */
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .homeTitle {
    display: flex;
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    z-index: 9;
    cursor: pointer;
    height: 64px;
    line-height: 62px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    align-items: center;
    justify-content:left;
    padding-left:16px;
    box-sizing: border-box
  }
  .homeTitle img{
    padding: 18px 0px 20px 0px;
  }
</style>
