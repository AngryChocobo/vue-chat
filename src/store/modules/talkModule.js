import axios from '@/plugins/axios.js'
import {getMessageList} from '@const/api'

export default {
  state: {
    talkList: [],
    messageList: [],
  },
  getters: {
    totalMessageUnReadCount(state) {
      return state.talkList
        .map(v => v.unReadCount || 0)
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
      state.messageList = payload
    },
    sendMessageSuccess(state, payload) {
      state.messageList.push(payload)
    },
    receiveMessage(state, payload) {
      state.messageList.push(payload)
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
