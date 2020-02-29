<template>
  <el-dialog :title="'文件上传'" :close-on-click-modal=false width="400px" @close="closeDia" :visible.sync="visible">
    <div>
      <div>
        <el-upload
          class="upload-demo"
          drag
          ref="upload"
          :data="data"
          :limit="1"
          :auto-upload="false"
          :before-upload="beforeAvatarUpload"
          :on-exceed="handleExceed"
          :on-success="succ"
          :on-error="er"
          :action=url
          :headers=headers
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传rar/zip文件</div>
        </el-upload>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" class="editBtn" @click="cancel">取消</el-button>
      <el-button size="small" class="editBtn" @click="getTemplate">下载模板</el-button>
      <el-button size="small" class="editBtn" @click="up">确定</el-button>
    </span>
      <uploadDialog :showDialog.sync="showDialog" :uploadAmount="uploadAmount"></uploadDialog>
  </el-dialog>
</template>

<script>
import consts from '@/lib/constant.js'
import { getFormData } from '@/lib/util.js'
import { downloadTemplate } from '@/axios/api.js'
import uploadDialog from './uploadDialog'
export default {
  components: {
    uploadDialog
  },
  data () {
    return {
      visible: false,
      url: `${consts.apiPrefix}/excle/upload`,
      headers: {
        sessionId: sessionStorage.getItem('sessionId')
      },
      menuList: [],
      input: '',
      data: {
        code: '', // 场景ID,login接口获得
        type: '' // person type
      },
      showDialog: false,
      uploadAmount: {}
    }
  },
  methods: {
    getTemplate () {
      let formData = getFormData({
        code: this.data.code,
        type: this.data.type
      })
      downloadTemplate(formData).then(res => {
        // console.log(res.getResponseHeader('Content-Disposition'))
        let url = window.URL.createObjectURL(res.data)
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = '模板.rar'
        a.click()
        window.URL.revokeObjectURL(url)
      }).catch(erro => {
        this.$alert('模板下载失败！', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    showData (cfg) {
      this.visible = true
      // staff
      this.data.code = cfg.personType === 'staff' ? sessionStorage.getItem('templateId') : 0
      this.data.type = cfg.personType === 'staff' ? 1 : 0
    },
    beforeAvatarUpload (file) {
      // if (!file) {
      //   this.$message.error('请先上传rar格式文件在提交')
      // }
      const flag = file.name.substring(file.name.indexOf('.') + 1) === 'rar' || file.name.substring(file.name.indexOf('.') + 1) === 'zip'
      if (!flag) {
        this.failDialog('上传文件只能是rar/zip格式')
      }
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 300) {
        this.failDialog('上传文件大小不能超过300M')
      }
      return flag && fileSize < 300
    },
    handleExceed (files, fileList) {
      // this.$message.warning('每次只能上传 1 个文件')
      this.failDialog('每次只能上传 1 个文件')
    },
    up () {
      this.$refs.upload.submit()
    },
    cancel () {
      this.$refs.upload.clearFiles()
      this.$refs.upload.abort()
      this.visible = false
    },
    closeDia () {
      this.$refs.upload.clearFiles()
    },
    succ (response, file, fileList) {
      if (response.success) {
        this.$message.success(response.message)
        this.$refs.upload.clearFiles()
        this.$emit('updateList', response.data)
        this.visible = false
      } else {
        // this.failDialog(response.message)
        if (response.value) {
          this.showDialog = true
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.uploadAmount = response
        this.$refs.upload.clearFiles()
      }
    },
    er (err, file, fileList) {
      this.$message.error(err)
    },
    failDialog (txt) {
      this.$alert(txt || '操作失败！', '提示', {
        confirmButtonText: '确定',
        type: 'error'
      })
    }
  }
}
</script>
<style scoped>
  .txt{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #606266;
    letter-spacing: 0;
    line-height: 16px;
    cursor: pointer;
  }
</style>
