<template>
  <div class="dialogDiv">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :show="show"
    >
      <div style="height:420px;" class="dialogAndScrollbar">
        <el-scrollbar style="height:100%;">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="底库名称" prop="libraryName">
              <el-input v-model.trim="ruleForm.libraryName" class="width_428"></el-input>
            </el-form-item>
            <el-form-item label="选择底库" class="checkBlary">
              <template>
                <div class="treeWrap">
                  <div style="height:286px;" class="dialogAndScrollbar">
                    <el-scrollbar style="height:100%;">
                      <el-input
                        style="width:90%;display:block;margin:10px auto 5px"
                        clearable
                        placeholder="输入关键字进行过滤"
                        v-model="filterText"
                      ></el-input>
                      <el-tree
                        :data="data"
                        :props="defaultProps"
                         node-key="id"
                         :accordion="true"
                        :default-expanded-keys="this.idArr"
                        :filter-node-method="filterNode"
                        :expand-on-click-node="false"
                        ref="tree"
                        @node-click="handleNodeClick"
                      >
                      <span class="custom-tree-node" slot-scope="{ node, data  }">
                        <span>
                            <i :class="data.icon"></i>{{ node.label }}
                        </span>
                    </span>
                      </el-tree>
                    </el-scrollbar>
                  </div>
                </div>
              </template>
              <div class="rightDiv">
                <el-scrollbar style="height:100%;">
                  <h3 class="rightHeader">已选</h3>
                  <div v-for="(item, index) in checkAmount" :key="index" class="singal">
                    <div>{{item.name}}</div>
                    <div class="deleteBrary" @click="deleteBrary(item.name, index)">X</div>
                  </div>
                </el-scrollbar>
              </div>
            </el-form-item>
            <div class="dblMessage" v-if="toast===false">请双击触发</div>
            <div class="dblMessageToast" v-else>请选择底库</div>
            <el-form-item label="备注" prop="content">
              <el-input
                type="textarea"
                maxlength="100"
                show-word-limit
                v-model.trim="ruleForm.content"
                class="width_428"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="状态" prop="status"
                        :rules="{ required: true, message: '请选择状态', trigger: 'blur' }">
                        <el-radio v-model="ruleForm.status" :label="1">有效</el-radio>
                        <el-radio v-model="ruleForm.status" :label="0">无效</el-radio>
            </el-form-item>-->
            <!-- <el-form-item>
                          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>-->
          </el-form>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { toAddLibrary, toUpdateLibrary } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
