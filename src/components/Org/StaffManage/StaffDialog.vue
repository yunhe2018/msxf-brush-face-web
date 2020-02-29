<template>
  <div class="dialogDiv">
    <template v-if="photoShow">
        <el-dialog
        title="照片规范"
        :close-on-click-modal=false
        :visible.sync="photoShow">
          <img src="../../assets/images/photoRule.png" width="100%"/>
      </el-dialog>
    </template>
    <template v-else-if="staffType==='staff'">
      <el-dialog
        :title="title"
        :close-on-click-modal=false
        :visible.sync="visible"
        @close="$emit('update:show', false)"
        :show="show"
        :before-close="handleClose">
        <div style="height:420px;" class="dialogAndScrollbar">
          <el-scrollbar style="height:100%;" ref="myScrollbar">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="照片" prop="field1"
              :rules="{ required: true, message: '图片不能为空', trigger: 'blur'}">
              <!-- <el-upload
                class="avatar-uploader"
                ref="upload"
                :action="upload_url"
                list-type="picture-card"
                :name="upload_name"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :file-list="ad_url_list"
                :limit="2"
                accept="image/jpg,image/jpeg,image/png"
                :http-request="uploadSectionFile">
              <span class="font-14">照片上传</span>
              <div slot="tip" class="el-upload__tip">支持JPG\JPEG\PNG，大小5M内<el-link type="primary" @click="showPhotoPop">照片规范</el-link></div>
            </el-upload> -->
            <el-upload
                  class="avatar-uploader"
                  ref="upload1"
                  :action="upload_url"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadSectionFileOne">
                  <div class="avatarWrap" v-if="ruleForm.field1">
                    <img :src="getImgUrl(ruleForm.field1)" class="avatar">
                    <!-- <span class="deleteImg" @click.stop="deleteImg('field1')"></span> -->
                  </div>
                  <i v-else class="el-icon-picture-outline avatar-uploader-icon"><p>上传照片</p></i>
                </el-upload>
                <!-- <el-upload
                  class="avatar-uploader mgl-20"
                  ref="upload2"
                  :action="upload_url"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadSectionFileTwo">
                  <div class="avatarWrap" v-if="ruleForm.field2">
                    <img :src="getImgUrl(ruleForm.field2)" class="avatar">
                    <span class="deleteImg" @click.stop="deleteImg('field2')"></span>
                  </div>
                  <i v-else class="el-icon-picture-outline avatar-uploader-icon"><p>上传照片</p></i>
                </el-upload> -->
                <div class="avatar-uploader mgl-20" v-if="ruleForm.field2" >
                  <img :src="getImgUrl(ruleForm.field2)" class="avatar">
                </div>
                <div class="imgUploadTip mgl-20">
                  <p>支持JPG\JPEG\PNG，大小5M内</p>
                  <el-link type="primary" @click="showPhotoPop">照片规范</el-link>
                </div>
            </el-form-item>
            <el-form-item label="姓名" prop="userName"
              :rules="[{ required: true, message: '请输入姓名', trigger: 'blur'},
              { min:2, max:20, message: '姓名长度为2-20间', trigger: 'blur'}]">
              <el-input size="small" v-model.trim="ruleForm.userName" class="width_305"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex"
              :rules="{ required: true, message: '请选择性别', trigger: 'blur' }">
              <el-radio v-model="ruleForm.sex" :label="0">男</el-radio>
              <el-radio v-model="ruleForm.sex" :label="1">女</el-radio>
            </el-form-item>
            <el-form-item :label="field.lable" :key="field.name" v-for="field in staffFields"
              :prop="field.name"
              :rules="setRule(field.name,field.lable,field.required)">
              <!--lableType:text-->
              <el-input size="small" v-model.trim="ruleForm[field.name]" v-if="field.lableType==='text'" class="width_305"></el-input>
              <!--lableType:time-->
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm[field.name]" :editable="false" v-if="field.lableType==='time'" value-format="yyyy-MM-dd" style="width: 305px"></el-date-picker>
              <!--lableType:orgTree-->
              <el-popover
                placement="bottom"
                width="300"
                trigger="click"
                v-model="popvisible" v-else-if="field.lableType==='orgTree'">
                <el-input
                 size="small"
                  slot="reference"
                  v-model="ruleForm.orgName"
                  placeholder="请选择部门" class="width_305"></el-input>
                  <div style="height:300px;" class="dialogAndScrollbar">
                    <el-scrollbar style="height:100%;">
                      <el-tree
                        ref="tree"
                        style="min-height:200px;overflow:auto;"
                        :data="orgTreeData"
                        node-key="id"
                        highlight-current
                        :expand-on-click-node="false"
                        :default-expanded-keys="[1]"
                        :props="props"
                        @node-click="setOrg">
                      </el-tree>
                    </el-scrollbar>
                  </div>
              </el-popover>
            </el-form-item>
            <el-form-item label="备注" prop="content">
              <el-input size="small" type="textarea" v-model.trim="ruleForm.content" class="width_305" maxlength="100" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled">提交</el-button>
        </span>
      </el-dialog>
    </template>
    <template v-else-if="staffType==='visitor'">
      <el-dialog
        :title="title"
        :visible.sync="visible"
        @close="$emit('update:show', false)"
        :close-on-click-modal=false
        :show="show"
        :before-close="handleClose">
        <div style="height:420px;" class="dialogAndScrollbar">
          <el-scrollbar style="height:100%;">
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
              <el-form-item label="照片" prop="field1"  label-width='110px'
                :rules="{ required: true, message: '图片不能为空', trigger: 'blur'}">
               <el-upload
                  class="avatar-uploader"
                  ref="upload1"
                  :action="upload_url"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadSectionFileOne">
                  <img v-if="ruleForm.field1" :src="getImgUrl(ruleForm.field1)" class="avatar">
                  <i v-else class="el-icon-picture-outline avatar-uploader-icon"><p>上传照片</p></i>
                </el-upload>
                <div class="imgUploadTip mgl-20">
                  <p>支持JPG\JPEG\PNG，大小5M内</p>
                  <el-link type="primary" @click="showPhotoPop">照片规范</el-link>
                </div>
              </el-form-item>
              <el-form-item label="访客姓名" prop="userName"  label-width='110px'
                :rules="[{ required: true, message: '访客姓名不能为空', trigger: 'blur'},
                { min:2, max:20, message: '访客姓名长度为2-20间', trigger: 'blur'}]">
                <el-input size="small" v-model.trim="ruleForm.userName" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex"
                :rules="{ required: true, message: '请选择性别', trigger: 'blur' }">
                <el-radio v-model="ruleForm.sex" :label="0">男</el-radio>
                <el-radio v-model="ruleForm.sex" :label="1">女</el-radio>
              </el-form-item>
              <el-form-item label="手机号" prop="phone"  label-width='110px'
                :rules="setRule('phone','手机号',false)">
                <el-input size="small" v-model.trim="ruleForm.phone" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="来访目的" prop="field3" label-width='110px'
                :rules="{ required: true, message: '来访目的不能为空', trigger: 'blur'}">
                <el-select size="small" v-model="ruleForm.field3" placeholder="请选择" class="width_305">
                  <el-option
                    v-for="item in visitPurpose"
                    :key="item.dictCode"
                    :value="item.dictCode"
                    :label="item.dictName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="访客类型" prop="userRole"  label-width='110px'
                :rules="{ required: true, message: '访客类型不能为空', trigger: 'blur'}">
                <el-radio v-model="ruleForm.userRole" :label="0">普通</el-radio>
                <el-radio v-model="ruleForm.userRole" :label="1">VIP</el-radio>
              </el-form-item>
              <el-form-item label="身份证号" prop="identifyNo"  label-width='110px' :rules="setRule('identifyNo','身份证号',false)" >
                <el-input size="small" v-model.trim="ruleForm.identifyNo" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="所属单位" prop="field4" label-width='110px' :rules="setRule('field4','所属单位',false)">
                <el-input size="small" v-model.trim="ruleForm.field4" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="访问开始时间" prop="startTime" label-width='110px'
                :rules="[{ required: true, message: '访问开始时间不能为空', trigger: 'blur'}]">
                <el-date-picker
                 size="small"
                  style="width:305px"
                  v-model="ruleForm.startTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="00:00:00">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="访问结束时间" prop="endTime" label-width='110px'
                :rules="[{ required: true, message: '访问结束时间不能为空', trigger: 'blur'},
                { validator: validateTime, trigger: 'blur' }]">
                <el-date-picker
                  size="small"
                  style="width:305px"
                  v-model="ruleForm.endTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="23:59:59">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="车牌号" prop="field8" label-width='110px'
                :rules="[{ min:2, max:20, message: '车牌号长度为2-20间', trigger: 'blur'}]">
                <el-input size="small" v-model.trim="ruleForm.field8" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="被访人" prop="visitorName" label-width='110px'
                :rules="[{ required: true, message: '被访人不能为空', trigger: 'change'}]">
                <el-input size="small" v-model.trim="ruleForm.visitorName" readonly class="width_305" @focus="openPersonList"></el-input>
              </el-form-item>
              <!-- <el-form-item label="备注" prop="content"  label-width='110px'>
                <el-input size="small" type="textarea" v-model.trim="ruleForm.content" class="width_305" maxlength="100" show-word-limit></el-input>
              </el-form-item> -->
            </el-form>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled">提交</el-button>
        </span>
        <!-- <personList ref="personList" @inputPerson = "inputPerson" /> -->
        <personList ref="personList" @inputPerson="inputPerson" />
      </el-dialog>
    </template>
    <template v-else-if="staffType==='yellow'">
      <el-dialog
        :title="title"
        :visible.sync="visible"
        @close="$emit('update:show', false)"
        :close-on-click-modal=false
        :show="show"
        :before-close="handleClose">
        <div style="height:420px;" class="dialogAndScrollbar">
          <el-scrollbar style="height:100%;">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="照片" prop="field1"
                :rules="{ required: true, message: '图片不能为空', trigger: 'blur'}">
                <!-- <el-upload
                  class="avatar-uploader"
                  ref="upload"
                  :action="upload_url"
                  list-type="picture-card"
                  :name="upload_name"
                  :on-remove="handleRemove"
                  :on-exceed="handleExceed"
                  :file-list="ad_url_list"
                  :limit="2"
                  accept="image/jpg,image/jpeg,image/png"
                  :http-request="uploadSectionFile">
                <span class="font-14">照片上传</span>
                <div slot="tip" class="el-upload__tip">支持JPG\JPEG\PNG，大小5M内<el-link type="primary" @click="showPhotoPop">照片规范</el-link></div>
              </el-upload> -->
             <el-upload
                  class="avatar-uploader"
                  ref="upload1"
                  :action="upload_url"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadSectionFileOne">
                  <img v-if="ruleForm.field1" :src="getImgUrl(ruleForm.field1)" class="avatar">
                  <i v-else class="el-icon-picture-outline avatar-uploader-icon"><p>上传照片</p></i>
                </el-upload>
                <div class="imgUploadTip mgl-20">
                  <p>支持JPG\JPEG\PNG，大小5M内</p>
                  <el-link type="primary" @click="showPhotoPop">照片规范</el-link>
                </div>
              </el-form-item>
              <el-form-item label="姓名" prop="userName"
                :rules="[{ min:2, max:20, message: '姓名长度为2-20间', trigger: 'blur'}]">
                <el-input v-model.trim="ruleForm.userName" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phone" :rules="setRule('phone','手机号',false)">
                <el-input v-model.trim="ruleForm.phone" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="identifyNo" :rules="setRule('identifyNo','身份证号',false)">
                <el-input v-model.trim="ruleForm.identifyNo" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="所属单位" prop="field4" :rules="setRule('field4','所属单位',false)">
                <el-input v-model.trim="ruleForm.field4" class="width_305"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="content">
                <el-input type="textarea" v-model.trim="ruleForm.content" class="width_305" maxlength="100" show-word-limit></el-input>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button size="small" class="editBtn" @click="submitForm('ruleForm')" :disabled="this.subdisabled" >提交</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { getFormData, filterObjNull } from '../../lib/util'
