<template>
    <div class="errorWrap">
        <div class="errorBox">
            <h3>抱歉！您所访问的页面不存在。</h3>
            <p class="info">您输入的网址有误或链接已经过期</p>
            <p><el-link class="btn-common" @click="toHome()">返回首页</el-link></p>
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
    toHome () {
      this.$router.push('/home')
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
    padding:15px 0 0 215px;
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
.info{
    font-family: PingFangSC-Regular;
    font-size:16px;
    color:#666;
    line-height: 27px;
    margin:12px 0 29px 0;
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
}

</style>
