<template>
  <div class="search-user-and-group">
    <my-nav-bar title="搜索" left-arrow />
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

<script lang="ts">
import MyNavBar from '@/components/my-nav-bar.vue'
import UserAvatar from '@/components/user-avatar.vue'
import {getSearchUserResult} from '@/api/user'
import {useRouter} from 'vue-router'
import {onMounted, ref} from 'vue'
import {Toast} from 'vant'

export default {
  name: 'SearchUserAndGroup',
  components: {
    MyNavBar,
    UserAvatar,
  },
  setup() {
    const router = useRouter()
    const keyword = ref('')
    const userList = ref([])
    const activeName = ref('all')
    function checkUserInfo(user) {
      router.push({
        name: 'UserInfo',
        params: {
          userId: user.id,
        },
      })
    }
    async function searchUsers() {
      const result: any = await getSearchUserResult(keyword.value)
      if (result.length == 0) {
        Toast('无查询结果')
      } else {
        userList.value = result
      }
    }
    function goTalkView() {
      //
    }
    onMounted(searchUsers)
    return {
      keyword,
      userList,
      activeName,
      goTalkView,
      searchUsers,
      checkUserInfo,
    }
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
