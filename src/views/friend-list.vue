<template>
  <div class="friend-list">
    <my-nav-bar>
      <template slot="right">
        <router-link to="/search-user">添加好友</router-link>
      </template>
    </my-nav-bar>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="全部好友" name="all">
        <van-list>
          <van-cell
            class="friend"
            v-for="friend in friendList"
            :key="friend.id"
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
import {getUserFriendList} from '@const/api'
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
    onLoad() {},
    getUserFriendList() {
      this.axios.get(getUserFriendList(window.loggedInUser.id)).then(res => {
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
