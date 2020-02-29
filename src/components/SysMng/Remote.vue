<template>
  <div class="listBot">
    <div class="box" style="margin-top:30px">
      <el-form label-width="100px" :model="formData">
        <el-form-item label="远程IP">
          <el-input class='width_305' size="small" v-model="formData.host" clearable placeholder="请输入IP"></el-input>
        </el-form-item>
        <el-form-item label="远程端口">
          <el-input class='width_305' size="small" v-model="formData.serverPort" clearable placeholder="请输入端口"></el-input>
        </el-form-item>
        <el-form-item label="本地端口">
          <el-input class='width_305' size="small" v-model="formData.remotePort" clearable placeholder="请输入端口"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="saveBtn" size="small" @click="remoteOpenCtrl">{{btnTxt}}</el-button>
          <el-button type="primary" class="saveBtn" size="small" @click="getNetStatus" style="margin-left:20px;">测试网络</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getFormData } from '../../lib/util'
import { remoteStatus, netCheck, remoteOpen } from '../../axios/api'
export default{
  name: 'Remote',
  data () {
    return {
      formData: {},
      btnTxt: '申请远程支持',
      onBtnTxt: '申请远程支持',
      offBtnTxt: '关闭远程支持',
      status: 0 // 1开启，0关闭
    }
  },
  created () {
    this.getRemoteStatus()
  },
  methods: {
    // 网络检查
    getNetStatus () {
      let reqData = getFormData({
        host: this.formData.host,
        serverPort: this.formData.serverPort
      })
      netCheck(reqData).then(res => {
        if (res.data.success) {
          this.successMessage(res.data.message)
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    // 查看远程是否开启
    getRemoteStatus () {
      remoteStatus().then(res => {
        if (res.data.success) {
          let result = res.data.value || {}
          this.formData = result
          if (result.online) {
            this.status = 1
            this.btnTxt = this.offBtnTxt
          } else {
            this.status = 0
            this.btnTxt = this.onBtnTxt
          }
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    // 远程开启、关闭控制
    remoteOpenCtrl () {
      let status = 1
      if (this.status === 1) {
        status = 0
      }
      let reqData = getFormData({
        host: this.formData.host,
        serverPort: this.formData.serverPort,
        remotePort: this.formData.remotePort,
        status: status
      })
      remoteOpen(reqData).then(res => {
        if (res.data.success) {
          this.status = status
          this.btnTxt = this.status === 1 ? this.offBtnTxt : this.onBtnTxt
          this.successMessage(res.data.message)
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 16px;
  font-weight: bold;
  padding: 20px 0;
}
.saveBtn {
  margin-top: 24px;
  background: #4C7EE9;
  border-radius: 4px;
  color: #FFF;
}
</style>
