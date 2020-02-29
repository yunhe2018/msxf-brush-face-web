<template>
  <div style="height:100%">
    <el-scrollbar style="height:100%">
      <template v-for="(list, i) in this.menuList">
        <el-submenu :key="i" :index="list.menuName" v-if="list.subList">
          <template slot="title" style="padding-left:10px">
            <i class="icon-menu" :style="setMenuIcon(list.menuName)"></i><span>{{list.menuName}}</span>
          </template>
          <!-- <template v-for="item in list.subList"> -->
          <el-menu-item
            class="twoMenu"
            :index="(item.menuUrl).toString()"
            v-for="(item, index) in list.subList"
            :key="index"
          >
            <span>{{item.menuName}}</span>
          </el-menu-item>
          <!-- </template> -->
        </el-submenu>

        <el-menu-item :index="(list.menuUrl).toString()" :key="i" v-else>
          <i class="icon-menu" :style="setMenuIcon(list.menuName)"></i><span slot="title">{{list.menuName}}</span>
        </el-menu-item>
      </template>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      menuIcons: {
        '首页': 'menu_home.svg',
        '人员管理': 'menu_renyuan.svg',
        '组织管理': 'menu_zuzhi.svg',
        '底库管理': 'menu_diku.svg',
        '设备管理': 'menu_shebei.svg',
        '记录管理': 'menu_jilu.svg',
        '门禁业务': 'menu_menjin.svg',
        '迎宾业务': 'menu_yingbin.svg',
        '账号管理': 'menu_zhanghao.svg',
        '系统管理': 'menu_xitong.svg',
        '考勤业务': 'menu_kaoqin.svg',
        '升级管理': 'menu_appver.svg',
        'APP升级': 'menu_appver.svg',
        '会议业务': 'menu_hyqd.svg',
        '会议管理': 'menu_hyqd.svg',
        'default': 'menu_xitong.svg'
      }
    }
  },
  props: ['menuList'],
  methods: {
    setMenuIcon (key) {
      return 'background-image:url(' + require('@/assets/images/' + (this.menuIcons[key] || this.menuIcons['default'])) + ')'
    }
  }
}
</script>

<style>
.el-menu , .el-menu-vertical-demo .el-menu{
  background-color: #1e283c !important;
  border: 0 none;
}
.el-menu .el-menu-item.is-active{
  color: #bdc0c6;
  background-color:#253148;
  border-right:solid 3px #4C7EE9;
}
.el-menu--collapse .el-menu-item.is-active{
  background-color:#4C7EE9;
}

.el-menu .el-tooltip{
  padding:0 16px !important;
}
.el-menu .el-menu-item,.el-menu  .el-submenu__title{
  color: #bdc0c6;
  height: 40px;
  line-height: 40px;
  padding:0 16px !important;
  text-align: left;
}
.twoMenu{
  height:30px !important;
  line-height: 30px !important;
}
.el-menu--vertical .twoMenu{
  margin:4px 0;
}
.el-submenu .el-menu{
  margin-top:8px;
}
.el-menu--collapse .el-tooltip,
.el-menu--collapse .el-menu-item,.el-menu--collapse  .el-submenu__title{
  padding-left:23px !important;
}

.el-menu .el-menu-item:hover,.el-menu .el-submenu__title:hover{
  background-color:#1e283c;
  color:#4C7EE9;
}
.el-menu .el-menu-item.is-active:hover{
  background-color:#253148;
}
.el-menu--collapse .el-menu-item.is-active:hover{
  background-color:#4C7EE9;
}
.el-menu .el-menu-item i,.el-menu .el-submenu__title i{
  display: inline-block;
  width:16px;
  height: 16px;
  background-position: center center;
  background-size: 100% 100%;
  margin-right:15px;
}
.el-menu--collapse span,
.el-menu--collapse i.el-submenu__icon-arrow {
  height: 0;
  width: 0;
  visibility: hidden;
  display: inline-block;
}
.el-menu .el-submenu__title .el-submenu__icon-arrow {
  color: #fff;
  margin-right:0;
}
.el-menu-vertical-demo {
  box-sizing: border-box;
  padding-top: 64px;
  height: 100%;
}
.el-menu-vertical-demo li{
  margin-bottom:8px;
}
.el-menu-vertical-demo .twoMenu li{
  margin-bottom:0;
}
.el-menu--vertical{
  left:60px !important;
}
.twoMenu {
  text-align: left;
  text-indent: 30px;
  color:#B9B9B9
}
.el-menu-vertical-demo /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-menu-vertical-demo /deep/ .el-scrollbar__bar.is-vertical > div {
  background-color: rgba(256, 256, 256, 0.6);
}
.el-tooltip__popper.is-dark{
  background-color:#253148 !important
}
.el-tooltip__popper[x-placement^=right] .popper__arrow,
.el-tooltip__popper[x-placement^=right] .popper__arrow::after,
.el-tooltip__popper[x-placement^=left] .popper__arrow,
.el-tooltip__popper[x-placement^=left] .popper__arrow::after{
  border-left-color: #253148 !important
}
</style>
