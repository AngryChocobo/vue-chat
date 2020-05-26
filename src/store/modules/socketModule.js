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
  RECONNECT_ATTEMPT,
  RECONNECT_FAILED,
  UPDATE_USER_FRIEND_LIST,
  RESET_RECONNECT_OVERLAY,
} from '@store/types/mutation-types.js'

import {
  CONNECT_SOCKET_IO,
  CLEAR_UN_READ_FRIEND_REQUEST,
  GET_TALK_LIST,
  GET_FRIEND_REQUEST_LIST,
  MAKE_FRIEND_REQUEST,
  SEND_MESSAGE,
  CLEAR_UN_READ_MESSAGES,
  RECEIVE_FRIEND_REQUEST,
  AGREE_MAKE_FRIEND_REQUEST,
  GET_USER_FRIEND_LIST,
} from '@store/types/action-types.js'

export default {
  state: {
    socket: null,
    reconnectAttempt: 0, // socket尝试重连次数
    reconnectFailed: false, // socket尝试重连失败
    friendRequestList: [],
    friendList: [],
  },

  mutations: {
    [SET_SOCKET](state, payload) {
      state.socket = payload
    },
    [UPDATE_FRIEND_REQUEST_LIST](state, payload) {
      console.log('用户的好友请求列表： ', payload)
      state.friendRequestList = payload
    },
    [UPDATE_USER_FRIEND_LIST](state, payload) {
      console.log('用户的好友列表： ', payload)
      state.friendList = payload
    },
    [RECONNECT_ATTEMPT](state, payload) {
      console.log('重联次数: ', payload)
      state.reconnectAttempt = payload
    },
    [RECONNECT_FAILED](state) {
      state.reconnectAttempt = null
      state.reconnectFailed = true
    },
    [RESET_RECONNECT_OVERLAY](state) {
      state.reconnectAttempt = 0
      state.reconnectFailed = false
    },
  },
  actions: {
    [CONNECT_SOCKET_IO](context) {
      const {loggedInUser} = context.getters
      if (!loggedInUser.id) {
        console.log('没登录，拒接连接socket')
        return
      }
      const socket = io.connect(SOCKETIO_PATH, {reconnectionAttempts: 5})
      socket.emit('connectSocketIO', loggedInUser.id)
      context.commit(SET_SOCKET, socket)
      context.dispatch(GET_TALK_LIST)
      context.dispatch(GET_FRIEND_REQUEST_LIST)
      socket.on('receiveMessage', data => {
        console.log('收到了新消息', JSON.stringify(data))
        context.commit(RECEIVE_MESSAGE, data, {root: true})
      })
      socket.on('receiveFriendRequest', data => {
        console.log('收到了新的好友请求', JSON.stringify(data))
        context.dispatch(RECEIVE_FRIEND_REQUEST)
      })
      socket.on('sendMessageSuccess', data => {
        console.log('sendMessageSuccess', data)
        context.commit(SEND_MESSAGE_SUCCESS, data)
      })
      socket.on('makeFriendRequestResult', data => {
        Toast(data)
        router.back()
      })
      socket.on('getFriendRequestResult', data => {
        context.commit(UPDATE_FRIEND_REQUEST_LIST, data)
      })
      socket.on('updateTalkList', data => {
        console.log('updateTalkList', data)
        context.commit(UPDATE_TALK_LIST, data)
      })
      socket.on('updateFriendList', data => {
        console.log('updateFriendList', data)
        context.commit(UPDATE_USER_FRIEND_LIST, data)
      })

      socket.on('agreeMakeFriendRequestFaild', data => {
        console.log('同意好友请求失败', data)
        Toast(data)
      })

      socket.on('agreeMakeFriendRequestSuccess', data => {
        console.log('同意好友请求成功', data)
        Toast('已通过好友请求')
        router.back()
      })

      // socket.on('connect_error', error => {
      //   console.log('connect_error', error)
      // })

      socket.on('reconnect_attempt', attemptNumber => {
        // console.log('reconnect_attempt', attemptNumber)
        context.commit(RECONNECT_ATTEMPT, attemptNumber)
      })

      socket.on('reconnect_failed', () => {
        // console.log('reconnect_failed')
        context.commit(RECONNECT_FAILED)
      })

      // 重联成功
      socket.on('reconnect', () => {
        console.log('reconnect')
        context.commit(RESET_RECONNECT_OVERLAY)
      })
    },
    [AGREE_MAKE_FRIEND_REQUEST](context, payload) {
      context.state.socket.emit('agreeMakeFriendRequest', payload)
    },
    [GET_TALK_LIST](context) {
      context.state.socket.emit('getTalkList')
    },
    [SEND_MESSAGE](context, payload) {
      context.state.sendingMessage = payload.message
      context.state.socket.emit('sendMessage', payload)
    },
    [MAKE_FRIEND_REQUEST](context, payload) {
      context.state.socket.emit('makeFriendRequest', payload)
    },
    [GET_FRIEND_REQUEST_LIST](context) {
      context.state.socket.emit('getFriendRequestList')
    },
    [GET_USER_FRIEND_LIST](context) {
      context.state.socket.emit('getUserFriendList')
    },
    [CLEAR_UN_READ_MESSAGES](context, payload) {
      context.state.socket.emit('clearUnReadMessages', payload.targetId)
    },
    [CLEAR_UN_READ_FRIEND_REQUEST](context) {
      context.state.socket.emit('clearUnReadFriendRequest')
    },
    [RECEIVE_FRIEND_REQUEST](context) {
      context.dispatch(GET_FRIEND_REQUEST_LIST)
    },
  },
}
