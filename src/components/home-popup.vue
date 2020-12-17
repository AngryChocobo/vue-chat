<template>
  <base-popup :items="items" />
</template>

<script lang="ts">
import BasePopup from './base-popup.vue'
import {useRouter} from 'vue-router'

export default {
  data() {
    return {}
  },
  computed: {
    items() {
      return [
        {
          text: '新建群聊',
          iconName: 'friends',
          callback: this.goToCreateGroupPage,
        },
        {
          text: '添加好友',
          iconName: 'manager',
          callback: this.goToSearchUserAngGroupPage,
        },
      ]
    },
  },
  components: {
    BasePopup,
  },
  methods: {
    show() {
      console.log('show')
    },
    goToCreateGroupPage() {
      const router = useRouter()

      router.push({
        name: 'CreateGroup',
      })
    },
    goToSearchUserAngGroupPage() {
      const router = useRouter()

      router.push({
        name: 'SearchUserAndGroup',
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
