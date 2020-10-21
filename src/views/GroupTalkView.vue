<template>
  <div class="group-talk-view" ref="view">
    <my-nav-bar :title="navTitle" />
    <div class="talk-list" ref="talkList" v-if="groupInfo">
      <van-cell
        :border="false"
        v-for="message in messageList"
        :key="message.id"
      >
        <group-message-item
          :targetUserInfo="message.userInfo"
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
import GroupMessageItem from '@components/group-message-item.vue'
import TalkInput from '@components/talk-input.vue'
import {getGroupInfo} from '@/api/group'
import {
  GET_GROUP_MESSAGE_LIST,
  SEND_MESSAGE,
  // CLEAR_UN_READ_MESSAGES,
} from '@store/types/action-types.js'

export default {
  name: 'GroupTalkView',
  components: {
    MyNavBar,
    GroupMessageItem,
    TalkInput,
  },
  data() {
    return {
      groupInfo: null,
      initScrollTimer: null,
    }
  },
  computed: {
    navTitle() {
      return this.groupInfo && this.groupInfo.groupName
    },
    messageList() {
      return this.$store.state.talkModule.messageLists[this.targetId]
    },
    groupId() {
      return Number(this.$route.params.id)
    },
    ...mapGetters(['totalUnReadMessage']),
  },
  mounted() {
    this.getGroupInfo(this.groupId)
    this.getGroupMessageList()
    // this.clearUnReadMessages()
  },
  destroyed() {
    clearTimeout(this.initScrollTimer)
  },
  methods: {
    // clearUnReadMessages() {
    //   if (this.totalUnReadMessage.find(v => v.targetUserId == this.targetId)) {
    //     this.$store.dispatch(CLEAR_UN_READ_MESSAGES, {
    //       targetId: this.groupInfo,
    //     })
    //   }
    // },
    async getGroupInfo(groupId) {
      const groupInfo = await getGroupInfo(groupId)
      this.groupInfo = groupInfo
      this.$nextTick(() => {
        this.initScrollTimer = setTimeout(() => {
          this.scrollToBottom()
        }, 100)
      })
    },
    getGroupMessageList() {
      this.$store.dispatch(GET_GROUP_MESSAGE_LIST, {
        id: this.groupId,
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
.group-talk-view {
  .talk-list {
    padding-bottom: 60px;
  }
}
</style>
