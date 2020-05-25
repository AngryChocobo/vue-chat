import {Toast} from 'vant'
import axios from '@/plugins/axios.js'
import router from '@/router/index.js'
import {
  UPDATE_LOGGEDINUSER,
  CLEAR_TOKEN,
  UPDATE_LOGGEDINUSER_NICKNAME,
  UPDATE_LOGGEDINUSER_AVATAR,
} from '@store/types/mutation-types.js'
import {
  CONNECT_SOCKET_IO,
  GET_USER_FRIEND_LIST,
  LOGIN,
  REGISTER,
  CONFIRM_NICK_NAME,
  CONFIRM_AVATAR,
} from '@store/types/action-types.js'
import {register, login, confirmNickName, confirmAvatar} from '@const/api'

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
      state.loggedInUser = payload.loggedInUser
      state.token = payload.token
      router.push('/talk-list')
      window.localStorage.setItem('token', payload.token)
      window.localStorage.setItem(
        'loggedInUser',
        JSON.stringify(payload.loggedInUser),
      )
    },
    [UPDATE_LOGGEDINUSER_NICKNAME](state, nickname) {
      state.loggedInUser.nickname = nickname
    },
    [UPDATE_LOGGEDINUSER_AVATAR](state, avatar) {
      state.loggedInUser.avatar = avatar
    },
  },
  actions: {
    [LOGIN](context, payload) {
      const {username, password} = payload
      axios.post(login, {username, password}).then(res => {
        Toast('登陆成功！')
        context.commit(UPDATE_LOGGEDINUSER, res.data)
        context.dispatch(CONNECT_SOCKET_IO)
        context.dispatch(GET_USER_FRIEND_LIST)
      })
    },
    [REGISTER](context, payload) {
      const {username, password} = payload
      axios.post(register, {username, password}).then(() => {
        router.push('/login')
      })
    },
    [CONFIRM_NICK_NAME](context, {nickname}) {
      axios.post(confirmNickName, {nickname}).then(res => {
        Toast('修改昵称成功！')
        console.log('修改昵称成功！', res)
        context.commit(UPDATE_LOGGEDINUSER_NICKNAME, res.data.nickname)
      })
    },
    [CONFIRM_AVATAR](context, {avatar}) {
      axios.post(confirmAvatar, {avatar}).then(res => {
        Toast('修改头像成功！')
        console.log('修改头像成功！')
        context.commit(UPDATE_LOGGEDINUSER_AVATAR, res.data.avatar)
      })
    },
  },
}
