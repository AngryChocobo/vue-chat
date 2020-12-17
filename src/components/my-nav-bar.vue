<template>
  <div class="my-nav-bar">
    <van-nav-bar
      @click-left="onClickLeft"
      :left-arrow="leftArrow"
      v-bind="$attrs"
    >
      <slot name="left"></slot>
      <slot name="title"></slot>
      <slot name="right"></slot>
    </van-nav-bar>
  </div>
</template>

<script lang="ts">
import {useRouter} from 'vue-router'
export default {
  name: 'MyNavBar',
  props: {
    leftArrow: Boolean,
  },
  setup(props) {
    const router = useRouter()

    function onClickLeft() {
      props.leftArrow && router.back()
    }

    return {
      onClickLeft,
    }
  },
}
</script>

<style lang="less" scoped>
.my-nav-bar {
  height: 46px; // 起到占位置的作用
  /deep/ .van-nav-bar--fixed {
    left: 50%;
    transform: translateX(-50%);
    max-width: 600px;
  }
}
</style>
