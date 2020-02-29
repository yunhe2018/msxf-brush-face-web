<template>
    <el-tree
    :props="props"
    :data="treeData"
    :expand-on-click-node="false"
    @node-click="handleNodeClick">
    </el-tree>
</template>

<script>
import { getOrgTree } from '../../axios/api.js'
import { getFormData } from '../../lib/util.js'
export default {
  data () {
    return {
      props: {
        label: 'nodeName',
        children: 'children'
      },
      orgTreeData: []
    }
  },
  created () {
    this.getOrgTreeData()
  },
  computed: {
    treeData: function () {
      let treeData = []
      this.orgTreeData.forEach(element => {
        let count = element.userCount || 0
        count = '(' + count + '人)'
        element.nodeName = element.orgName + count
        element.parentPath = element.parentPath || ''
        if (element.children) {
          element.children.forEach(ele => {
            let count = ele.userCount || 0
            count = '(' + count + '人)'
            ele.nodeName = ele.orgName + count
            ele.parentPath = (element.parentPath || element.orgName) + '>'
          })
        }
        treeData.push(element)
      })
      return treeData
    }
  },
  methods: {
    handleNodeClick (data) {
      this.$emit('updateCurrOrg', data)
    },

    getOrgTreeData () {
      let reqData = getFormData({
        patentId: 0,
        flag: 0
      })
      getOrgTree(reqData).then(res => {
        if (res && res.data && res.data.success) {
          this.orgTreeData = res.data.value
          this.orgTreeData = Object.assign({}, this.orgTreeData)
        }
      })
    }
  }
}
</script>
