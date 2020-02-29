<template>
    <div class="errorWrap">
        <div class="errorBox">
            <h3>抱歉！您的登录已经超时，请重新登录</h3>
            <p><el-link class="btn-common" @click="toLogin">返回登录</el-link></p>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    toLogin () {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.errorWrap{
    text-align: center;
    width:100%;
    height: 100%;
    position: relative;
}
.errorBox{
    background: url("../assets/images/404@2x.png") 0 0 no-repeat;
    background-size: 180px 180px;
    padding:40px 0 0 215px;
    min-height: 180px;
    display:block;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-60%);
    -webkit-transform: translate(-50%,-60%);
    text-align: left;
}
h3{
    font-family:PingFangSC-Medium ;
    font-size:24px;
    color:#333;
    line-height: 24px;
    margin:0;
}
.btn-common{
    font-family: PingFangSC-Medium;
    font-size:14px;
    border: solid 1px #4C7EE9;
    height:14px;
    line-height: 14px;
    padding:9px 10px;
    color:#4C7EE9;
    border-radius:4px;
    margin-top:29px;
}

</style>
