<template>
  <div class="user-info">
    <my-nav-bar title="用户信息" />
    <template v-if="userInfo">
      <div class="main-info">
        <img :src="imgSrc" alt="" class="userImg" />
        <div class="info-content">
          <h3 v-if="userIsFriend">
            {{ userInfo.friendRemark || userInfo.nickname }}
          </h3>
          <h3 v-else>{{ userInfo.nickname }}</h3>
          <p v-if="userInfo.friendRemark">昵称： {{ userInfo.nickname }}</p>
          <p>用户名： {{ userInfo.username }}</p>
          <p>地区： todo......</p>
        </div>
      </div>
      <template v-if="userIsFriend">
        <van-cell> 设置备注和标签 </van-cell>
        <van-cell> 朋友权限 </van-cell>
        <van-cell> 朋友圈 </van-cell>
        <van-cell @click="talkTo"> 发消息 </van-cell>
        <van-cell> 音视频通话 </van-cell>
      </template>
      <div v-if="!userIsFriend && userInfo.stats !== 1">
        <van-cell-group>
          <van-field
            v-model="userInfo.say"
            label="好友申请"
            placeholder="请输入好友申请信息"
            :disabled="userInfo.stats === 0"
          />
        </van-cell-group>
        <van-cell>
          <van-button
            type="primary"
            size="large"
            :disabled="userInfo.stats === 0"
            @click="makeFriendRequest"
          >
            {{ userInfo.stats | statsFilter }}
          </van-button>
        </van-cell>
      </div>
    </template>
  </div>
</template>

<script>
import MyNavBar from '@components/my-nav-bar.vue'

import {getUserInfo} from '@/const/api.js'
export default {
  name: 'UserInfo',
  data() {
    return {
      userInfo: null,
    }
  },
  components: {
    MyNavBar,
  },
  filters: {
    statsFilter(stats) {
      return stats === null ? '发送好友申请' : '好友申请已发送'
    },
  },
  computed: {
    imgSrc() {
      return this.userInfo && this.userInfo.src
        ? require('@assets/head/' + this.userInfo.src)
        : require('@assets/head/head.jpg')
    },
    userIsFriend() {
      return this.userInfo && this.userInfo.friendRelationId ? true : false
    },
    loggedInUserId() {
      return this.$store.state.loggedInUserModule.loggedInUser.id.id
    },
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    talkTo() {
      this.$router.push({
        name: 'TalkView',
        params: {id: this.userInfo.userId},
      })
    },
    getUserInfo() {
      const {userId} = this.$route.params
      if (!userId) {
        this.$toast('无效的用户id')
        return
      }
      this.$axios.get(getUserInfo(userId)).then(res => {
        this.userInfo = res.data
      })
    },
    makeFriendRequest() {
      this.$store.commit('makeFriendRequest', {
        userId: this.userInfo.userId,
        say: this.userInfo.say,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.user-info {
  .main-info {
    display: flex;
    align-items: flex-start;
    padding: 10px 16px;
    .userImg {
      width: 64px;
    }
    .info-content {
      margin-left: 16px;
      h3 {
        margin: 0;
      }
      p {
        margin: 0.5em 0;
        font-size: 14px;
        color: #888;
      }
    }
  }
}
</style>
