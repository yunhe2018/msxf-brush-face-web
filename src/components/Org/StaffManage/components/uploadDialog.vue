<template>
    <div>
      <el-dialog
            title="导入结果"
            :visible.sync="visible"
            @close="$emit('update:showDialog', false)"
            :close-on-click-modal=false
            :before-close="handleClose"
            :append-to-body='true'
            width="400px"
            :showDialog="showDialog">
            <div class="numTotal">
              <div class="left" v-if="this.uploadAmount.value && this.uploadAmount.value.totalNum"><span>全部</span>{{this.uploadAmount.value ? '：' + this.uploadAmount.value.totalNum : ''}}</div>
              <div class="left" v-if="this.uploadAmount.value && this.uploadAmount.value.errorNum && this.uploadAmount.value.totalNum"><span>成功</span>{{this.uploadAmount.value ? '：' + (this.uploadAmount.value.totalNum - this.uploadAmount.value.errorNum) : ''}}</div>
              <div v-if="this.uploadAmount.value && this.uploadAmount.value.errorNum"><span>失败</span>{{this.uploadAmount.value ? '：' + this.uploadAmount.value.errorNum : ''}}</div>
            </div>
            <div>{{this.uploadAmount.value ? this.uploadAmount.message : ''}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" class="editBtn" @click="cancel">取消</el-button>
                <el-button size="small" class="editBtn" @click="uploadTemplate">下载错误文件</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'CalendarDialog',
  props: {
    showDialog: {
      type: Boolean
    },
    uploadAmount: {
      type: Object
    }
  },
  data () {
    return {
      visible: this.showDialog,
      apiPrefix: this.$globalConst.apiPrefix
    }
  },
  methods: {
    handleClose (done) {
      done()
    },
    cancel () {
      this.visible = false
    },
    uploadTemplate () {
      window.location.href = this.apiPrefix + this.uploadAmount.value.errorFile
    }
  },
  watch: {
    showDialog () {
      this.visible = this.showDialog
      if (!this.showDialog) return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.numTotal {
  display: flex;
}
.left {
  margin-right: 15px;
}
</style>
