<template>
  <base-popup :items="items" />
</template>

<script lang="ts">
import BasePopup from './base-popup.vue'
import {useRouter} from 'vue-router'

export default {
  components: {
    BasePopup,
  },
  setup() {
    const router = useRouter()
    function goToCreateGroupPage() {
      router.push({
        name: 'CreateGroup',
      })
    }
    function goToSearchUserAngGroupPage() {
      router.push({
        name: 'SearchUserAndGroup',
      })
    }
    const items = [
      {
        text: '新建群聊',
        iconName: 'friends',
        callback: goToCreateGroupPage,
      },
      {
        text: '添加好友',
        iconName: 'manager',
        callback: goToSearchUserAngGroupPage,
      },
    ]
    return {
      items,
    }
  },
}
</script>
