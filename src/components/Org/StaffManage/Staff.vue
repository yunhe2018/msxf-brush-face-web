<template>
    <div>
        <div class='listTop'>
          <div class='listTopTit'>
              <div class='listTit'>查询条件</div>
          </div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="姓名" class="label_197">
                <el-input @keyup.enter.native="queryStaffList" :class='["width_240",{"width_197": searchFields.length > 0}]' size="small" v-model.trim="formInline.name" clearable></el-input>
            </el-form-item>
            <el-form-item :label="field.lable" :key="field.name" v-for="field in searchFields" class="label_197">
                <el-popover
                 size="small"
                  placement="bottom"
                  width="190"
                  trigger="click"
                  v-model="popvisible" v-if="field.lableType==='orgTree'">
                   <div slot="reference" class="myInput">
                    <el-input
                        class='width_197'
                        size="small"
                        v-model="formInline.orgName"
                        clearable
                        placeholder="请选择部门"></el-input>
                  </div>
                  <div style="height:330px;" class="dialogAndScrollbar">
                    <el-scrollbar style="height:100%;">
                      <el-tree
                          class='width_197'
                          ref="tree"
                          style="min-height:200px;width:350px;overflow:auto;"
                          :data="orgTreeData"
                          node-key="id"
                          highlight-current
                          :expand-on-click-node="false"
                          :default-expanded-keys="[1]"
                          :props="props"
                          @node-click="setOrg">
                      </el-tree>
                    </el-scrollbar>
                  </div>
              </el-popover>
            </el-form-item>
            <el-button size="small" @click="queryStaffList">查询</el-button>
            <el-button size="small" @click="addStaffEvent">新增员工</el-button>
            <el-button size="small" @click="uploadFile">导入</el-button>
            <el-button size="small" @click="downloadFile" :loading="staffDownloading">导出</el-button>
          </el-form>
        </div>
        <div class="listBotTit">
          <div data-v-5295f104="" class="boxTitle">数据列表</div>
          <div class="pdlr-16">
            <el-table :data="staffList" style="width: 100%;" @selection-change="handleSelectionChange" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="姓名" prop="userName">
                  <template slot-scope="scope">
                    <div style="display:none">{{ scope.row.id }}</div>
                    <div>{{ scope.row.userName }}</div>
                </template>
                </el-table-column>
                <el-table-column label="性别"  prop="sex">
                  <template slot-scope="scope">
                    <span v-if='scope.row.sex===0'>男</span>
                    <span v-if='scope.row.sex===1'>女</span>
                  </template>
                </el-table-column>
                <el-table-column :label="field.lable" :key="field.name" :prop="field.name==='orgId'?'orgName':field.name" v-for="field in staffListFields"></el-table-column>
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
                    <el-link type="primary" class="opreationBtn" @click="modifyStaffEvent(scope.row,scope.$index)">修改</el-link>
                    <el-link type="primary" class="opreationBtn" @click="deleteStaffEvent(scope.row,scope.$index)">删除</el-link>
                  </template>
                </el-table-column>
            </el-table>
            <div class="btnAll" v-if="staffTotal">
              <el-checkbox class='staffCheckbox' v-model="allChecked" @change="toggleSelection(staffList)">全选</el-checkbox>
              <div size="small" class='batchDelete' @click="batchDelete">批量删除</div>
            </div>
            <el-pagination
                v-if="staffTotal"
                class="pageView"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 50, 100, 500]"
                :current-page.sync="reqStaff.pageNum"
                :total="staffTotal"
                :page-size="pageSize">
            </el-pagination>
          </div>
        </div>
        <StaffDialog :show.sync="show" :type="type" :staffFields="staffFields" :orgTreeData="orgTreeData" :formVal="formVal" :imgPrefix="url" @submit="handleSubmit" :btnDisabled="btnDisabled"></StaffDialog>

      <uploadFileDialog ref="up" @updateList="updateList" />
      <imgSwipper ref="showBigImg" />
    </div>
</template>

