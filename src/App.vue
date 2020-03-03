<template>
  <div id="app">
    <!-- <img src="./assets/logo.png" /> -->
    <div>
      <router-link to="/talk-list">talk-list</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
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
