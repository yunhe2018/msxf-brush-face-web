<template>
    <div>
        <div class='listTop'>
          <div class='listTopTit'>
              <div class='listTit'>查询条件</div>
          </div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
              <el-form-item label="黄名单姓名" class="label_197">
                  <el-input @keyup.enter.native="queryYellowList" class='width_240' size="small" v-model.trim="formInline.name" clearable></el-input>
              </el-form-item>
              <el-button size="small" @click="queryYellowList">查询</el-button>
              <el-button size="small" @click="addYellowEvent" class="btn">新增黄名单</el-button>
          </el-form>
        </div>
        <div class="listBotTit">
          <div data-v-5295f104="" class="boxTitle">数据列表</div>
          <div class="pdlr-16">
            <el-table :data="yellowList" style="width: 100%">
                <el-table-column label="姓名" prop="userName">
                    <template slot-scope="scope">
                      <div style="display:none">{{ scope.row.id }}</div>
                      <div>{{ scope.row.userName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="手机号" prop="phone"></el-table-column>
                <!-- <el-table-column label="所属单位" prop="field4"></el-table-column> -->
                <!-- <el-table-column label="身份证号" prop="identifyNo"></el-table-column> -->
                <el-table-column label="照片">
                  <template slot-scope="scope">
                    <img :src="url+scope.row.field1" height="40" @click="imgClick(scope.row,scope.$index)"/>
                  </template>
                </el-table-column>
                <el-table-column label="识别记录" width="80">
                  <template slot-scope="scope">
                    <el-link type="primary" class="opreationBtn" @click="recordTo(scope.row)">查看</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-link type="primary" class="opreationBtn" @click="modifyYellowEvent(scope.row,scope.$index)">修改</el-link>
                    <el-link type="primary" class="opreationBtn" @click="deleteYellowEvent(scope.row,scope.$index)">删除</el-link>
                  </template>
                </el-table-column>
            </el-table>

            <el-pagination
                v-if="yellowTotal"
                class="pageView"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 50, 100, 500]"
                :current-page.sync="reqYellow.pageNum"
                :total="yellowTotal"
                :page-size="pageSize">
            </el-pagination>
            </div>
          </div>
          <StaffDialog :show.sync="show" :type="type" :formVal="formVal" :staffType="staffType" :imgPrefix="url" @submit="handleSubmit" :btnDisabled="btnDisabled"></StaffDialog>
          <imgSwipper ref="showBigImg" />
    </div>
</template>

<script>
import StaffDialog from './StaffDialog'
import { listBlack, addBlack, deleteBlack, modifyBlack, getOrgTree } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
import imgSwipper from '@/components/common/imgSwipper'

export default {
  name: 'Yellow',
  inject: ['reload'],
  components: {
    StaffDialog,
    imgSwipper
  },
  data () {
    return {
      pageSize: 10,
      props: {
        label: 'orgName',
        children: 'children'
      },
      formInline: {
        name: '',
        // status: '',
        orgName: '',
        orgId: null
      },
      formVal: {},
      show: false,
      type: 'add',
      staffType: 'yellow',
      popvisible: false,
      userRole: '',
      searchFields: [],
      yellowFields: [],
      yellowList: [], // 人员列表
      orgTreeData: [], // 组织树
      url: this.$globalConst.apiPrefix,
      yellowTotal: 0,
      yellowCurPage: 1,
      bigImg: '',
      initReqYellow: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        visitedName: ''
      },
      reqYellow: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        visitedName: ''
      },
      btnDisabled: false
    }
  },
  created () {
    this.initData()
    this.getOrgTreeData()
    this.queryYellowList()
  },
  methods: {
    handleSizeChange (val) {
      this.initReqYellow.pageSize = val
      this.queryYellowList()
    },
    // 初始化组件数据
    initData () {
      this.formInline = {}
      this.reqYellow = JSON.parse(JSON.stringify(this.initReqYellow))
    },
    addYellowEvent () {
      this.show = true
      this.type = 'add'
      this.formVal = {
        // status: 1 // 默认选中有效状态
      }
    },
    // 修改员工
    modifyYellowEvent (e) {
      this.show = true
      this.type = 'modify'
      this.formVal = JSON.parse(JSON.stringify(e))
    },
    // 删掉员工
    deleteYellowEvent (e) {
      this.$confirm(`确认删除${e.userName}人员数据吗？`, '删除人员', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = getFormData({
            id: e.id
          })
          deleteBlack(data, this.userRole).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryYellowList(this.reqYellow.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
          }).catch(() => {
            this.failMessage('操作失败')
          })
        })
    },
    // 查询组织人员信息
    queryYellowList (e) {
      if (typeof e === 'number') {
        this.reqYellow.pageNum = e
      } else {
        this.reqYellow.pageNum = 1
        this.yellowCurPage = 1
      }
      // this.reqYellow.status = this.formInline.status
      this.reqYellow.name = this.formInline.name
      this.reqYellow.visitedName = this.formInline.visitedName
      let reqData = filterObjNull(this.reqYellow)
      reqData = getFormData(reqData)
      this.yellowList = []
      listBlack(reqData, this.userRole).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.failMessage(result.message)
          this.yellowList = []
          if (this.reqYellow.pageNum === 1) {
            this.yellowTotal = 0
          }
          return false
        }
        if (result.value) {
          this.yellowList = res.data.value.list || []
          this.yellowTotal = res.data.value.total
        } else {
          this.yellowList = []
          this.yellowTotal = 0
        }
      }).catch((res) => { // 请求失败返回的数据
        this.yellowList = []
        if (this.reqYellow.pageNum === 1) {
          this.yellowTotal = 0
        }
        this.failMessage(res && res.data && res.data.message)
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
      console.log(data.value)
      data.value.userName = data.value.userName || ''
      let reqData = data.value
      if (this.type === 'add') {
        addBlack(reqData, this.userRole).then(res => {
          if (res.data.success) {
            this.show = data.status
            this.successMessage(res.data.message)
            this.queryYellowList()
          } else {
            this.failDialog(res.data.message)
          }
          this.btnDisabled = false
        }).catch((res) => {
          this.failDialog(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      } else {
        modifyBlack(reqData, this.userRole).then(res => {
          if (res.data.success) {
            this.show = data.status
            this.successMessage(res.data.message)
            this.queryYellowList(this.reqYellow.pageNum)
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
    setOrg (node) {
      this.formInline.orgId = node.id
      this.formInline.orgName = node.orgName
      this.popvisible = false
    },
    imgClick (detail, index) {
      this.$refs.showBigImg.showData({
        dataList: this.yellowList.map(i => ({ imgUrl: i.field1, userName: i.userName })),
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
      this.queryYellowList(val)
    }
  }
}
</script>
<style scoped>
.el-radio{margin-right:10px}
.el-dialog{max-height:80%}
.imgPopCls /deep/ .el-dialog__header{
    padding:0
}
.imgPopCls /deep/ .el-dialog__headerbtn{
    top:10px;
    right:10px;
}
.imgPopCls /deep/ .el-dialog__body {
  padding: 20px;
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
  }
  .pdlr-16{padding-left:16px;padding-right:16px}

</style>
