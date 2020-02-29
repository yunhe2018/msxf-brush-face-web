<template>
    <div>
        <div class='listTop'>
            <div class='listTopTit'>
                <div class='listTit'>查询条件</div>
            </div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="迎宾名称"  class="label_197">
              <el-input class='width_197' size="small" v-model.trim="formInline.keyword" clearable @keyup.enter.native="getListGreet"></el-input>
            </el-form-item>
            <el-form-item label="安装位置" class="label_197">
              <el-input class='width_197' size="small" v-model.trim="formInline.greetingPosition" clearable @keyup.enter.native="getListGreet"></el-input>
            </el-form-item>
            <!-- <el-form-item label="状态">
              <el-select class='width_197' size="small" v-model="formInline.status" placeholder="请选择" clearable>
                <el-option label="有效" value="1"></el-option>
                <el-option label="无效" value="0"></el-option>
              </el-select>
            </el-form-item> -->
            <el-button size="small" @click="getListGreet">查询</el-button>
            <el-button size="small" @click="addGreetEvent">新增迎宾</el-button>
          </el-form>
        </div>
        <div class="listBotTit">
          <div data-v-5295f104="" class="boxTitle">数据列表</div>
          <div class="pdlr-16">
            <el-table :data="meetList" style="width: 100%">
              <!-- <el-table-column label="序号" type="index"></el-table-column> -->
              <el-table-column label="迎宾名称" prop="greetingName">
                <template slot-scope="scope">
                  <div style="display:none">{{ scope.row.id }}</div>
                  <div>{{ scope.row.greetingName }}</div>
              </template>
              </el-table-column>
              <el-table-column label="安装位置" prop="greetingPosition"></el-table-column>
              <el-table-column label="应用盒子" prop="boxIp"></el-table-column>
              <el-table-column label="识别主机" prop="hostIp"></el-table-column>
              <el-table-column label="摄像头" prop="videoIp"></el-table-column>
              <el-table-column label="底库名称">
                <template slot-scope="scope">
                  <el-link type="primary" class="opreationBtn" @click="showLibrary(scope.row,scope.$index)">{{scope.row.libraryName}}</el-link>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="status" label="状态" width="50">
                <template slot-scope="scope">
                  <span v-if='scope.row.status===0'>无效</span>
                  <span v-if='scope.row.status===1'>有效</span>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                  <el-link type="primary" class="opreationBtn mgr-10" @click="screenConfigEvent(scope.row)">屏幕配置</el-link>
                  <el-link type="primary" class="opreationBtn" @click="modifyGreetEvent(scope.row,scope.$index)">修改</el-link>
                  <el-link type="primary" class="opreationBtn" @click="deleteGreetEvent(scope.row,scope.$index)">删除</el-link>
                </template>
              </el-table-column>
          </el-table>
          <el-pagination
              v-if="meetTotal"
              class="pageView"
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next, jumper"
              :current-page.sync="reqListGreet.pageNum"
              :total="meetTotal"
              :page-size="pageSize">
            </el-pagination>
          </div>
        </div>
        <GreetDialog :show.sync="show" :type="type" :greetId="greetId" :formSelect="formSelect" :imgPrefix="url" @submit="handleSubmit" :btnDisabled="btnDisabled"></GreetDialog>
        <!-- 查看底库 -->
        <CountDetail :countShow.sync="countShow" :countAmount="countAmount" :status="status" :manage="greet"></CountDetail>
        <!-- 屏幕配置 -->
        <ModifyComponay :showModifiy.sync="showModifiy" :modifiyType="modifiyType" :business="business" @renderScreen="renderScreen"></ModifyComponay>
</div>
</template>

<script>
import GreetDialog from './GreetDialog'
import CountDetail from '../Storage/CountDetail'
import ModifyComponay from '../common/ModifyComponay'
import { listGreetingBusiness, addGreetingBusiness, deleteGreetingBusiness, updateGreetingBusiness } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'

export default {
  name: 'Greeting',
  components: {
    GreetDialog,
    CountDetail,
    ModifyComponay
  },
  data () {
    return {
      btnDisabled: false,
      pageSize: 10,
      formInline: {
        keyword: '',
        greetingPosition: '',
        status: ''
      },
      formVal: {},
      formSelect: {},
      show: false,
      type: 'add',
      countShow: false,
      countAmount: {},
      status: '',
      showModifiy: false,
      modifiyType: '',
      business: {},
      meetList: [],
      meetTotal: 0,
      meetCurPage: 1,
      url: this.$globalConst.apiPrefix,
      greet: 'greet',
      reqListGreet: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        greetingPosition: '',
        status: ''
      },
      greetId: null
    }
  },
  created () {
    this.getListGreet()
  },
  methods: {
    addGreetEvent () {
      this.show = true
      this.type = 'add'
    },
    modifyGreetEvent (data) {
      this.show = true
      this.type = 'modify'
      this.greetId = data.id
      // this.formVal = JSON.parse(JSON.stringify(data))
    },
    deleteGreetEvent (e) {
      this.$confirm(`确认删除${e.greetingName}迎宾吗`, '删除迎宾', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = getFormData({
            id: e.id
          })
          deleteGreetingBusiness(data).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.getListGreet(this.reqListGreet.pageNum)
            } else {
              this.failMessage(res.data.message)
            }
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    // editGreetEvent () {
    //   this.show = true
    //   this.type = 'modify'
    // },
    getListGreet (e) {
      if (typeof e === 'number') {
        this.reqListGreet.pageNum = e
      } else {
        this.reqListGreet.pageNum = 1
        this.reqListGreet = Object.assign({}, this.reqListGreet, this.formInline)
      }
      let reqData = getFormData(filterObjNull(this.reqListGreet))
      this.meetList = []
      listGreetingBusiness(reqData).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.meetList = []
          if (this.reqListGreet.pageNum === 1) {
            this.meetTotal = 0
          }
          this.failMessage(result.message)
          return
        }
        if (result.value) {
          this.meetList = result.value.list || []
          this.meetTotal = result.value.total
        } else {
          this.meetList = []
          this.meetTotal = 0
        }
      }).catch((res) => {
        this.meetList = []
        if (this.reqListGreet.pageNum === 1) {
          this.meetTotal = 0
        }
        this.failMessage(res && res.data && res.data.message)
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
      // this.getListGreet()
    },
    handleSubmit (data) {
      this.btnDisabled = true
      let reqData = data.value
      if (this.type === 'add') {
        addGreetingBusiness(reqData, this.userRole).then(res => {
          if (res.data.success) {
            this.show = data.status
            this.successMessage(res.data.message)
            this.getListGreet()
          } else {
            this.failDialog(res.data.message)
          }
          this.btnDisabled = false
        }).catch((res) => {
          this.failDialog(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      } else {
        updateGreetingBusiness(reqData, this.userRole).then(res => {
          if (res.data.success) {
            this.show = data.status
            this.successMessage(res.data.message)
            this.getListGreet(this.reqListGreet.pageNum)
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
    showLibrary (amount) {
      this.countAmount = amount
      this.status = 'access'
      this.countShow = true
    },

    screenConfigEvent (amount) {
      this.showModifiy = true
      this.modifiyType = 'manageModifiy'
      this.business = {
        businessId: amount.id,
        businessType: 1
      }
    },
    renderScreen (e) {
      this.showModifiy = e
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.getListGreet(val)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-radio{margin-right:10px}
.splitLine{padding:0 5px;}
.btn{margin-bottom: 20px;}
.listBotTit {
  padding-bottom: 9px;
  background: #fff;
}
.pdlr-16{padding-left:16px;padding-right:16px}

</style>
