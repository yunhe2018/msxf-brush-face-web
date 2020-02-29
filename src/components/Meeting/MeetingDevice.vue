<template>
  <div>
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline DeviceForm" @submit.native.prevent>
        <el-form-item label="签到设备名称" class="label_197">
          <el-input @keyup.enter.native="queryMeeting" clearable class='width_197' size="small" v-model.trim="formInline.mbName"></el-input>
        </el-form-item>
        <el-button size="small" @click="queryMeeting" class="queryBtn">查询</el-button>
        <el-button size="small" @click="addMeeting" class="queryBtn">新增签到设备</el-button>
      </el-form>
    </div>
    <div class="listBotTit">
      <div data-v-5295f104="" class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <!-- <el-table-column type="index" label="序号" align="left"></el-table-column> -->
        <el-table-column prop="mbName" label="签到设备名称" align="left">
          <template slot-scope="scope">
          <div style="display:none">{{ scope.row.id }}</div>
          <div>{{ scope.row.mbName }}</div>
        </template>
        </el-table-column>
        <el-table-column prop="integratedIp" label="智能一体机" align="left"></el-table-column>
        <el-table-column prop="dataIp" label="识别主机" align="left"></el-table-column>
        <el-table-column prop="identifyStatusStr" label="识别机制" align="left"> </el-table-column>
        <el-table-column prop="mbStatus" label="业务状态" align="left">
          <template slot-scope="scope">
            <span v-if='scope.row.mbStatus===1'>开启</span>
            <span v-if='scope.row.mbStatus===0'>关闭</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="240">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" v-if="scope.row.mbType === 1" @click="screenTable(scope.row)">屏幕配置</el-link>
            <el-link type="primary" class="opreationBtn" @click="modifiyTable(scope.row,scope.$index)">修改</el-link>
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
    <MeetdeviceDialog :show.sync="show" :btnDisabled="btnDisabled" :id="id" :type="type" @submit="submit" ></MeetdeviceDialog>
    <ModifyComponay :showModifiy.sync="showModifiy" :modifiyType="modifiyType" :business="business" :screenType="screenType" @renderScreen="renderScreen"></ModifyComponay>
  </div>
</template>

<script>
import MeetdeviceDialog from './MeetdeviceDialog'
import { listMeetingBusiness, addMeetingBusiness, deleteMeetingBusiness, updateMeetingBusiness } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
import ModifyComponay from '../common/ModifyComponay'
export default {
  name: 'MeetingDevice',
  components: {
    MeetdeviceDialog,
    ModifyComponay
  },
  data () {
    return {
      formInline: {},
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      show: false,
      btnDisabled: false,
      id: 0,
      type: '',
      showModifiy: false,
      screenType: '',
      modifiyType: '',
      business: {}
    }
  },
  created () {
    this.queryMeeting()
  },
  methods: {
    screenTable (amount) {
      this.showModifiy = true
      this.modifiyType = 'manageModifiy'
      this.screenType = 'attendMng'
      this.business = {
        businessId: amount.id,
        businessType: 3
      }
    },
    renderScreen (e) {
      this.showModifiy = e
    },
    queryMeeting (num) {
      let data = {
        pageSize: this.pageSize,
        mbName: this.formInline.mbName
      }
      if (typeof num === 'number') {
        data.pageNum = num
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listMeetingBusiness(getFormData(data)).then(res => {
        if (res.data.success === true) {
          if (!res.data.value) {
            this.total = 0
            this.tableData = []
          } else {
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
      this.queryMeeting(e)
    },
    submit (amount) {
      this.btnDisabled = true
      console.log(amount)
      let data = {
        mbType: amount.value.mbType,
        mbName: amount.value.mbName,
        identifyStatus: amount.value.identifyStatus,
        mbStatus: amount.value.mbStatus,
        content: amount.value.content
      }
      data.deviceIds = []
      // 识别主机
      data.deviceIds.push(amount.value.dataIp)
      // 配合式-后端识别
      if (amount.value.mbType === 0) {
        // 智能一体机
        data.deviceIds.push(amount.value.integratedIp)
        if (amount.value.identifyStatus === 1) {
          // 门禁开关-网络开关
          if (amount.value.accessStatus) {
            data.accessStatus = 1
            data.deviceIds.push(amount.value.networkIds)
          } else {
            data.accessStatus = 0
          }
        }
      } else {
        // 应用盒子
        data.deviceIds.push(amount.value.boxIds, amount.value.cameraIds)
        // 摄像头
        if (amount.value.cameraIdsAmount || amount.value.cameraIds) {
          let arr = []
          arr.push(amount.value.cameraIds)
          amount.value.cameraIdsAmount.map(item => {
            data.deviceIds.push(item.value)
            arr.push(item.value)
          })
          data.videoDeviceId = arr[amount.value.videoType]
        }
        // 非配合式-网络开关
        if (amount.value.accessStatus) {
          data.accessStatus = 1
          data.deviceIds.push(amount.value.networkIds)
        } else {
          data.accessStatus = 0
        }
      }
      if (this.type === 'add') {
        addMeetingBusiness(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.queryMeeting()
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
        updateMeetingBusiness(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.queryMeeting(this.pageNum)
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
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    addMeeting () {
      this.type = 'add'
      this.show = true
    },
    modifiyTable (amount) {
      this.type = 'modify'
      this.id = amount.id
      this.show = true
    },
    deleteTable (amount) {
      this.$confirm(`确认删除${amount.mbName}吗`, '删除', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: amount.id
          }
          deleteMeetingBusiness(getFormData(data)).then(res => {
            // console.log(res)
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryMeeting(this.pageNum)
            } else {
              if (res.data.code === '20') {
                let str = `<div></div>`
                res.data.value.map(item => {
                  str += `<div style="display: block;">${item}</div>`
                })
                this.$alert(`<div>
                  ${res.data.message}
                  <div style="height: 50px;overflow: auto;" class="dialogAndScrollbar">
                    ${str}
                  </div>
                </div>`, '提示', {
                  dangerouslyUseHTMLString: true
                })
              } else {
                this.failMessage(res && res.data && res.data.message)
              }
            }
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
