<template>
  <div class="talk-list-item" @click="goTalkDetail">
    <div class="head-image">
      <img :src="imgSrc" alt="" />
      <div v-show="unReadCount" class="dot">{{ unReadCount }}</div>
    </div>
    <div class="content">
      <div class="content-header">
        <p class="targetUserName">{{ targetUserName }}</p>
        <p class="sendDate">{{ formatedDate }}</p>
      </div>
      <p class="message van-ellipsis">
        {{ `${lastMessageUserName}: ${message}` }}
      </p>
    </div>
  </div>
</template>

<script>
/**
 * 对话列表的子组件，作为一个用户/群存在
 */
export default {
  name: 'TalkListItem',
  props: {
    id: Number,
    message: String, // 对话内容
    src: String, // 头像src
    targetUserName: String, // 对话目标名
    sendDate: Number, // 对话时间
    targetUserId: Number, // 对话目标id
    lastMessageUserName: String, // 最后发言用户名
    unReadCount: Number,
    type: Number, // 对话目标类型 （todo: 用户、群等）
  },
  computed: {
    formatedDate() {
      return this.$moment(this.sendDate).format('YY/MM/DD')
    },
    imgSrc() {
      return this.src
        ? require('@assets/head/' + this.src)
        : require('@assets/head/head.jpg')
    },
  },
  mounted() {},
  methods: {
    goTalkDetail() {
      this.$router.push({
        name: 'TalkView',
        params: {id: this.targetUserId},
      })
    },
  },
}
</script>

<style lang="less" scoped>
.talk-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .head-image {
    position: relative;
    img {
      width: 48px;
      border-radius: 50%;
    }
    .dot {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      min-width: 16px;
      padding: 0 3px;
      color: #fff;
      font-weight: 500;
      font-size: 12px;
      font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
      line-height: 14px;
      text-align: center;
      background-color: #ee0a24;
      border: 1px solid #fff;
      border-radius: 16px;
    }
  }

  .content {
    flex: 1;
    margin-left: 12px;
    p {
      margin: 0;
    }
    .content-header {
      display: flex;
      justify-content: space-between;
      .sendDate {
        font-weight: lighter;
      }
    }
    .message {
      font-weight: lighter;
    }
  }
}
</style>
