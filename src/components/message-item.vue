<template>
  <div class="message-item" :class="isMine ? 'mine' : 'other'">
    <div class="head-image">
      <UserAvator
        :user="isMine ? loggedInUser : targetUserInfo"
        round
        @click.native="goUserInfo"
      />
    </div>
    <div class="content">
      <div class="content-header">
        <!-- <p v-if="!isMine" class="username">{{ targetUserInfo.username }}</p> -->
        <!-- <p class="send-date">{{ formatedSendDate }}</p> -->
      </div>
      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import UserAvator from '@/components/user-avatar.vue'
export default {
  name: 'MessageItem',
  components: {UserAvator},
  props: {
    fromUserId: Number, // 对话目标id
    message: String, // 对话内容
    targetUserInfo: Object,
    sendDate: Number, // 对话时间
  },
  computed: {
    isMine() {
      // 是否是自己的发言
      return this.fromUserId === this.loggedInUser.id
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
    formatedSendDate() {
      return this.$moment(this.sendDate).format('MM/DD HH:mm:ss')
    },
  },
  methods: {
    goUserInfo() {
      this.$router.push({
        name: 'UserInfo',
        params: {userId: this.fromUserId},
      })
    },
  },
}
</script>

<style lang="less" scoped>
.message-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  &.mine {
    flex-direction: row-reverse;
    .message {
      background-color: #a0e75a;
      &::after {
        right: -16px;
        border-left: 8px solid #a0e75a;
        border-right: 8px solid transparent;
      }
    }
  }

  &.other {
    .message {
      background-color: #ccc;
      &::after {
        left: -16px;
        border-left: 8px solid transparent;
        border-right: 8px solid #ccc;
      }
    }
  }
  .head-image {
    img {
      width: 40px;
      border-radius: 50%;
    }
  }

  .content {
    max-width: 70%;
    margin: 0 12px;
    p {
      margin: 0;
    }
    .content-header {
      display: flex;
      justify-content: space-between;
      .send-date {
        font-weight: lighter;
        justify-self: flex-start;
      }
    }
    .message {
      position: relative;
      border-radius: 8px;
      padding: 8px;
      min-height: 36px;
      box-sizing: border-box;
      color: black;
      &::after {
        content: ' ';
        position: absolute;
        top: 10px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
      }
    }
  }
}
</style>
