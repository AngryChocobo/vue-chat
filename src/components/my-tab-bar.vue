<template>
  <div class="my-tab-bar">
    <van-tabbar route>
      <van-tabbar-item
        to="/talk-list"
        icon="comment-o"
        :info="totalUnReadMessageCount || ''"
        >聊天</van-tabbar-item
      >
      <van-tabbar-item
        to="/friend-list"
        icon="friends-o"
        :info="friendRequestUnReadCount || ''"
        >好友</van-tabbar-item
      >
      <van-tabbar-item to="/my" icon="home-o">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'MyTabBar',
  computed: {
    ...mapGetters(['totalUnReadMessageCount', 'friendRequestUnReadCount']),
  },
}
</script>

<style lang="less" scoped>
.my-tab-bar {
  margin-top: 50px;
  /deep/ .van-tabbar--fixed {
    left: 50%;
    transform: translateX(-50%);
    max-width: 600px;
  }
}
</style>
