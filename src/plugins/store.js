import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import {getMessageList} from '@const/api'
import axios from '../plugins/http.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    socket: null,
    loggedInUser: null,
    talkList: [],
    messageList: [], // 当前会话页的消息记录
    sendingMessage: null, // 当前会话页的正在发送中的消息
  },
  mutations: {
    increment(state) {
      state.count++
    },
    login(state, payload) {
      state.loggedInUser = payload
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
  },
  actions: {
    setTimeOutCountIncrement(context) {
      setTimeout(() => {
        context.commit('increment')
      }, 5000)
    },
    login(context) {
      context.commit('login', {
        id: 1,
        username: '高明震',
        src: 'head-1.jpg',
      })
      // 链接socket.io
      context.dispatch('connectSocketIO')
    },
    getMessageList(context, payload) {
      const {loggedInUser} = context.state
      axios.get(getMessageList(loggedInUser.id, payload.toUserId)).then(res => {
        context.commit('updateMessageList', res.data)
      })
    },
    connectSocketIO(context) {
      const {loggedInUser} = context.state
      const socket = io.connect('http://localhost:8888')
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
