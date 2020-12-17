<template>
  <div class="create-group">
    <my-nav-bar title="创建群聊" />
    <van-field
      v-model.trim="groupName"
      rows="2"
      autosize
      label="群名称"
      type="textarea"
      maxlength="10"
      placeholder="请输入群名称"
      show-word-limit
    />
    <div style="margin: 16px 16px 32px 16px; ">
      <van-button
        block
        type="info"
        :disabled="groupName.length == 0"
        @click="createGroup"
      >
        立即创建
      </van-button>
    </div>
  </div>
</template>

<script>
import MyNavBar from '@/components/my-nav-bar.vue'
import {CREATE_GROUP} from '@/store/types/action-types'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default {
  name: 'FriendList',
  components: {
    MyNavBar,
  },
  data() {
    return {
      groupName: '',
    }
  },
  methods: {
    toFriendRequestList() {
      const router = useRouter()

      router.push({
        path: 'friend-request-list',
      })
    },
    checkFriendInfo(friend) {
      const router = useRouter()

      router.push({
        name: 'UserInfo',
        params: {userId: friend.id},
      })
    },
    createGroup() {
      const store = useStore()
      // store.dispatch(CREATE_GROUP, {groupName: this.groupName})
      store.dispatch(CREATE_GROUP, {groupName: ''})
    },
  },
}
</script>

<style lang="less" scoped></style>
