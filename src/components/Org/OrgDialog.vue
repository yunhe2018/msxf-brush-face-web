<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
    @close="$emit('update:show', false)"
    :close-on-click-modal=false
    :show="show">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="部门名称" prop="orgName">
        <el-input class="width_305" size="small" v-model.trim="ruleForm.orgName"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" v-show="hideOrgList !== 'add'">
        <!-- <el-select v-model="curOrg.orgName" clearable >
          <el-option v-for="item in orgTreeData" :key="item.parentId" :value="item.parentId" :label="item.orgName"></el-option>
        </el-select> -->
        <el-popover
            placement="bottom"
            width="280"
            trigger="click"
            v-model="popvisible">
            <el-input
              class="width_305"
              slot="reference"
              v-model="parentNames"
              readonly
              placeholder="请选择上级部门"></el-input>
              <div style="height:220px;" class="dialogAndScrollbar">
                <el-scrollbar style="height:100%;">
                <el-tree
                  ref="tree"
                  style="min-height:200px;overflow:auto;"
                  :data="orgTreeData"
                  node-key="id"
                  highlight-current
                  :default-expanded-keys="[1]"
                  :expand-on-click-node="false"
                  :props="props"
                  @node-click="setParentOrg">
                </el-tree>
                </el-scrollbar>
              </div>
        </el-popover>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { filterObjNull } from '../../lib/util.js'
export default {
  name: 'orgDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    hideOrgList: {
      type: String
    },
    orgId: Number,
    curOrg: {
      type: Object,
      default: function () {}
    },
    curChild: {
      type: Object,
      default: function () {}
    },
    orgTreeData: Array,
    btnDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      subdisabled: this.btnDisabled,
      props: {
        label: 'orgName',
        children: 'children'
      },
      // parentName: this.curOrg.orgName,
      parentNames: '',
      // parentNode: this.curOrg,
      visible: this.show,
      ruleForm: {},
      title: '',
      popvisible: true,
      rules: {
        orgName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        orgParent: { required: true, message: '请选择上级部门', trigger: 'change' }
      }
    }
  },
  created () {
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.subdisabled = true
        let data = {
          status: false,
          value: this.ruleForm
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
      })
    },
    handleClose (done) {
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
      done()
    },
    setParentOrg (node) {
      console.log(node)
      this.ruleForm.parentId = node.id
      this.ruleForm.orgGrade = node.orgGrade
      this.parentNames = node.orgName
      this.popvisible = false
    }
  },
  watch: {
    show () {
      this.visible = this.show
      if (!this.visible) return
      this.subdisabled = false

      if (this.hideOrgList === 'modifyEvent') {
        if (this.curOrg.parentPath) {
          this.parentNames = this.curOrg.parentName
        }
      } else if (this.hideOrgList === 'addEvent') {
        this.parentNames = this.curOrg.orgName
      }
      if (this.type === 'modify') {
        this.title = '编辑部门'
        // if (this.hideOrgList) { // 编辑当前组织
        //   this.ruleForm = JSON.parse(JSON.stringify(this.curOrg))
        //   this.ruleForm.orgGrade = this.curOrg.orgGrade - 1
        // } else { // 编辑子组织
        //   this.ruleForm = JSON.parse(JSON.stringify(this.curChild))
        //   this.ruleForm.orgGrade = this.curOrg.orgGrade
        // }
        this.ruleForm = JSON.parse(JSON.stringify(this.curOrg))
        this.ruleForm.orgGrade = this.curOrg.orgGrade - 1
      } else {
        this.ruleForm = {
          orgName: '',
          parentId: this.curOrg.id,
          orgGrade: this.curOrg.orgGrade,
          userCount: 0,
          status: 1
        }
        this.title = '添加部门'
      }
    },
    // curOrg () {
    //   console.log(this.curOrg.orgName)
    //   this.parentName = this.curOrg.orgName
    // },
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
    border-bottom: 1px solid #E5E7ED;
    height: 30px;
    line-height: 30px;
  }
  .el-input--suffix /deep/ .el-input__inner {
    width: 60%;
  }
  .el-input--suffix /deep/ .el-textarea__inner {
    width: 60%;
  }
</style>
