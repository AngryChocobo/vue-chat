import Vue from 'vue'
import Vuex from 'vuex'
import {Toast} from 'vant'
import router from '../router/index'
import io from 'socket.io-client'
import {
  getMessageList,
  getTalkList,
  SOCKETIO_PATH,
  register,
  login,
} from '@const/api'
import axios from './axios.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    socket: null,
    loggedInUser: JSON.parse(window.localStorage.getItem('loggedInUser')),
    token: window.localStorage.getItem('token'),
    talkList: [],
    friendRequestList: [],
    messageList: [], // 当前会话页的消息记录
    sendingMessage: null, // 当前会话页的正在发送中的消息
  },
  mutations: {
    increment(state) {
      state.count++
    },
    makeFriendRequest(state, payload) {
      store.dispatch('makeFriendRequest', payload)
    },
    cleanToken(state) {
      state.token = null
      router.replace('/login')
    },
    login(state, payload) {
      store.dispatch('login', payload)
    },
    updateLoggedInUser(state, payload) {
      state.loggedInUser = payload.user
      state.token = payload.token
      router.replace('/talk-list')
      window.localStorage.setItem('token', payload.token)
      window.localStorage.setItem('loggedInUser', JSON.stringify(payload.user))
    },
    register(state, payload) {
      store.dispatch('register', payload)
    },
    sendMessageSuccess(state, payload) {
      state.messageList.push(payload)
    },
    updateMessageList(state, payload) {
      state.messageList = payload
    },
    getMessageList(state, payload) {
      // loadding
      store.dispatch('getMessageList', payload)
    },
    sendMessage(state, payload) {
      store.dispatch('sendMessage', payload)
    },
    setSocket(state, payload) {
      state.socket = payload.socket
    },
    receiveMessage(state, payload) {
      // alert('receiveMessage: ' + payload.message)
      state.messageList.push(payload)
    },
    getTalkList(state, payload) {
      store.dispatch('getTalkList', payload)
    },
    updateTalkList(state, payload) {
      state.talkList = payload
    },
    getFriendRequestList() {
      store.dispatch('getFriendRequestList')
    },
    updateFriendRequestList(state, payload) {
      state.friendRequestList = payload
    },
  },
  actions: {
    setTimeOutCountIncrement(context) {
      setTimeout(() => {
        context.commit('increment')
      }, 5000)
    },
    getFriendRequestList(context) {
      context.state.socket.emit('getFriendRequestList')
    },
    makeFriendRequest(context, payload) {
      context.state.socket.emit('makeFriendRequest', payload)
    },
    login(context, payload) {
      const {username, password} = payload
      axios.post(login, {username, password}).then(res => {
        Toast('登陆成功！')
        context.commit('updateLoggedInUser', res.data)
      })
    },
    register(context, payload) {
      const {username, password} = payload
      axios.post(register, {username, password}).then(res => {
        router.replace('/login')
      })
    },
    getTalkList(context) {
      axios.get(getTalkList).then(res => {
        context.commit('updateTalkList', res.data)
      })
    },
    getMessageList(context, payload) {
      const {loggedInUser} = context.state
      axios.get(getMessageList(loggedInUser.id, payload.toUserId)).then(res => {
        context.commit('updateMessageList', res.data)
      })
    },
    connectSocketIO(context) {
      const {loggedInUser} = context.state
      if (!loggedInUser) {
        return
      }
      const socket = io.connect(SOCKETIO_PATH)
      context.commit('setSocket', {socket})
      socket.on('receiveMessage', data => {
        console.log('收到了新消息', JSON.stringify(data))
        context.commit('receiveMessage', data)
      })
      socket.emit('connectSocketIO', loggedInUser.id)

      socket.on('sendMessageSuccess', data => {
        context.commit('sendMessageSuccess', {
          id: data.id,
          fromUserId: loggedInUser.id,
          src: loggedInUser.src,
          username: loggedInUser.username,
          message: context.state.sendingMessage,
          sendDate: data.sendDate,
        })
      })
      socket.on('makeFriendRequestResult', data => {
        Toast(data)
        // todo 思考更好的处理办法
        router.back()
      })
      socket.on('getFriendRequestResult', data => {
        context.commit('updateFriendRequestList', data)
      })
      socket.on('updateTalkList', () => {
        alert('我收到了新消息，该重新获取对话列表了')
      })
    },
    sendMessage(context, payload) {
      context.state.sendingMessage = payload.message
      context.state.socket.emit('sendMessage', {
        toUserId: payload.toUserId,
        message: payload.message,
      })
    },
  },
})

// 链接socket.io
store.dispatch('connectSocketIO')

export default store
