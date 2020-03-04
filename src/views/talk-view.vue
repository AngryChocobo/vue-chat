<template>
  <div class="talk-view" ref="view">
    <van-list class="talk-list" ref="talkList">
      <van-cell v-for="message in messageList" :key="message.id">
        <message-item
          :from-user-id="message.fromUserId"
          :src="message.src"
          :username="message.username"
          :send-date="message.sendDate"
          :message="message.message"
          :type="message.type"
        />
      </van-cell>
    </van-list>
    <talk-input :on-send="sendMessage" />
  </div>
</template>

<script>
import MessageItem from '@components/message-item.vue'
import TalkInput from '@components/talk-input.vue'

export default {
  name: 'TalkView',
  components: {
    MessageItem,
    TalkInput,
  },
  data() {
    return {}
  },
  computed: {
    messageList() {
      return this.$store.state.messageList
    },
  },
  mounted() {
    this.$store.dispatch('setTimeOutCountIncrement')
    this.getMessageList()
  },
  methods: {
    getMessageList() {
      this.$store.commit('getMessageList', {
        toUserId: 2,
      })
    },
    scrollToBottom() {
      const dom = this.$refs.talkList
      dom.$el.scrollIntoView()
    },
    sendMessage(message) {
      this.$store.commit('sendMessage', {
        toUserId: 2,
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
