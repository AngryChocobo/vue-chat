<template>
  <div class="talk-list-item" @click="goTalkDetail">
    <div class="head-image">
      <img :src="src" alt="" />
    </div>
    <div class="content">
      <div class="content-header">
        <p class="username">{{ username }}</p>
        <p class="date">{{ formatedDate }}</p>
      </div>
      <p class="message van-ellipsis">{{ message }}</p>
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
    id: Number, // 对话目标id
    message: String, // 对话内容
    src: String, // 头像src
    username: String, // 对话目标名
    date: Number, // 对话时间
    type: Number, // 对话目标类型 （todo: 用户、群等）
  },
  computed: {
    formatedDate() {
      return this.$moment(this.date).format('YY/MM/DD')
    },
  },
  mounted() {},
  data() {
    return {}
  },
  methods: {
    goTalkDetail() {
      this.$router.push({
        name: 'TalkView',
        params: {id: this.id},
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
      .date {
        font-weight: lighter;
      }
    }
    .message {
      font-weight: lighter;
    }
  }
}
</style>
