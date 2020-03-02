<template>
  <div class="msg-item" @click="goTalkDetail" :class="isMine && 'mine-msg'">
    <div class="head-image">
      <img :src="src" alt="name" />
    </div>
    <div class="content">
      <div class="content-header">
        <p v-if="!isMine" class="name">{{ name }}</p>
        <p class="date">{{ formatedDate }}</p>
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
    date: Number, // 对话时间
    type: Number, // 对话目标类型 （todo: 用户、群等）
    isMine: Boolean, // 是否是自己的发言
  },
  computed: {
    formatedDate() {
      return this.$moment(this.date).format('YY/MM/DD')
    },
  },
  mounted() {
    // console.log()
  },
  data() {
    return {}
  },
  methods: {
    goTalkDetail() {
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
      .date {
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
