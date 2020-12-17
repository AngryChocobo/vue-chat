<template>
  <van-image
    :width="width || 48"
    :height="height || 48"
    :src="imgSrc"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
export default {
  name: 'UserAvatar',
  props: {
    avatar: {
      type: String,
    },
    width: String,
    height: String,
  },
  computed: {
    imgSrc() {
      return require('@/assets/head/' + (this.avatar || 'head.jpg'))
    },
  },
}
</script>

<style lang="less" scoped></style>
