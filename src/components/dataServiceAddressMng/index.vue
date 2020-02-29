<template>
  <div class="boxWrap">
    <div class="box">
      <div class="headerUser">管理服务器</div>
      <el-form :model="network" ref="network" label-width="90px" class="demo-ruleForm">
        <el-form-item label="IP地址" prop="adminIp">
          <el-input size="small" v-model.trim="adminIp" class="passWordInput width_305"></el-input>
        </el-form-item>
        <el-form-item prop="currAddress">
          <el-button size="small" type="primary" class="saveBtn" @click="updateAdminIp">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
    <p class="spaceLine"></p>
    <div class="box">
      <div class="headerUser">当前服务器</div>
      <el-form :model="network" ref="network" label-width="90px" class="demo-ruleForm">
        <el-form-item label="IP地址" prop="currAddress">
          <el-input size="small" v-model.trim="network.ip" class="passWordInput width_305"></el-input>
        </el-form-item>
        <el-form-item label="子网掩码" prop="currAddress">
          <el-input size="small" v-model.trim="network.mask" class="passWordInput width_305"></el-input>
        </el-form-item>
        <el-form-item label="网关" prop="currAddress">
          <el-input size="small" v-model.trim="network.gateway" class="passWordInput width_305"></el-input>
        </el-form-item>
        <el-form-item label="DNS" prop="currAddress">
          <el-input size="small" v-model.trim="network.dns" class="passWordInput width_305"></el-input>
        </el-form-item>
        <el-form-item prop="currAddress">
          <el-button size="small" type="primary" class="saveBtn" @click="updateNetwork">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
    <p class="spaceLine"></p>
    <div class="box">
      <div class="headerUser">授权</div>
      <el-form ref="network" label-width="90px" class="demo-ruleForm">
        <el-form-item label="授权码" prop="secret">
          <el-input size="small" v-model.trim="secret" class="passWordInput width_305"></el-input>
        </el-form-item>
        <el-form-item prop="currAddress">
          <el-button size="small" type="primary" class="saveBtn" @click="setAuthEvent">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getAddress, changeAdminIp, changeNetwork } from '@/axios/dataServiceApi.js'
import { setAuth } from '@/axios/api.js'
import { getFormData } from '@/lib/util'

export default {
  name: 'PassWord',
  data () {
    return {
      btnDisabled: false,
      adminIp: '', // 管理服务器地址
      network: { // 当前服务器地址
        ip: '', // ip
        mask: '', // 子网掩码
        gateway: '', // 网管
        dns: '' // DNS
      },
      secret: ''
    }
  },
  methods: {
    updateAdminIp () {
      var reqData = getFormData({
        adminIp: this.adminIp
      })
      changeAdminIp(reqData).then(res => {
        if (res.data && res.data.success) {
          this.successMessage(res.data.message)
        } else {
          this.failMessage(res.data.message)
        }
      }).catch((res) => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    updateNetwork () {
      var reqData = getFormData({
        ...this.network
      })
      changeNetwork(reqData).then(res => {
        if (res.data && res.data.success) {
          this.successMessage(res.data.message)
        } else {
          this.failMessage(res.data.message)
        }
      }).catch((res) => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    setAuthEvent () {
      let reqData = getFormData({
        secret: this.secret
      })
      setAuth(reqData).then(res => {
        if (res.data.success) {
          this.successMessage(res.data.message)
        } else {
          this.failMessage(res.data.message)
        }
      }).catch((res) => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    successMessage (txt) {
      txt = txt || '保存成功'
      this.$message({
        message: txt,
        type: 'success'
      })
    },
    failMessage (txt) {
      txt = txt || '保存失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  },
  mounted () {
    getAddress().then(res => {
      if (res.data.success) {
        this.adminIp = res.data.value.adminIp
        this.network = res.data.value.network
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.boxWrap{
  position: fixed;
  width: 100%;
  height:100%;
  left: 0;
  top: 0;
  z-index: 9;
  background: #fff;
  overflow:auto
}
.box{
  padding: 0 16px 20px 6px;
  /* height: 100%; */
}
.spaceLine{
  height: 1px;
  background: #d5d5d5;
  margin: 0 16px;
}
.headerUser {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 16px;
  font-weight: bold;
  padding: 20px 10px;
}
.demo-ruleForm {
    width: 60%;
}
.passWordInput /deep/ .el-input__inner {
    width: 100%;
}
.demo-ruleForm {
  padding-top: 11px;
}
.saveBtn {
  /* margin-left: 10px; */
  background: #4C7EE9;
  border-radius: 4px;
  color: #FFF;
}
</style>
