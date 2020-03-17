import {Toast} from 'vant'
import axios from '@/plugins/axios.js'
import router from '@/router/index.js'
import {UPDATE_LOGGEDINUSER, CLEAR_TOKEN} from '@store/types/mutation-types.js'
import {CONNECT_SOCKET_IO, LOGIN} from '@store/types/action-types.js'

import {register, login} from '@const/api'
export default {
  state: {
    loggedInUser: JSON.parse(window.localStorage.getItem('loggedInUser')),
    token: window.localStorage.getItem('token'),
  },
  mutations: {
    [CLEAR_TOKEN](state) {
      state.token = null
      router.replace('/login')
    },
    [UPDATE_LOGGEDINUSER](state, payload) {
      state.loggedInUser = payload.user
      state.token = payload.token
      router.replace('/talk-list')
      window.localStorage.setItem('token', payload.token)
      window.localStorage.setItem('loggedInUser', JSON.stringify(payload.user))
    },
  },
  actions: {
    [LOGIN](context, payload) {
      const {username, password} = payload
      axios.post(login, {username, password}).then(res => {
        Toast('登陆成功！')
        context.commit(UPDATE_LOGGEDINUSER, res.data)
        context.dispatch(CONNECT_SOCKET_IO)
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
