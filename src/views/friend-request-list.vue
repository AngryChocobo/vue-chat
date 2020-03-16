<template>
  <div class="friend-request-list">
    <my-nav-bar title="新朋友">
      <template slot="right">
        <router-link to="/search-user">添加好友</router-link>
      </template>
    </my-nav-bar>
    <van-list>
      <van-cell
        class="friend"
        v-for="friend in friendRequestList"
        :key="friend.id"
        :value="friend.stats == 0 ? '查看' : '已同意'"
        @click="checkFriendRequestInfo(friend)"
      >
        <div class="friend-info">
          <img :src="getImgSrc(friend.src)" :alt="friend.name" />
          <span class="username">{{ friend.username }}</span>
        </div>
        <van-tag type="primary" v-if="friend.stats === 0" plain>待通过</van-tag>
        <van-tag type="success" v-if="friend.stats === 1" plain>已通过</van-tag>
        <!-- todo 根据不同的stats显示通过状态 -->
      </van-cell>
    </van-list>
    <my-tab-bar />
  </div>
</template>

<script>
import MyTabBar from '@components/my-tab-bar.vue'
import MyNavBar from '@components/my-nav-bar.vue'
export default {
  name: 'FriendRequestList',
  components: {
    MyTabBar,
    MyNavBar,
  },
  data() {
    return {
      activeName: 'all',
    }
  },
  computed: {
    friendRequestList() {
      return this.$store.state.socketModule.friendRequestList
    },
  },
  mounted() {},
  methods: {
    checkFriendRequestInfo(friend) {
      this.$router.push({
        name: 'FriendRequestInfo',
        params: {
          userId: friend.userId,
        },
      })
    },
    getImgSrc(src) {
      return src
        ? require('@assets/head/' + src)
        : require('@assets/head/head.jpg')
    },
  },
}
</script>

<style lang="less" scoped>
.friend-request-list {
  padding: 0;
  /deep/.friend {
    .van-cell__value {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .friend-info {
        display: flex;
        align-items: center;
        img {
          width: 32px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
