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
        @click="checkFriendRequestInfo(friend.makeRecordUserInfo)"
      >
        <div class="friend-info">
          <img :src="getImgSrc(friend.makeRecordUserInfo.src)" />
          <span class="username">{{ friend.makeRecordUserInfo.username }}</span>
        </div>
        <van-tag type="primary" v-if="friend.stats === 'Waiting'" plain
          >待通过</van-tag
        >
        <van-tag type="success" v-if="friend.stats === 'Agree'" plain
          >已通过</van-tag
        >
        <van-tag type="danger" v-if="friend.stats === 'Disagree'" plain
          >已拒绝</van-tag
        >
        <!-- todo 根据不同的stats显示通过状态 -->
      </van-cell>
    </van-list>
    <my-tab-bar />
  </div>
</template>

<script>
import {CLEAR_UN_READ_FRIEND_REQUEST} from '@store/types/action-types.js'
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
  mounted() {
    this.clearUnReadFriendRequest()
  },
  methods: {
    clearUnReadFriendRequest() {
      if (this.friendRequestList.length) {
        this.$store.dispatch(CLEAR_UN_READ_FRIEND_REQUEST)
      }
    },
    checkFriendRequestInfo(friend) {
      this.$router.push({
        name: 'FriendRequestInfo',
        params: {
          userId: friend.id,
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
