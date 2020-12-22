<template>
  <div class="my-nav-bar">
    <van-nav-bar
      @click-left="onClickLeft"
      :left-arrow="leftArrow"
      v-bind="$attrs"
    >
      <template v-slot:left> <slot name="left"></slot> </template>
      <template v-slot:title> <slot name="title"></slot></template>
      <template v-slot:right> <slot name="right"></slot></template>
    </van-nav-bar>
  </div>
</template>

<script lang="ts">
import {SetupContext} from 'vue'
import {useRouter} from 'vue-router'
export default {
  name: 'MyNavBar',
  props: {
    leftArrow: Boolean,
  },
  setup(props: any, context: SetupContext) {
    const router = useRouter()
    console.log(context)
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
