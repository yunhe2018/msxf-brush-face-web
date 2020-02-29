<template>
  <div class="listBot">
    <div class="title">磁盘信息</div>
    <div class="authDetail">
      <dl>
        <dt>磁盘容量：</dt>
        <dd>{{info.total}}</dd>
      </dl>
      <dl>
        <dt>可用空间：</dt>
        <dd>{{info.free}}</dd>
      </dl>
      <dl>
        <dt>可用占比：</dt>
        <dd>{{info.freeRate||0}}%</dd>
      </dl>
    </div>

    <div class="title">磁盘清理</div>
    <dl>
      <dt>记录时间：</dt>
      <dd>
        <el-date-picker
          class="elInpt-1"
          v-model="form.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          placeholder="选择日期时间"
        ></el-date-picker>
        <span class="gray">至</span>
        <el-date-picker
          class="elInpt-1"
          v-model="form.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          placeholder="选择日期时间"
        ></el-date-picker>
        <el-radio-group v-model="form.recordType" style="padding-left: 16px;">
          <el-radio :label="0">门禁</el-radio>
          <!-- <el-radio :label="1">迎宾</el-radio> -->
          <el-radio :label="2">考勤</el-radio>
        </el-radio-group>
        <el-link type="primary" class="opreationBtn mgl-15" @click="getRecord">查询</el-link>
      </dd>
    </dl>

    <template v-if="recordData.disk">
      <div class="title">查询结果</div>
      <dl>
        <dt>总共条目：</dt>
        <dd>{{recordData.recordCount||0}}条，预计清理空间{{recordData.disk||0}}（按照一条记录含图片300K计算）</dd>
      </dl>
      <dl>
        <dt></dt>
        <dd>
          <el-button type="primary" class="delBtn" @click="delRecord">删除</el-button>
        </dd>
      </dl>
    </template>
  </div>
</template>

<script>
import { diskInfo, countRecord, clearRecord } from '../../axios/api.js'
export default {
  data () {
    return {
      info: {},
      recordData: {},
      form: {
        startTime: '',
        endTime: '',
        recordType: 0
      }
    }
  },
  created () {
    this.getDiskInfo()
  },
  methods: {
    getDiskInfo () {
      diskInfo()
        .then(res => {
          if (res.data.success) {
            this.info = res.data.value || {}
          } else {
            this.failMessage(res && res.data && res.data.message)
          }
        })
        .catch(function (res) {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    getRecord () {
      let reqData = {
        ...this.form
      }
      countRecord(reqData)
        .then(res => {
          this.recordData = res.data.value || {}
        })
        .catch(function (res) {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    delRecord () {
      this.$prompt('请输入当期管理员密码进行删除', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[^\s]+/,
        inputErrorMessage: '密码不能为空'
      }).then(({ value }) => {
        let reqData = {
          ...this.form,
          passWord: value
        }
        clearRecord(reqData).then(res => {
          if (res.data.success) {
            this.recordData = {
              recordCount: 0,
              disk: '0M'
            }
            this.successMessage(res && res.data && res.data.message)
          } else {
            this.failMessage(res && res.data && res.data.message)
          }
        }).catch(function (res) {
          this.failMessage(res && res.data && res.data.message)
        })
      })
    },

    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
      // this.queryLibrary()
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

<style scoped>
.listBot {
  padding: 0 16px 20px 24px;
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
.authDetail {
  width: 50%;
  line-height: 30px;
  /* background: #8F939A; */
  /* padding-left: 100px; */
  font-weight: bold;
}
dl {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #909399;
  line-height: 18px;
  margin-bottom: 11px;
  font-weight: normal;
}
dl:last-child {
  margin-bottom: 0;
}
dt {
  display: inline-block;
  width: 80px;
}
dd {
  display: inline-block;
  font-family: ArialMT;
  font-size: 14px;
  color: #606266;
  line-height: 18px;
  text-align: left;
}
dd .gray {
  font-family: ArialMT;
  font-size: 14px;
  color: #909399;
  margin: 0 15px;
}

.delBtn {
  margin-top: 24px;
  background: #4c7ee9;
  border-radius: 4px;
  color: #fff;
}
</style>
