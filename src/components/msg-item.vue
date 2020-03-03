<template>
  <div class="msg-item" :class="isMine && 'mine-msg'">
    <div class="head-image">
      <img :src="imgSrc" :alt="name" @click="goUserInfo" />
    </div>
    <div class="content">
      <div class="content-header">
        <p v-if="!isMine" class="name">{{ name }}</p>
        <p class="send-date">{{ formatedSendDate }}</p>
      </div>
      <p class="msg">{{ msg }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MsgItem',
  props: {
    id: Number, // 对话目标id
    msg: String, // 对话内容
    src: String, // 头像src
    name: String, // 对话目标名
    sendDate: Number, // 对话时间
    type: Number, // 对话目标类型 （todo: 用户、群等）
  },
  computed: {
    isMine() {
      // 是否是自己的发言
      return this.id === window.loggedInUser.id
    },
    formatedSendDate() {
      return this.$moment(this.sendDate).format('MM/DD HH:mm')
    },
    imgSrc() {
      return this.src
        ? require('@assets/head/' + this.src)
        : require('@assets/head/head.jpg')
    },
  },
  mounted() {},
  data() {
    return {}
  },
  methods: {
    goUserInfo() {
      // this.$router.push({
      //   path: 'talk-view',
      //   query: {
      //     targetId: this.id,
      //   },
      // })
    },
  },
}
</script>

<style lang="less" scoped>
.msg-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  &.mine-msg {
    flex-direction: row-reverse;
  }

  .head-image {
    img {
      width: 48px;
    }
  }

  .content {
    max-width: 70%;
    margin: 0 12px;
    border: 1px dashed orange;
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
    .msg {
      font-weight: lighter;
    }
  }
}
</style>
