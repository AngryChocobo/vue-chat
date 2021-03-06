<template>
  <div class="talk-list-item" @click="goTalkDetail">
    <div class="avatar-wrapper">
      <UserAvatar :avatar="userInfo.avatar" round />
      <div v-show="unReadCount" class="dot">{{ unReadCount }}</div>
    </div>
    <div class="content">
      <div class="content-header">
        <p class="targetUserName">{{ userInfo.username }}</p>
        <p class="sendDate">{{ formatedDate }}</p>
      </div>
      <p class="message van-ellipsis">
        {{ `${lastMessageUserName}: ${message}` }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 对话列表的子组件，作为一个用户/群存在
 */
import UserAvatar from '@/components/user-avatar.vue'
import {useRouter} from 'vue-router'
import {computed} from 'vue'
import dayjs from 'dayjs'

export default {
  name: 'TalkListItem',
  components: {
    UserAvatar,
  },
  props: {
    userInfo: Object,
    message: String, // 对话内容
    sendDate: String, // 对话时间
    lastMessageUserName: String, // 最后发言用户名
    unReadCount: Number,
  },
  setup(props: any) {
    const router = useRouter()
    const formatedDate = computed(() => {
      return dayjs(props.sendDate).format('YYYY/MM/DD')
    })
    function goTalkDetail() {
      router.push({
        name: 'TalkView',
        params: {id: props.userInfo.id},
      })
    }
    return {
      formatedDate,
      goTalkDetail,
    }
  },
}
</script>

<style lang="less" scoped>
.talk-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .avatar-wrapper {
    position: relative;
    .dot {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      min-width: 16px;
      padding: 0 3px;
      color: #fff;
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      background-color: #ee0a24;
      border: 1px solid #fff;
      border-radius: 16px;
    }
  }

  .content {
    flex: 1;
    margin-left: 12px;
    min-width: 0; // 解决内容中text-overflow: ellipsis;没有生效的bug
    p {
      margin: 0;
    }
    .content-header {
      display: flex;
      justify-content: space-between;
      .sendDate {
        font-weight: lighter;
      }
    }
    .message {
      font-weight: lighter;
    }
  }
}
</style>
