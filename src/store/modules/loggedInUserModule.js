import {Toast} from 'vant'
import axios from '@/plugins/axios.js'
import router from '@/router/index'

import {register, login} from '@const/api'
export default {
  state: {
    loggedInUser: JSON.parse(window.localStorage.getItem('loggedInUser')),
    token: window.localStorage.getItem('token'),
  },
  mutations: {
    cleanToken(state) {
      state.token = null
      router.replace('/login')
    },
    updateLoggedInUser(state, payload) {
      state.loggedInUser = payload.user
      state.token = payload.token
      router.replace('/talk-list')
      window.localStorage.setItem('token', payload.token)
      window.localStorage.setItem('loggedInUser', JSON.stringify(payload.user))
    },
  },
  actions: {
    login(context, payload) {
      const {username, password} = payload
      axios.post(login, {username, password}).then(res => {
        Toast('登陆成功！')
        context.commit('updateLoggedInUser', res.data)
      })
    },
    register(context, payload) {
      const {username, password} = payload
      axios.post(register, {username, password}).then(() => {
        router.replace('/login')
      })
    },
  },
}
