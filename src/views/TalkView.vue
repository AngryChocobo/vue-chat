<template>
  <div class="talk-view" ref="view">
    <my-nav-bar :title="navTitle" />
    <div class="talk-list" ref="talkList" v-if="targetInfo">
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

<script>
import {mapGetters} from 'vuex'
import MyNavBar from '@components/my-nav-bar.vue'
import MessageItem from '@components/message-item.vue'
import TalkInput from '@components/talk-input.vue'
import {getUserInfo} from '@/api/user'
import {
  GET_MESSAGE_LIST,
  SEND_MESSAGE,
  CLEAR_UN_READ_MESSAGES,
} from '@store/types/action-types.js'

export default {
  name: 'TalkView',
  components: {
    MyNavBar,
    MessageItem,
    TalkInput,
  },
  data() {
    return {
      targetInfo: null,
      initScrollTimer: null,
    }
  },
  computed: {
    navTitle() {
      return this.targetInfo && this.targetInfo.username
    },
    messageList() {
      return this.$store.state.talkModule.messageLists[this.targetId]
    },
    targetId() {
      return Number(this.$route.params.id)
    },
    ...mapGetters(['totalUnReadMessage']),
  },
  mounted() {
    this.getUserInfo(this.targetId)
    this.getMessageList()
    this.clearUnReadMessages()
  },
  destroyed() {
    clearTimeout(this.initScrollTimer)
  },
  methods: {
    clearUnReadMessages() {
      if (this.totalUnReadMessage.find(v => v.targetUserId == this.targetId)) {
        this.$store.dispatch(CLEAR_UN_READ_MESSAGES, {
          targetId: this.targetId,
        })
      }
    },
    async getUserInfo(targetId) {
      const userInfo = await getUserInfo(targetId)
      this.targetInfo = userInfo
      this.$nextTick(() => {
        this.initScrollTimer = setTimeout(() => {
          this.scrollToBottom()
        }, 100)
      })
    },
    getMessageList() {
      this.$store.dispatch(GET_MESSAGE_LIST, {
        targetId: this.targetId,
      })
    },
    scrollToBottom() {
      const dom = this.$refs.talkList
      dom.scrollIntoView(false)
    },
    sendMessage(message) {
      this.$store.dispatch(SEND_MESSAGE, {
        targetId: this.targetId,
        message,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.talk-view {
  .talk-list {
    padding-bottom: 60px;
  }
}
</style>