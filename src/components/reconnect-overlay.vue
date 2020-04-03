<template>
  <van-overlay
    :show="!!reconnectAttempt || reconnectFailed"
    class="reconnect-overlay"
  >
    <div class="wrapper">
      <van-loading
        v-if="reconnectAttempt"
        color="#fff"
        size="64"
        type="spinner"
      />
      <p>未能连接到服务器</p>
      <p v-if="reconnectAttempt">第{{ reconnectAttempt }}次重连中</p>
      <p v-if="reconnectFailed">请稍后刷新重试</p>
    </div>
  </van-overlay>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'ReconnectOverlay',
  data() {
    return {
      value: '',
    }
  },
  computed: {
    ...mapState({
      reconnectAttempt: state => state.socketModule.reconnectAttempt,
      reconnectFailed: state => state.socketModule.reconnectFailed,
    }),
  },
  methods: {
    clearInputValue() {
      this.value = ''
    },
    sendMessage() {
      this.onSend(this.value)
      this.clearInputValue()
    },
  },
}
</script>

<style lang="less" scoped>
.reconnect-overlay {
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    .van-loading {
      margin-bottom: 20px;
    }
    p {
      margin: 0 0 8px 0;
      color: #fff;
    }
  }
}
</style>
