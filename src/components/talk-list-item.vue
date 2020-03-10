<template>
  <div class="talk-list-item" @click="goTalkDetail">
    <div class="head-image">
      <img :src="imgSrc" alt="" />
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
    toUserId: Number, // 对话目标id
    lastMessageUserName: String, // 最后发言用户名
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
        params: {id: this.toUserId},
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
    img {
      width: 48px;
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
