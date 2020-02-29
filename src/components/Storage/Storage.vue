<template>
  <div>
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="底库名称" class="label_197">
          <el-input @keyup.enter.native="queryLibrary" clearable class='label_240' size="small" v-model.trim="formInline.keyword"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select class='width_197' size="small" v-model="formInline.status" clearable>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <el-button size="small" @click="queryLibrary" class="queryBtn">查询</el-button>
        <el-button size="small" @click="addLibrary" class="btn queryBtn">新增底库</el-button>
      </el-form>
    </div>
     <div class="listBotTit">

      <div data-v-5295f104="" class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <el-table-column prop="libraryName" label="底库名称" align="left">
            <template slot-scope="scope">
              <div style="display:none">{{ scope.row.id }}</div>
              <div>{{ scope.row.libraryName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" align="left"> </el-table-column>
        <el-table-column prop="userCount" label="人员数量" align="left">
          <template slot-scope="scope">
            <div class="opreationBtn"  @click="clickCount(scope.row)">{{scope.row.userCount}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="状态" align="center" width="50">
          <template slot-scope="scope">
            <span v-if='scope.row.status===0'>无效</span>
            <span v-if='scope.row.status===1'>有效</span>
          </template>
        </el-table-column> -->
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
    <AddStorage :show.sync="show" :type="type" :id="id" @submit="submit" :btnDisabled="btnDisabled"></AddStorage>
    <CountDetail :countShow.sync="countShow" :countAmount="countAmount" :storage="storage" :manage="library"></CountDetail>
  </div>
</template>

<script>
import AddStorage from './AddStorage'
import CountDetail from './CountDetail'
import { listLibrary, deleteLibrary, addLibrary, updateLibrary } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
export default {
  name: 'Storage',
  data () {
    return {
      btnDisabled: false,
      formInline: {},
      pageNum: 1,
      pageSize: 10,
      currentPage: 0,
      total: 0,
      tableData: [],
      show: false,
      type: '',
      storage: 'storage',
      countShow: false,
      countAmount: {},
      id: 0,
      library: 'library'
    }
  },
  components: {
    AddStorage,
    CountDetail
  },
  created () {
    this.queryLibrary(this.pageNum)
  },
  methods: {
    queryLibrary (num) {
      // console.log('查询')
      let data = {
        pageSize: this.pageSize,
        keyword: this.formInline.keyword
        // status: this.formInline.status
      }
      if (typeof num === 'number') {
        data.pageNum = num
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listLibrary(getFormData(data)).then(res => {
        if (res.data.success === true) {
          if (!res.data.value) {
            this.tableData = []
            this.total = 0
          } else {
            this.tableData = res.data.value.list
            this.total = res.data.value.total
          }
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    addLibrary () {
      this.show = true
      this.type = 'add'
    },
    modifiyTable (e) {
      this.id = e.id
      this.show = true
      this.type = 'modifiy'
    },
    handleCurrentChange (e) {
      this.queryLibrary(e)
    },
    submit (e) {
      // console.log(e)
      this.btnDisabled = true
      let data = {
        userIds: e.userIds,
        libraryIds: e.libraryIds,
        orgIds: e.orgIds,
        libraryName: e.value.libraryName,
        content: e.value.content
        // status: e.value.status
      }
      if (this.type === 'add') {
        addLibrary(data).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res.data.message)
            this.queryLibrary()
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
        data.id = this.id
        updateLibrary(data).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res.data.message)
            this.queryLibrary(this.pageNum)
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
    deleteTable (e) {
      this.$confirm(`确认删除${e.libraryName}吗`, '删除', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: e.id
          }
          deleteLibrary(getFormData(data)).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryLibrary(this.pageNum)
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
    clickCount (e) {
      this.countShow = true
      this.countAmount = e
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btn{
    margin-bottom: 20px;
  }
</style>
