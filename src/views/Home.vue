<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <my-btn @click.native="show">
      <span>你</span>
      <span>好</span>
      <span>吗</span>
    </my-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import Mybtn from '@/components/test/my-btn.vue'

export default {
  name: 'Home',
  components: {
    'my-btn': Mybtn,
  },
  created() {
    console.log('Home created')
  },
  mounted() {
    console.log('Home mounted')
  },
  destroyed() {
    console.log('Home destroyed')
  },
  methods: {
    show(v) {
      console.log('父组件收到了click事件：', v)
    },
  },
}
</script>
