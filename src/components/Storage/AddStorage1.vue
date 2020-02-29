<template>
    <div class="dialogDiv">
      <el-dialog
            :title="title"
            width="800px"
            :visible.sync="visible"
            @close="$emit('update:show', false)"
            :before-close="handleClose"
            :close-on-click-modal=false
            :show="show">
            <div style="height:400px" class="dialogAndScrollbar">
                <el-scrollbar style="height:100%;">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                      <el-form-item size="small" label="底库名称" prop="libraryName">
                          <el-input v-model.trim="ruleForm.libraryName" style="width:600px"></el-input>
                      </el-form-item>
                      <el-form-item label="选择底库" class="checkBlary">
                        <template>
                          <div class="treeWrap">
                            <div style="height:286px;width:260px;" class="dialogAndScrollbar">
                                <el-scrollbar style="height:100%;">
                                  <el-input
                                    style="width:90%;display:block;margin:10px auto 5px"
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText">
                                  </el-input>
                                  <el-tree
                                  style="width:260px;"
                                  class="filter-tree"
                                  :data="data"
                                  ref="tree"
                                  show-checkbox
                                  :props="defaultProps"
                                  node-key="code"
                                  :filter-node-method="filterNode"
                                  @check-change="handleCheckChange"
                                  :expand-on-click-node="false">
                                  </el-tree>
                                </el-scrollbar>
                              </div>
                          </div>
                        </template>
                        <div class="toRight"><span></span></div>
                        <div class="rightDivWrap">
                          <div class="rightDiv dialogAndScrollbar">
                            <el-scrollbar style="height:100%;">
                              <h3 class="rightHeader">已选</h3>
                              <el-tree
                                :data="rightData"
                                ref="rightTree"
                                style="width:250px;"
                                :props="defaultProps"
                                node-key="code"
                                default-expand-all
                                :expand-on-click-node="false"
                                :render-content="rightRenderContent">
                              </el-tree>
                            </el-scrollbar>
                          </div>
                          <div class="el-form-item__error" v-if="rightData.length === 0">请选择底库!</div>
                        </div>
                      </el-form-item>
                      <el-form-item label="备注" prop="content">
                          <el-input style="width:600px" type="textarea" maxlength="100" show-word-limit v-model.trim="ruleForm.content"></el-input>
                      </el-form-item>
                  </el-form>
                </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" class="editBtn" @click="submitForm('ruleForm')">提交</el-button>
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
    }
  },
  data () {
    return {
      ids: {
        orgIds: '',
        libraryIds: '',
        userIds: ''
      },
      filterText: '',
      visible: this.show,
      ruleForm: {},
      data: [],
      initCheckedKeys: [],
      rightData: [],
      checkAmount: [],
      libraryIds: [],
      orgIds: [],
      userIds: [],
      amount: [],
      arr: [],
      title: '',
      toast: false,
      num: 1,
      rules: {
        libraryName: [
          { required: true, message: '请输入底库名称！', trigger: 'blur' },
          { min: 2, max: 20, message: '底库名称长度为2-20个字符', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    getIds (data) {
      if (data.length > 0) {
        data.forEach(i => {
          if (i.orgName && i.isChoose) {
            this.ids.orgIds = `${this.ids.orgIds}${i.id},`
          } else if (i.userName && i.isChoose) {
            this.ids.userIds = `${this.ids.userIds}${i.userId},`
          } else if (i.libraryName && i.isChoose) {
            this.ids.libraryIds = `${this.ids.libraryIds}${i.id},`
          }
          if (i.children && i.children.length > 0 && !i.isChoose) {
            this.getIds(i.children)
          }
        })
      }
    },
    getCheckAmount (data) { // 过滤掉半选状态的元素
      data.forEach(i => {
        if (i.isChoose) {
          this.checkAmount.push(i)
        }
        if (i.children && i.children.length > 0) {
          this.getCheckAmount(i.children)
        }
      })
    },
    submitForm (formName) {
      this.ids.orgIds = ''
      this.ids.userIds = ''
      this.ids.libraryIds = ''
      this.getIds(this.rightData)
      this.getCheckAmount(this.rightData)
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.rightData.length < 1) {
          this.toast = true
          return ''
        }
        // console.log(this.rightData)
        let data = {
          status: false,
          value: this.ruleForm,
          checkAmount: this.checkAmount,
          ...this.ids
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
        })
      })
    },
    rightRenderContent (h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{`${node.label}`}</span>
          </span>
          <span class="tree_btnWrap" on-click={ () => this.removeKey(node, data) }>
            删除
          </span>
        </span>)
    },
    removeKey (node, data) {
      let keys = this.$refs.tree.getCheckedKeys()

      // 删除所有子级code 得逐层向下删
      this.removeChildrenCode(keys, data)
      // 删除父级code 得逐层向上删
      this.removeParentCode(keys, node)
      // 删除当前code
      // if (node.leve === 1)
      if (keys.some(i => i === data.code)) {
        keys.splice(keys.indexOf(data.code), 1)
      }
      // 重置tree结构
      this.$refs.tree.setCheckedKeys(keys)

      // 確保刪除當前節點
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.code === data.code)
      children.splice(index, 1)
    },
    removeParentCode (keys, node) {
      const parent = node.parent
      // console.log(parent.parent)
      // console.log(parent.parent.data)
      if (parent.level !== 0) {
        if (keys.some(i => i === parent.data.code)) {
          keys.splice(keys.indexOf(parent.data.code), 1)
        }
      }
      if (parent.level >= 2) { // 若level = 1的元素,没有父级
        this.removeParentCode(keys, parent)
      }
    },
    removeChildrenCode (keys, data) { // 有children，删除所有下级、下下级的code
      if (data.children && data.children.length > 0) {
        data.children.forEach(v => {
          if (keys.some(i => i === v.code)) {
            keys.splice(keys.indexOf(v.code), 1)
          }
          this.removeChildrenCode(keys, v)
        })
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleCheckChange (data, checked, indeterminate) {
      setTimeout(() => {
        data.isChoose = checked
        this.initRightData()
      }, 150)
    },
    initRightData () {
      this.$nextTick(() => {
        const checkedKeys = this.$refs.tree.getCheckedKeys() // 选中节点ID
        const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys() // 半选中节点ID
        // console.log(checkedKeys, halfCheckedKeys)
        const showTree = JSON.parse(JSON.stringify(this.data))
        this.rightData = this.checkedFilter(showTree, checkedKeys, halfCheckedKeys)
        // console.log(this.rightData)
      })
    },
    checkedFilter (data, checkedKeys, halfCheckedKeys) {
      for (let i = 0; i < data.length; i++) {
        if (checkedKeys.indexOf(data[i].code) === -1 && halfCheckedKeys.indexOf(data[i].code) === -1) {
          // console.log('执行了' + data[i].code + data[i].name)
          data.splice(i, 1)
          i--
        } else if (data[i].children && data[i].children.length > 0) {
          this.checkedFilter(data[i].children, checkedKeys, halfCheckedKeys)
        }
      }
      return data
    },
    initCheckedKeysFun (data) {
      data.forEach(i => {
        if (i.isChoose) {
          this.initCheckedKeys.push(i.code)
          if (i.children && i.children.length > 0) { // 如果上级是true全选状态，也把它下面所有元素的isChoose改为true
            const j = i.children
            j.forEach(v => {
              v.isChoose = true
              // this.initCheckedKeys.push(i.code)
            })
          }
        }
        if (i.children && i.children.length > 0) {
          this.initCheckedKeysFun(i.children)
        }
      })
    },
    renderChildren (amount) {
      amount.forEach(item => {
        // item.name = item.userName || item.orgName
        if (item.userCount) {
          item.name = item.userName ? item.userName + '(' + item.userCount + ')' : item.orgName + '(' + item.userCount + ')'
        } else {
          item.name = item.userName || item.orgName
        }
        if (item.children) {
          item.children = item.children.concat(item.userList)
          this.renderChildren(item.children)
        } else {
          if (item.userList) {
            item.children = []
            item.userList.map(userItem => {
              userItem.name = userItem.userName
            })
            item.children = item.children.concat(item.userList)
          }
        }
      })
    },
    handleClose (done) {
      this.$refs['ruleForm'].clearValidate()
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
      this.data = []
      this.initCheckedKeys = []
      this.rightData = []
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })

      this.visible = this.show
      if (!this.show) return
      if (this.type === 'modifiy') {
        this.title = '编辑底库'
        this.checkAmount = []
        let data = {
          id: this.id
        }
        toUpdateLibrary(getFormData(data)).then(res => {
          if (res.data.success === true) {
            this.ruleForm = res.data.value.libraryBean
            this.renderChildren(res.data.value.orgList)
            this.data = res.data.value.orgList
            res.data.value.libraryList.map(item => {
              item.name = item.libraryName
              item.code = item.libraryName // 后台没有给libraryList（只有一个访客数据）里面的元素加唯一标示code，这里是自己加的，新增也有同样操作。
              this.data.push(item)
            })
            this.initCheckedKeysFun(this.data)
            // console.log(this.data)
            // console.log(this.initCheckedKeys)
            this.$refs.tree.setCheckedKeys(this.initCheckedKeys) // init 左侧tree
            this.initRightData() // init 右侧tree
          } else {
            this.failMessage(res.data.message)
          }
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
      } else {
        this.ruleForm = {}
        this.title = '新增底库'
        toAddLibrary().then(res => {
          if (res.data.success === true) {
            this.renderChildren(res.data.value.orgList)
            this.data = res.data.value.orgList
            res.data.value.libraryList.map(item => {
              item.name = item.libraryName
              item.code = item.libraryName
              this.data.push(item)
            })
            this.$refs.tree.setCheckedKeys([]) // init 左侧tree为空
          } else {
            this.failMessage(res.data.message)
          }
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .headerUser {
    font-size: 22px;
    border-bottom: 1px solid #E5E7ED;
    height: 30px;
    line-height: 30px;
  }
  /* .el-input--suffix /deep/ .el-input__inner {
    width: 60%;
  }
  .el-input--suffix /deep/ .el-textarea__inner {
    width: 60%;
  } */
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
  .treeWrap{
    width: 260px;
    border: 1px solid #EBEEF5;
    height: 302px;
  }
  .rightDivWrap{
    overflow: hidden;
    padding: 10px 0 0 16px;
    font-size: 14px;
    border: 1px solid #EBEEF5;
  }
  .rightDiv {
    width: 250px;
    height:270px;
    /* margin-bottom: 16px; */
  }
  .rightHeader{
    font-size: 14px;
    padding-left: 7px;
  }
  .toRight{
    width: 70px;
    position: relative;
  }
  .toRight span{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 26px;
    height:26px;
    background: url("../../assets/images/youjiantou.png") no-repeat;
    background-size: 100% 100%;
  }
  .singal {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
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
  }
  /* .el-form-item /deep/ .el-form-item__content {
    width: 60%;
  } */
</style>
