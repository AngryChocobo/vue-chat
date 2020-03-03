<template>
  <div class="talk-input">
    <van-icon class-prefix="my-icon" name="keyboard" size="28" />
    <!-- <van-icon name="icon-font icon-yuyin" /> -->
    <van-field class="msg-input" v-model="value" placeholder="请输入骚话" />
    <div class="right-btns">
      <van-icon name="smile-o" size="28" />
      <van-icon v-show="!value" name="add-o" size="28" />
      <van-button
        v-show="value"
        class="send-btn"
        type="primary"
        size="small"
        round
        @click="sendMessage"
        >发送</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'TalkInput',
  data() {
    return {
      value: '',
    }
  },
  props: {
    onSend: {
      type: Function,
    },
  },
  destroyed() {
    this.clearInputValue()
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
.talk-input {
  position: fixed;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 16px;
  background-color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .msg-input {
    flex: 1;
    margin: 0 8px;
    padding: 4px 8px;
  }
  .right-btns {
    display: flex;
    align-items: center;
    .send-btn {
    }
  }
}
</style>
