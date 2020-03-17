import Vue from 'vue'
import axios from '@/plugins/axios.js'
import {getMessageList} from '@const/api'
import {
  UPDATE_TALK_LIST,
  UPDATE_MESSAGE_LIST,
  SEND_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE,
} from '@store/types/mutation-types.js'
import {GET_MESSAGE_LIST} from '@store/types/action-types.js'

export default {
  state: {
    talkList: [],
    messageLists: {},
  },
  getters: {
    totalUnReadMessage(state) {
      return state.talkList.filter(v => v.unReadCount)
    },
    totalUnReadMessageCount(state, getters) {
      return getters.totalUnReadMessage
        .map(v => v.unReadCount)
        .reduce((a, b) => a + b, 0)
    },
  },
  mutations: {
    [UPDATE_TALK_LIST](state, payload) {
      console.log('talk模块 准备更新会话列表')
      state.talkList = payload
    },
    [UPDATE_MESSAGE_LIST](state, payload) {
      console.log('talk模块 准备更新消息列表', payload)
      Vue.set(state.messageLists, payload.targetId, payload.messageList)
    },
    [SEND_MESSAGE_SUCCESS](state, payload) {
      if (!state.messageLists[payload.targetId]) {
        Vue.set(state.messageLists, payload.targetId, [payload])
      } else {
        state.messageLists[payload.targetId].push(payload)
      }
    },
    [RECEIVE_MESSAGE](state, payload) {
      if (!state.messageLists[payload.fromUserId]) {
        Vue.set(state.messageLists, payload.fromUserId, [payload])
      } else {
        state.messageLists[payload.fromUserId].push(payload)
      }
    },
  },
  actions: {
    [GET_MESSAGE_LIST](context, payload) {
      const {loggedInUser} = context.rootState.loggedInUserModule
      axios.get(getMessageList(loggedInUser.id, payload.targetId)).then(res => {
        context.commit(UPDATE_MESSAGE_LIST, res.data)
      })
    },
  },
}
