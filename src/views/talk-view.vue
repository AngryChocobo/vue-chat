<template>
  <div class="talk-view" ref="view">
    <van-list class="talk-list" ref="talkList" v-if="targetInfo">
      <van-cell v-for="message in messageList" :key="message.id">
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
import MessageItem from '@components/message-item.vue'
import TalkInput from '@components/talk-input.vue'
import {getTalkTargetInfo} from '@const/api'

export default {
  name: 'TalkView',
  components: {
    MessageItem,
    TalkInput,
  },
  data() {
    return {
      targetInfo: null,
    }
  },
  computed: {
    messageList() {
      return this.$store.state.messageList
    },
    targetId() {
      return this.$route.params.id
    },
  },
  mounted() {
    // this.$store.dispatch('setTimeOutCountIncrement')
    this.getTalkTargetInfo(this.targetId)
    this.getMessageList()
  },
  methods: {
    getTalkTargetInfo(targetId) {
      this.$http.get(getTalkTargetInfo(targetId)).then(res => {
        this.targetInfo = res.data
      })
    },
    getMessageList() {
      this.$store.commit('getMessageList', {
        toUserId: this.targetId,
      })
    },
    scrollToBottom() {
      const dom = this.$refs.talkList
      dom.$el.scrollIntoView()
    },
    sendMessage(message) {
      this.$store.commit('sendMessage', {
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
