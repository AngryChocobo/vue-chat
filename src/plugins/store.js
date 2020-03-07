import Vue from 'vue'
import Vuex from 'vuex'
import {Toast} from 'vant'
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
    loggedInUser: null,
    token: window.localStorage.getItem('token'),
    talkList: [],
    messageList: [], // 当前会话页的消息记录
    sendingMessage: null, // 当前会话页的正在发送中的消息
  },
  mutations: {
    increment(state) {
      state.count++
    },
    login(state, payload) {
      store.dispatch('login', payload)
    },
    updateLoggedInUser(state, payload) {
      state.loggedInUser = payload.user
      state.token = payload.token
      window.localStorage.setItem('token', payload.token)
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
      state.messageList.push(payload)
    },
    getTalkList(state, payload) {
      store.dispatch('getTalkList', payload)
    },
    updateTalkList(state, payload) {
      state.talkList = payload
    },
  },
  actions: {
    setTimeOutCountIncrement(context) {
      setTimeout(() => {
        context.commit('increment')
      }, 5000)
    },
    login(context, payload) {
      const {username, password} = payload
      const {$router} = payload
      axios.post(login, {username, password}).then(res => {
        Toast('登陆成功！')
        context.commit('updateLoggedInUser', res.data)
        // 链接socket.io
        context.dispatch('connectSocketIO')
        $router.replace('/talk-list')
      })
    },
    register(context, payload) {
      const {username, password} = payload
      const {$router} = payload
      axios.post(register, {username, password}).then(res => {
        $router.replace('/login')
      })
    },
    getTalkList(context) {
      const {loggedInUser} = context.state
      axios.get(getTalkList(loggedInUser.id)).then(res => {
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
    },
    sendMessage(context, payload) {
      context.state.sendingMessage = payload.message
      context.state.socket.emit('sendMessage', {
        fromUserId: context.state.loggedInUser.id,
        toUserId: payload.toUserId,
        message: payload.message,
      })
    },
  },
})

export default store
