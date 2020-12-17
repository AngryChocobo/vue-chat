<template>
  <div class="friend-request-list">
    <my-nav-bar title="新朋友" left-arrow />
    <van-list>
      <van-cell
        class="friend"
        v-for="friend in friendRequestList"
        :key="friend.id"
        @click="checkFriendRequestInfo(friend.makeRecordUserInfo)"
      >
        <div class="friend-info">
          <UserAvatar
            :avatar="friend.makeRecordUserInfo.avatar"
            style="margin-right: 8px"
          />
          <span class="username">{{ friend.makeRecordUserInfo.username }}</span>
        </div>
        <van-tag type="primary" v-if="friend.stats === 'Waiting'" plain
          >待通过</van-tag
        >
        <van-tag type="success" v-if="friend.stats === 'Agree'" plain
          >已通过</van-tag
        >
        <van-tag type="danger" v-if="friend.stats === 'Disagree'" plain
          >已拒绝</van-tag
        >
        <!-- todo 根据不同的stats显示通过状态 -->
      </van-cell>
    </van-list>
  </div>
</template>

<script lang="ts">
import {CLEAR_UN_READ_FRIEND_REQUEST} from '@/store/types/action-types'
import MyNavBar from '@/components/my-nav-bar.vue'
import UserAvatar from '@/components/user-avatar.vue'
import {useStore} from '@/store/store'
import {useRouter} from 'vue-router'
import {computed, onMounted, ref} from 'vue'

export default {
  name: 'FriendRequestList',
  components: {
    MyNavBar,
    UserAvatar,
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const activeName = ref('all')
    const friendRequestList = computed(() => {
      return store.state.socketModule.friendRequestList
    })

    function clearUnReadFriendRequest() {
      if (friendRequestList.value.length > 0) {
        store.dispatch(CLEAR_UN_READ_FRIEND_REQUEST)
      }
    }
    function checkFriendRequestInfo(friend) {
      router.push({
        name: 'FriendRequestInfo',
        params: {
          userId: friend.id,
        },
      })
    }

    onMounted(clearUnReadFriendRequest)
    return {
      activeName,
      friendRequestList,
      clearUnReadFriendRequest,
      checkFriendRequestInfo,
    }
  },
}
</script>

<style lang="less" scoped>
.friend-request-list {
  height: calc(100% - 50px);
  overflow-y: auto;
  /deep/.friend {
    .van-cell__value {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .friend-info {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
