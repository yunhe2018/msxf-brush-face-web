<template>
  <div class="hello">
    <div class='listTop'>
      <div class='listTopTit'>
          <div class='listTit'>查询条件</div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline DeviceForm" @submit.native.prevent>
        <el-form-item label="设备种类" class="label_197">
          <el-select class='width_197' size="small" v-model="formInline.region" clearable>
            <el-option ref="regionOptions" v-for="item in this.region" :key="item.dictCode" :value="item.dictCode" :label="item.dictName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备位置" class="label_197">
          <el-input @keyup.enter.native="queryDevice" clearable class='width_197' size="small" v-model.trim="formInline.deviceAddress"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select class='width_197' size="small" v-model="formInline.status" clearable>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <el-button size="small" @click="queryDevice" class="queryBtn">查询</el-button>
        <el-button size="small" @click="addDevice" class="queryBtn">新增设备</el-button>
      </el-form>
    </div>
    <div class="listBotTit">
      <div data-v-5295f104="" class="boxTitle">数据列表</div>
      <div class="pdlr-16">
      <el-table :data="tableData" class="processTable">
        <!-- <el-table-column type="index" label="序号" align="left"></el-table-column> -->
        <el-table-column prop="deviceTypeStr" label="设备种类" align="left">
          <template slot-scope="scope">
          <div style="display:none">{{ scope.row.id }}</div>
          <div>{{ scope.row.deviceTypeStr }}</div>
        </template>
        </el-table-column>
        <el-table-column prop="deviceNormsStr" label="设备型号" align="left"></el-table-column>
        <el-table-column prop="deviceAddress" label="安装位置" align="left"></el-table-column>
        <el-table-column prop="videoIp" label="视频流" align="left"> </el-table-column>
        <el-table-column prop="deviceIp" label="IP地址" align="left"> </el-table-column>
        <!-- <el-table-column prop="status" label="状态" align="left" width="50">
          <template slot-scope="scope">
            <span v-if='scope.row.status===0'>无效</span>
            <span v-if='scope.row.status===1'>有效</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="left" width="120">
          <template slot-scope="scope">
            <el-link v-if="scope.row.deviceType === 'deviceType:6'" type="primary" class="opreationBtn" @click="resetTable(scope.row,scope.$index)">重启</el-link>
            <el-link type="primary" class="opreationBtn" @click="modifiyTable(scope.row,scope.$index)">修改</el-link>
            <!-- <span class="splitLine">|</span> -->
            <el-link v-if="scope.row.deviceType !== 'deviceType:6'" type="primary" class="opreationBtn" @click="deleteTable(scope.row,scope.$index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        v-if="total"
        class="pageView"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 50, 100, 500]"
        :current-page.sync="pageNum"
        :total="total"
        :page-size="pageSize">
      </el-pagination>
      </div>
    </div>
    <DeviceDialog :show.sync="show" :region="region" :type="type" :id="id" @submit="submit" :btnDisabled="btnDisabled"></DeviceDialog>
  </div>
</template>

