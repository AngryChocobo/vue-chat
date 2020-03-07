import Vue from 'vue'
import axios from 'axios'
import store from './store.js'
import {Toast} from 'vant'

axios.interceptors.request.use(config => {
  const token = store.state.token
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    switch (error.response.status) {
      case 401: // token失效
        Toast(error.response.data)
        store.commit('cleanToken')
        break
      case 422: // 用户不存在、密码错误
        Toast(error.response.data)
        break
      default:
        Toast('default error')
    }
    return Promise.reject(error)
  },
)

Vue.prototype.$axios = axios

export default axios
