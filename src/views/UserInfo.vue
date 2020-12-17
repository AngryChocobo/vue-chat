<template>
  <div class="user-info">
    <my-nav-bar title="用户信息" left-arrow />
    <template v-if="userInfo">
      <div class="main-info">
        <UserAvatar :avatar="userInfo.avatar" width="64" height="64" />
        <div class="info-content">
          <h3>
            {{ userInfo.nickname || userInfo.username }}
          </h3>
          <!-- <p v-if="userInfo.friendRemark">昵称： {{ userInfo.nickname }}</p> -->
          <!-- <p>用户名： {{ userInfo.username }}</p> -->
          <!-- <p>地区： todo......</p> -->
        </div>
      </div>
      <template v-if="isMyFriend">
        <van-cell> 设置备注和标签 </van-cell>
        <van-cell> 朋友权限 </van-cell>
        <van-cell> 朋友圈 </van-cell>
        <van-cell @click="talkTo"> 发消息 </van-cell>
        <van-cell> 音视频通话 </van-cell>
      </template>
      <div v-if="canMakeFriend">
        <van-cell-group>
          <van-field
            v-model="say"
            label="好友申请"
            placeholder="请输入好友申请信息"
            :disabled="isMakedFriendRequest"
          />
        </van-cell-group>
        <van-cell>
          <van-button
            type="primary"
            size="large"
            :disabled="isMakedFriendRequest"
            @click="makeFriendRequest"
          >
            {{ isMakedFriendRequest ? '好友申请已发送' : '发送好友申请' }}
          </van-button>
        </van-cell>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import MyNavBar from '@/components/my-nav-bar.vue'
import {getUserInfoAndFriendRelation} from '@/api/user'
import UserAvatar from '@/components/user-avatar.vue'
import {MAKE_FRIEND_REQUEST} from '@/store/types/action-types'
import {useStore} from '@/store/store'
import {useRouter, useRoute} from 'vue-router'
import {computed, onMounted, reactive, ref} from 'vue'
import {Toast} from 'vant'

export default {
  name: 'UserInfo',
  components: {
    MyNavBar,
    UserAvatar,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const say = ref('')
    const loggedInUserId = store.getters.loggedInUserId

    const userInfo: any = reactive({})
    const isMyFriend = computed(() => {
      return userInfo && userInfo.friendRelation
    })

    const canMakeFriend = computed(() => {
      return userInfo.id && !isMyFriend.value && loggedInUserId !== userInfo.id
    })

    const isMakedFriendRequest = computed(() => {
      return userInfo && !!userInfo.makeFriendRecord
    })

    function talkTo() {
      router.push({
        name: 'TalkView',
        params: {id: userInfo.id},
      })
    }
    async function fetchUserInfoAndFriendRelation() {
      const {userId} = route.params
      if (!userId) {
        Toast('无效的用户id')
        return
      }
      const result: any = await getUserInfoAndFriendRelation(userId)
      Object.assign(userInfo, result)
      say.value = (result.makeFriendRecord && result.makeFriendRecord.say) || ''
    }
    function makeFriendRequest() {
      store.dispatch(MAKE_FRIEND_REQUEST, {
        targetUserId: userInfo.id,
        say: say.value,
      })
    }
    onMounted(fetchUserInfoAndFriendRelation)
    return {
      say,
      isMyFriend,
      userInfo,
      canMakeFriend,
      isMakedFriendRequest,
      makeFriendRequest,
      talkTo,
    }
  },
}
</script>

<style lang="less" scoped>
.user-info {
  height: calc(100% - 50px);
  overflow-y: auto;
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
