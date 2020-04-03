<template>
  <div class="friend-request-info">
    <my-nav-bar title="好友申请" />
    <template v-if="requestInfo">
      <div class="main-info">
        <img :src="imgSrc" alt="" class="userImg" />
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

<script>
import MyNavBar from '@components/my-nav-bar.vue'
import {getFriendRequestInfo} from '@/const/api.js'
import {AGREE_MAKE_FRIEND_REQUEST} from '@store/types/action-types.js'
export default {
  name: 'FriendRequestInfo',
  data() {
    return {
      requestInfo: null,
    }
  },
  components: {
    MyNavBar,
  },
  computed: {
    imgSrc() {
      return this.requestInfo && this.requestInfo.makeRecordUserInfo.src
        ? require('@assets/head/' + this.requestInfo.makeRecordUserInfo.src)
        : require('@assets/head/head.jpg')
    },
  },
  mounted() {
    this.getFriendRequestInfo()
  },
  methods: {
    getFriendRequestInfo() {
      const {userId} = this.$route.params
      if (!userId) {
        this.$toast('无效的用户id')
        return
      }
      this.$axios.get(getFriendRequestInfo(userId)).then(res => {
        this.requestInfo = res.data
      })
    },
    agree() {
      this.$store.dispatch(AGREE_MAKE_FRIEND_REQUEST, {
        targetUserId: this.$route.params.userId,
        recordId: this.requestInfo.id,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.friend-request-info {
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
