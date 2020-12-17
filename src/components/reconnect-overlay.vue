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

<script lang="ts">
import {computed, ref} from 'vue'
import {useStore} from '@/store/store'

export default {
  name: 'ReconnectOverlay',
  setup() {
    const value = ref('')
    const store = useStore()
    const reconnectAttempt = computed(() => {
      return store.state.socketModule.reconnectAttempt
    })

    const reconnectFailed = computed(() => {
      return store.state.socketModule.reconnectFailed
    })
    return {
      value,
      reconnectAttempt,
      reconnectFailed,
    }
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
