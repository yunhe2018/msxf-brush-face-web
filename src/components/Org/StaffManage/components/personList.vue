<template>
  <el-dialog :visible.sync="visible" append-to-body :close-on-click-modal=false class="imgPopCls" width="960px"
   :before-close="handleClose"
    @close="handleClose"
    >
    <div class="divWrap noRadioLable">
          <div class='listTop'>
            <el-form :model="form" ref="ruleForm" :inline="true">
              <el-form-item label="关键字" class="label_180">
                <el-input clearable class='width_197' size="small" v-model.trim="form.name"></el-input>
              </el-form-item>
              <!-- <div class="btnWrap"> -->
                <el-button size="small" @click="getList(1)">查询</el-button>
              <!-- </div> -->
            </el-form>
          </div>
          <div class="listBotTit" style="padding-top: 16px;">
            <div class="pdlr-16" style="height:300px">
              <div style="height:100%;" class="dialogAndScrollbar">
                <el-scrollbar style="height:100%;">
                  <el-table :data="tableDate" class="processTable">
                    <el-table-column label="选择" align="left">
                      <template slot-scope="scope">
                        <el-radio v-model="selected" :label="scope.row.id" @change="selectedChange(scope.row)"></el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column prop="userName" label="姓名" align="left"></el-table-column>
                    <el-table-column prop="phone" label="手机号" align="left"></el-table-column>
                  </el-table>
                  <el-pagination v-if="total" class="pageView"
                    @current-change="currentChange"
                    layout="total,prev, pager, next, jumper"
                    :total="total"
                    :current-page.sync="form.pageNum"
                    :page-size="form.pageSize" >
                  </el-pagination>
                </el-scrollbar>
              </div>
            </div>
            <div class="center-btn">
              <el-button size="small" class="editBtn" @click="submit('student')">提交</el-button>
            </div>
          </div>
      <imgSwipper ref="showBigImg" />
    </div>
  </el-dialog>
</template>

<script>
import { listVisited } from '@/axios/api.js'
import { filterObjNull, getFormData } from '@/lib/util.js'
import imgSwipper from '@/components/common/imgSwipper'
import consts from '@/lib/constant.js'
export default {
  components: {
    imgSwipper
  },
  data () {
    return {
      visible: false,
      imgPrefix: consts.apiPrefix,
      tableDate: [],
      selected: '',
      selectedRow: '',
      form: {
        pageNum: 0,
        pageSize: 10,
        name: ''
      },
      total: 0
    }
  },
  methods: {
    showData () {
      this.visible = true
      this.getList(1)
    },
    submit (type) {
      if (this.selected === '') {
        this.$message('请选择被访者')
        return
      }
      this.$emit('inputPerson', this.selectedRow)
      this.visible = false
    },
    getList (page) {
      this.form.pageNum = page
      listVisited(getFormData(filterObjNull(this.form))).then(res => {
        let result = res.data.value || {}
        this.total = result.total || 0
        this.tableDate = result.list || []
        if (!res.data.success) {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.total = 0
        this.tableDate = []
        this.failMessage(res && res.data && res.data.message)
      })
    },
    selectedChange (row) {
      this.selectedRow = row // 获取当前选中对象
    },
    // imgClick (detail, index, name) {
    //   this.$refs.showBigImg.showData({
    //     dataList: this[name].map(i => ({ imgUrl: i.field1, userName: i.userName })),
    //     imgInit: index,
    //     imgEnd: this.form.pageSize - 1
    //   })
    // },
    getImgUrl (imgData) {
      if (!imgData) return ''
      return 'data:image/jpg;base64,' + imgData
    },
    currentChange (val) {
      this.getList(val)
    },
    handleClose () {
      this.total = 0
      this.tableDate = []
      this.form = {
        pageNum: 0,
        pageSize: 10,
        name: ''
      }
      this.visible = false
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
    }
  },
  created () {
    // this.getClassList()
    // this.getOrgList()
  }
}
</script>
<style scoped>
.divWrap{
  margin: 16px 0;
}
.center-btn{
  text-align: center;
}
</style>
