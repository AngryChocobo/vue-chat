<template>
  <div class="my">
    <my-nav-bar title="我" :left-arrow="false" />
    <div class="main-info">
      <UserAvatar :avatar="loggedInUser.avatar" width="64" height="64" />
      <div class="info-content">
        <h3>
          {{ loggedInUser.nickname }}
        </h3>
        <p class="username">用户名：{{ loggedInUser.username }}</p>
      </div>
    </div>
    <van-cell @click="goMySettings"> 设置个人资料 </van-cell>
    <my-tab-bar />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import UserAvatar from '@/components/user-avatar.vue'
import MyTabBar from '@/components/my-tab-bar.vue'
import MyNavBar from '@/components/my-nav-bar.vue'
import {useRouter} from 'vue-router'

export default {
  name: 'My',
  components: {
    MyTabBar,
    MyNavBar,
    UserAvatar,
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  methods: {
    goMySettings() {
      const router = useRouter()

      router.push('my-settings')
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
