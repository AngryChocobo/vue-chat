<template>
  <div class="group-talk-view" ref="view">
    <my-nav-bar :title="navTitle" left-arrow />
    <div class="talk-list" ref="talkList" v-if="groupInfo">
      <van-cell
        :border="false"
        v-for="message in messageList"
        :key="message.id"
      >
        <group-message-item
          :targetUserInfo="message.sendMessageUserInfo"
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
import MyNavBar from '@/components/my-nav-bar.vue'
import GroupMessageItem from '@/components/group-message-item.vue'
import TalkInput from '@/components/talk-input.vue'
import {getGroupInfo} from '@/api/group'
import {
  GET_GROUP_MESSAGE_LIST,
  SEND_GROUP_MESSAGE,
  ENTER_GROUP_ROOM,
  // CLEAR_UN_READ_MESSAGES,
} from '@/store/types/action-types'
import {useStore} from '@/store/store'

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
  watch: {
    '$store.state.socketModule.socket'(socket) {
      if (socket) {
        console.log('有socket了，准备进入群聊room')
        this.enterGroupRoom()
      }
    },
  },
  computed: {
    navTitle() {
      return this.groupInfo && this.groupInfo.groupName
    },
    messageList() {
      const store = useStore()

      return store.state.talkModule.groupMessageLists[this.groupId]
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
  // destroyed() {
  //   clearTimeout(this.initScrollTimer)
  // },
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
      const store = useStore()

      store.dispatch(GET_GROUP_MESSAGE_LIST, {
        id: this.groupId,
      })
    },
    enterGroupRoom() {
      const store = useStore()

      store.dispatch(ENTER_GROUP_ROOM, {
        groupId: this.groupId,
      })
      // TODO 似乎需要一个进群的SUCCESS 响应
    },
    scrollToBottom() {
      const dom = this.$refs.talkList
      dom.scrollIntoView(false)
    },
    sendMessage(message) {
      const store = useStore()

      // 发送消息到群
      store.dispatch(SEND_GROUP_MESSAGE, {
        groupId: this.groupId,
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
