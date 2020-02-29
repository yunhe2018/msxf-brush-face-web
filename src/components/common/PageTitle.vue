<template>
    <div class="headerUser">{{ this.pageTitle }}</div>
</template>

<script>
export default {
  name: 'PageTitle',
  data () {
    return {
      pageTitle: ''
    }
  },
  created () {
    this.pageTitle = sessionStorage.getItem('menuName')
  },
  methods: {
    fetchDate () {
      this.pageTitle = sessionStorage.getItem('menuName')
    }
  },
  watch: {
    '$route': 'fetchDate'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .headerUser {
    font-size: 22px;
    color: #303133;
    /* border-bottom: 1px solid #E5E7ED; */
    height: 30px;
    line-height: 30px;
    margin-bottom: 24px;
  }
</style>
