<template>
  <div class="processMng">
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="考勤名称" class="label_197">
          <el-input class='width_197' size="small" clearable v-model.trim="formInline.atName" @keyup.enter.native="queryAttend"></el-input>
        </el-form-item>
        <el-form-item label="安装位置" class="label_197">
          <el-input class='width_197' size="small" clearable v-model.trim="formInline.atPosition" @keyup.enter.native="queryAttend"></el-input>
        </el-form-item>
        <el-button size="small" class="queryBtn" @click="queryAttend">查询</el-button>
        <el-button size="small" class="queryBtn" @click="addAttend">新增考勤</el-button>
      </el-form>
    </div>
    <div class="listBotTit">
      <div class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <!-- <el-table-column type="index" label="序号" align="left"></el-table-column> -->
        <el-table-column prop="atName" label="考勤名称" align="left">
          <template slot-scope="scope">
            <div style="display:none">{{ scope.row.id }}</div>
            <div>{{ scope.row.atName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="atPosition" label="安装位置" align="left"></el-table-column>
        <el-table-column prop="integratedIP" label="智能一体机" align="left"></el-table-column>
        <el-table-column prop="dataServerIP" label="识别主机" align="left"></el-table-column>
        <el-table-column prop="identifyStatus" label="识别机制" align="left">
          <template slot-scope="scope">
            <span v-if='scope.row.identifyStatus===0'>前端识别</span>
            <span v-if='scope.row.identifyStatus===1'>后端识别</span>
        </template>
        </el-table-column>

        <el-table-column prop="libraryName" label="底库名称" align="left">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" @click="libraryNameClick(scope.row,scope.$index)">{{scope.row.libraryName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="atStatus" label="业务状态" align="left">
          <template slot-scope="scope">
            <span v-if='scope.row.atStatus===0'>关</span>
            <span v-if='scope.row.atStatus===1'>开</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="left">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" v-if="scope.row.atType === 1" @click="screenTable(scope.row)">屏幕配置</el-link>
            <el-link type="primary" class="opreationBtn" @click="modifiyTable(scope.row,scope.$index)">修改</el-link>
            <!-- <span class="splitLine">|</span> -->
            <el-link type="primary" class="opreationBtn" @click="deleteTable(scope.row)">删除</el-link>
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
    <CountDetail :countShow.sync="countShow" :countAmount="countAmount" :manage="manage"></CountDetail>
    <AttendMngDialog :show.sync="show" :type="type" :id="id" @submit="submit" :btnDisabled="btnDisabled"></AttendMngDialog>
    <ModifyComponay :showModifiy.sync="showModifiy" :modifiyType="modifiyType" :business="business" :screenType="screenType" @renderScreen="renderScreen"></ModifyComponay>
  </div>
</template>

<script>
import { listAttendance, addAttendance, deleteAttendance, updateAttendance } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
import AttendMngDialog from './AttendMngDialog'
import ModifyComponay from '../common/ModifyComponay'
import CountDetail from '../Storage/CountDetail'
export default {
  name: 'AttendMng',
  components: {
    AttendMngDialog,
    ModifyComponay,
    CountDetail
  },
  data () {
    return {
      formInline: {},
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      show: false,
      btnDisabled: false,
      id: 0,
      type: '',
      showModifiy: false,
      modifiyType: '',
      business: {},
      screenType: '',
      countShow: false,
      countAmount: {},
      manage: 'attend'
    }
  },
  created () {
    this.queryAttend()
  },
  methods: {
    libraryNameClick (amount) {
      this.countAmount = amount
      this.countShow = true
    },
    screenTable (amount) {
      this.showModifiy = true
      this.modifiyType = 'manageModifiy'
      this.screenType = 'attendMng'
      this.business = {
        businessId: amount.id,
        businessType: 2
      }
    },
    renderScreen (e) {
      this.showModifiy = e
    },
    queryAttend (e) {
      let data = {
        pageSize: this.pageSize,
        atPosition: this.formInline.atPosition,
        atName: this.formInline.atName
      }
      if (typeof e === 'number') {
        data.pageNum = e
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listAttendance(getFormData(data)).then(res => {
        if (res.data.success) {
          var result = res.data.value || {}
          this.tableData = result.list || []
          this.total = result.total || 0
          // if (!res.data.value) {
          //   this.total = 0
          //   this.tableData = []
          // } else {
          //   this.tableData = res.data.value.list || []
          //   this.total = res.data.value.total
          // }
        } else {
          this.failMessage(res.data.message)
          this.total = 0
          this.tableData = []
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
        this.total = 0
        this.tableData = []
      })
    },
    deleteTable (amount) {
      this.$confirm(`确认删除${amount.atName}吗`, '删除', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: amount.id
          }

          deleteAttendance(getFormData(data)).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryAttend(this.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    handleCurrentChange (e) {
      this.queryAttend(e)
    },
    addAttend () {
      this.show = true
      this.type = 'add'
    },
    modifiyTable (amount) {
      this.show = true
      this.type = 'modifiy'
      this.id = amount.id
    },
    submit (amount) {
      this.btnDisabled = true
      let data = {
        atName: amount.value.atName,
        atPosition: amount.value.atPosition,
        atStatus: amount.value.atStatus,
        content: amount.value.content,
        libraryId: amount.value.libraryIds,
        atType: amount.value.atType
      }
      data.deviceIds = []
      data.deviceIds.push(amount.value.hostIps)
      if (amount.value.atType === 0) {
        data.identifyStatus = amount.value.identifyStatus
        data.deviceIds.push(amount.value.machines)
      } else {
        data.deviceIds.push(amount.value.cameraIds, amount.value.boxIds)
        if (amount.value.cameraIdsAmount || amount.value.cameraIds) {
          let arr = []
          arr.push(amount.value.cameraIds)
          amount.value.cameraIdsAmount.map(item => {
            data.deviceIds.push(item.value)
            arr.push(item.value)
          })
          data.videoDeviceId = arr[amount.value.videoType]
        }
      }
      if (this.type === 'add') {
        addAttendance(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.queryAttend()
          } else {
            // this.failMessage(res.data.message)
            this.$alert(res.data.message, '提示', {
              confirmButtonText: '确定',
              type: 'error',
              callback: action => {
              }
            })
          }
          this.btnDisabled = false
        }).catch(res => {
          // this.failMessage(res && res.data && res.data.message)
          this.$alert('请求失败', '提示', {
            confirmButtonText: '确定',
            type: 'error',
            callback: action => {
            }
          })
          this.btnDisabled = false
        })
      } else {
        data.id = this.id
        updateAttendance(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.queryAttend(this.pageNum)
          } else {
            // this.failMessage(res.data.message)
            this.$alert(res.data.message, '提示', {
              confirmButtonText: '确定',
              type: 'error',
              callback: action => {
              }
            })
          }
          this.btnDisabled = false
        }).catch(res => {
          // this.failMessage(res && res.data && res.data.message)
          this.$alert('请求失败', '提示', {
            confirmButtonText: '确定',
            type: 'error',
            callback: action => {
            }
          })
          this.btnDisabled = false
        })
      }
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
      // this.queryAttend()
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
</style>
