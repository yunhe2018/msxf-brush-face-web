<template>
  <div>
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline DeviceForm" @submit.native.prevent>
        <el-form-item label="会议室名称" class="label_197">
          <el-input @keyup.enter.native="queryMeeting" clearable class='width_197' size="small" v-model.trim="formInline.mrName"></el-input>
        </el-form-item>
        <el-form-item label="会议室位置" class="label_197">
          <el-input @keyup.enter.native="queryMeeting" clearable class='width_197' size="small" v-model.trim="formInline.mrAddress"></el-input>
        </el-form-item>
        <el-button size="small" @click="queryMeeting" class="queryMeeting">查询</el-button>
        <el-button size="small" @click="addMeeting" class="addMeeting">新增会议室</el-button>
      </el-form>
    </div>
    <div class="listBotTit">
      <div data-v-5295f104="" class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <!-- <el-table-column type="index" label="序号" align="left"></el-table-column> -->
        <el-table-column prop="mrName" label="会议室名称" align="left">
          <template slot-scope="scope">
          <div style="display:none">{{ scope.row.id }}</div>
          <div>{{ scope.row.mrName }}</div>
        </template>
        </el-table-column>
        <el-table-column prop="mrAddress" label="会议室位置" align="left"></el-table-column>
        <el-table-column prop="mrNums" label="会议室容量" align="left"></el-table-column>
        <el-table-column prop="mrStatus" label="业务状态" align="left">
          <template slot-scope="scope">
            <span v-if='scope.row.mrStatus===0'>关闭</span>
            <span v-if='scope.row.mrStatus===1'>开启</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="120">
          <template slot-scope="scope">
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
    <MeetingMngDialog :show.sync="show" :btnDisabled="btnDisabled" :id="id" :type="type" @submit="submit"></MeetingMngDialog>
  </div>
</template>

<script>
import MeetingMngDialog from './MeetingMngDialog'
import { listMeetingRoom, deleteMeetingRoom, addMeetingRoom, updateMeetingBusinessRoom } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
export default {
  name: 'MeetingMng',
  components: {
    MeetingMngDialog
  },
  data () {
    return {
      formInline: {},
      tableData: [],
      show: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      btnDisabled: false,
      id: 0,
      type: ''
    }
  },
  created () {
    this.queryMeeting()
  },
  methods: {
    submit (amount) {
      this.btnDisabled = true
      console.log(amount.value)
      let data = {
        mrName: amount.value.mrName,
        mrAddress: amount.value.mrAddress,
        mrNums: amount.value.mrNums,
        startTime: '00:00',
        endTime: '23:59',
        mrStatus: amount.value.mrStatus,
        content: amount.value.content
      }
      let obj = {}
      amount.data3.map(item => {
        amount.value.deviceIds.map(childItem => {
          if (item.mbId === childItem) {
            obj[item.mbId] = item.mbName
          }
        })
      })
      data.mbList = obj
      if (this.type === 'add') {
        addMeetingRoom(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.queryMeeting()
          } else {
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
        updateMeetingBusinessRoom(data).then(res => {
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
    queryMeeting (num) {
      let data = {
        pageSize: this.pageSize,
        mrAddress: this.formInline.mrAddress,
        mrName: this.formInline.mrName
      }
      if (typeof num === 'number') {
        data.pageNum = num
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listMeetingRoom(getFormData(data)).then(res => {
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
    addMeeting () {
      this.type = 'add'
      this.show = true
    },
    modifiyTable (amount) {
      this.type = 'modify'
      this.id = amount.id
      this.show = true
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
    deleteTable (amount) {
      this.$confirm(`确认删除${amount.mrName}吗`, '删除', {
        closeOnClickModal: false
      }).then(() => {
        this.$confirm('删除会议室， 则清空所有与会议室相关记录', '删除', {
          closeOnClickModal: false
        }).then(() => {
          let data = {
            id: amount.id
          }
          deleteMeetingRoom(getFormData(data)).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryMeeting(this.pageNum)
            } else {
              this.failMessage(res && res.data && res.data.message)
            }
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
