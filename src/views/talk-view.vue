<template>
  <div class="talk-view" ref="view">
    <my-nav-bar :title="navTitle" />
    <van-list class="talk-list" ref="talkList" v-if="targetInfo">
      <van-cell
        :border="false"
        v-for="message in messageList"
        :key="message.id"
      >
        <message-item
          :from-user-id="message.fromUserId"
          :src="targetInfo.src"
          :username="targetInfo.username"
          :send-date="message.sendDate"
          :message="message.message"
        />
      </van-cell>
    </van-list>
    <talk-input :on-send="sendMessage" />
  </div>
</template>

<script>
import MyNavBar from '@components/my-nav-bar.vue'
import MessageItem from '@components/message-item.vue'
import TalkInput from '@components/talk-input.vue'
import {getTalkTargetInfo} from '@const/api'

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
    }
  },
  computed: {
    navTitle() {
      return this.targetInfo && this.targetInfo.username
    },
    messageList() {
      return this.$store.state.talkModule.messageList
    },
    targetId() {
      return Number(this.$route.params.id)
    },
    totalUnReadMessage() {
      return this.$store.getters.totalUnReadMessage
    },
  },
  mounted() {
    this.getTalkTargetInfo(this.targetId)
    this.getMessageList()
    this.clearUnReadMessages()
  },
  methods: {
    clearUnReadMessages() {
      if (this.totalUnReadMessage.find(v => v.targetUserId == this.targetId)) {
        this.$store.dispatch('clearUnReadMessages', {
          targetId: this.targetId,
        })
      }
    },
    getTalkTargetInfo(targetId) {
      this.$axios(getTalkTargetInfo(targetId)).then(res => {
        this.targetInfo = res.data
      })
    },
    getMessageList() {
      this.$store.dispatch('getMessageList', {
        toUserId: this.targetId,
      })
    },
    scrollToBottom() {
      const dom = this.$refs.talkList
      dom.$el.scrollIntoView()
    },
    sendMessage(message) {
      this.$store.dispatch('sendMessage', {
        toUserId: this.targetId,
        message,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.talk-view {
  .talk-list {
    margin-bottom: 60px;
  }
}
</style>
