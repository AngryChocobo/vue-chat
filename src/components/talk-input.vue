<template>
  <div class="talk-input-wrapper">
    <emoji-picker ref="emojiPicker" @select="onPickEmoji" />

    <div class="talk-input">
      <van-icon class-prefix="my-icon" name="keyboard" size="28" />
      <!-- <van-icon name="icon-font icon-yuyin" /> -->
      <van-field
        class="message-input"
        v-model="value"
        placeholder="请输入骚话"
      />
      <div class="right-btns">
        <van-icon name="smile-o" size="28" @click.native="openEmojiPicker" />
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
  </div>
</template>

<script>
import EmojiPicker from '@/components/emoji-picker.vue'
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
  components: {
    EmojiPicker,
  },
  methods: {
    clearInputValue() {
      this.value = ''
    },
    sendMessage() {
      this.onSend(this.value)
      this.clearInputValue()
    },
    openEmojiPicker() {
      this.$refs.emojiPicker.open()
    },
    onPickEmoji(url) {
      this.onSend(url)
    },
  },
  destroyed() {
    this.clearInputValue()
  },
}
</script>

<style lang="less" scoped>
.talk-input-wrapper {
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
    .message-input {
      flex: 1;
      margin: 0 8px;
      padding: 4px 8px;
    }
    .right-btns {
      display: flex;
      align-items: center;
    }
  }
}
</style>
