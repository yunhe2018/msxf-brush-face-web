import axios from 'axios'
import consts from '../lib/dataServiceConstant.js'
axios.defaults.withCredentials = false
axios.defaults.baseURL = consts.apiPrefix

function axioInterceptor (instance) {
  // http request 拦截器
  instance.interceptors.request.use(
    config => {
      return config
    },
    err => {
      // hideLoading()
      return Promise.reject(err)
    }
  )
  // http response 拦截器
  instance.interceptors.response.use(
    response => {
      return response
    },
    error => {
      // hideLoading()
      console.log(error)
      // if (error.response) {

      // }
      return Promise.reject(error)
    }
  )
}
export const service = axios.create({
  timeout: 5000
})
export const downloadService = axios.create()
axioInterceptor(downloadService)
axioInterceptor(service)
