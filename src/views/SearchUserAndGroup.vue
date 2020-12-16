<template>
  <div class="search-user-and-group">
    <my-nav-bar title="搜索" />
    <van-search
      v-model.trim="keyword"
      placeholder="请输入搜索关键词"
      @search="searchUsers"
    />
    <van-list class="list">
      <van-cell
        class="user"
        v-for="user in userList"
        :key="user.id"
        @click="checkUserInfo(user)"
      >
        <UserAvatar
          :avatar="user.avatar"
          round
          @click="goTalkView"
          style="margin-right: 8px;"
        />
        <span class="username">{{ user.username }}</span>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import MyNavBar from '@components/my-nav-bar.vue'
import UserAvatar from '@/components/user-avatar.vue'
import {getSearchUserResult} from '@/api/user'

export default {
  name: 'SearchUserAndGroup',
  components: {
    MyNavBar,
    UserAvatar,
  },
  data() {
    return {
      keyword: '',
      userList: [],
      activeName: 'all',
    }
  },
  mounted() {
    this.searchUsers()
  },
  methods: {
    checkUserInfo(user) {
      this.$router.push({
        name: 'UserInfo',
        params: {
          userId: user.id,
        },
      })
    },
    async searchUsers() {
      const userList = await getSearchUserResult(this.keyword)
      if (userList.length == 0) {
        this.$toast('无查询结果')
      } else {
        this.userList = userList
      }
    },
    goTalkView() {},
  },
}
</script>

<style lang="less" scoped>
.search-user-and-group {
  height: 100%;
  .list {
    height: calc(100% - 100px);
    overflow-y: auto;
  }
  .user {
    .van-cell__value {
      display: flex;
      align-items: center;
    }
  }
}
</style>
