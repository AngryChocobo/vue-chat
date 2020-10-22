import {Toast} from 'vant'
import {JSEncrypt} from 'jsencrypt'
import router from '@/router/index.js'
import {
  UPDATE_LOGGEDINUSER,
  CLEAR_TOKEN,
  UPDATE_LOGGEDINUSER_NICKNAME,
  UPDATE_LOGGEDINUSER_AVATAR,
  UPDATE_TOKEN,
} from '@store/types/mutation-types.js'
import {
  CONNECT_SOCKET_IO,
  GET_USER_FRIEND_LIST,
  LOGIN,
  REGISTER,
  CONFIRM_NICK_NAME,
  CONFIRM_AVATAR,
  GET_LOGGEDINUSER_INFO,
  GUEST_LOGIN,
} from '@store/types/action-types.js'
import {
  register,
  login,
  guestLogin,
  getLoggedInUserInfo,
  confirmNickName,
  confirmAvatar,
} from '@/api/user'
const encrypt = new JSEncrypt()
encrypt.setPublicKey(process.env.VUE_APP_RSA_PUBLIC_KEY)
export default {
  state: {
    loggedInUser: {},
    token: window.localStorage.getItem('token'),
  },
  mutations: {
    [CLEAR_TOKEN](state) {
      state.token = null
      window.localStorage.setItem('token', '')
      router.replace('/login')
    },
    [UPDATE_TOKEN](state, token) {
      state.token = token
      window.localStorage.setItem('token', token)
    },
    [UPDATE_LOGGEDINUSER](state, loggedInUser) {
      state.loggedInUser = loggedInUser
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
      const encryptedPassword = encrypt.encrypt(password) // RSA算法对密码进行加密
      login({username, password: encryptedPassword}).then(res => {
        Toast('登陆成功！')
        context.commit(UPDATE_LOGGEDINUSER, res.loggedInUser)
        context.commit(UPDATE_TOKEN, res.token)
        context.dispatch(CONNECT_SOCKET_IO)
        context.dispatch(GET_USER_FRIEND_LIST)
        router.push('/talk-list')
      })
    },
    [REGISTER](context, payload) {
      const {username, password} = payload
      const encryptedPassword = encrypt.encrypt(password) // RSA算法对密码进行加密
      register({username, password: encryptedPassword}).then(() => {
        router.push('/login')
      })
    },
    [GUEST_LOGIN](context) {
      console.log('游客登录', context)
      // 请求接口 获取临时token
      guestLogin().then(res => {
        console.log('游客获取到了token', res)
      })
    },
    async [GET_LOGGEDINUSER_INFO](context) {
      const res = await getLoggedInUserInfo()
      context.commit(UPDATE_LOGGEDINUSER, res)
    },
    [CONFIRM_NICK_NAME](context, {nickname}) {
      confirmNickName({nickname}).then(res => {
        Toast('修改昵称成功！')
        console.log('修改昵称成功！', res)
        context.commit(UPDATE_LOGGEDINUSER_NICKNAME, res.nickname)
      })
    },
    [CONFIRM_AVATAR](context, {avatar}) {
      confirmAvatar({avatar}).then(res => {
        Toast('修改头像成功！')
        console.log('修改头像成功！')
        context.commit(UPDATE_LOGGEDINUSER_AVATAR, res.avatar)
      })
    },
  },
}
