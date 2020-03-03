<template>
  <div class="talk-view" ref="view">
    <van-list class="talk-list" ref="talkList">
      <van-cell v-for="msg in msgList" :key="msg.id">
        <msg-item
          :from-user-id="msg.fromUserId"
          :src="msg.src"
          :username="msg.username"
          :send-date="msg.sendDate"
          :message="msg.message"
          :type="msg.type"
        />
      </van-cell>
    </van-list>
    <talk-input :on-send="sendMessage" />
  </div>
</template>

<script>
import MsgItem from '@components/msg-item.vue'
import TalkInput from '@components/talk-input.vue'
import {getTalkViewDetail} from '@const/api'
// TODO 将临时消息存储在列表页组件，在恰当时机push到消息列表，这种做法觉得有问题
export default {
  name: 'TalkView',
  components: {
    MsgItem,
    TalkInput,
  },
  data() {
    return {
      sendingMessage: null,
      msgList: [],
    }
  },
  mounted() {
    this.getTalkViewDetail()
    this.$socket.on('sendMessageSuccess', data => {
      this.msgList.push({
        id: data.id,
        fromUserId: window.loggedInUser.id,
        src: window.loggedInUser.src,
        username: window.loggedInUser.username,
        message: this.sendingMessage,
        sendDate: Date.now(),
      })
    })
  },
  methods: {
    getTalkViewDetail() {
      this.axios.get(getTalkViewDetail(1, 2)).then(res => {
        this.msgList = res.data || []
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      })
    },
    scrollToBottom() {
      const dom = this.$refs.talkList
      dom.$el.scrollIntoView()
    },
    sendMessage(message) {
      this.$socket.emit('sendMessage', {
        fromUserId: 1,
        toUserId: 2,
        message,
      })
      this.sendingMessage = message
      // this.axios
      //   .post(sendNewMessage, {
      //     fromUserId: 1,
      //     toUserId: 2,
      //     message,
      //   })
      //   .then(res => {
      //     this.getTalkViewDetail()
      //   })
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
