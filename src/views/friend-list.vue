<template>
  <div class="friend-list">
    <my-nav-bar title="好友列表" :left-arrow="false">
      <template slot="right">
        <router-link to="/search-user">添加好友</router-link>
      </template>
    </my-nav-bar>
    <van-field
      class="newFriend"
      readonly
      label="新朋友"
      is-link
      @click="toFriendRequestList"
    >
      <div v-show="FRIEND_REQUEST_UN_READ_COUNT" class="dot" slot="right-icon">
        {{ FRIEND_REQUEST_UN_READ_COUNT }}
      </div>
    </van-field>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="全部好友" name="all">
        <van-list>
          <van-cell
            class="friend"
            v-for="friend in friendList"
            :key="friend.id"
            @click="checkFriendInfo(friend.friendUserInfo)"
          >
            <img
              :src="getImgSrc(friend.friendUserInfo.src)"
              :alt="friend.friendUserInfo.name"
            />
            <span class="username">{{ friend.friendUserInfo.username }}</span>
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
import {mapGetters} from 'vuex'
import MyTabBar from '@components/my-tab-bar.vue'
import MyNavBar from '@components/my-nav-bar.vue'
import {getUserFriendList} from '@const/api'
import {FRIEND_REQUEST_UN_READ_COUNT} from '@store/types/getters-types.js'

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
  computed: {
    ...mapGetters([FRIEND_REQUEST_UN_READ_COUNT]),
  },
  mounted() {
    this.getUserFriendList()
  },
  methods: {
    toFriendRequestList() {
      this.$router.push({
        path: 'friend-request-list',
      })
    },
    checkFriendInfo(friend) {
      this.$router.push({
        name: 'UserInfo',
        params: {userId: friend.id},
      })
    },
    getUserFriendList() {
      this.$axios.get(getUserFriendList).then(res => {
        console.log('好友列表: ', res.data)
        this.friendList = res.data || []
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
.friend-list {
  .newFriend {
    /deep/ .van-field__right-icon {
      position: relative;
      .dot {
        position: absolute;
        top: 0;
        right: 16px;
        box-sizing: border-box;
        transform: translateY(-50%);
        min-width: 16px;
        padding: 0 3px;
        color: #fff;
        font-weight: 500;
        font-size: 12px;
        font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
        line-height: 14px;
        text-align: center;
        background-color: #ee0a24;
        border: 1px solid #fff;
        border-radius: 16px;
      }
    }
  }

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
