<template>
  <div>
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <div>
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline recordForm"
          @submit.native.prevent
          label-width="65px">
          <div>
            <el-form-item label="月份" class="label_197">
              <el-date-picker
                style="width:197px"
                v-model="form.month"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="姓名" class="label_197">
              <el-input
                class="width_197"
                size="small"
                clearable
                v-model.trim="form.userName"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" class="label_197">
              <el-popover
                size="small"
                placement="bottom"
                width="190"
                trigger="click"
                v-model="popvisible">
                <div slot="reference" class="myInput">
                  <el-input
                    class="width_197"
                    size="small"
                    v-model="form.orgName"
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
            <!-- <el-form-item label="人员类型" class="label_197">
              <el-select class="width_197" size="small" v-model="form.userType" clearable>
                <el-option label="员工" value="1"></el-option>
                <el-option label="访客" value="2"></el-option>
                <el-option label="黄名单" value="3"></el-option>
                <el-option label="陌生人" value="0"></el-option>
                <el-option label="VIP" value="4"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="考勤名称" class="label_197">
              <attendanceName v-model="form.attendanceId"></attendanceName>
            </el-form-item>
          </div>
          <div class="btn">
            <el-button size="small" class="queryBtn" @click="getData()">查询</el-button>
            <el-button size="small" class="queryBtn" @click="exportEcrl" :loading="attendReportloading" >导出</el-button>
          </div>
        </el-form>
      </div>
    </div>
     <div class="listBotTit">

      <div data-v-5295f104="" class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <el-table-column
          prop="userName"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="userType"
          label="人员类型">
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="部门">
        </el-table-column>
        <el-table-column
          prop="attendanceNums"
          label="应出勤天数"
          width="100">
        </el-table-column>
        <el-table-column
          prop="realNum"
          label="实际出勤"
          width="80">
        </el-table-column>
        <el-table-column
          prop="avgTimeStr"
          label="日均工时（时）"
          width="120">
        </el-table-column>
        <el-table-column
          prop="lateNum"
          label="迟到次数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="lateSumStr"
          label="迟到时长"
          width="80">
        </el-table-column>
        <el-table-column
          prop="earlyNum"
          label="早退次数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="earlySumStr"
          label="早退时长"
          width="80">
        </el-table-column>
        <el-table-column
          prop="lackNum"
          label="旷工天数"
          width="80">
        </el-table-column>
        <el-table-column label="操作" align="left" fixed="right" width="100">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" @click="toDetail(scope.row)">{{scope.id}}查看详情</el-link>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        v-if="total"
        class="pageView"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :current-page.sync="pageNum"
        :total="total"
        :page-size="pageSize">
      </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgTree, getAttendanceDealList, excelAttendance } from '../../axios/api.js'
import attendanceName from './components/attendanceName'
import { getFormData, filterObjNull } from '../../lib/util.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'AttendReport',
  components: {
    attendanceName
  },
  data () {
    return {
      props: {
        label: 'orgName',
        children: 'children'
      },
      form: {
        month: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
        userName: '',
        orgId: '',
        orgName: '',
        attendanceId: '',
        userType: ''
      },
      total: '',
      pageSize: 20,
      pageNum: 1,
      orgTree: [],
      tableData: [],
      popvisible: false
    }
  },
  computed: {
    ...mapState(['attendReportloading'])
  },
  methods: {
    ...mapMutations(['attendReportloadingShow', 'attendReportloadingHide']),
    setOrg (node) {
      this.$set(this.form, 'orgId', node.id)
      this.$set(this.form, 'orgName', node.orgName)
      this.popvisible = false
    },
    getData (pageNum) {
      this.pageNum = pageNum || 1
      const month = new Date(this.form.month)
      let data = {
        month: month.getFullYear() + '-' + (month.getMonth() < 9 ? ('0' + (month.getMonth() + 1)) : (month.getMonth() + 1)) + '-01',
        userName: this.form.userName,
        orgId: this.form.orgName ? this.form.orgId : '',
        userType: this.form.userType,
        attendanceId: this.form.attendanceId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      // 缓存查询条件
      sessionStorage.setItem('reportData', JSON.stringify({...data, orgName: this.form.orgName}))
      data = filterObjNull(data)
      getAttendanceDealList(getFormData(data)).then(res => {
        if (!res.data.success) {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
          this.tableData = []
          this.total = 0
          return false
        }
        if (res.data.value) {
          this.tableData = res.data.value.list || []
          this.total = res.data.value.total
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    },
    exportEcrl () {
      // 二次确认
      this.$confirm('是否确认导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.attendReportloadingShow()
        const month = new Date(this.form.month)
        let data = {
          month: month.getFullYear() + '-' + (month.getMonth() < 9 ? ('0' + (month.getMonth() + 1)) : (month.getMonth() + 1)) + '-01',
          userName: this.form.userName,
          orgId: this.form.orgName ? this.form.orgId : '',
          userType: this.form.userType
        }
        data = getFormData(filterObjNull(data))
        excelAttendance(data).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '考勤数据.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
          this.attendReportloadingHide()
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
      })
    },
    toDetail (row) {
      const date = new Date(this.form.month)
      const fomart = date.getFullYear() + '-' + (date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1))
      this.$router.push({
        name: 'AttendCalendar',
        query: {
          userId: row.userId,
          month: fomart,
          userName: row.userName,
          attendanceNums: row.attendanceNums,
          realNum: row.realNum,
          lateNum: row.lateNum,
          earlyNum: row.earlyNum,
          lackNum: row.lackNum
          // onLackNum: row.onLackNum,
          // offLackNum: row.offLackNum
        }
      })
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // console.log(this.pageNum)
      this.getData(val)
    }
  },
  mounted () {
    getOrgTree().then(res => {
      if (res.data.success === true) {
        this.orgTree = res.data.value || []
        // this.getOrgTree(res.data.value)
      } else {
        this.failMessage(res.data.message)
      }
    }).catch(res => {
      this.failMessage(res && res.data && res.data.message)
    })
    if (this.$route.query.cacheCondition) { // 如果是从详情页（日历展示页）返回列表页，则查询走缓存
      this.form = JSON.parse(sessionStorage.getItem('reportData'))
      this.pageNum = JSON.parse(sessionStorage.getItem('reportData')).pageNum
      this.getData(this.pageNum)
    } else {
      this.getData()
    }
  }
}
</script>

<style scoped>
  .btn{
    display: inline-block;
    margin-bottom: 22px;
  }
</style>
