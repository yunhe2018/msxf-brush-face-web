<template>
  <div class="processMng">
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="规则名称" class="label_197">
          <el-input class='width_197' size="small" v-model.trim="formInline.ruleName" clearable @keyup.enter.native="querylistRule"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select class='width_197' size="small" v-model="formInline.status" clearable>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <el-button size="small" class="queryBtn" @click="querylistRule">查询</el-button>
        <el-button size="small" class="queryBtn" @click="addRule">新增规则</el-button>
      </el-form>
    </div>
    <div class="listBotTit">
      <div data-v-5295f104="" class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <!-- <el-table-column type="index" label="序号" align="left"></el-table-column> -->
        <el-table-column prop="ruleName" label="规则名称" align="left">
          <template slot-scope="scope">
            <div style="display:none">{{ scope.row.id }}</div>
            <div>{{ scope.row.ruleName }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="状态" align="left">
          <template slot-scope="scope">
            <span v-if='scope.row.status===0'>无效</span>
            <span v-if='scope.row.status===1'>有效</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
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
      <RuleDialog :show.sync="show" :type="type" :id="id" @submit="submit" :btnDisabled="btnDisabled"></RuleDialog>
  </div>
</template>

<script>
import { listRule, deleteRule, addRule, updateRule } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
import RuleDialog from './RuleDialog'
export default {
  name: 'Rule',
  components: {
    RuleDialog
  },
  data () {
    return {
      btnDisabled: false,
      formInline: {},
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      show: false,
      type: '',
      id: 0
    }
  },
  created () {
    this.querylistRule(this.pageNum)
  },
  methods: {
    querylistRule (num) {
      let data = {
        pageSize: this.pageSize,
        keyword: this.formInline.ruleName || ''
        // status: this.formInline.status || ''
      }
      if (typeof num === 'number') {
        data.pageNum = num
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listRule(getFormData(data)).then(res => {
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
    handleCurrentChange (e) {
      this.querylistRule(e)
    },
    addRule () {
      this.show = true
      this.type = 'add'
    },
    submit (e) {
      this.btnDisabled = true
      let startTime =
            e.value.time[0] instanceof Date ? e.value.time[0].getHours() + ':' + e.value.time[0].getMinutes() + ':' + e.value.time[0].getSeconds() : e.value.time[0]
      let endTime =
            e.value.time[1] instanceof Date ? e.value.time[1].getHours() + ':' + e.value.time[1].getMinutes() + ':' + e.value.time[1].getSeconds() : e.value.time[1]
      // let startTime =
      // e.value.time[0] instanceof Date ? e.value.time[0].getHours() + ':' + e.value.time[0].getMinutes() + ':' + e.value.time[0].getSeconds() : (e.value.time[0] instanceof Date ? e.value.time[0] : '00:00:00')
      // let endTime =
      // e.value.time[1] instanceof Date ? e.value.time[1].getHours() + ':' + e.value.time[1].getMinutes() + ':' + e.value.time[1].getSeconds() : (e.value.time[1] instanceof Date ? e.value.time[1] : '23:59:59')
      let openTime = ''
      e.isAdd.map(item => {
        openTime += item + ','
      })
      let appointTime = ''
      let appointStatus = 0
      if (e.chooseArr.length > 0) {
        appointStatus = 1
        e.chooseArr.map(item => {
          appointTime += item + ','
        })
      }
      let data = {
        ruleName: e.value.ruleName,
        openTime: openTime,
        // status: e.value.status,
        startTime: startTime,
        endTime: endTime,
        dayStatus: e.value.dayTime ? 1 : 0,
        appointTime: appointTime,
        appointStatus: appointStatus
      }
      if (this.type === 'add') {
        addRule(data).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res.data.message)
            this.querylistRule()
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
        updateRule(data).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res.data.message)
            this.querylistRule(this.pageNum)
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
    deleteTable (amount) {
      this.$confirm(`确认删除${amount.ruleName}吗`, '删除', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: amount.id
          }
          deleteRule(getFormData(data)).then(res => {
            // console.log(res)
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.querylistRule(this.pageNum)
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
    },
    modifiyTable (amount) {
      this.type = 'modifiy'
      this.show = true
      this.id = amount.id
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
      // this.querylistRule()
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btn{margin-bottom: 20px;}
</style>
