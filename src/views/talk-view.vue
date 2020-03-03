<template>
  <div class="talk-view" ref="view">
    <van-list class="talk-list" ref="talkList">
      <van-cell v-for="msg in msgList" :key="msg.id">
        <msg-item
          :id="msg.id"
          :src="msg.src"
          :name="msg.username"
          :send-date="msg.sendDate"
          :msg="msg.message"
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
import {getTalkViewDetail, sendNewMessage} from '@const/api'
export default {
  name: 'TalkView',
  components: {
    MsgItem,
    TalkInput,
  },
  data() {
    return {
      msgList: [],
    }
  },
  mounted() {
    this.getTalkViewDetail()
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
      this.axios
        .post(sendNewMessage, {
          fromUserId: 1,
          toUserId: 2,
          message,
        })
        .then(res => {
          this.getTalkViewDetail()
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
