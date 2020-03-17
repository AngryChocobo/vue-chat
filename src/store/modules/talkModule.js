import Vue from 'vue'
import axios from '@/plugins/axios.js'
import {getMessageList} from '@const/api'

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
    updateTalkList(state, payload) {
      console.log('talk模块 准备更新会话列表')
      state.talkList = payload
    },
    updateMessageList(state, payload) {
      console.log('talk模块 准备更新消息列表', payload)
      Vue.set(state.messageLists, payload.targetId, payload.messageList)
    },
    sendMessageSuccess(state, payload) {
      if (!state.messageLists[payload.targetId]) {
        Vue.set(state.messageLists, payload.targetId, [payload])
      } else {
        state.messageLists[payload.targetId].push(payload)
      }
    },
    receiveMessage(state, payload) {
      if (!state.messageLists[payload.fromUserId]) {
        Vue.set(state.messageLists, payload.fromUserId, [payload])
      } else {
        state.messageLists[payload.fromUserId].push(payload)
      }
    },
  },
  actions: {
    getMessageList(context, payload) {
      const {loggedInUser} = context.rootState.loggedInUserModule
      axios.get(getMessageList(loggedInUser.id, payload.toUserId)).then(res => {
        context.commit('updateMessageList', res.data)
      })
    },
  },
}