export default {
  name: 'AddStorage',
  props: {
    show: {
      type: Boolean
    },
    type: {
      type: String
    },
    id: {
      type: Number
    },
    btnDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      subdisabled: this.btnDisabled,
      filterText: '',
      visible: this.show,
      ruleForm: {},
      data: [],
      libraryIds: [],
      orgIds: [],
      userIds: [],
      checkAmount: [],
      amount: [],
      arr: [],
      idArr: [],
      title: '',
      toast: false,
      num: 1,
      rules: {
        libraryName: [
          { required: true, message: '请输入底库名称！', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '底库名称长度为2-20个字符',
            trigger: 'blur'
          }
        ]
        // status: { required: true, message: '请选择状态!', trigger: 'change' }
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      timeout: ''
    }
  },
  created () {},
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    submitForm (formName) {
      if (this.checkAmount.length < 1) {
        this.toast = true
        return ''
      }
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.subdisabled = true
        let toorgIds = ''
        let tolibraryIds = ''
        let touserIds = ''
        this.orgIds.map(item => {
          toorgIds += item + ','
        })
        this.libraryIds.map(item => {
          tolibraryIds += item + ','
        })
        this.userIds.map(item => {
          touserIds += item + ','
        })
        let data = {
          status: false,
          value: this.ruleForm,
          checkAmount: this.checkAmount,
          orgIds: toorgIds,
          libraryIds: tolibraryIds,
          userIds: touserIds
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
        // this.checkAmount = []
        // this.libraryIds = []
        // this.orgIds = []
        // this.userIds = []
        // this.data = []
        // this.$nextTick(() => {
        //   this.$refs[formName].resetFields()
        // })
      })
    },
    handleNodeClick (data) {
      this.arr.push(data.name)
      if (this.arr.length < 3) {
        if (this.arr[1]) {
          if (this.arr[1] === this.arr[0]) {
            this.num += 1
            this.arr = []
          } else {
            this.arr.shift()
            this.num = 1
          }
        }
      } else {
        this.arr = []
      }
      if (this.num > 1) {
        // if (this.amount.indexOf(data.name) < 0) {
        if (this.userIds.indexOf(data.userId) < 0) {
          if (data.userName) {
            this.userIds.push(data.userId)
            this.checkAmount.push({ userId: data.userId, name: data.name })
          }
          this.amount.push(data.name)
        }
        if (this.orgIds.indexOf(data.id) < 0) {
          if (data.orgName) {
            this.orgIds.push(data.id)
            this.checkAmount.push({ orgIds: data.id, name: data.name })
          }
          this.amount.push(data.name)
        }
        if (this.libraryIds.indexOf(data.libraryIds) < 0) {
          if (data.libraryName) {
            this.libraryIds.push(data.id)
            this.checkAmount.push({ libraryIds: data.id, name: data.name })
          }
          this.amount.push(data.name)
        }
        this.toast = false
        // }
        this.num = 1
      }
    },
    renderChildren (amount) {
      // console.log(amount)
      amount.forEach(item => {
        // if (item) {
        // item.name = item.userName || item.orgName
        if (item.userCount) {
          item.name = item.userName
            ? item.userName + '(' + item.userCount + ')'
            : item.orgName + '(' + item.userCount + ')'
        } else {
          item.name = item.userName || item.orgName
        }
        item.icon = item.userName ? 'el-icon-user' : 'el-icon-s-home'
        if (item.children) {
          if (item.userList) {
            item.children = item.children.concat(item.userList)
          }
          this.renderChildren(item.children)
        } else {
          if (item.userList) {
            item.children = []
            item.userList.map(userItem => {
              userItem.icon = 'el-icon-user'
              userItem.name = userItem.userName
            })
            item.children = item.children.concat(item.userList)
          }
        }
        // }
      })
      // console.log(amount)
    },
    deleteBrary (item, index) {
      if (this.libraryIds.indexOf(this.checkAmount[index].libraryIds) >= 0) {
        this.libraryIds.splice(
          this.libraryIds.indexOf(this.checkAmount[index].libraryIds),
          1
        )
      }
      if (this.userIds.indexOf(this.checkAmount[index].userId) >= 0) {
        this.userIds.splice(
          this.userIds.indexOf(this.checkAmount[index].userId),
          1
        )
      }
      if (this.orgIds.indexOf(this.checkAmount[index].orgIds) >= 0) {
        this.orgIds.splice(
          this.orgIds.indexOf(this.checkAmount[index].orgIds),
          1
        )
      }
      this.checkAmount.splice(index, 1)
      this.amount.splice(index, 1)
    },
    handleClose (done) {
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
      done()
      this.amount = []
      this.arr = []
      this.checkAmount = []
      this.libraryIds = []
      this.orgIds = []
      this.userIds = []
      this.data = []
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    show () {
      this.visible = this.show
      if (!this.show) return false
      this.subdisabled = false
      // if (!this.visible) return
      this.checkAmount = []
      this.libraryIds = []
      this.orgIds = []
      this.userIds = []
      this.data = []
      if (this.type === 'modifiy') {
        this.title = '编辑底库管理'
        // this.checkAmount = []
        // this.libraryIds = []
        // this.orgIds = []
        // this.userIds = []
        let data = {
          id: this.id
        }
        toUpdateLibrary(getFormData(data))
          .then(res => {
            if (res.data.success === true) {
              res.data.value.orgList.map(item => {
                if (item.orgName) {
                  this.idArr.push(item.id)
                }
              })
              this.ruleForm = res.data.value.libraryBean
              const library = res.data.value.libraryBean.selectNames.library
              const org = res.data.value.libraryBean.selectNames.org
              const user = res.data.value.libraryBean.selectNames.user
              this.renderChildren(res.data.value.orgList)
              this.data = res.data.value.orgList
              res.data.value.libraryList.map(item => {
                item.name = item.libraryName
                this.data.push(item)
              })
              if (library) {
                for (var key in library) {
                  this.libraryIds.push(key)
                  this.checkAmount.push({
                    libraryIds: key,
                    name: library[key]
                  })
                }
              }
              if (org) {
                for (var keyo in org) {
                  this.orgIds.push(keyo)
                  this.checkAmount.push({ orgIds: keyo, name: org[keyo] })
                }
              }
              if (user) {
                for (var keys in user) {
                  this.userIds.push(keys)
                  this.checkAmount.push({ userId: keys, name: user[keys] })
                }
              }
            } else {
              this.failMessage(res.data.message)
            }
          })
          .catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
      } else {
        this.title = '新增底库管理'
        this.ruleForm = {
          // status: 1
        }
        toAddLibrary()
          .then(res => {
            if (res.data.success === true) {
              res.data.value.orgList.map(item => {
                if (item.orgName) {
                  this.idArr.push(item.id)
                }
              })
              this.renderChildren(res.data.value.orgList)
              this.data = res.data.value.orgList
              res.data.value.libraryList.map(item => {
                item.name = item.libraryName
                this.data.push(item)
              })
            } else {
              this.failMessage(res.data.message)
            }
          })
          .catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        this.checkAmount = []
        this.orgIds = []
        this.userIds = []
        this.libraryIds = []
      }
      this.ruleForm = Object.assign({}, this.ruleForm)
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
.headerUser {
  font-size: 22px;
  border-bottom: 1px solid #e5e7ed;
  height: 30px;
  line-height: 30px;
}
.el-form-item /deep/ .el-button {
  margin-left: 30%;
}
.checkBlary /deep/ .el-form-item__content {
  display: flex;
  justify-content: flex-start;
}
.checkBlary {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #606266;
  letter-spacing: 0;
  line-height: 14px;
}
.treeWrap {
  width: 210px;
  border: 1px solid #dcdfe6;
  height: 286px;
  border-radius: 4px;
}
.rightDiv {
  width: 210px;
  height: 286px;
  border: 1px solid #dcdfe6;
  margin-left: 8px;
  border-radius: 4px;
  padding: 18px 0 0 16px;
  font-size: 14px;
  box-sizing: border-box;
}
.rightHeader {
  font-size: 14px;
  line-height: 32px;
}
.singal {
  display: flex;
  justify-content: space-between;
  line-height: 28px;
}
.dblMessage {
  margin-left: 100px;
  margin-top: -15px;
}
.dblMessageToast {
  color: red;
  margin-left: 140px;
  margin-top: -15px;
}
.deleteBrary {
  cursor: pointer;
  color: #dcdfe6;
  margin-right: 16px;
}
.width_428 {
  width: 428px;
}
</style>
