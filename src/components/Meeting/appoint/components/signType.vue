<template>
  <div class="dialogDiv">
    <el-dialog title="签到记录" :visible.sync="visible" :close-on-click-modal="false">
      <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="createTimeStr" label="时间" width="150"></el-table-column>
        <el-table-column label="打卡照片" v-if="checkInModeCode !== 'checkInMode:2'">
          <template slot-scope="scope">
            <img :src="scope.row.captureImg ? url+scope.row.captureImg : require('@/assets/images/people.png')" height="40" @click="imgClick(scope.row.captureImg)"/>
          </template>
        </el-table-column>
        <el-table-column prop="degree" label="比对分数"></el-table-column>
        <el-table-column prop="name" label="底库照片">
          <template slot-scope="scope">
            <img :src="url+scope.row.libraryImg" height="40" @click="imgClick(scope.row.libraryImg)"/>
          </template>
        </el-table-column>
        <el-table-column prop="icCard" label="IC卡卡号" v-if="checkInModeCode !== 'checkInMode:1'"></el-table-column>
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
    </el-dialog>
    <!--查看照片-->
    <el-dialog :visible.sync="imgPopShow" class="imgPopCls" width="30%">
        <img :src="bigImg" class="bigImg"/>
    </el-dialog>
  </div>
</template>

<script>
import { meetingRecordByUserId } from '@/axios/api.js'
import { getFormData } from '@/lib/util.js'
export default {
  data () {
    return {
      visible: false,
      checkInModeCode: '',
      tableData: [],
      total: 0,
      pageNum: 0,
      pageSize: 5,
      bigImg: '',
      imgPopShow: false,
      url: this.$globalConst.apiPrefix,
      form: {}
    }
  },
  methods: {
    showData (data) {
      this.visible = true
      this.form = data
      this.checkInModeCode = data.checkInModeCode
      this.getList()
    },
    getList (pageNum) {
      this.pageNum = pageNum || 1
      meetingRecordByUserId(getFormData({
        ...this.form,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })).then(res => {
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
      if (img) {
        this.bigImg = this.url + img
        this.imgPopShow = true
      }
    }
  }
}
</script>
<style scoped>
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
