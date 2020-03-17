import {Toast} from 'vant'
import router from '@/router/index'
import io from 'socket.io-client'
import {SOCKETIO_PATH} from '@const/api.js'
import {
  UPDATE_TALK_LIST,
  SEND_MESSAGE_SUCCESS,
  UPDATE_FRIEND_REQUEST_LIST,
  SET_SOCKET,
  RECEIVE_MESSAGE,
} from '@store/types/mutation-types.js'

import {
  CONNECT_SOCKET_IO,
  CLEAR_UNREAD_FRIEND_REQUEST,
} from '@store/types/action-types.js'

export default {
  state: {
    socket: null,
    friendRequestList: [],
  },
  getters: {
    friendRequestUnReadCount(state) {
      return state.friendRequestList.filter(v => v.read === 0).length
    },
  },
  mutations: {
    [SET_SOCKET](state, payload) {
      state.socket = payload
    },
    [UPDATE_FRIEND_REQUEST_LIST](state, payload) {
      state.friendRequestList = payload
    },
  },
  actions: {
    [CONNECT_SOCKET_IO](context) {
      const {loggedInUser} = context.rootState.loggedInUserModule
      if (!loggedInUser) {
        console.log('没登录，拒接连接socket')
        return
      }
      const socket = io.connect(SOCKETIO_PATH, {reconnectionAttempts: 10})
      socket.emit('connectSocketIO', loggedInUser.id)
      context.commit(SET_SOCKET, socket)
      socket.emit('getTalkList')
      socket.emit('getFriendRequestList')
      socket.on('receiveMessage', data => {
        console.log('收到了新消息', JSON.stringify(data))
        context.commit(RECEIVE_MESSAGE, data, {root: true})
      })
      socket.on('sendMessageSuccess', data => {
        context.commit(SEND_MESSAGE_SUCCESS, {
          id: data.id,
          fromUserId: loggedInUser.id,
          src: loggedInUser.src,
          username: loggedInUser.username,
          message: context.state.sendingMessage,
          targetId: data.targetId,
          sendDate: data.sendDate,
        })
      })
      socket.on('makeFriendRequestResult', data => {
        Toast(data)
        // todo 思考更好的处理办法
        router.back()
      })
      socket.on('getFriendRequestResult', data => {
        context.commit(UPDATE_FRIEND_REQUEST_LIST, data)
      })
      socket.on('updateTalkList', data => {
        console.log('updateTalkList', data, UPDATE_TALK_LIST)
        context.commit(UPDATE_TALK_LIST, data)
      })
    },
    getTalkList(context) {
      context.state.socket.emit('getTalkList')
    },
    sendMessage(context, payload) {
      context.state.sendingMessage = payload.message
      context.state.socket.emit('sendMessage', payload)
    },
    makeFriendRequest(context, payload) {
      context.state.socket.emit('makeFriendRequest', payload)
    },
    getFriendRequestList(context) {
      context.state.socket.emit('getFriendRequestList')
    },
    clearUnReadMessages(context, payload) {
      context.state.socket.emit('clearUnReadMessages', payload.targetId)
    },
    [CLEAR_UNREAD_FRIEND_REQUEST](context) {
      context.state.socket.emit('clearUnReadFriendRequest')
    },
  },
}