import { imgUpload, getSysDictByParentCode } from '../../axios/api.js'
import personList from './components/personList'
export default {
  name: 'StaffDialog',
  components: {
    personList
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    imgPrefix: {
      type: String,
      default: ''
    },
    orgTreeData: Array,
    staffFields: Array,
    formVal: Object,
    staffType: {
      type: String,
      default: 'staff'
    },
    btnDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      subdisabled: this.btnDisabled,
      props: {
        label: 'orgName',
        children: 'children'
      },
      visible: this.show,
      ruleForm: {
      },
      title: '',
      popvisible: false,
      upload_url: '', // 上传URL
      upload_name: '', // 图片名称
      ad_url: '', // 上传后的图片URL
      ad_url_list: [], // 预览列表
      photoShow: false,
      visitPurpose: [],
      timeout: null,
      validateTime: (rule, value, callback) => {
        const startTime = this.ruleForm.startTime
        const endTime = this.ruleForm.endTime
        if (startTime && endTime && new Date(startTime).getTime() > new Date(endTime).getTime()) {
          callback(new Error('开始时间不能大于结束时间'))
        }
        callback()
      }
    }
  },
  created () {
    if (this.staffType === 'visitor') {
      this.getSysDictByParentCodeData()
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid, object) => {
        if (!valid) {
          if (!(Object.keys(object).length === 1 && object['orgId'] && typeof (this.ruleForm.orgId) === 'number')) {
            return false
          }
        }
        if (this.ruleForm.startTime && this.ruleForm.endTime && (new Date(this.ruleForm.endTime).getTime() - new Date(this.ruleForm.startTime).getTime() < 0)) {
          this.$message.error('错误：开始时间大于结束时间，请重新填写')
          return false
        }
        this.subdisabled = true
        let data = {
          status: false,
          value: this.ruleForm
        }
        data = filterObjNull(data)
        this.$emit('submit', data)
        this.ad_url_list = []
      })
    },
    deleteImg (fileName) {
      this.ruleForm[fileName] = ''
    },
    handleClose (done) {
      this.$refs['ruleForm'].clearValidate()
      this.ad_url_list = []
      this.ruleForm = {}
      this.subdisabled = false
      done()
    },
    setOrg (node) {
      // this.ruleForm.orgId = node.id
      // this.ruleForm.orgName = node.orgName

      this.$set(this.ruleForm, 'orgId', node.id)
      this.$set(this.ruleForm, 'orgName', node.orgName)
      this.popvisible = false
    },
    beforeAvatarUpload (file) {
      let isLt5M = file.size / 1024 / 1024 < 5
      let isIMAGE = ['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) > -1
      if (!isIMAGE) {
        this.$message.error('上传图片格式不对!')
      }
      if (!isLt5M) {
        this.$message({
          message: '上传图片大小不能超过 5MB!',
          type: 'warning'
        })
        self.$refs.upload.uploadFiles = []
      }
      return isIMAGE && isLt5M
    },
    handleRemove (file, fileList) {
      if (file.url === this.imgPrefix + this.ruleForm.field1) {
        this.ruleForm.field1 = ''
      } else {
        this.ruleForm.field2 = ''
      }
    },
    handleExceed () {
      this.$message({
        message: '请先删除选择的图片或视频，再上传',
        type: 'warning'
      })
    },
    uploadSectionFileOne (params) {
      let self = this
      let file = params.file

      self.upload_url = ''
      self.upload_name = 'file_img[]'
      var reqData = getFormData({
        file: file
      })
      imgUpload(reqData).then(res => {
        if (res.data && res.data.success) {
          self.$set(self.ruleForm, 'field1', res.data.value)
        } else {
          this.failMessage('上传失败，请重新上传')
          self.$refs.upload1.uploadFiles = []
        }
      }).catch(() => { // 请求失败返回的数据
        this.failMessage('上传失败，请重新上传')
      })
    },
    showPhotoPop (e) {
      this.photoShow = true
    },
    // 获取来访目的
    getSysDictByParentCodeData () {
      if (this.visitPurpose && this.visitPurpose.length) return
      let data = getFormData({
        parentCode: 'visitPurpose'
      })
      getSysDictByParentCode(data).then(res => {
        if (res.data && res.data.value) {
          this.visitPurpose = res.data.value
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(() => {
        this.failMessage()
      })
    },
    failMessage (txt) {
      txt = txt || '请求失败'
      this.$message({
        message: txt,
        type: 'error'
      })
    },
    getImgUrl (imgUrl) {
      return imgUrl ? (this.imgPrefix + imgUrl) : ''
    },
    handleAvatarSuccess (data, file) {
      this.$set(this.ruleForm, 'field1', data.value)
    },
    setRule (key, name, required) {
      required = required || false
      var ruleObj = []
      if (required) {
        if (key === 'orgId') {
          ruleObj.push({ required: required, message: name + '不能为空', trigger: 'change' })
        } else {
          ruleObj.push({ required: required, message: name + '不能为空', trigger: 'blur' })
        }
      }
      switch (key) {
        case 'email':
          ruleObj.push(
            { max: 30, message: '长度不能超过30个字符', trigger: 'blur' },
            {pattern: /^\w+(\.\w+)*@\w+\.\w+$/, message: '邮箱格式不正确', trigger: 'blur'})
          break

        case 'age':
          ruleObj.push(
            {pattern: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/, message: '年龄输入不合法', trigger: 'blur'})
          break

        case 'phone':
          ruleObj.push(
            {pattern: /1[3-9][0-9]\d{8}/, message: '您的手机号格式不正确', trigger: 'blur'})
          break

        case 'identifyNo':
          ruleObj.push(
            // {pattern: /^[0-9a-zA-Z]{18}$/, message: '身份证号需为18位数字', trigger: 'blur'}
            {pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号填写有误，请填写18位', trigger: 'blur'}
          )
          break

        case 'staffNo':
          ruleObj.push(
            {pattern: /^\w{0,20}$/, message: '工号不能超过20个字符', trigger: 'blur'})
          break

        case 'job':
          ruleObj.push(
            {max: 20, message: '职位不能超过20个字符', trigger: 'blur'})
          break

        case 'field4':
          ruleObj.push(
            {max: 40, message: '所属单位不能超过40个字符', trigger: 'blur'})
          break
      }
      return ruleObj
    },
    openPersonList () {
      this.$refs.personList.showData()
    },
    inputPerson (row) {
      this.ruleForm.visitorName = row.userName
      this.ruleForm.visitorId = row.id
      this.$refs['ruleForm'].validate()
    }

  },
  watch: {
    show () {
      this.visible = this.show
      if (!this.visible) return false
      this.subdisabled = false
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
        if (this.staffType === 'staff') {
          this.$refs['myScrollbar'].wrap.scrollTop = 0
        }
      })
      if (this.type === 'modify') {
        if (this.staffType === 'visitor') {
          this.title = '编辑访客'
        } else if (this.staffType === 'yellow') {
          this.title = '编辑黄名单'
        } else {
          this.title = '编辑员工'
        }
      } else {
        if (this.staffType === 'visitor') {
          this.title = '添加访客'
        } else if (this.staffType === 'yellow') {
          this.title = '添加黄名单'
        } else {
          this.title = '添加员工'
        }
      }
      if ((this.staffType === 'visitor') && this.show) {
        this.getSysDictByParentCodeData()
      }
    },
    formVal () {
      this.ruleForm = JSON.parse(JSON.stringify(this.formVal))
      this.ad_url_list = []
      if (this.formVal.field1) this.ad_url_list.push({url: this.imgPrefix + this.formVal.field1})
      if (this.formVal.field2) this.ad_url_list.push({url: this.imgPrefix + this.formVal.field2})
    },
    btnDisabled (newValue) {
      if (this.show) {
        this.subdisabled = newValue
      }
    }
  }
}
</script>

<style scoped>
  .el-radio{margin-right:15px}
  .avatar-uploader{
    border: 1px solid #EBEEF5 ;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
    width:112px;
    height: 112px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #5cb6ff;
    width: 112px;
    margin-top:36px;
    text-align: center;
  }
  .el-icon-picture-outline p{
    color:#C0C4CC;
    font-size:12px
  }
  .avatarWrap{
    position: relative;
  }
  .avatarWrap .deleteImg{
    display: none;
    position: absolute;
    width: 20px;
    height: 20px;
    background: url('../../assets/images/delete.png') no-repeat;
    background-size: 100% 100%;
    right:4px;
    top: 5px;
  }
  .avatarWrap:hover .deleteImg{
    display: block;
  }
  .avatar {
    width: 112px;
    height: 112px;
    display: block;
  }
  .imgUploadTip{display:inline-block;vertical-align: top;line-height: 30px;margin-top:10px;}
  .imgUploadTip p{margin:0;color:#909399 }
  /* .width_305{
    width:305px;
  } */
</style>
