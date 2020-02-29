<template>
  <div class="processMng">
        <div data-v-5295f104="" class="boxTitle">数据列表
          <el-button size="small" @click="addAccount" class="queryBtn">新增管理员</el-button>
        </div>
      <div class="pdlr-16">
        <el-table :data="tableData" class="processTable">
          <!-- <el-table-column type="index" label="序号" align="left"></el-table-column> -->
          <el-table-column prop="userName" label="登录账号" align="left">
            <template slot-scope="scope">
            <div style="display:none">{{ scope.row.id }}</div>
            <div>{{ scope.row.userName }}</div>
          </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名" align="left"> </el-table-column>
          <el-table-column prop="mobile" label="联系方式" align="left"> </el-table-column>
          <el-table-column prop="isAdmin" label="账号类型" align="left">
            <template slot-scope="scope">
              <span v-if='scope.row.isAdmin===0'>用户管理员</span>
              <span v-if='scope.row.isAdmin===1'>系统管理员</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="status" label="状态" align="left">
            <template slot-scope="scope">
              <span v-if='scope.row.status===0'>无效</span>
              <span v-if='scope.row.status===1'>有效</span>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" align="left" width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.isAdmin===0">
                <el-link type="primary" class="opreationBtn" @click="resetTable(scope.row,scope.$index)">重置密码</el-link>
                  <!-- <span class="splitLine">|</span> -->
                <el-link type="primary" class="opreationBtn" @click="modifiyTable(scope.row,scope.$index)">修改</el-link>
                <!-- <span class="splitLine">|</span> -->
                <el-link type="primary" class="opreationBtn" @click="deleteTable(scope.row,scope.$index)">删除</el-link>
              </template>
              <template v-if="scope.row.isAdmin===1">
                <el-link type="primary" class="opreationBtn" @click="modifiyDetail(scope.row,scope.$index)">修改</el-link>
              </template>
            </template>
        </el-table-column>
        </el-table>
    </div>
    <AddAccount :show.sync="show" :id="id" :type="type" @submit="submit" :detail="detail" :btnDisabled="btnDisabled"></AddAccount>
  </div>
</template>

<script>
import AddAccount from './AddAccount'
import { listSysUser, addSysUser, deleteUser, modifiyUser, resetPassword } from '../../axios/api.js'
import { getFormData } from '../../lib/util.js'
export default {
  name: 'Account',
  components: {
    AddAccount
  },
  data () {
    return {
      btnDisabled: false,
      askSearch: {
        processName: ''
      },
      tableData: [],
      amount: {},
      show: false,
      type: '',
      id: 0,
      detail: ''
    }
  },
  created () {
    this.queryList()
  },
  methods: {
    modifiyTable (value, index) {
      this.show = true
      this.type = 'modifiy'
      this.id = value.id
      this.detail = ''
    },
    modifiyDetail (value, index) {
      this.show = true
      this.type = 'modifiy'
      this.detail = 'detail'
      this.id = value.id
    },
    deleteTable (value, index) {
      this.$confirm(`确认删除${value.realName}管理员吗`, '删除', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: value.id
          }
          deleteUser(getFormData(data)).then(res => {
            if (res.data.success) {
              this.successMessage(res && res.data && res.data.message)
            } else {
              this.failMessage(res && res.data && res.data.message)
            }
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    addAccount () {
      this.show = true
      this.type = 'add'
      this.detail = ''
    },
    submit (e) {
      // console.log(e)
      this.btnDisabled = true
      const data = JSON.parse(JSON.stringify(e.value))
      let amounts = {
        userName: data.userName,
        password: data.password,
        realName: data.realName,
        isAdmin: data.isAdmin,
        mobile: data.mobile,
        // status: data.status,
        content: data.content
      }
      if (this.type === 'modifiy') {
        amounts.id = this.id
        modifiyUser(amounts).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res && res.data && res.data.message)
          } else {
            // this.failMessage(res && res.data && res.data.message)
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
        addSysUser(amounts).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res && res.data && res.data.message)
          } else {
            // this.failMessage(res && res.data && res.data.message)
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
    queryList () {
      let data = {
        pageNum: '1',
        pageSize: '10',
        keyword: sessionStorage.getItem('userName')
      }
      listSysUser(data).then(res => {
        if (res.data.success === true) {
          if (res.data.value) {
            this.tableData = res.data.value.list
          } else {
            this.tableData = []
          }
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
      this.queryList()
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    resetTable (value, index) {
      this.$confirm(`确定重置${value.userName}管理员的密码789@#467吗？`, '重置密码', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: value.id
          }
          resetPassword(getFormData(data)).then(res => {
            if (res.data.success) {
              this.successMessage(res && res.data && res.data.message)
            } else {
              this.failMessage(res && res.data && res.data.message)
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
  /* .processTable /deep/ .el-table__header-wrapper {
    height: 48px;
    line-height: 48px;
  } */
  .boxTitle {
    line-height: 36px;
  }
  .processTit {
    font-family: PingFangSC-Regular;
    font-size: 22px;
    color: #303133;
    line-height: 22px;
    margin-bottom: 24px;
  }
  .btnLfet {
    margin-left: 32px;
  }
  .processBtn {
    border: 1px solid #4C7EE9;
    color: #4C7EE9;
  }
  .tableBtn {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #4C7EE9;
    line-height: 14px;
    margin-right: 5px;
  }
  .processMng {
    background: #fff;
    border-radius: 4px;
  }
</style>
