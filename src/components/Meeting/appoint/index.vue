<template>
  <div>
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline recordForm" @submit.native.prevent label-width="65px">
          <el-form-item label="选择日期" class="label_197">
            <el-date-picker v-model="form.maTime" type="date" :clearable="false" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <div class="btn">
            <el-button size="small" class="queryBtn" @click="getList">查询</el-button>
          </div>
        </el-form>
      </div>
    </div>
     <div class="listBotTit">
      <div class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" :span-method="arraySpanMethod">
        <el-table-column label="会议室名称" width="230">
          <template slot-scope="scope">
            <h4>{{scope.row.mrName}}</h4>
            <span class="details">{{scope.row.mrAddress}}</span>
            <span class="details">容量：{{scope.row.mrNums}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="190">
          <template slot-scope="scope">
            <p :class="['tableTime',{'unable': scope.row.maName || scope.row.maStatus === '无预约'}]">
              <span>{{scope.row.startTime + "~" + scope.row.endTime}}</span>
              <span v-if="!scope.row.maName && scope.row.maStatus !== '无预约'" class="icon" :style="{background:'url(' + timeIcon + ')'}"></span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <el-table-column prop="maName" label="会议名称"></el-table-column>
          <el-table-column label="参会人员" width="170">
            <template slot-scope="scope">
              <el-link type="primary" class="opreationBtn" @click="lookPpList(scope.row)">{{scope.row.libraryName + "(" + scope.row.maCounts + ")"}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="maUserName" label="预约人"></el-table-column>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p :class="{over: scope.row.maStatus !== '已预约' && scope.row.maStatus !== '可预约'}">{{scope.row.maStatus}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" fixed="right" width="110">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" v-if="scope.row.maStatus === '已完成' || scope.row.maStatus === '会议中'" @click="goDetail(scope.row)">查看</el-link>
            <el-link type="primary" class="opreationBtn" v-if="scope.row.maStatus === '可预约'" @click="edit(scope.row)">预约</el-link>
            <el-link type="primary" class="opreationBtn" v-if="scope.row.maStatus === '已预约'" @click="edit(scope.row)">修改</el-link>
            <el-link type="primary" class="opreationBtn" v-if="scope.row.maStatus === '已完成' || scope.row.maStatus === '已预约'" @click="del(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </div>
    <appointEdit ref='editAppoint' @updateList="getList" />
    <peopleList ref='ppList' />
  </div>
</template>

<script>
import { listMeetingAppointment, deleteMeetingAppointment } from '@/axios/api.js'
import { getFormData } from '@/lib/util.js'
import timeIcon from '@/assets/images/icon_shijian_white.svg'
import appointEdit from './components/appointEdit'
import peopleList from './components/peopleList'
export default {
  components: {
    appointEdit,
    peopleList
  },
  data () {
    return {
      timeIcon: timeIcon,
      form: {
        maTime: null
      },
      tableData: []
    }
  },
  computed: {
  },
  methods: {
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.rowspan !== undefined) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          }
        } else if (row.isSame) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
      if (!row.maName) {
        if (columnIndex === 2) {
          return [1, 3]
        } else if (columnIndex === 3 || columnIndex === 4) {
          return [0, 0]
        }
      }
    },
    getList () {
      this.tableData = []
      const currDay = new Date(this.form.maTime)
      const maTime = currDay.getFullYear() + '-' + this.add0(currDay.getMonth() + 1) + '-' + this.add0(currDay.getDate())
      // 缓存查询条件
      sessionStorage.setItem('maTime', maTime)
      const jsonData = getFormData({maTime: maTime})
      listMeetingAppointment(jsonData).then(res => {
        if (res.data.success) {
          const arr = []
          res.data.value.list.forEach(v => {
            v.appointmentList.forEach(i => {
              arr.push({
                ...i,
                mrName: v.room.mrName,
                mrId: v.room.id,
                mrAddress: v.room.mrAddress,
                mrNums: v.room.mrNums
              })
            })
          })
          this.tableData = arr
          // 合并单元格处理
          for (let i = 0; i < this.tableData.length; i++) {
            if (i === 0) { // 第一個單獨處理
              const count = this.tableData.filter(v => this.tableData[0].mrName === v.mrName).length
              if (count > 1) {
                this.tableData[0].rowspan = count
              }
            } else {
              if (this.tableData[i].mrName !== this.tableData[i - 1].mrName) { // 有重複的，切是第一個加字段rowspan
                this.tableData[i].rowspan = this.tableData.filter(v => this.tableData[i].mrName === v.mrName).length
              } else {
                this.tableData[i].isSame = true // 重複的，但不是第一個，用isSame標記
              }
            }
          }
        }
      })
    },
    edit (row) {
      const currDay = new Date(this.form.maTime)
      const maTime = currDay.getFullYear() + '-' + this.add0(currDay.getMonth() + 1) + '-' + this.add0(currDay.getDate())
      let data = {}
      if (row.maName) {
        data = {
          type: 'edit',
          mrId: row.mrId,
          maId: row.maId,
          maTime: maTime
        }
      } else {
        data = {
          type: 'add',
          startTime: row.startTime,
          endTime: row.endTime,
          mrId: row.mrId,
          maTime: maTime
        }
      }
      this.$refs.editAppoint.showData({
        ...data
      })
    },
    goDetail (row) {
      this.$router.push({
        path: '/meeting/appointDetail',
        query: {
          maId: row.maId
        }
      })
    },
    del (row) {
      this.$confirm(`确认删除会议吗？`, '删除会议', {
        closeOnClickModal: false
      }).then(() => {
        let data = getFormData({
          maId: row.maId
        })
        deleteMeetingAppointment(data).then(res => {
          if (res.data.success) {
            this.successMessage(res.data.message)
            this.getList()
          } else {
            this.failMessage(res.data.message)
          }
        }).catch((res) => {
          this.failMessage(res && res.data && res.data.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    lookPpList (row) {
      this.$refs.ppList.showData({id: row.libraryId})
    },
    add0 (num) {
      return num > 9 ? num : '0' + num
    },
    failDialog (txt) {
      this.$alert(txt || '操作失败！', '提示', {
        confirmButtonText: '确定',
        type: 'error'
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
  },
  mounted () {
    if (this.$route.query.cacheCondition) { // 如果是从详情页返回列表页，则查询走缓存
      this.form.maTime = sessionStorage.getItem('maTime')
    }
    this.getList()
  },
  created () {
    const today = new Date()
    this.form.maTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  }
}
</script>

<style scoped>
  .btn{
    display: inline-block;
    margin-bottom: 22px;
  }
  .tableTime{
    display: flex;
    justify-content: space-between;
    width:166px;
    height: 44px;
    line-height: 44px;
    border-radius: 4px;
    padding-left: 10px;
    color: #fff;
    box-sizing: border-box;
    background-color: #4C7EE9;
  }
  .unable{
    background-color: #F2F6FC;
    color: #606266;
  }
  .tableTime .icon{
    width: 12px;
    height: 12px;
    margin: 16px 10px;
  }
  h4{
    font-size: 14px;
  }
  .details{
    width: 45%;
    font-size: 12px;
  }
  .over{
    color: #C0C4CC;
  }
</style>
