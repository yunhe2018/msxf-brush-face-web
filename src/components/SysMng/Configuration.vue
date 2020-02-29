<template>
  <div style="height: 100%" class="config">
    <div class="listBot mgt-10">
      <template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="识别参数配置" name="firstTab">
            <!-- <div class="headerUser">识别参数配置</div> -->
            <el-form
              :model="formInline"
              :rules="rules"
              ref="formInline"
              label-width="150px"
              class="demo-ruleForm"
            >
              <el-form-item label="识别阈值" prop="algorithmDegree">
                <el-input v-model="formInline.algorithmDegree" class="width_197" size="small">
                  <template slot="prepend">大于</template>
                </el-input>
              </el-form-item>
              <el-form-item label="陌生人阈值" prop="strangerAlgorithmDegree">
                <el-input
                  v-model="formInline.strangerAlgorithmDegree"
                  class="width_197"
                  size="small"
                >
                  <template slot="prepend">小于</template>
                </el-input>
              </el-form-item>
              <el-form-item label>
                <el-button
                  size="small"
                  type="primary"
                  class="saveBtn"
                  :disabled="btnDisabled"
                  @click="saveAlgorithmDegree('formInline')"
                >保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="图片质量参数配置" name="secondTab">
            <!-- <div class="headerUser">图片质量参数配置</div> -->
            <el-form :inline="true" :model="form2" :rules="rules2" ref="form2" label-width="170px" class="el-form-small-space">
              <el-form-item label=" ">
                <div class="td-cell">
                  <span class="bold">人脸注册</span>
                </div>
              </el-form-item>
              <el-form-item class="nolabel">
                <div class="td-cell">
                  <span class="bold">人脸识别</span>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="人脸区域灰度均值下限" prop="registe.averageMin">
                <div class="td-cell">
                    <el-input v-model="form2.registe.averageMin" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.averageMin" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.averageMin" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="人脸区域灰度均值上限" prop="registe.averageMax">
                <div class="td-cell">
                  <el-input v-model="form2.registe.averageMax" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.averageMax" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.averageMax" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="反光度" prop="registe.highLight">
                <div class="td-cell">
                  <el-input v-model="form2.registe.highLight" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.highLight" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.highLight" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="人脸完整度" prop="registe.intergrity">
                <div class="td-cell">
                  <el-input v-model="form2.registe.intergrity" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.intergrity" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.intergrity" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="长边/宽边分辨率最小值" prop="registe.minResolution">
                <div class="td-cell">
                  <el-input v-model="form2.registe.minResolution" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.minResolution" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.minResolution" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="俯仰角" prop="registe.pitch">
                <div class="td-cell">
                  <el-input v-model="form2.registe.pitch" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.pitch" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.pitch" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="滚转角" prop="registe.roll">
                <div class="td-cell">
                  <el-input v-model="form2.registe.roll" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.roll" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.roll" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="偏航角" prop="registe.yaw">
                <div class="td-cell">
                  <el-input v-model="form2.registe.yaw" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.yaw" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.yaw" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label="模糊度" prop="registe.defocus">
                <div class="td-cell">
                  <el-input v-model="form2.registe.defocus" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <el-form-item prop="search.defocus" class="nolabel">
                <div class="td-cell">
                  <el-input v-model="form2.search.defocus" class="width_197" size="small"></el-input>
                </div>
              </el-form-item>
              <br />
              <el-form-item label=" ">
                <el-button
                  size="small"
                  type="primary"
                  class="saveBtn"
                  @click="addPicQualityEvent('form2')"
                >保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
