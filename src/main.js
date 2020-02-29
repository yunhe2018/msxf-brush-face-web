import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.css'
import store from './store/store.js'
import moment from 'moment'
import globalConst from './lib/constant.js'
import {findItem} from './lib/util.js'
// 全局引入
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.prototype.$moment = moment
Vue.use(ELEMENT)
Vue.config.productionTip = false
Vue.prototype.$globalConst = globalConst

router.beforeEach((to, from, next) => {
  let menuData = sessionStorage.getItem('menus')
  if (menuData && menuData !== 'null' && menuData !== 'undefined') {
    menuData = JSON.parse(menuData)
    if (typeof menuData === 'string') {
      menuData = JSON.parse(menuData)
    }
    let curMenu = findItem(menuData, 'subList', 'menuUrl', to.path)
    if (curMenu) {
      sessionStorage.setItem('menuName', curMenu.menuName)
    }
  }

  if (!store.state.sessionId) {
    store.commit('modifySessionId', sessionStorage.getItem('sessionId'))
  }
  if (to.meta.isLogin) {
    // 判断该路由是否需要登录权限
    if (sessionStorage.getItem('sessionId')) {
      next()
    } else {
      next({
        path: '/login',
        // 将跳转的路由path作为参数，登录成功后跳转到该路由
        query: { redirect: router.currentRoute.path }
      })
    }
  } else {
    if (to.matched.length === 0) {
      next('/error')
    } else {
      next()
    }
  }
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
