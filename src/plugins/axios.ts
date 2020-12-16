import {Toast} from 'vant'
import axios from 'axios'
import store from '../store/store'
import {CLEAR_TOKEN} from '@/store/types/mutation-types'

const env = process.env.NODE_ENV
// create an axios instance
const service = axios.create({
  baseURL:
    env === 'development'
      ? 'http://localhost:3000'
      : 'http://123.206.116.160:3000', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})
service.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config
})

service.interceptors.response.use(
  response => {
    return response.data || {}
  },
  error => {
    if (!error.response) {
      // Toast('服务器不想服务了', JSON.stringify(error))
      Toast('服务器不想服务了')
    } else {
      switch (error.response.status) {
        case 401: // token失效
          Toast(error.response.data)
          store.commit(CLEAR_TOKEN)
          break
        case 422: // 用户不存在、密码错误
          Toast(error.response.data)
          break
        default:
          Toast(error.response.data)
      }
    }

    return Promise.reject(error)
  },
)

// Vue.prototype.$axios = service

export default service
