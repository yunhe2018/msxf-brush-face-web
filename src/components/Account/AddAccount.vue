<template>
  <div>
    <el-dialog
          :title="title"
          :visible.sync="visible"
          @close="$emit('update:show', false)"
          :before-close="handleClose"
          :close-on-click-modal=false
          :show="show">
          <div style="height:420px;" class="dialogAndScrollbar">
            <el-scrollbar style="height:100%;">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                 <template v-if="this.detail">
                    <el-form-item label="账号类型">
                      <div>{{ this.ruleForm.content }}</div>
                    </el-form-item>
                    <el-form-item label="登录账号">
                      <div>{{ this.ruleForm.userName }}</div>
                    </el-form-item>
                    <el-form-item label="密码">
                      <div>{{ this.ruleForm.password }}</div>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="账号类型" prop="isAdmin">
                      <el-radio-group v-model="ruleForm.isAdmin">
                        <el-radio :label="0">用户管理员</el-radio>
                      </el-radio-group>
                    </el-form-item>
                     <el-form-item label="登录账号" prop="userName">
                      <el-input class="width_305" size="small" v-model="ruleForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                      <el-input class="width_305" size="small" v-model.trim="ruleForm.password" show-password auto-complete="new-password"></el-input>
                    </el-form-item>
                  </template>
                <el-form-item label="姓名" prop="realName">
                  <el-input class="width_305" size="small" v-model.trim="ruleForm.realName"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="mobile">
                  <el-input class="width_305" size="small" v-model.trim="ruleForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="content">
                  <el-input class="width_305" size="small" type="textarea" v-model.trim="ruleForm.content" maxlength="100" show-word-limit></el-input>
                </el-form-item>
                <!-- <el-form-item label="状态" prop="status">
                  <template v-if="this.detail">
                    <div>{{ this.ruleForm.status === '0' ? '无效' : '有效' }}</div>
                  </template>
                  <template v-else>
                    <el-radio v-model="ruleForm.status" :label="1">有效</el-radio>
                    <el-radio v-model="ruleForm.status" :label="0">无效</el-radio>
                  </template>
                </el-form-item> -->
                <!-- <el-form-item>
                  <el-button size="small" type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item> -->
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
import { filterObjNull, getFormData } from '../../lib/util.js'
import { toUpdateSysUser } from '../../axios/api.js'

export default {
  name: 'AddAccount',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    detail: {
      type: String,
      default: ''
    },
    btnDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      subdisabled: this.btnDisabled,
      visible: this.show,
      ruleForm: {},
      title: '',
      rules: {
        isAdmin: { required: true, message: '请选择账号类型', trigger: 'change' },
        userName: [
          { required: true, message: '请输入登录账号!', trigger: 'blur' },
          { min: 6, max: 30, message: '登录账号长度为6-30个字符', trigger: 'blur' },
          { pattern: /^\w+(\.\w+)?@\w+(\.\w+)+$/, message: '必须为邮箱格式', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码!', trigger: 'blur' },
          { min: 6, max: 30, message: '原密码长度为6-30个字符', trigger: 'blur' },
          { pattern: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[^x00-xff].*$)\S{5,30}$/, message: '符号、数字、字母两种以上组合' }
        ],
        realName: { required: true, message: '请输入姓名！', trigger: 'blur' },
        mobile: [{ required: true, message: '请输入联系方式！', trigger: 'blur' },
          { pattern: /1[3-9][0-9]\d{8}/, message: '您的手机号格式不正确', trigger: 'blur' },
          { max: 11, message: '手机号只能为11位', trigger: 'blur' }]
        // status: { required: true, message: '请选择状态', trigger: 'blur' }
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
          status: false
        }
        if (this.detail) {
          data.value = {
            realName: this.ruleForm.realName,
            mobile: this.ruleForm.mobile,
            content: this.ruleForm.content,
            userName: this.ruleForm.userName,
            password: this.ruleForm.password
          }
        } else {
          data.value = this.ruleForm
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
        // this.$nextTick(() => {
        //   this.$refs[formName].resetFields()
        // })
      })
    },
    handleClose (done) {
      done()
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
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
    show () {
      this.visible = this.show
      if (!this.visible) return
      this.subdisabled = false
      if (this.type === 'modifiy') {
        this.title = '编辑账号管理'
        let data = {
          id: this.id
        }
        toUpdateSysUser(getFormData(data)).then(res => {
          if (res.data.success === true) {
            this.ruleForm = res.data.value
          } else {
            this.failMessage(res && res.data && res.data.message)
          }
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
      } else {
        this.title = '新增账号管理'
        this.ruleForm = {
          isAdmin: 0,
          // status: 1,
          userName: '',
          password: ''
        }
        this.ruleForm = Object.assign({}, this.ruleForm)
      }
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
  border-bottom: 1px solid #E5E7ED;
  height: 30px;
  line-height: 30px;
}
.el-form-item /deep/ .el-form-item__content {
  width: 60%;
}
.el-form-item /deep/ .el-button {
  margin-left: 30%;
}
</style>
