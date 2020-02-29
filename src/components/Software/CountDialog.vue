<template>
  <div>
    <el-dialog
        class="software"
        title="客户端更新记录"
        :visible.sync="visible"
        @close="$emit('update:countShow', false)"
        :countShow="countShow">
        <el-table :data="tableData" class="processTable">
            <el-table-column prop="ipAddress" label="IP地址" align="left"></el-table-column>
            <el-table-column prop="businessName" label="承载业务" align="left"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="left"></el-table-column>
            <el-table-column prop="beforeVersion" label="更新前版本" align="left"></el-table-column>
            <el-table-column prop="afterVersion" label="更新后版本" align="left"></el-table-column>
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
      </el-dialog>
  </div>
</template>

<script>
import { getFormData } from '../../lib/util.js'
import { listSysSoftwareRecord } from '../../axios/api.js'

export default {
  name: 'CountDialog',
  props: {
    countShow: {
      type: Boolean,
      default: false
    },
    countId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      visible: this.countShow,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 0,
      total: 0
    }
  },
  created () {
  },
  methods: {
    listSysSoftwareRecord (num) {
      let data = {
        pageSize: this.pageSize,
        softwareId: this.countId
      }
      if (typeof num === 'number') {
        data.pageNum = num
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      listSysSoftwareRecord(getFormData(data)).then(res => {
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
    handleCurrentChange (e) {
      this.listSysSoftwareRecord(e)
    }
  },
  watch: {
    countShow () {
      this.visible = this.countShow
      this.listSysSoftwareRecord()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
