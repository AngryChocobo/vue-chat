<template>
  <div class="friend-request-info">
    <my-nav-bar title="好友申请" left-arrow />
    <template v-if="requestInfo">
      <div class="main-info">
        <UserAvatar :avatar="requestInfo.makeRecordUserInfo.avatar" />
        <div class="info-content">
          <h3>
            {{
              requestInfo.makeRecordUserInfo.nickname ||
                requestInfo.makeRecordUserInfo.username
            }}
          </h3>
          <p>{{ 100 }} 个共同好友</p>
        </div>
      </div>
      <van-cell-group>
        <van-field v-model="requestInfo.say" label="附加信息" readonly />
      </van-cell-group>
      <van-cell>
        <van-button
          v-if="requestInfo.stats === 'Waiting'"
          type="primary"
          size="large"
          @click="agree"
        >
          同意
        </van-button>
        <van-button
          v-if="requestInfo.stats === 'Agree'"
          disabled
          type="primary"
          size="large"
          @click="agree"
        >
          已同意
        </van-button>
        <van-button
          v-if="requestInfo.stats === 'Disagree'"
          disabled
          type="danger"
          size="large"
          @click="agree"
        >
          已拒绝
        </van-button>
      </van-cell>
    </template>
  </div>
</template>

<script lang="ts">
import MyNavBar from '@/components/my-nav-bar.vue'
import UserAvatar from '@/components/user-avatar.vue'
import {getFriendRequestInfo} from '@/api/user'
import {AGREE_MAKE_FRIEND_REQUEST} from '@/store/types/action-types'
import {useStore} from '@/store/store'
import {onMounted, ref} from 'vue'
import {Toast} from 'vant'
import {useRoute} from 'vue-router'

export default {
  name: 'FriendRequestInfo',
  components: {
    MyNavBar,
    UserAvatar,
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const requestInfo: any = ref(null)

    async function fetchFriendRequestInfo() {
      const {userId} = route.params
      if (!userId) {
        Toast('无效的用户id')
        return
      }
      const data = await getFriendRequestInfo(userId)
      requestInfo.value = data
    }
    function agree() {
      store.dispatch(AGREE_MAKE_FRIEND_REQUEST, {
        targetUserId: route.params.userId,
        recordId: requestInfo.value.id,
      })
    }
    onMounted(fetchFriendRequestInfo)
    return {
      requestInfo,
      agree,
    }
  },
}
</script>

<style lang="less" scoped>
.friend-request-info {
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
