import Vue from 'vue'
import axios from '@/plugins/axios.js'
import {getMessageList} from '@const/api'
import {
  UPDATE_TALK_LIST,
  UPDATE_MESSAGE_LIST,
  SEND_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE,
  ALLOW_NOTIFICATION,
} from '@store/types/mutation-types.js'
import {
  GET_MESSAGE_LIST,
  NOTIFICATION_GRANTED,
} from '@store/types/action-types.js'
import {
  TOTAL_UN_READ_MESSAGE_COUNT,
  TOTAL_UN_READ_MESSAGE,
} from '@store/types/getters-types.js'

export default {
  state: {
    allowNotification: false,
    talkList: [],
    messageLists: {},
  },
  getters: {
    [TOTAL_UN_READ_MESSAGE](state) {
      return state.talkList.filter(v => !v.read)
    },
    [TOTAL_UN_READ_MESSAGE_COUNT](state, getters) {
      return getters[TOTAL_UN_READ_MESSAGE].map(v => v.unReadCount).reduce(
        (a, b) => a + b,
        0,
      )
    },
  },
  mutations: {
    [ALLOW_NOTIFICATION](state) {
      state.allowNotification = true
    },
    [UPDATE_TALK_LIST](state, payload) {
      console.log('talk模块 准备更新会话列表')
      state.talkList = payload
    },
    [UPDATE_MESSAGE_LIST](state, payload) {
      console.log('talk模块 准备更新消息列表', payload)
      Vue.set(state.messageLists, payload.targetId, payload.messageList)
    },
    [SEND_MESSAGE_SUCCESS](state, payload) {
      console.log('SEND_MESSAGE_SUCCESS mutation ', payload)
      if (!state.messageLists[payload.targetUserId]) {
        Vue.set(state.messageLists, payload.targetUserId, payload.message)
      } else {
        state.messageLists[payload.targetUserId].push(payload.message)
      }
    },
    [RECEIVE_MESSAGE](state, payload) {
      console.log('收到消息: ', payload)
      if (!state.messageLists[payload.fromUserId]) {
        Vue.set(state.messageLists, payload.fromUserId, [payload])
      } else {
        state.messageLists[payload.fromUserId].push(payload)
      }
      // 使用浏览器推送
      new Notification(payload.username, {
        body: payload.message,
        // icon: 'https://image.zhangxinxu.com/image/blog/zxx_240_0818.jpg',
      })
    },
  },
  actions: {
    [NOTIFICATION_GRANTED](context) {
      context.commit(ALLOW_NOTIFICATION)
    },
    [GET_MESSAGE_LIST](context, payload) {
      const {loggedInUser} = context.rootState.loggedInUserModule
      axios.get(getMessageList(loggedInUser.id, payload.targetId)).then(res => {
        context.commit(UPDATE_MESSAGE_LIST, res.data)
      })
    },
  },
}
