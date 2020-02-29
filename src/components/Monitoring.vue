<template>
  <div class="processMng">
    <div class='processTit'>6</div>
    <el-form :model="formData" :rules="formRule" ref="formData" label-width="100px">
      <el-form-item prop="name" label="66">
        <el-input class='width_197' size="small" v-model.trim="formData.name" ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Meeting',
  data () {
    return {
      msg: '',
      formData: {
        name: ''
      },
      formRule: {
        name: [{required: true, message: '不能为空', trigger: 'blur'}]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .processTit {
    font-family: PingFangSC-Regular;
    font-size: 22px;
    color: #303133;
    line-height: 22px;
    margin: 24px;
  }
</style>
