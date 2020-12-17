<template>
  <div class="talk-input-wrapper">
    <div class="talk-input">
      <van-icon class-prefix="my-icon" name="keyboard" size="28" />
      <!-- <van-icon name="icon-font icon-yuyin" /> -->
      <van-field
        class="message-input"
        v-model="value"
        placeholder="请输入骚话"
      />
      <div class="right-btns">
        <van-icon name="smile-o" size="28" @click="openEmojiPicker" />
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
    <emoji-picker
      ref="emojiPicker"
      @select="appendEmoji"
      v-model:show="showEmojiPicker"
    />
  </div>
</template>

<script lang="ts">
import EmojiPicker from '@/components/emoji-picker.vue'
import {onUnmounted, ref} from 'vue'

export default {
  name: 'TalkInput',
  components: {
    EmojiPicker,
  },
  props: {
    onSend: {
      type: Function,
    },
  },
  setup(props: any) {
    const value = ref('')
    const showEmojiPicker = ref(false)
    function clearInputValue() {
      value.value = ''
    }
    function sendMessage() {
      props.onSend(value.value)
      clearInputValue()
    }
    function openEmojiPicker() {
      showEmojiPicker.value = !showEmojiPicker.value
    }
    function appendEmoji(emoji) {
      showEmojiPicker.value = false
      value.value += emoji
    }
    onUnmounted(clearInputValue)
    return {
      clearInputValue,
      sendMessage,
      openEmojiPicker,
      appendEmoji,
    }
  },
}
</script>

<style lang="less" scoped>
.talk-input-wrapper {
  position: fixed;
  bottom: 0;
  width: 100%;

  .talk-input {
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
