<template>
  <div class="talk-view" ref="view">
    <my-nav-bar :title="navTitle" left-arrow />
    <div class="talk-list" ref="talkListRef" v-if="targetInfo">
      <van-cell
        :border="false"
        v-for="message in messageList"
        :key="message.id"
      >
        <message-item
          :targetUserInfo="targetInfo"
          :from-user-id="message.fromUserId"
          :send-date="message.sendDate"
          :message="message.message"
        />
      </van-cell>
    </div>
    <talk-input :on-send="sendMessage" />
  </div>
</template>

<script lang="ts">
import MyNavBar from '@/components/my-nav-bar.vue'
import MessageItem from '@/components/message-item.vue'
import TalkInput from '@/components/talk-input.vue'
import {getUserInfo} from '@/api/user'
import {useStore} from '@/store/store'

import {
  GET_MESSAGE_LIST,
  SEND_MESSAGE,
  CLEAR_UN_READ_MESSAGES,
} from '@/store/types/action-types'
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'

export default {
  name: 'TalkView',
  components: {
    MyNavBar,
    MessageItem,
    TalkInput,
  },

  setup() {
    const route = useRoute()
    const store = useStore()
    const talkListRef: any = ref(null)
    const targetInfo: any = ref(null)
    const initScrollTimer: any = ref(null)
    const navTitle = computed(() => {
      return targetInfo.value && targetInfo.value.username
    })

    const targetId = computed(() => {
      return Number(route.params.id)
    })
    const messageList = computed(() => {
      return store.state.talkModule.messageLists[targetId.value]
    })
    const totalUnReadMessage = computed(() => {
      return store.getters.totalUnReadMessage
    })
    function clearUnReadMessages() {
      if (
        totalUnReadMessage.value.find(v => v.targetUserId == targetId.value)
      ) {
        store.dispatch(CLEAR_UN_READ_MESSAGES, {
          targetId: targetId.value,
        })
      }
    }
    function scrollToBottom() {
      talkListRef.value.scrollIntoView(false)
    }
    async function fetchUserInfo(id) {
      const userInfo = await getUserInfo(id)
      targetInfo.value = userInfo
      nextTick(() => {
        initScrollTimer.value = setTimeout(() => {
          scrollToBottom()
        }, 100)
      })
    }
    function getMessageList() {
      store.dispatch(GET_MESSAGE_LIST, {
        targetId: targetId.value,
      })
    }

    function sendMessage(message) {
      store.dispatch(SEND_MESSAGE, {
        targetId: targetId.value,
        message,
      })
    }
    watch(messageList, () => {
      nextTick(scrollToBottom)
    })
    onMounted(() => {
      fetchUserInfo(targetId.value)
      getMessageList()
      clearUnReadMessages()
    })
    return {
      targetInfo,
      initScrollTimer,
      totalUnReadMessage,
      targetId,
      messageList,
      navTitle,
      sendMessage,
      talkListRef,
    }
  },

  // destroyed() {
  //   clearTimeout(this.initScrollTimer)
  // },
}
</script>

<style lang="less" scoped>
.talk-view {
  height: calc(100% - 50px);
  overflow-y: auto;
}
</style>
