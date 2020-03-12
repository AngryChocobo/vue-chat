<template>
  <div class="friend-list">
    <my-nav-bar title="好友列表">
      <template slot="right">
        <router-link to="/search-user">添加好友</router-link>
      </template>
    </my-nav-bar>
    <van-field readonly label="新朋友" is-link @click="toFriendRequestList" />
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="全部好友" name="all">
        <van-list>
          <van-cell
            class="friend"
            v-for="friend in friendList"
            :key="friend.id"
            @click="checkFriendInfo(friend)"
          >
            <img
              :src="getImgSrc(friend.src)"
              :alt="friend.name"
              @click="goTalkView"
            />
            <span class="username">{{ friend.username }}</span>
          </van-cell>
        </van-list>
      </van-collapse-item>
      <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
      <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
    </van-collapse>
    <my-tab-bar />
  </div>
</template>

<script>
import MyTabBar from '@components/my-tab-bar.vue'
import MyNavBar from '@components/my-nav-bar.vue'
import {getUserFriendList, getUserInfo} from '@const/api'
export default {
  name: 'FriendList',
  components: {
    MyTabBar,
    MyNavBar,
  },
  data() {
    return {
      friendList: [],
      activeName: 'all',
    }
  },
  mounted() {
    this.getUserFriendList()
  },
  methods: {
    toFriendRequestList() {
      this.$router.push({
        path: 'friend-request',
      })
    },
    checkFriendInfo(friend) {
      this.$router.push({
        name: 'UserInfo',
        params: {userId: friend.userId},
      })
    },
    getUserFriendList() {
      this.$axios
        .get(
          getUserFriendList(
            this.$store.state.loggedInUserModule.loggedInUser.id.id,
          ),
        )
        .then(res => {
          this.friendList = res.data || []
        })
    },
    getImgSrc(src) {
      return src
        ? require('@assets/head/' + src)
        : require('@assets/head/head.jpg')
    },
    goTalkView() {},
  },
}
</script>

<style lang="less" scoped>
.friend-list {
  /deep/ .van-collapse-item__content {
    padding: 0;
    .friend {
      /deep/ .van-cell__value {
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
