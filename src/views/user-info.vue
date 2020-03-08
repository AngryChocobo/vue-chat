<template>
  <div class="user-info">
    <my-nav-bar title="用户信息" />
    <template v-if="userInfo">
      <div class="main-info">
        <img :src="imgSrc" alt="" class="userImg" />
        <div class="info-content">
          <h3>{{ userInfo.username }}</h3>
          <p>昵称： {{ userInfo.nickname }}</p>
          <p>用户名： {{ userInfo.username }}</p>
          <p>地区： todo......</p>
        </div>
      </div>
      <van-cell> 设置备注和标签 </van-cell>
      <van-cell> 朋友权限 </van-cell>
      <van-cell> 朋友圈 </van-cell>
      <van-cell> 发消息 </van-cell>
      <van-cell> 音视频通话 </van-cell>
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
  computed: {
    imgSrc() {
      return this.userInfo && this.userInfo.src
        ? require('@assets/head/' + this.userInfo.src)
        : require('@assets/head/head.jpg')
    },
  },
  components: {
    MyNavBar,
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
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
