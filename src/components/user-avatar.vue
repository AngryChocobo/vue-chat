<template>
  <van-image
    :width="width || 48"
    :height="height || 48"
    :src="imgSrc"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: 'UserAvator',
  props: {
    user: Object,
    userId: String,
    width: String,
    height: String,
  },
  computed: {
    imgSrc() {
      if (!this.user.src) {
        return require('@assets/head/head.jpg')
      }
      if (this.isMine) {
        return require('@assets/head/' +
          this.$store.state.loggedInUserModule.loggedInUser.src)
      } else {
        return require('@assets/head/' + this.user.src)
      }
    },
    isMine() {
      // 是否是自己的发言
      return (
        this.fromUserId === this.$store.state.loggedInUserModule.loggedInUser.id
      )
    },
  },
  methods: {
    goTalkDetail() {
      this.$router.push({
        name: 'TalkView',
        params: {id: this.targetUserId},
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
