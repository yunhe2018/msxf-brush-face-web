<template>
  <div>
    <el-dialog
          class="software"
          :title="title"
          :visible.sync="visible"
          @close="$emit('update:show', false)"
          :before-close="handleClose"
          :close-on-click-modal=false
          :show="show">
          <div style="height:380px;" class="dialogAndScrollbar">
            <el-scrollbar style="height:100%;" ref="myScrollbar">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item size="small" label="APP类型" prop="code">
                    <el-select v-model="ruleForm.code" clearable class="width_305" :disabled="codeDisabled">
                    <el-option v-for="item in this.appNameList" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item size="small" label="版本号" prop="version">
                  <el-input v-model.trim="ruleForm.version" class="width_305" :disabled="codeDisabled"></el-input>
                </el-form-item>
                 <el-form-item label="升级机制" prop="upgradeStatus">
                  <el-radio-group v-model="ruleForm.upgradeStatus"  class="width_305">
                    <el-radio :label="1">强制升级</el-radio>
                    <el-radio :label="0">非强制升级</el-radio>
                  </el-radio-group>
                  </el-form-item>
                  <el-form-item label="文件上传" prop="field1"
                    :rules="{ required: true, message: '文件不能为空', trigger: 'blur'}">
                      <el-upload
                        class="upload-demo"
                        accept=".apk"
                        :action=url
                        :headers=headers
                        :limit="1"
                        :on-remove="removeFile"
                        :on-exceed="handleExceed"
                        :on-change="changeFile"
                        :file-list="fileList">
                        <div class="uploadFile">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <span slot="tip" class="el-upload__tip">只能上传apk文件</span>
                        </div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="更新内容">
                    <el-input type="textarea" :rows="4" v-model="ruleForm.content" class="width_305" maxlength="200" show-word-limit></el-input>
                  </el-form-item>
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
import { toUpdateSoftware } from '../../axios/api.js'
import consts from '@/lib/constant.js'

export default {
  name: 'AddAccount',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    appNameList: {
      type: Array
    },
    btnDisabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      subdisabled: this.btnDisabled,
      visible: this.show,
      ruleForm: {},
      title: '',
      fileList: [],
      url: `${consts.apiPrefix}/software/appUpload`,
      headers: {
        sessionId: sessionStorage.getItem('sessionId')
      },
      codeDisabled: false,
      rules: {
        code: { required: true, message: '请选择APP类型', trigger: 'change' },
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' },
          { pattern: /^(?!0\.0\.0)(\d|[1]\d+)\.(\d|[1]\d+)\.(\d|[1]\d+)$/, message: '请输入正确版本号', trigger: 'blur' }],
        upgradeStatus: { required: true, message: '请选择升级机制', trigger: 'change' }
      }
    }
  },
  created () {
  },
  methods: {
    handleClose (done) {
      done()
      this.$refs['ruleForm'].clearValidate()
      this.subdisabled = false
    },
    handleExceed (files, fileList) {
      // this.$message.warning('每次只能上传 1 个文件')
      this.failDialog('每次只能上传 1 个文件')
    },
    changeFile (file, fileList) {
      let self = this
      if (file.response) {
        if (file.response.success) {
          self.successMessage('上传成功')
          self.$set(self.ruleForm, 'field1', file.response.value)
        }
      }
    },
    removeFile (file, fileList) {
      let self = this
      if (fileList.length < 1) {
        self.$set(self.ruleForm, 'field1', '')
      }
    },
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
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
    },
    failDialog (txt) {
      this.$alert(txt || '操作失败！', '提示', {
        confirmButtonText: '确定',
        type: 'error'
      })
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
      this.fileList = []
      this.ruleForm.field1 = ''
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      })
      if (!this.visible) return
      this.subdisabled = false
      if (this.type === 'modifiy') {
        this.codeDisabled = true
        this.title = '编辑APP'
        let data = {
          id: this.id
        }
        toUpdateSoftware(getFormData(data)).then(res => {
          if (res.data.success) {
            this.ruleForm = res.data.value
            this.$set(this.ruleForm, 'field1', res.data.value.uploadAddress)
            this.fileList.push({name: res.data.value.fileName, field1: res.data.value.uploadAddress})
          } else {
            this.failMessage(res.data.message)
          }
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
      } else {
        this.codeDisabled = false
        this.title = '新增APP'
        this.ruleForm = {
          upgradeStatus: 1
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
.software /deep/ .el-upload-list {
    width: 305px !important;
    margin-bottom: 5px;
}
</style>
