<template>
  <van-image
    :width="width || 48"
    :height="height || 48"
    :avatar="imgSrc"
    v-bind="$attrs"
  />
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'UserAvator',
  props: {
    user: Object,
    width: String,
    height: String,
  },
  computed: {
    ...mapGetters(['loggedInUser']),
    imgSrc() {
      if (this.isMine) {
        return require('@assets/head/' + this.loggedInUser.avatar)
      } else {
        return require('@assets/head/' + this.user.avatar)
      }
    },
    isMine() {
      return this.user && this.user.id === this.loggedInUser.id
    },
  },
  methods: {
    goTalkDetail() {
      this.$router.push({
        name: 'TalkView',
        params: {id: this.user.id},
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
