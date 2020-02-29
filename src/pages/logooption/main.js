/* eslint-disable no-redeclare */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import Logooption from './logooption'
import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../../assets/css/common.css'
import globalConst from '../../lib/constant.js'

Vue.use(ELEMENT)
Vue.config.productionTip = false
Vue.prototype.$globalConst = globalConst

// eslint-disable-next-line no-new
new Vue({
  el: '#logooption',
  render: h => h(Logooption)
})
