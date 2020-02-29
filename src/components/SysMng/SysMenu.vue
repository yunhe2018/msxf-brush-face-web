<template>
  <div style="height: 100%" class="menuList">
    <div class="listBot">
        <div class="headerUser">菜单配置</div>
        <div class="treeDiv">
            <el-scrollbar style="height: 400px;">
            <el-tree
                :data="this.menu"
                show-checkbox
                node-key="id"
                :default-checked-keys="menusIds"
                @check-change="handleCheckChange"
                :default-expand-all="true"
                :props="defaultProps">
            </el-tree>
            </el-scrollbar>
        </div>
      <el-button size="small" type="primary" class="saveBtn" @click="saveMenu">保存</el-button>
    </div>
  </div>
</template>

<script>
import { menuList, updateMenuList } from '../../axios/api.js'
export default {
  name: 'SysMenu',
  inject: ['reload'],
  data () {
    return {
      btnDisabled: false,
      menu: [], // 所有的菜单数组
      menusIds: [], // 已选的菜单id数组
      ids: [],
      defaultProps: {
        children: 'subList',
        label: 'menuName'
      }
    }
  },
  created () {
    menuList().then(res => {
      if (res.data.success === true) {
        this.menu = res.data.value
        this.menu.forEach(item => {
          if (item.visiable === 1) {
            this.menusIds.push(item.id)
            if (item.subList) {
              item.subList.forEach(childItem => {
                if (childItem.visiable === 0) {
                  if (this.menusIds.indexOf(item.id) > 0) {
                    this.menusIds.splice(this.menusIds.indexOf(item.id), 1)
                    return ''
                  }
                }
              })
            }
          }
          if (item.subList) {
            item.subList.forEach(childItem => {
              if (childItem.visiable === 1) {
                if (this.menusIds.indexOf(childItem.id) < 0) {
                  this.menusIds.push(childItem.id)
                }
              }
            })
          }
          console.log(this.menusIds)
        })
      } else {
        this.failMessage(res.data.message)
      }
    }).catch(res => {
      this.failMessage(res && res.data && res.data.message)
    })
  },
  methods: {
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      if (checked) {
        data.visiable = 1
        this.menusIds.push(data.id)
      } else {
        data.visiable = 0
        this.menusIds.splice(this.menusIds.indexOf(data.id), 1)
      }
      // if (data.visiable === 0) {
      //   data.visiable = 1
      //   this.menusIds.push(data.id)
      //   if (data.subList) {
      //     data.subList.map((item) => {
      //       item.visiable = 1
      //       this.menusIds.push(item.id)
      //     })
      //   }
      // } else {
      //   data.visiable = 0
      //   this.menusIds.splice(this.menusIds.indexOf(data.id), 1)
      //   if (data.subList) {
      //     data.subList.map((item) => {
      //       item.visiable = 0
      //       this.menusIds.splice(this.menusIds.indexOf(item.id), 1)
      //     })
      //   }
      // }
    },
    saveMenu () {
      this.$confirm(`确认保存菜单配置吗`, '提示', {
        closeOnClickModal: false
      })
        .then(() => {
          this.btnDisabled = true
          let str = ''
          this.menu.forEach(item => {
            this.menusIds.forEach(idItem => {
              if (item.id === idItem) {
                str += item.id + ','
              }
            })
            if (item.subList) {
              item.subList.forEach(childItem => {
                this.menusIds.forEach(idItem => {
                  if (childItem.id === idItem) {
                    str += childItem.id + ','
                  }
                })
                if (childItem.visiable === 1) {
                  let arr = str.split(',')
                  if (arr.indexOf((item.id).toString()) < 0) {
                    str += item.id + ','
                  }
                }
              })
            }
          })
          console.log(str)
          let data = {
            id: str
          }
          updateMenuList(data).then(res => {
            if (res.data.success === true) {
              this.$message({
                message: res.data.message,
                type: 'success'
              })
              this.reload()
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
            this.btnDisabled = false
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
            this.btnDisabled = false
          })
        })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .listBot {
  padding: 0 16px 20px 24px;
} */
.headerUser {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 16px;
  font-weight: bold;
  padding: 20px 0;
  }
  .treeDiv {
    width: 100%;
    height: 405px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding-left: 24px;
    box-sizing: border-box;
    /* overflow: auto; */
  }
  .saveBtn {
    margin-top: 24px;
    background: #4C7EE9;
    border-radius: 4px;
    color: #FFF;
  }
   /* .menuList /deep/ .el-scrollbar__wrap {
     overflow-x: hidden;
   } */
   .menuList /deep/ .el-tree {
       margin: 24px 0;
   }
  .menuList /deep/ .el-tree-node__label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #303133;
    line-height: 14px;
    letter-spacing: 1px;
  }
  /* .menuList /deep/ .el-tree-node,.is-focusable,.is-checked{
    margin-bottom: 24px;
  } */
  .menuList /deep/ .el-tree-node__content {
    height: 14px;
    margin-top: 24px;
  }
   .menuList /deep/ .el-tree-node__content:fitst-child {
    height: 14px;
    margin-top: 0;
  }
.menuList /deep/ .el-tree-node__children .el-tree-node__content {
    margin-top: 12px;
}
</style>
