<template>
  <div class="create-group">
    <my-nav-bar title="创建群聊" left-arrow />
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

<script lang="ts">
import MyNavBar from '@/components/my-nav-bar.vue'
import {CREATE_GROUP} from '@/store/types/action-types'
import {useStore} from '@/store/store'
import {useRouter} from 'vue-router'
import {ref} from 'vue'

export default {
  name: 'FriendList',
  components: {
    MyNavBar,
  },
  setup() {
    const groupName = ref('')
    const store = useStore()
    const router = useRouter()
    function toFriendRequestList() {
      router.push({
        path: 'friend-request-list',
      })
    }
    function checkFriendInfo(friend) {
      router.push({
        name: 'UserInfo',
        params: {userId: friend.id},
      })
    }
    function createGroup() {
      store.dispatch(CREATE_GROUP, {groupName: groupName.value})
    }
    return {
      groupName,
      toFriendRequestList,
      checkFriendInfo,
      createGroup,
    }
  },
}
</script>

<style lang="less" scoped></style>
