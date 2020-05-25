<template>
  <div id="app">
    <router-view></router-view>
    <reconnect-overlay />
  </div>
</template>

<script>
import ReconnectOverlay from '@components/reconnect-overlay.vue'
export default {
  name: 'app',
  components: {
    ReconnectOverlay,
  },
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* 引入第三方或自定义的字体图标样式 */
@font-face {
  font-family: 'my-icon';
  src: url('./assets/font/iconfont.ttf') format('truetype');
}

.my-icon {
  position: relative;
  display: inline-block;
  font: normal normal normal 14px/1 my-icon;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}

.my-icon-keyboard::before {
  content: '\e64b';
}
</style>