<script>
import StaffDialog from './StaffDialog'
import uploadFileDialog from './components/uploadFileDialog'
import { listStaff, addStaff, deleteStaff, modifyStaff, getDynamicSearchField, getDynamicForm, getDynamicFormWithValue, getOrgTree, excelExport, deleteStaffBatch } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
import { mapState, mapMutations } from 'vuex'
import imgSwipper from '@/components/common/imgSwipper'
export default {
  name: 'StaffManage',
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
      formInline: {
        name: '',
        // status: '',
        orgName: '',
        orgId: null
      },
      formVal: {},
      show: false,
      type: 'add',
      popvisible: false,
      userRole: '',
      searchFields: [],
      staffFields: [],
      delFields: ['age', 'email', 'identifyNo', 'job', 'staffNo'],
      staffList: [], // 人员列表
      orgTreeData: [], // 组织树
      url: this.$globalConst.apiPrefix,
      staffTotal: 0,
      staffCurPage: 1,
      bigImg: '',
      reqStaff: {
        pageNum: 1,
        pageSize: 10
      },
      btnDisabled: false,
      multipleSelection: [],
      allChecked: false
    }
  },
  created () {
    this.initData()
    this.getSearchField()
    this.getOrgTreeData()
    this.getDynamicFormEvent()
    this.queryStaffList()
  },
  computed: {
    ...mapState(['staffDownloading']),
    staffListFields () {
      let listTmp = JSON.parse(JSON.stringify(this.staffFields))
      listTmp = listTmp.filter((item, index) => {
        return this.delFields.indexOf(item.name) === -1
      })
      return listTmp
    }
  },
  watch: {
    '$route' (to, from) { // 监听路由是否变化
      if (this.$route.params.userRole) { // 判断userRole是否有值
        this.userRole = this.$route.params.userRole
        this.getSearchField() // 动态获取查询字段
        this.getOrgTreeData() // 获取组织树
        this.getDynamicFormEvent() // 获取增改表单项
        this.queryStaffList() // 查询组织人员信息
      }
    }
  },
  methods: {
    ...mapMutations(['staffDownloadingShow', 'staffDownloadingHide']),
    handleSizeChange (val) {
      this.reqStaff.pageSize = val
      this.queryStaffList()
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
      if (this.multipleSelection.length === this.staffList.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
    },
    // 初始化组件数据
    initData () {
      // console.log(this.$route)
      this.userRole = this.$route.params.userRole
      this.formInline = {
        name: '',
        // status: '',
        orgName: '',
        orgId: null
      }
      this.formInline = Object.assign({}, this.formInline)
    },
    // 动态获取查询字段
    getSearchField () {
      getDynamicSearchField(this.userRole).then(res => { // 请求成功返回的数据
        let result = res.data || {}
        if (!result.success) {
          this.searchFields = []
          this.failMessage(result.message)
          return false
        }
        this.searchFields = res.data.value || []
      }).catch((res) => { // 请求失败返回的数据
        this.searchFields = []
        this.failMessage(res && res.data && res.data.message)
      })
    },
    addStaffEvent () {
      this.show = true
      this.type = 'add'
      this.formVal = {
        // status: 1, // 默认选中有效状态
        sex: ''
      }// 初始化form表单数据
      this.getDynamicFormEvent()
    },
    // 获取增改表单项
    getDynamicFormEvent () {
      getDynamicForm(this.userRole).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.staffFields = []
          this.failMessage(result.message)
          return false
        }
        this.staffFields = res.data.value || []
      }).catch((res) => { // 请求失败返回的数据
        this.staffFields = []
        this.failMessage(res && res.data && res.data.message)
      })
    },
    // 获取指定员工增改表单项、包含值
    modifyStaffEvent (e) {
      this.show = true
      this.type = 'modify'
      // 获取指定员工增改表单项
      let data = getFormData({
        id: e.id
      })
      getDynamicFormWithValue(data, this.userRole).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.staffFields = []
          this.formVal = {}
          this.failMessage(result.message)
          return false
        }
        if (result.value) {
          this.staffFields = result.value.dynamicFileds
          this.formVal = result.value
        } else {
          this.staffFields = []
          this.formVal = {}
        }
      }).catch((res) => { // 请求失败返回的数据
        this.staffFields = []
        this.formVal = {}
        this.failMessage(res && res.data && res.data.message)
      })
    },
    // 删掉员工
    deleteStaffEvent (e) {
      this.$confirm(`确认删除${e.userName}人员数据吗？`, '删除人员', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = getFormData({
            id: e.id
          })
          deleteStaff(data, this.userRole).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryStaffList(this.reqStaff.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
          }).catch((res) => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    // 批量删除
    batchDelete () {
      this.$confirm('确定要批量删除吗？', '批量删除人员', {
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
          deleteStaffBatch(data, this.userRole).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryStaffList(this.reqStaff.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
          }).catch((res) => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    // 查询组织人员信息
    queryStaffList (e) {
      if (typeof e === 'number') {
        this.reqStaff.pageNum = e
      } else {
        this.reqStaff.pageNum = 1
        this.staffCurPage = 1
      }
      let reqData = {
        pageNum: this.reqStaff.pageNum,
        pageSize: this.reqStaff.pageSize
        // status: this.formInline.status
      }
      if (this.formInline.name) {
        reqData.name = this.formInline.name
      }
      if (this.formInline.orgName) { // 如果清空组织名input，则不取orgId
        reqData.orgId = this.formInline.orgId
      }
      reqData = filterObjNull(reqData)
      reqData = getFormData(reqData)
      this.staffList = []
      listStaff(reqData, this.userRole).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.failMessage(result.message)
          this.staffList = []
          if (this.reqStaff.pageNum === 1) {
            this.staffTotal = 0
          }
          return false
        }
        if (result.value) {
          this.staffList = result.value.list || []
          this.staffTotal = result.value.total
        } else {
          this.staffList = []
          this.staffTotal = 0
        }
      }).catch((res) => { // 请求失败返回的数据
        this.staffList = []
        if (this.reqStaff.pageNum === 1) {
          this.staffTotal = 0
        }
        this.failMessage(res && res.data && res.data.message)
      })
    },
    updateList () {
      this.queryStaffList()
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
        addStaff(reqData, this.userRole).then(res => {
          if (res.data.success) {
            this.show = data.status
            this.successMessage(res.data.message)
            this.queryStaffList()
          } else {
            this.failDialog(res.data.message)
          }
          this.btnDisabled = false
        }).catch((res) => {
          this.failDialog(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      } else {
        modifyStaff(reqData, this.userRole).then(res => {
          if (res.data.success) {
            this.show = data.status
            this.successMessage(res.data.message)
            this.queryStaffList(this.reqStaff.pageNum)
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
      // this.queryStaffList()
    },
    setOrg (node) {
      this.formInline.orgId = node.id
      this.formInline.orgName = node.orgName
      this.popvisible = false
    },
    // orgClearEvent (e) {
    //   this.formInline.orgId = ''
    //   this.formInline.orgName = ''
    //   this.showOrgClose = false
    // },
    imgClick (detail, index) {
      this.$refs.showBigImg.showData({
        dataList: this.staffList.map(i => ({ imgUrl: i.field1, userName: i.userName })),
        imgInit: index,
        imgEnd: this.pageSize - 1
      })
    },
    recordTo (amount) {
      this.$router.push({
        path: '/record',
        query: {
          userName: amount.userName,
          orgId: amount.orgId,
          orgName: amount.orgName,
          userType: amount.userType
        }
      })
      sessionStorage.setItem('menuName', '记录管理')
      // sessionStorage.setItem('menuOrder', 5)
      this.reload()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.queryStaffList(val)
    },
    uploadFile () {
      this.$refs.up.showData({
        personType: 'staff'
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
        this.staffDownloadingShow()
        let exportData = {
          name: this.formInline.name,
          orgId: this.formInline.orgName ? this.formInline.orgId : '',
          type: 1,
          code: sessionStorage.getItem('templateId'),
          userType: this.userRole
        }
        exportData = filterObjNull(exportData)
        excelExport(exportData).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '员工数据.rar'
          a.click()
          window.URL.revokeObjectURL(url)
          this.staffDownloadingHide()
          this.successMessage('导出成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
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

.myInput .el-icon-circle-close{
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
}
  .listBotTit {
    padding-bottom: 9px;
    background: #fff;
    position: relative;
  }
</style>
