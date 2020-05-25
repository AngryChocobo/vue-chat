<template>
  <div class="user-info">
    <my-nav-bar title="用户信息" />
    <template v-if="userInfo">
      <div class="main-info">
        <UserAvator :user="userInfo" width="64" height="64" />
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

<script>
import MyNavBar from '@components/my-nav-bar.vue'
import {getUserInfo} from '@/const/api.js'
import UserAvator from '@/components/user-avatar.vue'
import {MAKE_FRIEND_REQUEST} from '@store/types/action-types.js'
import {mapGetters} from 'vuex'

export default {
  name: 'UserInfo',
  data() {
    return {
      say: '',
      userInfo: null,
    }
  },
  components: {
    MyNavBar,
    UserAvator,
  },
  computed: {
    ...mapGetters(['loggedInUserId']),
    imgSrc() {
      return this.userInfo && this.userInfo.avatar
        ? require('@assets/head/' + this.userInfo.avatar)
        : require('@assets/head/head.jpg')
    },
    isMyFriend() {
      return this.userInfo && !!this.userInfo.friendRelation
    },
    canMakeFriend() {
      return !this.isMyFriend && this.loggedInUserId !== this.userInfo.id
    },
    isMakedFriendRequest() {
      return this.userInfo && !!this.userInfo.makeFriendRecord
    },
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    talkTo() {
      this.$router.push({
        name: 'TalkView',
        params: {id: this.userInfo.id},
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
        this.say =
          (res.data.makeFriendRecord && res.data.makeFriendRecord.say) || ''
      })
    },
    makeFriendRequest() {
      this.$store.dispatch(MAKE_FRIEND_REQUEST, {
        targetUserId: this.userInfo.id,
        say: this.say,
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
