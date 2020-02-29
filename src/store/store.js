import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 初始化全局的一个变量
    userName: '',
    pageTitle: '',
    sessionId: '',
    chartFlag: '',
    staffDownloading: false,
    visitorDownloading: false,
    recordDownloading: false,
    attendReportloading: false,
    attendDownloading: false,
    attendDetailloading: false,
    appointloading: false
  },
  mutations: {
    modifyTips (state, userName) {
      state.userName = userName
    },
    modifyTitle (state, pageTitle) {
      state.pageTitle = pageTitle
    },
    modifySessionId (state, sessionId) {
      state.sessionId = sessionId
    },
    setChartFlag (state, chartFlag) {
      state.chartFlag = new Date().getTime()
    },
    staffDownloadingShow (state, staffDownloading) {
      state.staffDownloading = true
    },
    staffDownloadingHide (state, staffDownloading) {
      state.staffDownloading = false
    },
    visitorDownloadingShow (state, visitorDownloading) {
      state.visitorDownloading = true
    },
    visitorDownloadingHide (state, visitorDownloading) {
      state.visitorDownloading = false
    },
    recordDownloadingShow (state, recordDownloading) {
      state.recordDownloading = true
    },
    recordDownloadingHide (state, recordDownloading) {
      state.recordDownloading = false
    },
    attendReportloadingShow (state, attendReportloading) {
      state.attendReportloading = true
    },
    attendReportloadingHide (state, attendReportloading) {
      state.attendReportloading = false
    },
    attendDownloadingShow (state, attendDownloading) {
      state.attendDownloading = true
    },
    attendDownloadingHide (state, attendDownloading) {
      state.attendDownloading = false
    },
    attendDetailloadingShow (state, attendDetailloading) {
      state.attendDetailloading = true
    },
    attendDetailloadingHide (state, attendDetailloading) {
      state.attendDetailloading = false
    },
    appointloadingShow (state, appointloading) {
      state.appointloading = true
    },
    appointloadingHide (state, appointloading) {
      state.appointloading = false
    }
  }
})
export default store
