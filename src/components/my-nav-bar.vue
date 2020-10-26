<template>
  <div class="my-nav-bar">
    <van-nav-bar
      :title="title"
      :left-text="leftText"
      :right-text="rightText"
      :left-arrow="leftArrow"
      :fixed="!noFixed"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template slot="left"> <slot name="left"></slot> </template>
      <template slot="title"> <slot name="title"></slot></template>
      <template slot="right"> <slot name="right"></slot></template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'MyNavBar',
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    onSend: {
      type: Function,
    },
    leftText: {
      type: String,
      default: '',
    },
    rightText: {
      type: String,
      default: '',
    },
    leftArrow: {
      type: Boolean,
      default: true,
    },
    noFixed: {
      type: Boolean,
      default: false,
    },
    onClickRight: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    onClickLeft() {
      this.leftArrow && this.$router.back()
    },
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
