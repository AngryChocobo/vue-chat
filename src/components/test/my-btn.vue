<template>
  <button class="my-btn" @click="handleClick"><slot></slot></button>
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
    handleClick(event) {
      console.log('组件收到了click事件：', event)
      this.$emit('clicked', event)
    },
  },
}
</script>

<style></style>