<script>
import DeviceDialog from './DeviceDialog'
import { getFormData, filterObjNull } from '../../lib/util.js'
import { getSysDictByParentCode, listDevice, addDevice, deleteDevice, updateDevice, restart } from '../../axios/api.js'
export default {
  name: 'Device',
  components: {
    DeviceDialog
  },
  data () {
    return {
      btnDisabled: false,
      formInline: {},
      region: [],
      tableData: [],
      type: '',
      show: false,
      pageNum: 1,
      pageSize: 10,
      currentPage: 0,
      total: 0,
      id: 0
    }
  },
  created () {
    this.getSysDictByParentCode()
    this.queryDevice()
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.queryDevice()
      console.log(this.pageSize)
    },
    getSysDictByParentCode () {
      let data = {
        parentCode: 'deviceType'
      }
      getSysDictByParentCode(getFormData(data)).then(res => {
        if (res.data.success === true) {
          this.region = res.data.value
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    queryDevice (num) {
      let data = {
        pageSize: this.pageSize,
        deviceType: this.formInline.region,
        deviceAddress: this.formInline.deviceAddress
        // status: this.formInline.status
      }
      if (typeof num === 'number') {
        data.pageNum = num
      } else {
        this.pageNum = 1
        data.pageNum = 1
      }
      data = filterObjNull(data)
      listDevice(getFormData(data)).then(res => {
        if (res.data.success === true) {
          if (res.data.value) {
            this.tableData = res.data.value.list
            // 总页数
            this.currentPage = res.data.value.pages
            // 总条数
            this.total = res.data.value.total
          } else {
            this.tableData = []
            this.total = 0
          }
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    addDevice () {
      this.show = true
      this.type = 'add'
    },
    modifiyTable (value) {
      this.show = true
      this.type = 'modifiy'
      this.id = value.id
    },
    resetTable () {
      this.$prompt('请输入系统管理员密码进行重启', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (val) => {
          if (!val) {
            return false
          }
        },
        inputErrorMessage: '密码不能为空'
      }).then(({ value }) => {
        let data = {
          passWord: value
        }
        restart(getFormData(data)).then(res => {
          if (res.data.success) {
            this.successMessage(res.data.message)
          } else {
            this.failMessage(res.data.message)
          }
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
      }).catch(() => {
      })
    },
    deleteTable (e) {
      this.$confirm(`确认删除${e.deviceTypeStr}设备吗？`, '删除', {
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: e.id
          }
          deleteDevice(getFormData(data)).then(res => {
            if (res.data.success) {
              this.successMessage(res.data.message)
              this.queryDevice(this.pageNum)
            } else {
              if (res.data.code === '20') {
                let str = `<div></div>`
                res.data.value.map(item => {
                  str += `<div style="display: block;">${item}</div>`
                })
                this.$alert(`<div>
                  ${res.data.message}
                  <div style="height: 50px;overflow: auto;" class="dialogAndScrollbar">
                    ${str}
                  </div>
                </div>`, '提示', {
                  dangerouslyUseHTMLString: true
                })
              } else {
                this.failMessage(res.data.message)
              }
            }
          }).catch(res => {
            this.failMessage(res && res.data && res.data.message)
          })
        })
    },
    submit (e) {
      this.btnDisabled = true
      // console.log(e)
      let data = {
        deviceType: e.value.deviceType,
        deviceNorms: e.value.deviceNorms,
        deviceAddress: e.value.deviceAddress,
        deviceIp: e.value.deviceIp,
        content: e.value.content
        // status: e.value.status
      }
      if (e.value.deviceType === 'deviceType:2') {
        data.videoIp = e.value.videoIp
      } else if (e.value.deviceType === 'deviceType:5') {
        data.algorithmDegree = e.value.algorithmDegree
        // data.strangerAlgorithmDegree = e.value.strangerAlgorithmDegree
      } else if (e.value.deviceType === 'deviceType:6') {
        data.subnet = e.value.subnet
        data.gateway = e.value.gateway
        data.dns1 = e.value.dns1
        data.dns2 = e.value.dns2
        data.ntpState = e.value.ntpState
        data.ntpAddress = e.value.ntpAddress
        data.ntpPort = e.value.ntpPort
      }
      if (this.type === 'add') {
        addDevice(data).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res.data.message)
            this.queryDevice()
          } else {
            // this.failMessage(res.data.message)
            this.$alert(res.data.message, '提示', {
              confirmButtonText: '确定',
              type: 'error',
              callback: action => {
              }
            })
          }
          this.btnDisabled = false
        }).catch(res => {
          // this.failMessage(res && res.data && res.data.message)
          this.$alert('请求失败', '提示', {
            confirmButtonText: '确定',
            type: 'error',
            callback: action => {
            }
          })
          this.btnDisabled = false
        })
      } else {
        data.id = this.id
        updateDevice(data).then(res => {
          if (res.data.success) {
            this.show = e.status
            this.successMessage(res.data.message)
            this.queryDevice(this.pageNum)
          } else {
            // this.failMessage(res.data.message)
            this.$alert(res.data.message, '提示', {
              confirmButtonText: '确定',
              type: 'error',
              callback: action => {
              }
            })
          }
          this.btnDisabled = false
        }).catch(res => {
          // this.failMessage(res && res.data && res.data.message)
          this.$alert('请求失败', '提示', {
            confirmButtonText: '确定',
            type: 'error',
            callback: action => {
            }
          })
          this.btnDisabled = false
        })
      }
    },
    successMessage (txt) {
      this.$message({
        message: txt,
        type: 'success'
      })
      // this.queryDevice()
    },
    handleCurrentChange (e) {
      this.queryDevice(e)
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pageView {
    text-align: right;
  }
  .btn{
    margin-bottom: 20px;
  }
  .allValue {
    height: 30px;
  }
</style>
