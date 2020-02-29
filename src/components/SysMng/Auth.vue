<template>
  <div style="height: 100%">
    <div class="listBot">
      <div class="auth" v-loading="upgrading"
        element-loading-text="升级中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="title">系统授权</div>
        <div class="authDetail">
          <div class="leftTit"><span class="titWidth">授权ID：</span><span class="rightTit">{{authInfo.clientId}}</span></div>
          <div class="leftTit"><span class="titWidth">授权企业：</span><span class="rightTit">{{authInfo.clientName}}</span></div>
          <div class="leftTit"><span class="titWidth">授权有效截止日期：</span><span class="rightTit">{{authInfo.endTime}}</span></div>
        </div>
        <div class="title span">系统版本</div>
        <div class="leftTit">
          <span class="titWidth">版本号：</span>
          <span class="rightTit">{{version}}</span>
          <span class="redTxt" v-if="verList && verList.length" @click="showDiag">有更新,点击查看</span>
        </div>
        <div class="title">问题反馈</div>
        <el-input type="textarea" :row="4" v-model.trim="textarea" maxlength="200" show-word-limit></el-input>
        <div>
          <el-button size="small" type="primary" class="saveBtn" @click="submit">提交</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="版本列表" :visible.sync="diagVisible" class="elDialog-2">
      <el-table :data="verList" height="400">
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{getStatusTxt(scope.row.status)}}</template>
        </el-table-column>

        <el-table-column label="更新时间" prop="createTime"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" :disabled="scope.row.status===10||downloadDisable?true:false" @click="download(scope.row)">下载</el-link>
            <el-link type="primary" class="opreationBtn" :disabled="scope.row.status===10?true:false" @click="upgrade(scope.row)">升级</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  addQuestionRecord,
  sysVersion,
  verCheck,
  verDownload,
  verUpgrade,
  getAuth
} from '@/axios/api.js'
import { getFormData } from '@/lib/util'
import { setTimeout, clearTimeout } from 'timers'
export default {
  name: 'Auth',
  data () {
    return {
      authInfo: {},
      textarea: '',
      version: this.$globalConst.version,
      verList: [],
      diagVisible: false,
      upgrading: false,
      timeout: null,
      isDetect: false,
      downloadDisable: false
    }
  },
  created () {
    this.getSysVersion()
    this.verCheckEvent()
    this.getAuthData()
  },
  methods: {
    getAuthData () {
      getAuth().then(res => {
        if (res.data.success) {
          this.authInfo = res.data.value || {}
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    getSysVersion (isDetect) {
      sysVersion()
        .then(res => {
          if (res.data.success) {
            this.version = res.data.value
            if (this.version !== this.localStorage('FACE_VER')) {
              this.successMessage('系统升级成功')
              this.localStorage('FACE_VER', this.version)
            }
          } else {
            this.failDialog(res.data.message)
          }
          // 判断是否升级中
          if (isDetect) {
            clearTimeout(this.timeout)
            this.timeout = null
            this.verCheckEvent()
            window.location.reload()
          }
          this.upgrading = false
        })
        .catch(res => {
          if (isDetect) {
            this.intervalEvent()
          } else {
            this.failMessage(res && res.data && res.data.message)
          }
        })
    },
    intervalEvent () {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.getSysVersion(true)
      }, 5000)
    },
    verCheckEvent () {
      verCheck()
        .then(res => {
          if (res.data.success) {
            let verArr = res.data.value || []
            this.verList = verArr.filter(item => {
              return item.status !== 5
            })
          }
        })
        .catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    download (item) {
      let reqData = getFormData({
        id: item.id
      })
      this.downloadDisable = true
      verDownload(reqData)
        .then(res => {
          if (res.data.success) {
            this.verCheckEvent()
            this.successMessage(res.data.message)
          } else {
            this.failDialog(res.data.message || '下载失败')
          }
          this.downloadDisable = false
        })
        .catch(res => {
          this.failMessage(res && res.data && res.data.message)
          this.downloadDisable = false
        })
    },
    upgrade (item) {
      let reqData = getFormData({
        id: item.id
      })
      verUpgrade(reqData)
        .then(res => {
          if (res.data.success) {
            this.diagVisible = false
            this.upgrading = true
            // 轮训检查是否升级完成
            this.intervalEvent()
          } else {
            this.failDialog(res.data.message || '升级失败')
          }
        })
        .catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    getStatusTxt (status) {
      switch (status) {
        case 2:
          return '可下载'
        case 3:
          return '已下载'
        case 4:
          return '已集群同步完成'
        case 5:
          return '已安装完成'
        case 10:
          return '禁止安装（需要依次升级）'
      }
    },
    localStorage (key, val) {
      if (window.localStorage) {
        if (typeof val !== 'undefined') {
          localStorage.setItem(key, val)
        } else {
          return localStorage.getItem(key)
        }
      }
      return false
    },
    showDiag () {
      this.diagVisible = true
    },
    submit () {
      this.$confirm(`确认提交吗`, '提交', {
        closeOnClickModal: false
      }).then(() => {
        if (!this.textarea) {
          this.$message({
            message: '问题反馈不能为空',
            type: 'error'
          })
          return ''
        }
        let data = {
          content: this.textarea
        }
        addQuestionRecord(data)
          .then(res => {
            if (res.data.success === true) {
              this.$message({
                message: res.data.message,
                type: 'success'
              })
              this.textarea = ''
            } else {
              this.failMessage(res.data.message)
            }
          })
          .catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
      })
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.listBot {
  padding: 0 16px 20px 24px;
}
.auth {
  font-size: 14px;
  /* padding-left: 8px; */
  /* padding-top: 11px; */
}
.title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 16px;
  font-weight: bold;
  padding: 20px 0;
  margin-top: 24px;
}
.title:first-child {
  margin-top: 0;
}
.leftTit {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #909399;
  line-height: 18px;
  margin-bottom: 11px;
  font-weight: normal;
}
.rightTit {
  font-family: ArialMT;
  font-size: 14px;
  color: #606266;
  line-height: 18px;
  text-align: left;
}
.span {
  display: inline-block;
}
.leftTit:last-child {
  margin-bottom: 0;
}
.redTxt {
  color: red;
  margin-left: 30px;
}
.authDetail {
  line-height: 30px;
  /* background: #8F939A; */
  /* padding-left: 100px; */
  font-weight: bold;
}
.version {
  /* padding-left: 100px; */
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #606266;
  line-height: 14px;
}
.auth /deep/ .el-textarea__inner {
  height: 120px;
  /* width: 480px; */
}
.auth /deep/ .el-textarea {
  width: 480px;
}
.titWidth {
  display: inline-block;
  width: 130px;
}
.saveBtn {
  margin-top: 24px;
  background: #4c7ee9;
  border-radius: 4px;
  color: #fff;
}
</style>
