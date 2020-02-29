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
                @keyup.enter.native="recordQuery"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" class="label_197">
              <!-- <el-select class='width_197' size="small" v-model="formInline.orgName" clearable>
                          <el-option v-for="item in this.orgTree" :key="item.id" :value="item.id" :label="item.orgName"></el-option>
              </el-select>-->
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
            <!-- <el-form-item label="日期" class="label_197">
              <el-date-picker
                size="small"
                class="width_197"
                v-model="formInline.createTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item> -->
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
            <el-form-item label="业务类型" class="label_197">
              <el-select class="width_197" size="small" v-model="formInline.businessType" clearable>
                <el-option label="迎宾" value="1"></el-option>
                <el-option label="门禁" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务地点" class="label_197">
              <el-select
                class="width_197"
                size="small"
                v-model="formInline.businessPosition"
                clearable
              >
                <el-option
                  v-for="item in this.businessAmount"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人员类型" class="label_197">
              <el-select class="width_197" size="small" v-model="formInline.userType" clearable>
                <el-option label="员工" value="1"></el-option>
                <el-option label="访客" value="2"></el-option>
                <el-option label="黄名单" value="3"></el-option>
                <el-option label="陌生人" value="0"></el-option>
                <el-option label="VIP" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-input  class="width_197" v-model.trim="formInline.content" style="display: none;margin-top: 5px;"></el-input>
            <div class="btn">
              <el-button size="small" class="queryBtn" @click="recordQuery">查询</el-button>
              <el-button
                size="small"
                class="queryBtn"
                @click="renderExport"
                :loading="recordDownloading"
              >导出</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="listBotTit">
      <div data-v-5295f104 class="boxTitle">数据列表</div>
      <div class="pdlr-16">
        <el-table :data="tableData" class="processTable">
          <el-table-column prop="userName" label="姓名" align="left">
            <template slot-scope="scope">
              <div style="display:none">id：{{ scope.row.id }}</div>
              <div class="hidden-red">对比结果：{{ scope.row.content }}</div>
              <div class="hidden-red">对比分数：{{ scope.row.similarValue }}</div>
              <div>{{ scope.row.userName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="userTypeStr" label="人员类型" align="left"></el-table-column>
          <el-table-column prop="createTimeStr" label="时间" align="left">
            <template slot-scope="scope">
              <div>{{scope.row.createTimeStr ? scope.row.createTimeStr.split(/\s+/)[0] : null}}</div>
              <div>{{scope.row.createTimeStr ? scope.row.createTimeStr.split(/\s+/)[1] : null}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="部门" align="left"></el-table-column>
          <!-- <el-table-column prop="content" label="对比结果" align="left"></el-table-column> -->
          <!-- <el-table-column prop="userMobile" label="手机号" align="left"></el-table-column> -->
          <el-table-column prop="smallImg" label="识别照片" align="left">
            <template slot-scope="scope">
              <div @click="libraryClick(scope.row,scope.$index,'small')">
                <img :src="scope.row.smallImg ? url+scope.row.smallImg : ''" height="40">
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="bigImg" label="识别照片" align="left">
              <template slot-scope="scope">
                <div @click="bigClick(scope.row)"><img :src="scope.row.bigImg ? url+scope.row.bigImg : ''" height="40"/></div>
              </template>
          </el-table-column>-->
          <!-- <el-table-column prop="similarValue" label="对比分数" align="left"></el-table-column> -->
          <el-table-column prop="libraryImg" label="底库照片" align="left">
            <template slot-scope="scope" v-if="scope.row.libraryImg">
              <div @click="libraryClick(scope.row,scope.$index)">
                <img :src="scope.row.libraryImg ? url+scope.row.libraryImg : ''" height="40">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="businessTypeStr" label="业务类型" align="left"></el-table-column>
          <el-table-column prop="businessPosition" label="识别位置" align="left"></el-table-column>
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
import { filterObjNull } from '../lib/util.js'
import {
  listUserRecord,
  dataExport,
  getOrgTree,
  businessPosition
} from '../axios/api.js'
import { mapState, mapMutations } from 'vuex'
import imgSwipper from '@/components/common/imgSwipper'
export default {
  name: 'Record',
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
      value1: '',
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      url: this.$globalConst.apiPrefix,
      orgTree: [],
      dialogVisible: false,
      businessAmount: [],
      popvisible: false
    }
  },
  created () {
    getOrgTree()
      .then(res => {
        if (res.data.success === true) {
          this.orgTree = res.data.value || []
          // this.getOrgTree(res.data.value)
        } else {
          this.failMessage(res.data.message)
        }
      })
      .catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    businessPosition()
      .then(res => {
        if (res.data.success === true) {
          this.businessAmount = res.data.value
        } else {
          this.failMessage(res.data.message)
        }
      })
      .catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    this.formInline.userName = this.$route.query.userName || ''
    this.formInline.orgId = this.$route.query.orgId || ''
    this.formInline.orgName = this.$route.query.orgName || ''
    if (this.$route.query.userType) {
      this.formInline.userType = this.$route.query.userType.toString()
      if (sessionStorage.getItem('diffTime')) {
        let diffTime = sessionStorage.getItem('diffTime') || 0
        let time = new Date(new Date().getTime() - diffTime)
        // let newDate = this.$moment(time).format('YYYY-MM-DD')
        // this.formInline.beginTime = new Date(newDate + ' 00:00:00')
        // this.formInline.endTime = new Date(newDate + ' 23:59:59')
        let year = new Date(time).getFullYear()
        let month = new Date(time).getMonth()
        let date = new Date(time).getDate()
        this.formInline.beginTime = new Date(year, month, date, 0, 0, 0)
        this.formInline.endTime = new Date(year, month, date, 23, 59, 59)
      } else {
        let time = new Date()
        // let newDate = this.$moment(time).format('YYYY-MM-DD')
        // this.formInline.beginTime = new Date(newDate + ' 00:00:00')
        // this.formInline.endTime = new Date(newDate + ' 23:59:59')
        let year = new Date(time).getFullYear()
        let month = new Date(time).getMonth()
        let date = new Date(time).getDate()
        this.formInline.beginTime = new Date(year, month, date, 0, 0, 0)
        this.formInline.endTime = new Date(year, month, date, 23, 59, 59)
      }
    }
    this.recordQuery()
    this.formInline = Object.assign({}, this.formInline)
  },
  watch: {
    $route (to, from) {
      if (this.$route.query.userType) {
        this.formInline.userType = this.$route.query.userType.toString()
        if (sessionStorage.getItem('time')) {
          let time = new Date(Number(sessionStorage.getItem('time')))
          // let newDate = this.$moment(time).format('YYYY-MM-DD')
          // this.formInline.beginTime = new Date(newDate + ' 00:00:00')
          // this.formInline.endTime = new Date(newDate + ' 23:59:59')
          let year = new Date(time).getFullYear()
          let month = new Date(time).getMonth()
          let date = new Date(time).getDate()
          this.formInline.beginTime = new Date(year, month, date, 0, 0, 0)
          this.formInline.endTime = new Date(year, month, date, 23, 59, 59)
        } else {
          let time = new Date()
          // let newDate = this.$moment(time).format('YYYY-MM-DD')
          // this.formInline.beginTime = new Date(newDate + ' 00:00:00')
          // this.formInline.endTime = new Date(newDate + ' 23:59:59')
          let year = new Date(time).getFullYear()
          let month = new Date(time).getMonth()
          let date = new Date(time).getDate()
          this.formInline.beginTime = new Date(year, month, date, 0, 0, 0)
          this.formInline.endTime = new Date(year, month, date, 23, 59, 59)
        }
      }
      this.recordQuery()
      this.formInline = Object.assign({}, this.formInline)
    }
  },
  computed: {
    ...mapState(['recordDownloading'])
  },
  methods: {
    beginDate () {
      const self = this
      return {
        disabledDate (time) {
          if (self.formInline.endTime) { // 如果结束时间不为空，则小于结束时间
            return new Date(self.formInline.endTime).getTime() < time.getTime() || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
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
    ...mapMutations(['recordDownloadingShow', 'recordDownloadingHide']),
    setOrg (node) {
      // this.ruleForm.orgId = node.id
      // this.ruleForm.orgName = node.orgName

      this.$set(this.formInline, 'orgId', node.id)
      this.$set(this.formInline, 'orgName', node.orgName)
      this.popvisible = false
    },
    recordQuery (e) {
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
        userName: this.formInline.userName,
        // orgId: this.formInline.orgId,
        beginTime: beginTime,
        endTime: endTime,
        businessType: this.formInline.businessType,
        businessPosition: this.formInline.businessPosition
      }
      if (this.formInline.orgName) { // 如果清空组织名input，则不取orgId
        data.orgId = this.formInline.orgId
      }
      if (this.formInline.content) {
        data.content = '模糊区域'
      }
      if (this.formInline.userType === '2') {
        data.userType = '2'
        data.userRole = 0
      } else if (this.formInline.userType === '4') {
        data.userType = '2'
        data.userRole = 1
      } else {
        data.userType = this.formInline.userType
      }
      if (typeof e === 'number') {
        data.pageNum = e
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listUserRecord(data)
        .then(res => {
          if (res.data.success === true) {
            if (!res.data.value) {
              this.total = 0
              this.tableData = []
            } else {
              // console.log(res.data.value.list)
              this.tableData = res.data.value.list
              this.total = res.data.value.total
            }
          } else {
            this.failMessage(res.data.message)
          }
        })
        .catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    handleCurrentChange (e) {
      this.recordQuery(e)
    },
    // getOrgTree (amount) {
    //   amount.forEach(item => {
    //     if (item.children) {
    //       item.children.forEach(childItem => {
    //         this.orgTree.push(childItem)
    //       })
    //       this.getOrgTree(item.children)
    //     }
    //   })
    // },
    libraryClick (detail, index, small) {
      let data = []
      if (small) {
        if (detail.bigImg) {
          data = this.tableData.map(i => ({ imgUrl: i.smallImg, bigImgUrl: i.bigImg, userName: i.userName || '' }))
        } else {
          data = this.tableData.map(i => ({ imgUrl: i.smallImg, userName: i.userName || '' }))
        }
      } else {
        data = this.tableData.map(i => ({ imgUrl: i.libraryImg, userName: i.userName || '' }))
      }
      this.$refs.showBigImg.showData({
        dataList: data,
        imgInit: index,
        imgEnd: this.pageSize - 1
      })
    },
    renderExport () {
      // 二次确认
      this.$confirm('是否确认导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.recordDownloadingShow()
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
          userName: this.formInline.userName,
          beginTime: beginTime,
          endTime: endTime,
          businessType: this.formInline.businessType,
          businessPosition: this.formInline.businessPosition
        }
        if (this.formInline.orgName) { // 如果清空组织名input，则不取orgId
          data.orgId = this.formInline.orgId
        }
        if (this.formInline.userType === '2') {
          data.userType = '2'
          data.userRole = 0
        } else if (this.formInline.userType === '4') {
          data.userType = '2'
          data.userRole = 1
        } else {
          data.userType = this.formInline.userType
        }
        dataExport(data).then(res => {
          // console.log(res.data)
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '业务记录.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
          this.recordDownloadingHide()
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-radio {
  margin-right: 10px;
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
.btn {
  /* margin: 0 0 0 12px; */
  display: inline;
}
.el-date-editor /deep/ .el-range-separator {
  padding: 0;
}

/* .myInput .el-icon-circle-close{
  position: absolute;
  right:0;
  top:0;
  width:30px;
  text-align: center;
  height: 100%;
  color:#C0C4CC;
  cursor: pointer
}
.myInput .el-icon-circle-close::after{
      content: '';
    height: 100%;
    width: 0;
    display: inline-block;
    vertical-align: middle;
} */
/* .el-dialog__wrapper /deep/ .el-dialog {
  width: 42%;
  display: flex;
  justify-content: center;
  align-items: Center;
} */
/* .el-form-item /deep/ .el-form-item__label{
  width:70px;
} */
/* .bigImg {
  width: 100%;
  display: inline-block;
  height: 300px;
  width: 230px;
} */
</style>
