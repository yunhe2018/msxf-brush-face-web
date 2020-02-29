<template>
    <div>
        <div class='listTop'>
          <div class='listTopTit'>
              <div class='listTit'>查询条件</div>
          </div>
          <el-form :inline="true" :model="form" class="demo-form-inline" @submit.native.prevent>
              <el-form-item label="访客姓名" class="label_197">
                  <el-input @keyup.enter.native="queryVisitorList" class='width_197' size="small" v-model.trim="form.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="被访人" class="label_197">
                  <el-input @keyup.enter.native="queryVisitorList" class='width_197' size="small" v-model.trim="form.visitedName" clearable></el-input>
              </el-form-item>
              <el-form-item label="授权时间">
                <el-date-picker
                  style="width:260px"
                  v-model="timeRange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-button size="small" @click="queryVisitorList">查询</el-button>
          <el-button size="small" @click="addVisitorEvent" class="btn">新增访客</el-button>
          <!-- <el-button size="small" @click="uploadFile">导入</el-button> -->
          <!-- <el-button size="small" @click="downloadFile" :loading="visitorDownloading">导出</el-button> -->
        </el-form>
        </div>
        <div class="listBotTit">
          <div data-v-5295f104="" class="boxTitle">数据列表</div>
          <div class="pdlr-16">
            <el-table :data="visitorList" style="width: 100%" @selection-change="handleSelectionChange" ref="multipleTable">
              <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="访客姓名" prop="userName">
                  <template slot-scope="scope">
                    <div style="display:none">{{ scope.row.id }}</div>
                    <div>{{ scope.row.userName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="访客照片">
                  <template slot-scope="scope">
                    <img :src="url+scope.row.field1" height="40" @click="imgClick(scope.row,scope.$index)"/>
                  </template>
                </el-table-column>
                <el-table-column label="来访目的" prop="field3"></el-table-column>
                <!-- <el-table-column label="手机号" prop="phone"></el-table-column> -->
                <el-table-column label="被访人" prop="visitorName"></el-table-column>
                <!-- <el-table-column label="身份证号" prop="identifyNo"></el-table-column> -->
                <el-table-column label="访问开始时间" prop="startTime"></el-table-column>
                <el-table-column label="访问结束时间" prop="endTime"></el-table-column>
                <el-table-column label="登记渠道">
                  <template slot-scope="scope">
                    {{scope.row.visitorSource === 1 ? '终端登记' : '后台添加'}}
                  </template>
                </el-table-column>
                <el-table-column label="识别记录" width="80">
                  <template slot-scope="scope">
                    <!-- <el-link type="primary" @click="showRisRecord(scope.row,scope.$index)">查看</el-link> -->
                    <el-link type="primary" class="opreationBtn" @click="recordTo(scope.row)">查看</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-link type="primary" class="opreationBtn" @click="modifyVisitorEvent(scope.row,scope.$index)">修改</el-link>
                    <el-link type="primary" class="opreationBtn" @click="deleteVisitorEvent(scope.row,scope.$index)">删除</el-link>
                  </template>
                </el-table-column>
            </el-table>
            <div class="btnAll" v-if="visitorTotal">
              <el-checkbox class='staffCheckbox' v-model="allChecked" @change="toggleSelection(visitorList)">全选</el-checkbox>
              <div size="small" class='batchDelete' @click="batchDelete">批量删除</div>
            </div>
            <el-pagination v-if="visitorTotal" class="pageView" @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 50, 100, 500]" :current-page.sync="reqVisitor.pageNum"
                :total="visitorTotal" :page-size="pageSize">
            </el-pagination>
          </div>
        </div>
        <StaffDialog :show.sync="show" :type="type" :formVal="formVal" :staffType="staffType" :imgPrefix="url" @submit="handleSubmit" :btnDisabled="btnDisabled"></StaffDialog>
      <uploadFileDialog ref="up" @updateList="updateList" />
      <imgSwipper ref="showBigImg" />
    </div>
</template>

<script>
import StaffDialog from './StaffDialog'
import { listVisitor, addVisitor, deleteVisitor, modifyVisitor, getVisitorById, getOrgTree, excelExport, deleteVisitorBatch } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
import uploadFileDialog from './components/uploadFileDialog'
import { mapState, mapMutations } from 'vuex'
import imgSwipper from '@/components/common/imgSwipper'

export default {
  name: 'Visitor',
  inject: ['reload'],
  components: {
    StaffDialog,
    uploadFileDialog,
    imgSwipper
  },
  data () {
    return {
      pageSize: 10,
      props: {
        label: 'orgName',
        children: 'children'
      },
      form: {
        name: '',
        orgName: '',
        visitedName: '',
        startTime: '', // 授权开始时间
        endTime: '' // 授权开始时间
      },
      timeRange: '',
      formVal: {},
      show: false,
      type: 'add',
      staffType: 'visitor',
      popvisible: false,
      userRole: '',
      searchFields: [],
      visitorFields: [],
      visitorList: [], // 人员列表
      orgTreeData: [], // 组织树
      recordData: [],
      url: this.$globalConst.apiPrefix,
      visitorTotal: 0,
      visitorCurPage: 1,
      bigImg: '',
      initReqVisitor: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        visitedName: ''
      },
      reqVisitor: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        visitedName: ''
      },
      btnDisabled: false,
      multipleSelection: [],
      allChecked: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(['visitorDownloading'])
  },
  created () {
    this.initData()
    this.getOrgTreeData()
    this.queryVisitorList()
  },
  methods: {
    ...mapMutations(['visitorDownloadingShow', 'visitorDownloadingHide']),
    handleSizeChange (val) {
      this.reqVisitor.pageSize = val
      this.queryVisitorList()
    },
    toggleSelection (rows) {
      // if (rows) {
      //   rows.forEach(row => {
      //     this.$refs.multipleTable.toggleRowSelection(row, true)
      //   })
      // } else {
      //   this.$refs.multipleTable.clearSelection()
      // }
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      if (this.multipleSelection.length === this.visitorList.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
    },
    // 初始化组件数据
    initData () {
      this.form = {}
      this.reqVisitor = JSON.parse(JSON.stringify(this.initReqVisitor))
    },
    addVisitorEvent () {
      this.show = true
      this.type = 'add'
      this.formVal = {
        visitorId: '',
        visitorName: ''
      }
    },
    // 修改员工
    modifyVisitorEvent (e) {
      this.show = true
      this.type = 'modify'
      this.getVisitorByIdData(e.id)
    },
    getVisitorByIdData (id) {
      let reqData = getFormData({
        id: id
      })
      getVisitorById(reqData).then(res => {
        let result = res.data || {}
        if (result.success) {
          this.formVal = result.value
        } else {
          this.failMessage('获取信息失败')
        }
      }).catch((res) => {
        this.formVal = {}
        this.failMessage(res && res.data && res.data.message)
      })
    },
    // 删掉员工
    deleteVisitorEvent (e) {
      this.$confirm(`确认删除${e.userName}人员数据吗？`, '删除人员', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = getFormData({
            id: e.id
          })
          deleteVisitor(data, this.userRole).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryVisitorList(this.reqVisitor.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    batchDelete () {
      this.$confirm('确定要批量删除吗？', '批量删除访客', {
        closeOnClickModal: false
      })
        .then(() => {
          let ids = ''
          if (this.multipleSelection) {
            this.multipleSelection.map(item => {
              ids += item.id + ','
            })
          }
          let data = getFormData({
            ids: ids
          })
          deleteVisitorBatch(data).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryVisitorList(this.reqVisitor.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
          }).catch((res) => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    // 查询组织人员信息
    queryVisitorList (e) {
      if (typeof e === 'number') {
        this.reqVisitor.pageNum = e
      } else {
        this.reqVisitor.pageNum = 1
        this.visitorCurPage = 1
      }
      this.reqVisitor.name = this.form.name
      this.reqVisitor.visitedName = this.form.visitedName
      this.reqVisitor.startTime = this.form.startTime
      this.reqVisitor.endTime = this.form.endTime
      let reqData = filterObjNull(this.reqVisitor)
      reqData = getFormData(reqData)
      this.visitorList = []
      listVisitor(reqData, this.userRole).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.failMessage(result.message)
          this.visitorList = []
          if (this.reqVisitor.pageNum === 1) {
            this.visitorTotal = 0
          }
          return false
        }
        if (result.value) {
          this.visitorList = result.value.list || []
          this.visitorTotal = result.value.total
        } else {
          this.visitorList = []
          this.visitorTotal = 0
        }
      }).catch((res) => { // 请求失败返回的数据
        this.visitorList = []
        if (this.reqVisitor.pageNum === 1) {
          this.visitorTotal = 0
        }
        this.failMessage(res && res.data && res.data.message)
      })
    },
    updateList () {
      this.queryVisitorList()
    },
    uploadFile () {
      this.$refs.up.showData({
        personType: 'visitor'
      })
    },
    downloadFile () {
      // 二次确认
      this.$confirm('是否确认导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.visitorDownloadingShow()
        excelExport({
          ...this.form,
          type: 0, // 固定值
          code: 0, // 固定值
          userType: 2 // 固定值
        }).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '访客数据.rar'
          a.click()
          window.URL.revokeObjectURL(url)
          this.visitorDownloadingHide()
          this.successMessage('导出成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
    },
    getOrgTreeData () {
      getOrgTree().then(res => {
        let result = res.data || {}
        if (result.success) {
          this.orgTreeData = result.value || []
        } else {
          this.orgTreeData = []
          this.failMessage(result.message)
        }
        this.orgTreeData = Object.assign([], this.orgTreeData)
      }).catch((res) => { // 请求失败返回的数据
        this.failMessage(res && res.data && res.data.message)
      })
    },
    handleSubmit (data) {
      this.btnDisabled = true
      let reqData = data.value
      if (this.type === 'add') {
        addVisitor(reqData, this.userRole).then(res => {
          if (res.data.success) {
            this.show = data.status
            this.successMessage(res.data.message)
            this.queryVisitorList()
          } else {
            this.failDialog(res.data.message)
          }
          this.btnDisabled = false
        }).catch((res) => {
          this.failDialog(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      } else {
        modifyVisitor(reqData, this.userRole).then(res => {
          if (res.data.success) {
            this.show = data.status
            this.successMessage(res.data.message)
            this.queryVisitorList(this.reqVisitor.pageNum)
          } else {
            this.failDialog(res.data.message)
          }
          this.btnDisabled = false
        }).catch((res) => {
          this.failDialog(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      }
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
    },
    imgClick (detail, index) {
      this.$refs.showBigImg.showData({
        dataList: this.visitorList.map(i => ({ imgUrl: i.field1, userName: i.userName })),
        imgInit: index,
        imgEnd: this.pageSize - 1
      })
    },
    recordTo (amount) {
      this.$router.push({
        path: '/record',
        query: {
          userName: amount.userName,
          userType: amount.userType
        }
      })
      sessionStorage.setItem('menuName', '记录管理')
      // sessionStorage.setItem('menuOrder', 5)
      this.reload()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.queryVisitorList(val)
    }
  },
  watch: {
    timeRange () {
      if (this.timeRange !== '' && this.timeRange !== null) {
        this.form.startTime = this.timeRange[0]
        this.form.endTime = this.timeRange[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    }
  }
}
</script>
<style scoped>
.btnAll .staffCheckbox {
  margin-right: 0;
  padding-right: 10px;
}
.batchDelete {
  color: #4C7EE9;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
.btnAll {
  display: flex;
  position: absolute;
  left: 28px;
  bottom: 29px;
  height: 25px;
}
.el-radio{margin-right:10px}
.el-dialog{max-height:80%}
.imgPopCls /deep/ .el-dialog__header{
    padding:0
}
.imgPopCls /deep/ .el-dialog__body {
  padding: 20px;
}
.imgPopCls /deep/ .el-dialog__headerbtn{
    top:10px;
    right:10px;
}
.bigImg {
  width: 100%;
}
.btn{
  margin-bottom: 20px;
}
  .listBotTit {
    padding-bottom: 9px;
    background: #fff;
    position: relative;
  }
  .pdlr-16{padding-left:16px;padding-right:16px}

</style>
