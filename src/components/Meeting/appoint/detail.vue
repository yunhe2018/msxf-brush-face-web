<template>
  <div>
    <div class='listTop'>
      <div class='listTopTit'>
        <div class='listTit'>查询条件
          <el-button size="small" class="queryBtn" style="margin-left: 16px" @click="goback">返回</el-button>
        </div>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline recordForm" @submit.native.prevent label-width="65px">
          <el-form-item label="姓名" class="label_197">
            <el-input class="width_197" size="small" clearable v-model.trim="form.userName"></el-input>
          </el-form-item>
          <el-form-item label="部门" class="label_197">
            <el-popover size="small" placement="bottom" width="190" trigger="click" v-model="popvisible">
              <div slot="reference" class="myInput">
                <el-input class="width_197" size="small" v-model="form.orgName" clearable placeholder="请选择部门"></el-input>
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
          <div class="btn">
              <el-button size="small" class="queryBtn" @click="getUserList(1)">查询</el-button>
              <el-button size="small" class="queryBtn" @click="exportExel" :loading="appointloading">导出</el-button>
            </div>
        </el-form>
      </div>
    </div>
    <div class="detailList">
      <h2>{{appointmentInfo.maName}}会议详情</h2>
      <div class="list">
        <p><label>会议名称:</label><span>{{appointmentInfo.maName}}</span></p>
        <p><label>会议主题:</label><span>{{appointmentInfo.maTopic}}</span></p>
        <p><label>会议地点:</label><span>{{appointmentInfo.mrAddress}}</span></p>
        <p><label>创建时间:</label><span>{{appointmentInfo.createTime}}</span></p>
        <p><label>开始时间:</label><span>{{appointmentInfo.startTime}}</span></p>
        <p><label>结束时间:</label><span>{{appointmentInfo.endTime}}</span></p>
        <p><label>参会人数:</label><span>{{appointmentInfo.maCounts}}</span></p>
        <p><label>实到人数:</label><span>{{appointmentInfo.realCounts}}</span></p>
        <p><label>未到人数:</label><span>{{appointmentInfo.notCounts}}</span></p>
      </div>
    </div>
     <div class="listBotTit">
      <div class="boxTitle">数据列表</div>
      <div class="pdlr-16">
        <el-table :data="userList">
          <el-table-column label="姓名" prop="userName"></el-table-column>
          <el-table-column label="性别" prop="sex"></el-table-column>
          <el-table-column label="头像" prop="userImg">
            <template slot-scope="scope">
              <div  v-if="scope.row.userImg" @click="libraryClick(scope.row.userImg, scope.$index)">
                <img :src="url + scope.row.userImg" height="40">
              </div>
              <img v-else :src="require('@/assets/images/people.png')" height="40">
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="orgName"></el-table-column>
          <el-table-column label="签到方式" prop="checkInMode"></el-table-column>
          <el-table-column label="签到状态" prop="checkInStatus"></el-table-column>
          <el-table-column label="签到记录">
            <template slot-scope="scope">
              <el-link type="primary" v-if="scope.row.checkInStatus === '已签到'" class="opreationBtn" @click="getRecord(scope.row)">查看</el-link>
              <el-link type="primary" v-if="scope.row.checkInStatus === '未签到'" class="opreationBtn" @click="pointerClick(scope.row)">手动签到</el-link>
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
          :page-size="pageSize"
        ></el-pagination>
      </div>
    </div>
    <signType ref="sign" />
    <!-- <el-dialog
      class="imgPopCls"
      :visible.sync="dialogVisible"
      @close="$emit('update:countShow', false)"
      width="30%"
    >
      <img :src="this.showImg" class="bigImg">
      <div>
      </div>
    </el-dialog> -->
    <imgSwipper ref="showBigImg" :type="meeting" />
  </div>
</template>

