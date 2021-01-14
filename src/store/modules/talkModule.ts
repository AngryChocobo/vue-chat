import {getMessageList} from '@/api/talk'
import {getGroupMessageList} from '@/api/group'
import {
  UPDATE_TALK_LIST,
  UPDATE_MESSAGE_LIST,
  SEND_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE,
  ALLOW_NOTIFICATION,
  UPDATE_GROUP_MESSAGE_LIST,
  RECEIVE_GROUP_MESSAGE,
} from '@/store/types/mutation-types'
import {
  GET_MESSAGE_LIST,
  GET_GROUP_MESSAGE_LIST,
  NOTIFICATION_GRANTED,
} from '@/store/types/action-types'

export interface TalkState {
  allowNotification: boolean
  talkList: any[]
  messageLists: {}
  groupMessageLists: {}
}

export default {
  state: (): TalkState => ({
    allowNotification: false,
    talkList: [],
    messageLists: {},
    groupMessageLists: {},
  }),
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
      // Vue.set(state.messageLists, payload.targetId, payload.messageList)
      state.messageLists[payload.targetId] = payload.messageList
    },
    [UPDATE_GROUP_MESSAGE_LIST](state, payload) {
      console.log('talk模块 准备更新群聊消息列表', payload)
      // Vue.set(
      //   state.groupMessageLists,
      //   payload.groupId,
      //   payload.groupMessageList,
      // )
      state.groupMessageLists[payload.groupId] = payload.groupMessageList
    },
    [SEND_MESSAGE_SUCCESS](state, payload) {
      if (!state.messageLists[payload.targetUserId]) {
        // Vue.set(state.messageLists, payload.targetUserId, payload.message)
        state.messageLists[payload.targetUserId] = payload.message
      } else {
        state.messageLists[payload.targetUserId].push(payload.message)
      }
    },
    [RECEIVE_MESSAGE](state, payload) {
      console.log('收到消息: ', payload)
      if (!state.messageLists[payload.fromUserId]) {
        // Vue.set(state.messageLists, payload.fromUserId, [payload])
        state.messageLists[payload.fromUserId] = [payload]
      } else {
        state.messageLists[payload.fromUserId].push(payload)
      }
      // 使用浏览器推送
      new Notification(payload.username, {
        body: payload.message,
        // icon: 'https://image.zhangxinxu.com/image/blog/zxx_240_0818.jpg',
      })
    },
    // 收到群消息
    [RECEIVE_GROUP_MESSAGE](state, payload) {
      console.log('收到群消息: ', payload)
      if (!state.groupMessageLists[payload.groupId]) {
        // Vue.set(state.groupMessageLists, payload.groupId, [payload])
      } else {
        state.groupMessageLists[payload.groupId].push(payload)
      }
    },
  },
  actions: {
    [NOTIFICATION_GRANTED](context) {
      context.commit(ALLOW_NOTIFICATION)
    },
    [GET_MESSAGE_LIST](context, payload) {
      getMessageList(payload.targetId).then(res => {
        context.commit(UPDATE_MESSAGE_LIST, res)
      })
    },
    [GET_GROUP_MESSAGE_LIST](context, payload) {
      getGroupMessageList(payload.id).then(res => {
        console.log('获取到群消息列表：', res)
        context.commit(UPDATE_GROUP_MESSAGE_LIST, res)
      })
    },
  },
}
