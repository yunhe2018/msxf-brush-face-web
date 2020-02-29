<template>
    <div>
      <el-dialog
        title="查看底库"
        class="countDialog"
        :visible.sync="visible"
        @close="$emit('update:countShow', false)"
        :before-close="handleClose"
        :countShow="countShow">
        <div class="queryQuest">
          <el-input  class='label_240' size="small" placeholder="查看姓名" v-model.trim="keyword" clearable @keyup.enter.native="querybtn"></el-input>
          <div class="querybtn" @click="querybtn" >查询</div>
        </div>
        <div style="height: 384px;width: 100%;">
          <el-scrollbar style="height:100%" ref="myScrollbar">
          <div style="width: 220px">
            <template v-if="this.manage === 'manage'">
              <div><span class="title">门禁名称</span><span class="rightTit">{{this.countAmount.acName}}</span></div>
              <div><span class="title">安装位置</span><span class="rightTit">{{this.countAmount.acPosition}}</span></div>
              <div><span class="title">状态</span><span class="rightTit">{{this.countAmount.status === 0 ? '无效' : '有效'}}</span></div>
            </template>
            <template v-if="this.manage === 'greet'">
              <div><span class="title">迎宾名称</span><span class="rightTit">{{this.countAmount.greetingName}}</span></div>
              <div><span class="title">底库名称</span><span class="rightTit">{{this.countAmount.libraryName}}</span></div>
            </template>
            <template v-if="this.manage === 'attend'">
              <div><span class="title">考勤名称</span><span class="rightTit">{{this.countAmount.atName}}</span></div>
              <div><span class="title">安装位置</span><span class="rightTit">{{this.countAmount.atPosition}}</span></div>
              <div><span class="title">状态</span><span class="rightTit">{{this.countAmount.atStatus === 0 ? '关' : '开'}}</span></div>
            </template>
            <template v-if="this.manage === 'library'">
              <div><span class="title">底库名称</span><span class="rightTit">{{this.countAmount.libraryName}}</span></div>
              <div><span class="title">状态</span><span class="rightTit">{{this.countAmount.status === 0 ? '无效' : '有效'}}</span></div>
            </template>
            <div><span class="title">人员数量</span><span class="rightTit">{{this.countAmount.userCount ? this.countAmount.userCount : this.total}}</span></div>
          </div>

          <div class="rightTable">
          <!-- <div style="width: 574px;border-left:1px solid #EBEEF5;"> -->
            <el-table :data="userList" class="processTable">
              <el-table-column prop="userImg" label="图片">
              <template slot-scope="scope">
                <div style="display:none">{{ scope.row.userId }}</div>
                  <img :src="url + scope.row.userImg" class="orgImg" />
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="orgName" label="归属部门"></el-table-column>
            <el-table-column prop="userTypeStr" label="人员类型"></el-table-column>
          </el-table>
          <el-pagination
            v-if="total"
            class="pageView"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize">
          </el-pagination>
           </div>
          </el-scrollbar>
        </div>
          <!-- <Pagebar :total="total" @pageChage="handleCurrentChange"> -->
          <!-- </Pagebar> -->
        </el-dialog>
    </div>
</template>

<script>
import { libraryUserList } from '../../axios/api.js'
import { getFormData, filterObjNull } from '../../lib/util.js'
// import Pagebar from '../common/pagebar'
export default {
  name: 'CountDetail',
  props: {
    countShow: {
      type: Boolean,
      default: false
    },
    countAmount: {
      type: Object,
      default: function () {}
    },
    manage: {
      type: String
    },
    storage: {
      type: String
    }
  },
  data () {
    return {
      visible: this.countShow,
      userList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      keyword: '',
      url: this.$globalConst.apiPrefix
    }
  },
  created () {
  },
  methods: {
    querybtn () {
      this.countQuery(this.pageNum, 'userName')
    },
    countQuery (num, userName) {
      let data = {
        pageNum: num,
        pageSize: this.pageSize
      }
      if (userName) {
        data.userName = this.keyword
      }
      if (this.storage === 'storage') {
        data.id = this.countAmount.id
      } else {
        data.id = this.countAmount.libraryId
      }
      data = filterObjNull(data)
      libraryUserList(getFormData(data)).then(res => {
        if (res.data.success === true) {
          this.userList = res.data.value.list
          this.total = res.data.value.total
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    handleCurrentChange (e) {
      this.countQuery(e)
    },
    handleClose (done) {
      done()
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  },
  watch: {
    countShow () {
      this.pageNum = 0
      this.total = 0
      this.userList = []
      this.visible = this.countShow
      this.$nextTick(() => {
        this.$refs['myScrollbar'].wrap.scrollTop = 0
      })
      this.keyword = ''
      if (this.countAmount) {
        this.countQuery(this.pageNum)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.countDialog /deep/ .el-dialog {
  /* height: 488px; */
  width: 800px;
}
.countDialog /deep/ .el-dialog__body {
  padding: 0 0 0 25px;
  height: 100%;
}
.countDialog /deep/ .el-dialog__body::after {
  content: '';
  display: inline-block;
  width: 1px;
  background: #EBEEF5;
  position: absolute;
  top: 57px;
  bottom: 0;
  left: 240px;
}
.countDialog /deep/ .el-scrollbar__view {
  display: flex;
}
.countDialog /deep/ .el-pager li {
  min-width: 33px;
}
/* 浮窗关闭 */
.countDialog /deep/ .el-dialog__headerbtn .el-dialog__close {
  position: absolute;
    top: -15px;
}

span {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
}
.title {
  width: 70px;
  text-align: left;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #303133;
  line-height: 40px;
  display: inline-block;
}
.rightTit {
  margin-left: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #909399;
  line-height: 40px;
}
.queryQuest {
  display: flex;
  position: absolute;
  right: 45px;
  top: 9px;
}
.querybtn {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #4C7EE9 ;
  text-align: right;
  line-height: 32px;
  margin-left: 15px;
  cursor: pointer;
}
.orgImg {
    display: inline-block;
    height: 40px;
}
.rightTable {
  width: 574px;
}
.queryQuest {
  display: flex;
  position: absolute;
  right: 45px;
  top: 9px;
}
.querybtn {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #4C7EE9 ;
  text-align: right;
  line-height: 32px;
  margin-left: 15px;
  cursor: pointer;
}
.orgImg {
    display: inline-block;
    height: 40px;
  }
</style>
