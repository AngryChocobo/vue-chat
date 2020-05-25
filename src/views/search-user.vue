<template>
  <div class="search-user">
    <my-nav-bar title="搜索用户" />
    <van-search
      v-model="keyword"
      placeholder="请输入搜索关键词"
      @search="searchUsers"
    />
    <van-list>
      <van-cell
        class="user"
        v-for="user in userList"
        :key="user.id"
        @click="checkUserInfo(user)"
      >
        <UserAvator
          :user="user"
          round
          @click.native="goTalkView"
          style="margin-right: 8px;"
        />
        <span class="username">{{ user.username }}</span>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import MyNavBar from '@components/my-nav-bar.vue'
import UserAvator from '@/components/user-avatar.vue'
import {searchUsers} from '@const/api'
export default {
  name: 'SearchUser',
  components: {
    MyNavBar,
    UserAvator,
  },
  data() {
    return {
      keyword: '',
      userList: [],
      activeName: 'all',
    }
  },
  watch: {
    keyword(value) {
      this.keyword = value.trim()
    },
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
    searchUsers() {
      this.$axios.get(searchUsers(this.keyword)).then(res => {
        this.userList = res.data
        if (res.data.length == 0) {
          this.$toast('无查询结果')
        }
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
.search-user {
  padding: 0;
  .user {
    .van-cell__value {
      display: flex;
      align-items: center;
    }
  }
}
</style>
