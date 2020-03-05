<template>
  <div class="my-tab-bar">
    <van-tabbar route>
      <van-tabbar-item to="/talk-list" icon="comment-o">聊天</van-tabbar-item>
      <van-tabbar-item to="/friend-list" icon="friends-o">好友</van-tabbar-item>
      <van-tabbar-item to="/home" icon="home-o">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'MyTabBar',
  data() {
    return {}
  },
  props: {
    onSend: {
      type: Function,
    },
  },
  methods: {
    // onChange(index) {},
    clearInputValue() {
      this.value = ''
    },
    sendMessage() {},
  },
}
</script>

<style lang="less" scoped>
.my-tab-bar {
  margin-top: 50px;
}
</style>
