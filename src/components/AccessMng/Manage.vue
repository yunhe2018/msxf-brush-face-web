<template>
  <div class="processMng">
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline DeviceForm" @submit.native.prevent>
        <el-form-item label="门禁名称" class="label_197">
          <el-input class='width_197' size="small" clearable v-model.trim="formInline.keyword" @keyup.enter.native="queryAccess"></el-input>
        </el-form-item>
        <el-form-item label="安装位置" class="label_197">
          <el-input class='width_197' size="small" clearable v-model.trim="formInline.acPosition" @keyup.enter.native="queryAccess"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select class='width_197' size="small" v-model="formInline.status" clearable>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <el-button size="small" class="queryBtn" @click="queryAccess">查询</el-button>
        <el-button size="small" class="queryBtn" @click="addAccess">新增门禁</el-button>
      </el-form>
    </div>
    <div class="listBotTit">
      <div data-v-5295f104="" class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <!-- <el-table-column type="index" label="序号" align="left"></el-table-column> -->
        <el-table-column prop="acType" label="门禁方式" align="left">
            <template slot-scope="scope">
              <div style="display:none">{{ scope.row.id }}</div>
              <span v-if='scope.row.acType===0'>配合式</span>
              <span v-if='scope.row.acType===1'>非配合式</span>
          </template>
        </el-table-column>
        <el-table-column prop="acName" label="门禁名称" align="left"></el-table-column>
        <el-table-column prop="acPosition" label="安装位置" align="left"></el-table-column>
        <el-table-column prop="hostIp" label="识别主机" align="left"></el-table-column>
        <el-table-column prop="identifyStatus" label="识别机制" align="left">
            <template slot-scope="scope">
            <span v-if='scope.row.identifyStatus===0'>前端识别</span>
            <span v-if='scope.row.identifyStatus===1'>后端识别</span>
          </template>
        </el-table-column>
        <el-table-column prop="greetingStatus" label="是否迎宾" align="left">
            <template slot-scope="scope">
            <span v-if='scope.row.greetingStatus===0'>关</span>
            <span v-if='scope.row.greetingStatus===1'>开</span>
          </template>
        </el-table-column>
        <el-table-column prop="libraryName" label="底库名称" align="left" width="150">
          <template slot-scope="scope">
            <div class="opreationBtn" @click="libraryClick(scope.row)">{{scope.row.libraryName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="acStatus" label="业务状态" align="left">
            <template slot-scope="scope">
            <span v-if='scope.row.acStatus===0'>关</span>
            <span v-if='scope.row.acStatus===1'>开</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="状态" align="left">
          <template slot-scope="scope">
            <span v-if='scope.row.status===0'>无效</span>
            <span v-if='scope.row.status===1'>有效</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="240" align="left">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" v-if="scope.row.acType === 1 && scope.row.greetingStatus === 1" @click="screenTable(scope.row)">屏幕配置</el-link>
            <el-link type="primary" class="opreationBtn" @click="modifiyTable(scope.row,scope.$index)">修改</el-link>
            <!-- <span class="splitLine">|</span> -->
            <el-link type="primary" class="opreationBtn" @click="deleteTable(scope.row,scope.$index)">删除</el-link>
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
    <ManageDialog :show.sync="show" :type="type" :id="id" @submit="submit" :btnDisabled="btnDisabled"></ManageDialog>
    <CountDetail :countShow.sync="countShow" :countAmount="countAmount" :status="status" :manage="manage"></CountDetail>
    <ModifyComponay :showModifiy.sync="showModifiy" :modifiyType="modifiyType" :business="business" @renderScreen="renderScreen"></ModifyComponay>
  </div>
</template>

<script>
import { listAccessBusiness, addAccessBusiness, updateAccessBusiness, deleteAccessBusiness } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
import ManageDialog from './ManageDialog'
import ModifyComponay from '../common/ModifyComponay'
import CountDetail from '../Storage/CountDetail'
export default {
  name: 'Manage',
  components: {
    ManageDialog,
    CountDetail,
    ModifyComponay
  },
  data () {
    return {
      btnDisabled: false,
      formInline: {},
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      show: false,
      type: '',
      id: 0,
      countShow: false,
      countAmount: {},
      status: '',
      showModifiy: false,
      modifiyType: '',
      business: {},
      manage: 'manage'
    }
  },
  created () {
    this.queryAccess(this.pageNum)
  },
  methods: {
    queryAccess (num) {
      let data = {
        pageSize: this.pageSize,
        // status: this.formInline.status,
        acPosition: this.formInline.acPosition,
        keyword: this.formInline.keyword
      }
      data = filterObjNull(data)
      if (typeof num === 'number') {
        data.pageNum = num
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      listAccessBusiness(getFormData(data)).then(res => {
        if (res.data.success === true) {
          if (res.data.value) {
            this.tableData = res.data.value.list
            this.total = res.data.value.total
          } else {
            this.tableData = []
            this.total = 0
          }
        } else {
          this.tableData = []
          this.total = 0
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    addAccess () {
      this.type = 'add'
      this.show = true
    },
    modifiyTable (item) {
      this.type = 'modifiy'
      this.show = true
      this.id = item.id
    },
    submit (amount) {
      this.btnDisabled = true
      let data = {
        acType: amount.value.acType,
        acName: amount.value.acName,
        acPosition: amount.value.acPosition,
        acStatus: amount.value.acStatus,
        content: amount.value.content
        // status: amount.value.status,

      }
      data.libraryIds = []
      data.libraryIds.push(amount.value.libraryIds)
      data.ruleIds = []
      data.ruleIds.push(amount.value.ruleIds)
      if (amount.value.acType === 0) {
        // data.attendanceStatus = amount.value.attendanceStatus
        data.deviceIds = []
        data.deviceIds.push(amount.value.machines, amount.value.hostIps)
        data.identifyStatus = amount.value.identifyStatus
        if (amount.value.identifyStatus === 1) {
          if (amount.value.networkStatus === true) {
            data.networkStatus = 1
            data.deviceIds.push(amount.value.networkIdStatus)
          } else {
            data.networkStatus = 0
          }
        }
      } else {
        data.deviceIds = []
        data.deviceIds.push(amount.value.hostIps, amount.value.cameraIds, amount.value.networkIds)
        if (amount.value.cameraIdsAmount || amount.value.cameraIds) {
          let arr = []
          arr.push(amount.value.cameraIds)
          amount.value.cameraIdsAmount.map(item => {
            data.deviceIds.push(item.value)
            arr.push(item.value)
          })
          data.videoDeviceId = arr[amount.value.videoType]
        }
        if (amount.greetingStatus === true) {
          data.greetingStatus = 1
          data.deviceIds.push(amount.value.boxIds)
        } else {
          data.greetingStatus = 0
        }
      }

      if (this.type === 'add') {
        addAccessBusiness(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.queryAccess()
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
        updateAccessBusiness(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.queryAccess(this.pageNum)
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
      // this.queryAccess()
    },
    handleCurrentChange (e) {
      this.queryAccess(e)
    },
    libraryClick (amount) {
      this.countAmount = amount
      this.status = 'access'
      this.countShow = true
    },
    deleteTable (amount) {
      this.$confirm(`确认删除${amount.acName}吗`, '删除', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: amount.id
          }
          deleteAccessBusiness(getFormData(data)).then(res => {
            // console.log(res)
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryAccess(this.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    screenTable (amount) {
      this.showModifiy = true
      this.modifiyType = 'manageModifiy'
      this.business = {
        businessId: amount.id,
        businessType: 0
      }
    },
    renderScreen (e) {
      this.showModifiy = e
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btn{margin-bottom: 20px;}
</style>
