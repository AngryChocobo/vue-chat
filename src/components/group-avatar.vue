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
  name: 'GroupAvatar',
  props: {
    width: String,
    height: String,
  },
  computed: {
    imgSrc() {
      return require('@assets/head/default-group-avatar.svg')
    },
  },
}
</script>

<style lang="less" scoped></style>