<script>
import { getOrgTree, detailsMeetingAppointment, detailsMeetingExport, signByHand } from '@/axios/api.js'
import { getFormData, filterObjNull } from '@/lib/util.js'
import signType from './components/signType'
import { mapState, mapMutations } from 'vuex'
import imgSwipper from '@/components/common/imgSwipper'
export default {
  components: {
    signType,
    imgSwipper
  },
  data () {
    return {
      total: 0,
      pageNum: 0,
      pageSize: 10,
      form: {
        maId: '',
        userName: '',
        orgName: '',
        orgId: ''
      },
      orgTree: [],
      props: {
        label: 'orgName',
        children: 'children'
      },
      popvisible: false,
      appointmentInfo: {},
      userList: [],
      showImg: '',
      dialogVisible: false,
      url: this.$globalConst.apiPrefix,
      meeting: 'meeting'
    }
  },
  computed: {
    ...mapState(['appointloading'])
  },
  methods: {
    ...mapMutations(['appointloadingShow', 'appointloadingHide']),
    libraryClick (amount, index) {
      // if (amount) {
      //   this.showImg = this.url + amount
      // }
      // this.dialogVisible = true
      this.$refs.showBigImg.showData({
        dataList: this.userList.map(i => ({ imgUrl: i.userImg, userName: i.userName })),
        imgInit: index,
        imgEnd: this.pageSize - 1
      })
    },
    setOrg (node) {
      this.$set(this.form, 'orgId', node.id)
      this.$set(this.form, 'orgName', node.orgName)
      this.popvisible = false
    },
    getUserList (pageNum) {
      this.pageNum = pageNum || 1
      const formData = getFormData(filterObjNull({
        orgId: this.form.orgName ? this.form.orgId : '',
        maId: this.form.maId,
        userName: this.form.userName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }))
      detailsMeetingAppointment(formData).then(res => {
        if (res.data.success && res.data.value) {
          this.appointmentInfo = res.data.value.appointmentInfo
          this.userList = res.data.value.userList.list
          this.total = res.data.value.userList.total
        } else {
          this.total = 0
          this.userList = []
        }
      }).catch((res) => {
        this.userList = []
        this.failMessage(res && res.data && res.data.message)
      })
    },
    handleCurrentChange (e) {
      this.getUserList(e)
    },
    exportExel () {
      // 二次确认
      this.$confirm('是否确认导出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.appointloadingShow()
        let exportData = {
          orgId: this.form.orgName ? this.form.orgId : '',
          maId: this.form.maId,
          userName: this.form.userName
        }
        detailsMeetingExport(getFormData(filterObjNull(exportData))).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '会议详情.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
          this.appointloadingHide()
          this.successMessage('导出成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
    },
    pointerClick (amount) {
      this.$confirm('请管理员确认参会人员是否已到现场', '详情', {
        closeOnClickModal: false
      }).then(() => {
        let data = {
          maId: this.appointmentInfo.id,
          userId: amount.userId
        }
        signByHand(getFormData(data)).then(res => {
          if (res.data.success) {
            this.successMessage(res.data.message)
            this.getUserList(this.pageNum)
          } else {
            this.failMessage(res.data.message)
          }
        })
      })
    },
    getRecord (row) {
      let data = {
        userId: row.userId,
        checkInModeCode: row.checkInModeCode,
        maId: this.form.maId
      }
      this.$refs.sign.showData(data)
    },
    goback () {
      this.$router.push({
        path: '/meeting/appointment',
        query: {cacheCondition: true}
      })
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
    getOrgTree().then(res => {
      if (res.data.success === true) {
        this.orgTree = res.data.value || []
      } else {
        this.failMessage(res.data.message)
      }
    }).catch(res => {
      this.failMessage(res && res.data && res.data.message)
    })
    this.form.maId = this.$route.query.maId
    this.getUserList()
  }
}
</script>

<style scoped>
.bigImg {
  width: 100%;
}
  .btn{
    display: inline-block;
    margin-bottom: 22px;
  }
  .detailList{
    padding: 20px 16px;
    font-size: 14px;
    border-bottom: 16px solid #EBF0F5;
  }
  .detailList h2{
    font-size: 14px;
    color: #303133;
    font-weight: bold;
    padding:0 0 10px 0;
  }
   .detailList .list{
     display: flex;
     flex-wrap: wrap;
   }
  .detailList .list p{
    width: 31%;
    line-height: 28px;
  }
  .detailList .list p label{
    color: #909399;
    padding-right: 16px;
  }
</style>
