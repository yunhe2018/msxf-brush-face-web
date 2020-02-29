<template>
  <div class="dialogDiv">
    <el-dialog title="参会人员" :visible.sync="visible" :close-on-click-modal="false" >
          <div class="condition">
            <p class="left">人员数量： {{total}}人</p>
            <p class="right">
              <el-input v-model="form.userName" placeholder="请输入姓名" style="width: 200px;"></el-input>
              <el-button size="small" class="queryBtn" @click="getList(1)">查询</el-button>
            </p>
          </div>
      <div class="dialogAndScrollbar divBox">
        <el-scrollbar style="height:100%;">
          <div class="tableWrap">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column label="照片" width="180">
                <template slot-scope="scope">
                  <img :src="url+scope.row.userImg" height="40" @click="imgClick(scope.row.userImg)"/>
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="姓名" width="180"></el-table-column>
              <el-table-column prop="orgName" label="归属部门" width="180"></el-table-column>
              <el-table-column prop="userTypeStr" label="人员类型"></el-table-column>
            </el-table>
          </div>
          <el-pagination
              v-if="total"
              class="pageView"
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next, jumper"
              :current-page.sync="pageNum"
              :total="total"
              :page-size="pageSize">
          </el-pagination>
        </el-scrollbar>
      </div>
    </el-dialog>
    <!--查看照片-->
    <el-dialog :visible.sync="imgPopShow" class="imgPopCls" width="30%">
        <img :src="bigImg" class="bigImg"/>
    </el-dialog>
  </div>
</template>

<script>
import { libraryUserList } from '@/axios/api.js'
import { getFormData, filterObjNull } from '@/lib/util.js'
export default {
  data () {
    return {
      visible: false,
      peopleNum: '',
      tableData: [],
      total: 0,
      pageNum: 0,
      pageSize: 10,
      form: {
        id: '',
        userName: ''
      },
      bigImg: '',
      imgPopShow: false,
      url: this.$globalConst.apiPrefix
    }
  },
  methods: {
    showData (data) {
      this.form = {} // 清空
      this.form.id = data.id
      this.getList()
      this.visible = true
    },
    getList (pageNum) {
      this.pageNum = pageNum || 1
      let formData = getFormData(filterObjNull({
        ...this.form,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }))
      libraryUserList(formData).then(res => {
        if (res.data.success && res.data.value) {
          this.total = res.data.value.total
          this.tableData = res.data.value.list
        } else {
          this.total = 0
          this.tableData = []
        }
      }).catch((res) => {
        this.tableData = []
        this.failMessage(res && res.data && res.data.message)
      })
    },
    handleCurrentChange (val) {
      this.getList(val)
    },
    imgClick (img) {
      this.bigImg = this.url + img
      this.imgPopShow = true
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

<style scoped>
.divBox{
  height:420px;
  padding: 0 20px 0 0;
}
.condition{
  display: flex;
  justify-content:space-between;
  padding: 0 20px 5px 0;
}
.condition .left{
  height: 32px;
  line-height: 32px;
}
.tableWrap{
  margin-top: 20px;
}
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
</style>
