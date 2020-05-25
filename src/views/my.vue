<template>
  <div class="my">
    <my-nav-bar title="我" :left-arrow="false" />
    <div class="main-info">
      <img :src="imgSrc" alt="" class="user-img" />
      <div class="info-content">
        <h3>
          {{ loggedInUserInfo.nickname }}
        </h3>
        <p class="username">用户名：{{ loggedInUserInfo.username }}</p>
      </div>
    </div>
    <van-cell @click="goMySettings"> 设置个人资料 </van-cell>
    <my-tab-bar />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import MyTabBar from '@components/my-tab-bar.vue'
import MyNavBar from '@components/my-nav-bar.vue'
export default {
  name: 'My',
  components: {
    MyTabBar,
    MyNavBar,
  },
  data() {
    return {
      userInfo1: null,
    }
  },
  computed: {
    ...mapState({
      loggedInUserInfo: state => state.loggedInUserModule.loggedInUser,
    }),
    imgSrc() {
      return this.loggedInUserInfo && this.loggedInUserInfo.avatar
        ? require('@assets/head/' + this.loggedInUserInfo.avatar)
        : require('@assets/head/head.jpg')
    },
  },
  methods: {
    goMySettings() {
      this.$router.push('my-settings')
    },
  },
}
</script>

<style lang="less" scoped>
.my {
  .main-info {
    display: flex;
    align-items: flex-start;
    padding: 10px 16px;
    .user-img {
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
