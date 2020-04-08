<template>
  <div class="my-tab-bar">
    <van-tabbar route>
      <van-tabbar-item
        to="/talk-list"
        icon="comment-o"
        :info="TOTAL_UN_READ_MESSAGE_COUNT || ''"
        >聊天</van-tabbar-item
      >
      <van-tabbar-item
        to="/friend-list"
        icon="friends-o"
        :info="FRIEND_REQUEST_UN_READ_COUNT || ''"
        >好友</van-tabbar-item
      >
      <van-tabbar-item to="/my" icon="home-o">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {
  TOTAL_UN_READ_MESSAGE_COUNT,
  FRIEND_REQUEST_UN_READ_COUNT,
} from '@store/types/getters-types.js'
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
  computed: {
    ...mapGetters([TOTAL_UN_READ_MESSAGE_COUNT, FRIEND_REQUEST_UN_READ_COUNT]),
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
