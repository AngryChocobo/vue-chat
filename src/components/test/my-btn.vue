<template>
  <form action="">
    <div @click="handleDivClick" id="father-div" class="button-wrapper">
      <button class="my-btn" @click="handleClick">
        <slot></slot>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  created() {
    console.log('my-btn created')
  },
  mounted() {
    console.log('my-btn mounted')
  },
  destroyed() {
    console.log('my-btn destroyed')
  },
  methods: {
    handleDivClick(event) {
      // if (event.target === event.currentTarget) {
      console.log('div 被点击了')
      // }
      // event.preventDefault()
    },
    handleClick(event) {
      console.log('组件收到了click事件：', event)
      // this.$emit('clicked', event)
      // event.stopPropagation()
      // event.prevent()
      // debugger
      // event.preventDefault()
    },
  },
}
</script>

<style>
.button-wrapper {
  padding: 40px;
}
</style>
