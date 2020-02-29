<template>
  <div class="orgCont">
    <div class="treeWrap" style="height:100%;width:270px">
      <el-scrollbar style="height:100%;">
        <el-tree
        style="width:350px;"
        :props="props"
        :data="orgTreeData"
        :expand-on-click-node="false"
        highlight-current
        node-key="id"
        :default-expanded-keys="expandedNode"
        :default-checked-keys="checkedNode"
        @node-click="updateCurrOrg">
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="orgMain">
      <div class="orgHeader">
        <h3>组织详细信息
          <span>先从左侧树结构中选择需要编辑的组织名，再进行相应操作!</span>
        </h3>
        <el-button v-if="this.treeShow" style="margin-left:20px" size="small" @click="add">新增根组织</el-button>
      </div>
      <!-- <p class="fs-t5">{{orgName}}<el-button style="margin-left:20px" type="primary" @click="editOrgEvent">编辑</el-button></p> -->
      <p class="path mgtb-10 fs-tc3" v-if="orgName">
        {{(orgPath?orgPath:'')+orgName}}
        <!-- <el-button style="margin-left:20px" size="small" @click="editOrgEvent">编辑</el-button>
        <el-button style="margin-left:20px" size="small" @click="addOrgEvent" v-if="isEndOrg!=1">添加子部门</el-button> -->
      </p>
      <template>
        <!-- <p class="fs-t3">下级部门<el-button style="margin-left:20px" type="primary" @click="addOrgEvent">添加子部门</el-button></p> -->
        <div class="tableWrap" style="height:90%;">
            <el-scrollbar style="height:100%;">
            <el-table :data="orgList" style="width: 100%">
              <!-- <el-table-column type="index" label="序号"></el-table-column> -->
              <el-table-column prop="orgName" label="名称">
                <template slot-scope="scope">
                  <div style="display:none">{{ scope.row.id }}</div>
                  <div>{{ scope.row.orgName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="人数">
                <template slot-scope="scope">
                  <el-link type="primary" @click="showUserPanel(scope.row,scope.$index)">{{scope.row.userCount||0}}</el-link>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-link type="primary" class="opreationBtn" @click="modifiyOrgEvent(scope.row,scope.$index)">修改</el-link>
                  <!-- <span class="splitLine">|</span> -->
                  <el-link type="primary" class="opreationBtn" @click="deleteOrgEvent(scope.row,scope.$index)">删除</el-link>
                  <el-link type="primary" class="opreationBtn" @click="addOrgEvent(scope.row,scope.$index)">添加子部门</el-link>
                </template>
              </el-table-column>
            </el-table>
          <!-- <el-pagination
              v-if="orgTotal"
              class="pageView"
              layout="total, prev, pager, next, jumper"
              :total="orgTotal"
              :current-page.sync="reqListOrg.pageNum"
              :page-size="10"
              @current-change="getListOrgData">
          </el-pagination> -->
          </el-scrollbar>
        </div>
        <template>
          <el-dialog
            class="elDialog-1"
            title="查看人员"
            :close-on-click-modal=false
            :visible.sync="userShow">
            <div style="height:420px;" class="dialogAndScrollbar">
              <el-scrollbar style="height:100%;">
                <el-table :data="orgUsers" stripe style="width: 100%">
                  <el-table-column label="照片">
                    <template slot-scope="scope" >
                      <img :src="url + scope.row.userImg" class="orgImg" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="userName" label="姓名"></el-table-column>
                </el-table>
                <el-pagination
                    v-if="userTotal"
                    class="pageView"
                    :current-page.sync="userCurPage"
                    @current-change="getPageUserList"
                    layout="total, prev, pager, next, jumper"
                    :total="userTotal"
                    :page-size="10">
                </el-pagination>
              </el-scrollbar>
              </div>
          </el-dialog>
        </template>
      </template>
    </div>

    <OrgDialog :show.sync="show" :type="type" :hideOrgList="hideOrgList" :orgId="orgId" :curOrg="curOrg" :orgTreeData="orgTreeData" :curChild="curChild" @submit="handleSubmit" :btnDisabled="btnDisabled"></OrgDialog>

  </div>
</template>

<script>
import { getOrgTree, addOrg, modifyOrg, deleteOrg, getOrg, getOrgUsers } from '../../axios/api.js'
import { getFormData } from '../../lib/util.js'

import OrgTree from './OrgTree'
import OrgDialog from './OrgDialog'
export default {
  name: 'Org',
  components: {
    OrgTree,
    OrgDialog
  },
  data () {
    return {
      btnDisabled: false,
      parentArr: [],
      props: {
        label: 'nodeName',
        children: 'children'
      },
      orgName: '',
      orgId: 0,
      orgPath: '',
      orgTreeData: [],
      orgList: [],
      orgTotal: 0,
      // orgCurPage: 1,
      userTotal: 0,
      userCurPage: 1,
      show: false,
      type: 'add',
      curOrg: {},
      curChild: {},
      checkedNode: [],
      expandedNode: [1],
      reqListOrg: {
        pageNum: 1,
        pageSize: 10,
        orgId: 0
      },
      url: this.$globalConst.apiPrefix,
      reqOrgUsers: {
        pageNum: 1,
        pageSize: 10,
        id: 0
      },
      userShow: false,
      orgUsers: [],
      hideOrgList: '',
      isEndOrg: false,
      treeShow: false,
      userCount: 0,
      deleteTree: false
    }
  },
  created () {
    this.getOrgTreeData()
  },
  watch: {
    orgTreeData: {
      handler: function (val, oldval) {
        this.handleDeepOrgTree(this.orgTreeData)
        if (this.deleteTree) {
          if (this.orgTreeData[0]) {
            let curOrg = this.orgTreeData[0]
            this.orgName = this.orgTreeData[0].orgName
            this.updateCurrOrg(curOrg, 'noReloadList')
          } else {
            let curOrg = []
            this.orgName = ''
            this.updateCurrOrg(curOrg, 'delete')
          }
          this.deleteTree = false
        }
        if (this.orgTreeData.length < 1) {
          this.treeShow = true
        }
      },
      deep: true// 对象内部的属性监听，也叫深度监听
    }
  },
  methods: {
    renderData (data, status) {
      this.orgList = []
      if (!status) {
        this.orgList.push({
          orgName: data.orgName,
          userCount: data.userCount ? data.userCount : this.userCount,
          id: data.id ? data.id : this.orgId,
          parentId: data.parentId
        })
      }
    },
    updateCurrOrg (node, noRefresh) {
      if (node.parentId === 0) {
        this.treeShow = true
      } else {
        this.treeShow = false
      }
      if (noRefresh === 'delete') {
        this.renderData(node, 'delete')
      } else {
        this.renderData(node)
      }

      // 添加子部门修改上级部门返显
      this.parentArr.map(item => {
        if (item.id === node.parentId) {
          node.parentName = item.orgName
        }
      })
      this.orgName = node.orgName
      this.userCount = node.userCount
      this.orgId = node.id
      this.orgPath = node.parentPath
      this.reqListOrg.orgId = node.id
      this.curOrg = node
      // this.reqListOrg.pageNum = 1
      // this.orgCurPage = 1
      if (node.isEnd === 1) { // 末分支
        this.isEndOrg = true
      } else {
        this.isEndOrg = false
        // if (noRefresh !== 'noReloadList') {
        // this.getListOrgData()
        // }
      }
      this.checkedNode = [node.id]
      this.expandedNode = [node.id]
    },
    addOrgEvent () {
      this.show = true
      this.type = 'add'
      this.hideOrgList = 'addEvent'
      // this.getOrgTreeData()
    },
    add () {
      this.show = true
      this.type = 'add'
      this.hideOrgList = 'add'
    },
    modifiyOrgEvent (data) {
      this.show = true
      this.type = 'modify'
      this.hideOrgList = 'modifyEvent'
      this.curChild = JSON.parse(JSON.stringify(data))
      // this.getOrgTreeData()
    },
    deleteOrgEvent (e) {
      this.$confirm(`确认删除${e.orgName}组织吗`, '删除组织', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = getFormData({
            id: e.id
          })
          deleteOrg(data).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message, this.reqListOrg.pageNum)
              this.deleteTree = true
            } else {
              this.failMessage(res.data.message)
            }
          }).catch((res) => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    // editOrgEvent () {
    //   this.show = true
    //   this.type = 'modify'
    //   this.hideOrgList = true
    // },
    getOrgInfo () {
      let data = getFormData({
        id: this.curOrg.id
      })
      getOrg(data).then(res => {
        if (res.data && res.data.success) {
          this.curOrg = Object.assign({}, this.curOrg, res.data.value)
          this.orgName = this.curOrg.orgName
        } else {
          this.curOrg = {}
          this.orgName = ''
          this.failMessage(res.data.message)
        }
      }).catch((res) => {
        this.curOrg = {}
        this.orgName = ''
        this.failMessage(res && res.data && res.data.message)
      })
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
    },
    successMessage (txt, pageNum) {
      this.$message({
        message: txt,
        type: 'success'
      })
      this.getOrgTreeData() // 重新获取组织树
      if (this.hideOrgList !== 'add') {
        this.getOrgInfo()
      } else {
        // this.getListOrgData(pageNum) // 重新获取组织列表
      }
    },
    // getListOrgData (pageNum) {
    //   if (typeof pageNum === 'number') {
    //     this.reqListOrg.pageNum = pageNum
    //   } else {
    //     this.reqListOrg.pageNum = 1
    //   }

    //   getListOrg(getFormData(this.reqListOrg)).then(res => {
    //     let result = res.data || {}
    //     if (!result.success) {
    //       this.orgList = []
    //       if (this.reqListOrg.pageNum === 1) {
    //         this.orgTotal = 0
    //       }
    //       this.failMessage(result.message)
    //       return
    //     }
    //     if (result.value) {
    //       this.orgList = result.value.list
    //       this.orgTotal = result.value.total
    //     } else {
    //       this.orgList = []
    //       this.orgTotal = 0
    //     }
    //   }).catch((res) => {
    //     this.orgList = []
    //     if (this.reqListOrg.pageNum === 1) {
    //       this.orgTotal = 0
    //     }
    //     this.failMessage(res && res.data && res.data.message)
    //   })
    // },
    getOrgTreeData () {
      getOrgTree().then(res => {
        let result = res.data || {}
        if (result.success) {
          this.orgTreeData = result.value || []
        } else {
          this.orgTreeData = []
          this.failMessage(result.message)
        }
        this.orgTreeData = Object.assign([], this.orgTreeData)
        if (!this.orgName) {
          if (this.orgTreeData[0]) {
          // this.updateCurrOrg(this.orgTreeData[0], 'noReloadList') // 默认显示数据
            let curOrg = this.orgTreeData[0]
            if (this.curOrg && this.curOrg.id) {
              curOrg = this.curOrg
            }
            this.updateCurrOrg(curOrg, 'noReloadList')
          }
        }
      }).catch((res) => {
        this.failMessage(res && res.data && res.data.message)
      })
    },

    handleSubmit (e) {
      this.btnDisabled = true
      let data = {}
      if (this.hideOrgList === 'add') {
        data = {
          orgName: e.value.orgName
        }
      } else {
        data = {
          orgName: e.value.orgName,
          parentId: e.value.parentId,
          orgGrade: e.value.orgGrade
        }
      }
      if (this.type === 'add') {
        addOrg(data).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res.data.message)
          } else {
            this.failDialog(res.data.message)
          }
          this.btnDisabled = false
        }).catch((res) => {
          this.failDialog(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      } else {
        data.id = e.value.id
        modifyOrg(data).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.updateCurrOrg(e.value)
            this.successMessage(res.data.message, this.reqListOrg.pageNum)
          } else {
            this.failDialog(res.data.message)
          }
          this.btnDisabled = false
        }).catch((res) => {
          this.failDialog(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      }
    },
    showUserPanel (data) {
      this.userShow = true
      this.reqOrgUsers.id = data.id
      this.reqOrgUsers.pageNum = 1
      this.userCurPage = 1
      this.getOrgUsersData()
    },
    getOrgUsersData () {
      getOrgUsers(getFormData(this.reqOrgUsers)).then(res => {
        let result = res.data || {}
        if (!result.success) {
          this.orgUsers = []
          if (this.reqOrgUsers.pageNum === 1) {
            this.userTotal = 0
          }
          this.failMessage(result.message)
          return
        }
        if (result.value) {
          this.orgUsers = result.value.list || []
          this.userTotal = result.value.total
        } else {
          this.orgUsers = []
          this.userTotal = 0
        }
      }).catch((res) => {
        this.orgUsers = []
        if (this.reqOrgUsers.pageNum === 1) {
          this.userTotal = 0
        }
        this.failMessage(res && res.data && res.data.message)
      })
    },

    handleDeepOrgTree (obj, parentPath) {
      obj.forEach(element => {
        let count = element.userCount || 0
        count = '(' + count + '人)'
        element.nodeName = element.orgName + count

        parentPath = parentPath || ''
        element.parentPath = parentPath
        // 添加子部门修改上级部门返显
        this.parentArr.push({id: element.id, orgName: element.orgName})
        if (element.children) {
          let nodeParentPath = (element.parentPath + element.orgName) + ' > '
          this.handleDeepOrgTree(element.children, nodeParentPath)
        }
      })
    },
    // getPageOrgList (pageNum) {
    //   this.reqListOrg.pageNum = pageNum
    //   this.getListOrgData(pageNum)
    // },
    getPageUserList (pageNum) {
      this.reqOrgUsers.pageNum = pageNum
      this.getOrgUsersData()
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-tree{
    background-color:#fff
  }
  .el-tree /deep/ .el-tree-node__label{
    font-size:12px;
  }
  .el-aside{
    /* margin-top:20px; */
    padding-top:10px;
  }
  .orgCont{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height:100%;
    background-color: #fff;
    padding: 16px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .treeWrap{
    height: 100%;
    width: 270px;
    border-right: 1px solid #e5e5e5;
    float: left;
    margin-right: 16px;
  }
  .orgMain{
    height: 100%;
  }
  .orgHeader{
    display: flex;
    justify-content: space-between;
    line-height: 36px;
    padding: 10px 0;
  }
  .orgHeader h3{
    font-size: 16px;
  }
  .orgHeader h3 span{
    font-size: 12px;
    color:#999;
    font-weight: normal;
  }
  .orgImg {
    display: inline-block;
    height: 40px;
  }
</style>
