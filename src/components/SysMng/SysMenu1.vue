<template>
  <div style="height: 100%">
    <div class="listBot">
      <div class="allMenu">
          <div class="checkbox_table" v-for="(item, indexkey) in menu" :key="item.menuOrder">
              <template>
              <el-checkbox class="check" v-model='menusIds' :label="item.menuName" @change='handleCheck(1,indexkey)'>
                  {{item.menuName}}
              </el-checkbox>
              <div class="childItem">
                  <div v-for="list in item.subList" class="line_check" :key="list.menuOrder" >
                  <el-checkbox class="check2" @change='handleCheck(2,indexkey)' v-model="menusIds" :label="list.menuName">
                      {{list.menuName}}
                  </el-checkbox>
                  </div>
              </div>
              </template>
          </div>
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
      menu: [], // 所有的菜单数组
      menusIds: [], // 已选的菜单id数组
      ids: []
    }
  },
  created () {
    menuList().then(res => {
      if (res.data.success === true) {
        this.menu = res.data.value
        this.menu.forEach(item => {
          if (item.visiable === 1) {
            this.menusIds.push(item.menuName)
          }
          if (item.subList) {
            item.subList.forEach(childItem => {
              if (childItem.visiable === 1) {
                this.menusIds.push(childItem.menuName)
              }
            })
          }
        })
      } else {
        this.failMessage(res.data.message)
      }
    }).catch(res => {
      this.failMessage(res && res.data && res.data.message)
    })
  },
  methods: {
    handleCheck (type, a = 0) {
      let self = this
      if (type === 2) { // 二级菜单点击
        let index = 0
        self.menu[a].subList.map(item => {
          // console.log(item)
          if (self.menusIds.indexOf(item.menuName) > -1) {
            index += 1
          }
        })
        if (index > 0) {
          // console.log(self.menu[a].menuName)
          // console.log(self.menusIds.indexOf(self.menu[a].menuName))
          if (self.menusIds.indexOf(self.menu[a].menuName) < 0) {
            self.menusIds.push(self.menu[a].menuName)
          }
        } else {
          // console.log(self.menu[a].menuName)
          // console.log(self.menusIds.indexOf(self.menu[a].menuName))
          if (self.menusIds.indexOf(self.menu[a].menuName) >= 0) {
            self.menusIds.splice(self.menusIds.indexOf(self.menu[a].menuName), 1)
            // console.log(self.menu[a].menuName)
          }
        }
      } else {
        if (self.menusIds.indexOf(self.menu[a].menuName) > -1) {
          self.menu[a].subList.map(item => {
            if (self.menusIds.findIndex((n) => n === item.menuName) < 0) {
              self.menusIds.push(item.menuName)
            }
          })
        } else {
          self.menu[a].subList.map(item => {
            if (self.menusIds.findIndex((n) => n === item.menuName) > -1) {
              self.menusIds.splice(self.menusIds.findIndex((n) => n === item.menuName), 1)
            }
          })
        }
      }
    },
    saveMenu () {
      this.$confirm(`确认保存菜单配置吗`, '提示', {
        closeOnClickModal: false
      })
        .then(() => {
          let str = ''
          this.menu.forEach(item => {
            this.menusIds.forEach(idItem => {
              if (item.menuName === idItem) {
                str += item.id + ','
              }
            })
            if (item.subList) {
              item.subList.forEach(childItem => {
                this.menusIds.forEach(idItem => {
                  if (childItem.menuName === idItem) {
                    str += childItem.id + ','
                  }
                })
              })
            }
          })
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
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
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
.check {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #606266;
  letter-spacing: 0;
  line-height: 14px;
  margin-bottom: 20px;
}
.check2 {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #606266;
  letter-spacing: 0;
  line-height: 14px;
  margin: 0 0 13px 24px;
}
.allMenu {
    /* display: flex; */
    padding-top: 11px;
}
.childItem {
    /* margin-bottom: 13px; */
    width: 70px
}
.line_check {
    display: inline-block;
    /* margin-bottom: 13px; */
}
.saveBtn {
    /* margin-left: 40%; */
    margin-bottom: 16px;
}
</style>