import {
  sysAlgorithmDetail,
  addSysAlgorithm,
  getPicQuality,
  addPicQuality
} from '../../axios/api.js'
export default {
  name: 'Configuration',
  data () {
    var newReg1 = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('识别阈值必须为数字'))
      }
      if (
        value.toString().indexOf('.') !== -1 &&
        value.toString().substring(value.toString().indexOf('.')).length > 3
      ) {
        callback(new Error('识别阈值必须小数点后为两位'))
      }
      if (value > 1 || value < 0) {
        callback(new Error('识别阈值不能大于1小于0'))
      } else {
        callback()
      }
    }
    var newReg2 = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('陌生人阈值必须为数字'))
      }
      if (
        value.toString().indexOf('.') !== -1 &&
        value.toString().substring(value.toString().indexOf('.')).length > 3
      ) {
        callback(new Error('陌生人阈值必须小数点后为两位'))
      }
      if (value > 1 || value < 0) {
        callback(new Error('陌生人阈值不能小于0大于1'))
      } else {
        callback()
      }
    }
    return {
      btnDisabled: false,
      formInline: {
        algorithmDegree: 0.8,
        strangerAlgorithmDegree: 0.75
      },
      rules: {
        algorithmDegree: [
          { required: true, message: '请输入识别阈值', trigger: 'blur' },
          { validator: newReg1, trigger: 'blur' }
        ],
        strangerAlgorithmDegree: [
          { required: true, message: '请输入陌生人阈值', trigger: 'blur' },
          { validator: newReg2, trigger: 'blur' }
        ]
      },
      activeName: 'firstTab',
      form2: {registe: {}, search: {}},
      rules2: {
        'registe.averageMin': [
          { required: true, message: '请输入人脸区域灰度均值下线', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'registe.averageMax': [
          { required: true, message: '请输入人脸区域灰度均值上限', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'registe.highLight': [
          { required: true, message: '请输入反光度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'registe.intergrity': [
          { required: true, message: '请输入人脸完整度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'registe.minResolution': [
          { required: true, message: '分辨率最小值', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'registe.pitch': [
          { required: true, message: '请输入俯仰角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'registe.roll': [
          { required: true, message: '请输入滚转角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'registe.yaw': [
          { required: true, message: '请输入偏航角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'registe.defocus': [
          { required: true, message: '请输入模糊度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.averageMin': [
          { required: true, message: '请输入人脸区域灰度均值下线', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.averageMax': [
          { required: true, message: '请输入人脸区域灰度均值上限', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.highLight': [
          { required: true, message: '请输入反光度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.intergrity': [
          { required: true, message: '请输入人脸完整度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.minResolution': [
          { required: true, message: '分辨率最小值', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.pitch': [
          { required: true, message: '请输入俯仰角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.roll': [
          { required: true, message: '请输入滚转角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.yaw': [
          { required: true, message: '请输入偏航角', trigger: 'blur' },
          { pattern: /^-?\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ],
        'search.defocus': [
          { required: true, message: '请输入模糊度', trigger: 'blur' },
          { pattern: /^\d*\.?\d*$/, message: '值须为数值', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getSysAlgorithm()
    this.getPicQualityData()
  },
  methods: {
    getSysAlgorithm () {
      sysAlgorithmDetail()
        .then(res => {
          if (res.data.success) {
            this.formInline = res.data.value || {}
          } else {
            this.failMessage(res && res.data && res.data.message)
          }
        })
        .catch(res => {
          this.failMessage(res && res.data && res.data.message)
        })
    },
    saveAlgorithmDegree (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.btnDisabled = true
        let data = {
          algorithmDegree: this.formInline.algorithmDegree,
          strangerAlgorithmDegree: this.formInline.strangerAlgorithmDegree
        }
        addSysAlgorithm(data)
          .then(res => {
            this.allMessage(res.data)
            this.btnDisabled = false
          })
          .catch(res => {
            this.failMessage(res && res.data && res.data.message)
            this.btnDisabled = false
          })
      })
    },
    getPicQualityData () {
      getPicQuality().then(res => {
        if (res.data.success) {
          if (res.data.value && res.data.value.registe) {
            this.form2 = res.data.value
          }
        } else {
          this.failMessage(res.data.message)
        }
      }).catch(res => {
        this.failMessage(res && res.data && res.data.message)
      })
    },
    addPicQualityEvent (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.btnDisabled = true
        addPicQuality(this.form2).then(res => {
          this.allMessage(res.data)
          this.btnDisabled = false
        }).catch(res => {
          this.failMessage(res && res.data && res.data.message)
          this.btnDisabled = false
        })
      })
    },
    allMessage (e) {
      if (e.success === true) {
        this.$message({
          message: e.message,
          type: 'success'
        })
      } else {
        this.$message({
          message: e.message,
          type: 'error'
        })
      }
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
.headerUser {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 16px;
  font-weight: bold;
  padding: 20px 0;
}
.saveBtn {
  /* margin-top: 24px; */
  background: #4c7ee9;
  border-radius: 4px;
  color: #fff;
}
.config /deep/ .el-input-group--prepend .el-input__inner,
.el-input-group__append {
  text-align: right;
}

.td-cell {
  display: inline-block;
  width: 200px;
  padding-right: 20px;
}
.td-cell .bold {
  font-weight: bold;
}
</style>
