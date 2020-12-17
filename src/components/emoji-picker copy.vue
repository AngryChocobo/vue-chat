<template>
  <van-dialog
    class="emoji-select-dialog"
    v-model="visible"
    title="表情包选择"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <div class="emoji-select">
      <img
        class="emoji"
        v-for="emoji in emojiList"
        :key="emoji.url"
        :src="emoji.url"
        @click="selectEmoji(emoji.url)"
      />
    </div>
  </van-dialog>
</template>

<script lang="ts">
import {fetchUserEmojiList} from '@/api/user'
export default {
  name: 'EmojiPicker',
  data() {
    return {
      visible: false,
      emojiList: [],
      selectedEmoji: '',
    }
  },
  methods: {
    selectEmoji(url) {
      this.selectedEmoji = url
      this.$emit('select', url)
      this.visible = false
    },
    async fetchUserEmojiList() {
      const list = await fetchUserEmojiList()
      this.emojiList = list || []
    },
    open() {
      console.log('open')

      if (!this.visible) {
        this.visible = true
        this.fetchUserEmojiList()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.emoji-select {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 16px;
  row-gap: 16px;
  padding: 32px;
  .emoji {
    width: 80px;
    height: 80px;
    border: 1px dashed transparent;
  }
}
</style>
