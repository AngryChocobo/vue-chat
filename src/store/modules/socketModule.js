import router from '@/router/index'
import io from 'socket.io-client'
import {SOCKETIO_PATH} from '@const/api.js'

export default {
  state: {
    socket: null,
  },
  mutations: {
    setSocket(state, payload) {
      state.socket = payload
    },
  },
  actions: {
    connectSocketIO(context) {
      const {loggedInUser} = context.rootState.loggedInUserModule
      if (!loggedInUser) {
        return
      }
      const socket = io.connect(SOCKETIO_PATH)
      socket.emit('connectSocketIO', loggedInUser.id)
      context.commit('setSocket', socket)
      socket.on('receiveMessage', data => {
        console.log('收到了新消息', JSON.stringify(data))
        context.commit('receiveMessage', data)
      })
      socket.emit('getTalkList')
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
      socket.on('updateTalkList', data => {
        console.log('updateTalkList', data)
        context.commit('updateTalkList', data)
      })
    },
    sendMessage(context, payload) {
      context.state.sendingMessage = payload.message
      context.state.socket.emit('sendMessage', payload)
    },
  },
}
