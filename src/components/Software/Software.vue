<template>
  <div class="softWare">
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <el-form :inline="true" :model="ruleForm" class="demo-form-inline" @submit.native.prevent>
         <el-form-item label="APP名称" prop="appName">
            <el-select size="small" v-model="ruleForm.appName" clearable class="label_197">
            <el-option v-for="(item, index) in this.appNameList" :key="index" :value="item.dictCode" :label="item.dictName"></el-option>
            </el-select>
        </el-form-item>
        <el-button size="small" class="queryBtn" @click="querySoftware">查询</el-button>
        <el-button size="small" class="queryBtn" @click="addSoftware">新增APP</el-button>
      </el-form>
    </div>
    <div class="listBotTit">
      <div data-v-5295f104="" class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <!-- <el-table-column type="index" label="序号" align="left"></el-table-column> -->
        <el-table-column prop="name" label="APP名称" align="left">
          <template slot-scope="scope">
            <div style="display:none">{{ scope.row.id }}</div>
            <div>{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号" align="left"></el-table-column>
        <el-table-column prop="createTimeStr" label="上传日期" align="left"></el-table-column>
        <el-table-column prop="content" label="更新内容" align="left">
          <template slot-scope="scope" >
            <el-tooltip effect="light" :content="scope.row.content" placement="top-start" popper-class="toolColor">
              <div v-if="scope.row.content">
                <div v-if="scope.row.content.length > 10">{{ scope.row.content.substring(0, 10) + "..." }}</div>
                <div v-else>{{ scope.row.content }}</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="counts" label="客户端更新数量" align="left">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" @click="countEdit(scope.row,scope.$index)">{{ scope.row.counts }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="left">
          <template slot-scope="scope">
            <el-link type="primary" class="opreationBtn" v-if="scope.row.atType === 1 && scope.row.greetingStatus === 1" @click="screenTable(scope.row)">屏幕配置</el-link>
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
    <CountDialog :countShow.sync="countShow" :countId="id"></CountDialog>
    <SoftwareDialog :show.sync="show" :id="id" :appNameList="appNameList" :type="type" @submit="submit" :btnDisabled="btnDisabled"></SoftwareDialog>
  </div>
</template>

<script>
import SoftwareDialog from './SoftwareDialog'
import CountDialog from './CountDialog'
import { getSysDictByParentCode, listSysSoftware, addSoftware, deleteSoftware, updateSoftware } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
export default {
  name: 'Software',
  components: {
    SoftwareDialog,
    CountDialog
  },
  data () {
    return {
      ruleForm: {},
      appNameList: [],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 0,
      total: 0,
      show: false,
      type: '',
      btnDisabled: false,
      countShow: false,
      id: 0
    }
  },
  created () {
    this.getSysDictByParentCode()
    this.querySoftware()
  },
  methods: {
    getSysDictByParentCode () {
      let data = {
        parentCode: 'appName'
      }
      getSysDictByParentCode(getFormData(data)).then(res => {
        if (res.data.success) {
          this.appNameList = res.data.value
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    countEdit (amount) {
      this.countShow = true
      this.id = amount.id
    },
    modifiyTable (amount) {
      this.show = true
      this.type = 'modifiy'
      this.id = amount.id
    },
    deleteTable (amount) {
      this.$confirm(`确认删除${amount.name}设备吗？`, '删除', {
        closeOnClickModal: false
      }).then(() => {
        let data = {
          id: amount.id
        }
        deleteSoftware(getFormData(data)).then(res => {
          if (res.data.success) {
            this.successMessage(res.data.message)
            this.querySoftware(this.pageNum)
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
              this.failMessage(res.data.message)
            }
          }
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
      })
    },
    querySoftware (num) {
      let data = {
        pageSize: this.pageSize,
        appName: this.ruleForm.appName
      }
      if (typeof num === 'number') {
        data.pageNum = num
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listSysSoftware(getFormData(data)).then(res => {
        if (res.data.success === true) {
          if (res.data.value) {
            this.tableData = res.data.value.list
            // 总页数
            this.currentPage = res.data.value.pages
            // 总条数
            this.total = res.data.value.total
          } else {
            this.tableData = []
            this.total = 0
          }
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    addSoftware () {
      this.show = true
      this.type = 'add'
    },
    submit (amount) {
      this.btnDisabled = true
      let data = {
        code: amount.value.code,
        version: amount.value.version,
        upgradeStatus: amount.value.upgradeStatus,
        content: amount.value.content,
        uploadAddress: amount.value.field1
      }
      if (this.type === 'add') {
        addSoftware(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.querySoftware()
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
        updateSoftware(data).then(res => {
          if (res.data.success) {
            this.show = amount.status
            this.successMessage(res.data.message)
            this.querySoftware(this.pageNum)
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
    handleCurrentChange (e) {
      this.querySoftware(e)
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
      // this.querySoftware()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .toolColor{
    max-width: 300px !important;
    min-width: 100px !important;
  }
</style>
