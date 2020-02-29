<template>
  <div>
    <div class="listTop">
      <div class="listTopTit">
        <div class="listTit">查询条件</div>
      </div>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline recordForm"
        @submit.native.prevent
        label-width="65px"
      >
        <div>
          <div style="margin-bottom: -15px;">
            <el-form-item label="姓名" class="label_197">
              <el-input
                class="width_197"
                size="small"
                clearable
                v-model.trim="formInline.userName"
                @keyup.enter.native="attendQuery"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" class="label_197">
              <el-popover
                size="small"
                placement="bottom"
                width="190"
                trigger="click"
                v-model="popvisible"
              >
                <div slot="reference" class="myInput">
                  <el-input
                    class="width_197"
                    size="small"
                    v-model="formInline.orgName"
                    clearable
                    placeholder="请选择部门"
                  ></el-input>
                </div>
                <div style="height:330px;" class="dialogAndScrollbar">
                  <el-scrollbar style="height:100%;">
                    <el-tree
                      class="width_197"
                      ref="tree"
                      style="min-height:200px;width:350px;overflow:auto;"
                      :data="orgTree"
                      node-key="id"
                      highlight-current
                      :expand-on-click-node="false"
                      :default-expanded-keys="[1]"
                      :props="props"
                      @node-click="setOrg"
                    ></el-tree>
                  </el-scrollbar>
                </div>
              </el-popover>
            </el-form-item>
            <el-form-item label="开始日期" class="label_197">
              <el-date-picker
                size="small"
                style="width: 197px"
                v-model="formInline.beginTime"
                type="datetime"
                placeholder="选择日期时间"
                :picker-options="startDatePicker">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" class="label_197">
              <el-date-picker
                size="small"
                style="width: 197px"
                v-model="formInline.endTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="23:59:59"
                :picker-options="endDatePicker">
              </el-date-picker>
            </el-form-item>
          </div>
          <div>
            <!-- <el-form-item label="业务类型" class="label_197">
              <el-select class="width_197" size="small" v-model="formInline.businessType" clearable>
                <el-option label="门禁业务" value="0"></el-option>
                <el-option label="迎宾业务" value="1"></el-option>
                <el-option label="考勤业务" value="2"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="业务名称" class="label_197">
              <el-select
                class="width_197"
                size="small"
                v-model="formInline.businessName"
                clearable>
                <el-option
                  v-for="item in this.businessList"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务地点" class="label_197">
              <el-select
                class="width_197"
                size="small"
                v-model="formInline.address"
                clearable
              >
                <el-option
                  v-for="item in this.addressList"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="人员类型" class="label_197">
              <el-select class="width_197" size="small" v-model="formInline.userType" clearable>
                <el-option label="员工" value="1"></el-option>
                <el-option label="访客" value="2"></el-option>
                <el-option label="黄名单" value="3"></el-option>
                <el-option label="陌生人" value="0"></el-option>
                <el-option label="VIP" value="4"></el-option>
              </el-select>
            </el-form-item> -->
            <el-input  class="width_197" v-model.trim="formInline.content" style="display: none;margin-top: 5px;"></el-input>
           <el-button size="small" class="queryBtn" @click="attendQuery">查询</el-button>
            <el-button
              size="small"
              class="queryBtn"
              @click="attendExport"
              :loading="attendDownloading"
            >导出</el-button>
          </div>
          <!-- <div class="btn" style="margin: -10px 0 24px 65px;">
          </div> -->
        </div>
      </el-form>
    </div>
    <div class="listBotTit">
      <div data-v-5295f104 class="boxTitle">数据列表</div>
      <div class="pdlr-16">
        <el-table :data="tableData" class="processTable">
          <el-table-column prop="userName" label="姓名" align="left">
            <template slot-scope="scope">
              <div style="display:none">{{ scope.row.id }}</div>
              <div>{{ scope.row.userName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="userTypeStr" label="人员类型" align="left"></el-table-column>
          <el-table-column prop="orgName" label="部门" align="left"></el-table-column>
          <el-table-column prop="attendanceDate" label="考勤日期" align="left"></el-table-column>
          <el-table-column prop="attendanceTime" label="考勤时间" align="left"></el-table-column>
          <el-table-column prop="punchTime" label="打卡时间" align="left"></el-table-column>
          <el-table-column prop="captureImg" label="打卡照片" align="left">
            <template slot-scope="scope" v-if="scope.row.captureImg">
              <div @click="libraryClick(scope.row,scope.$index,'small')">
                <img :src="url+scope.row.captureImg" height="40">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="degree" label="对比分数" align="left"></el-table-column>
          <el-table-column prop="albumImg" label="底库照片" align="left">
            <template slot-scope="scope" v-if="scope.row.albumImg">
              <div @click="libraryClick(scope.row,scope.$index)">
                <img :src="url+scope.row.albumImg" height="40">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="businessTypeStr" label="业务类型" align="left"></el-table-column>
          <el-table-column prop="businessName" label="业务名称" align="left"></el-table-column>
          <el-table-column prop="address" label="安装位置" align="left"></el-table-column>
        </el-table>
        <el-pagination
          v-if="total"
          class="pageView"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
          :current-page.sync="pageNum"
          :total="total"
          :page-size="pageSize"
        ></el-pagination>
      </div>
    </div>
    <imgSwipper ref="showBigImg" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { filterObjNull } from '../../lib/util.js'
import { listAttendanceRecord, getOrgTree, businessNameList, addressList, recordExport } from '../../axios/api.js'
import imgSwipper from '@/components/common/imgSwipper'

export default {
  name: 'AttendRecord',
  components: {
    imgSwipper
  },
  data () {
    return {
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      props: {
        label: 'orgName',
        children: 'children'
      },
      formInline: {},
      popvisible: false,
      orgTree: [],
      addressList: [],
      tableData: [],
      businessList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      url: this.$globalConst.apiPrefix,
      dialogVisible: false,
      smallStatus: false
    }
  },
  created () {
    getOrgTree()
      .then(res => {
        if (res.data.success === true) {
          this.orgTree = res.data.value || []
        } else {
          this.failMessage(res.data.message)
        }
      })
      .catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    businessNameList().then(res => {
      if (res.data.success === true) {
        this.businessList = res.data.value
      }
    })
    addressList().then(res => {
      if (res.data.success === true) {
        this.addressList = res.data.value
      }
    })
    this.attendQuery()
  },
  computed: {
    ...mapState(['attendDownloading'])
  },
  methods: {
    beginDate () {
      const self = this
      return {
        disabledDate (time) {
          if (self.formInline.endTime) { // 如果结束时间不为空，则小于结束时间
            return new Date(self.formInline.endTime).getTime() < time.getTime() || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()// 结束时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    processDate () {
      const self = this
      return {
        disabledDate (time) {
          if (self.formInline.beginTime) { // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.formInline.beginTime).getTime() > time.getTime() || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    ...mapMutations(['attendDownloadingShow', 'attendDownloadingHide']),
    setOrg (node) {
      // this.ruleForm.orgId = node.id
      // this.ruleForm.orgName = node.orgName

      this.$set(this.formInline, 'orgId', node.id)
      this.$set(this.formInline, 'orgName', node.orgName)
      this.popvisible = false
    },
    attendQuery (e) {
      let beginTime = null
      let endTime = null
      if (this.formInline.beginTime) {
        beginTime = this.$moment(this.formInline.beginTime).format('YYYY-MM-DD HH:mm:ss')
        if (!this.formInline.endTime) {
          // this.formInline.endTime = new Date(this.$moment(this.formInline.beginTime).format('YYYY-MM-DD') + ' 23:59:59')
          let year = new Date(this.$moment(this.formInline.beginTime)).getFullYear()
          let month = new Date(this.$moment(this.formInline.beginTime)).getMonth()
          let date = new Date(this.$moment(this.formInline.beginTime)).getDate()
          this.formInline.endTime = new Date(year, month, date, 23, 59, 59)
        }
        endTime = this.$moment(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.formInline.endTime) {
        endTime = this.$moment(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss')
        if (!this.formInline.beginTime) {
          // this.formInline.beginTime = new Date(this.$moment(this.formInline.endTime).format('YYYY-MM-DD') + ' 00:00:00')
          let year = new Date(this.$moment(this.formInline.endTime)).getFullYear()
          let month = new Date(this.$moment(this.formInline.endTime)).getMonth()
          let date = new Date(this.$moment(this.formInline.endTime)).getDate()
          this.formInline.beginTime = new Date(year, month, date, 0, 0, 0)
        }
        beginTime = this.$moment(this.formInline.beginTime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.formInline = Object.assign({}, this.formInline)
      let data = {
        pageSize: this.pageSize,
        startTime: beginTime,
        endTime: endTime,
        // businessType: this.formInline.businessType,
        businessName: this.formInline.businessName,
        address: this.formInline.address,
        userType: this.formInline.userType,
        userName: this.formInline.userName
      }
      if (this.formInline.orgName) {
        data.orgId = this.formInline.orgId
      }
      if (typeof e === 'number') {
        data.pageNum = e
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listAttendanceRecord(data).then(res => {
        if (res.data.success) {
          let result = res.data.value || {}
          this.tableData = result.list || []
          this.total = result.total || 0
          // if (!res.data.value) {
          //   this.total = 0
          //   this.tableData = []
          // } else {
          //   console.log(res.data.value.list)
          //   this.tableData = res.data.value.list
          //   this.total = res.data.value.total
          // }
        } else {
          this.failMessage(res.data.message)
        }
      })
        .catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    libraryClick (detail, index, small) {
      let data = []
      if (small) {
        if (detail.bigImg) {
          data = this.tableData.map(i => ({ imgUrl: i.captureImg, bigImgUrl: i.bigImg, userName: i.userName }))
        } else {
          data = this.tableData.map(i => ({ imgUrl: i.captureImg, userName: i.userName }))
        }
      } else {
        data = this.tableData.map(i => ({ imgUrl: i.albumImg, userName: i.userName }))
      }
      this.$refs.showBigImg.showData({
        dataList: data,
        imgInit: index,
        imgEnd: this.pageSize - 1
      })
    },
    handleCurrentChange (e) {
      this.attendQuery(e)
    },
    attendExport () {
      // 二次确认
      this.$confirm('是否确认导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.attendDownloadingShow()
        let beginTime = null
        let endTime = null
        // if (this.formInline.beginTime) {
        //   beginTime = this.$moment(this.formInline.beginTime).format('YYYY-MM-DD HH:mm:ss')
        // }
        // if (this.formInline.endTime) {
        //   endTime = this.$moment(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss')
        // }
        if (this.formInline.beginTime) {
          beginTime = this.$moment(this.formInline.beginTime).format('YYYY-MM-DD HH:mm:ss')
          if (!this.formInline.endTime) {
          // this.formInline.endTime = new Date(this.$moment(this.formInline.beginTime).format('YYYY-MM-DD') + ' 23:59:59')
            let year = new Date(this.$moment(this.formInline.beginTime)).getFullYear()
            let month = new Date(this.$moment(this.formInline.beginTime)).getMonth()
            let date = new Date(this.$moment(this.formInline.beginTime)).getDate()
            this.formInline.endTime = new Date(year, month, date, 23, 59, 59)
          }
          endTime = this.$moment(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (this.formInline.endTime) {
          endTime = this.$moment(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss')
          if (!this.formInline.beginTime) {
          // this.formInline.beginTime = new Date(this.$moment(this.formInline.endTime).format('YYYY-MM-DD') + ' 00:00:00')
            let year = new Date(this.$moment(this.formInline.endTime)).getFullYear()
            let month = new Date(this.$moment(this.formInline.endTime)).getMonth()
            let date = new Date(this.$moment(this.formInline.endTime)).getDate()
            this.formInline.beginTime = new Date(year, month, date, 0, 0, 0)
          }
          beginTime = this.$moment(this.formInline.beginTime).format('YYYY-MM-DD HH:mm:ss')
        }
        this.formInline = Object.assign({}, this.formInline)
        let data = {
          starTime: beginTime,
          endTime: endTime,
          // businessType: this.formInline.businessType,
          businessName: this.formInline.businessName,
          address: this.formInline.address,
          userType: this.formInline.userType,
          userName: this.formInline.userName
        }
        // if (this.formInline.orgName) {
        //   data.orgName = this.formInline.orgName
        // }
        if (this.formInline.orgId) {
          data.orgId = this.formInline.orgId
        }
        recordExport(data).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '考勤记录.xlsx'
          a.click()
          window.URL.revokeObjectURL(url) // 释放通过URL.createObjectURL()创建的对象url
          this.attendDownloadingHide()
          this.$message({
            message: '导出成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
        this.attendDownloadingHide()
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
  .el-radio {
  margin-right: 10px;
}
.imgPopCls /deep/ .el-dialog__header {
  padding: 0;
}
.imgPopCls /deep/ .el-dialog__body {
  padding: 20px;
}
.imgPopCls /deep/ .el-dialog__headerbtn {
  top: 10px;
  right: 10px;
}
.bigImg {
  width: 100%;
}
.recordForm {
  display: flex;
  /* margin-top: 24px; */
}
.recordBtn {
  width: 100px;
}
.el-date-editor /deep/ .el-range-separator {
  padding: 0;
}

</style>
