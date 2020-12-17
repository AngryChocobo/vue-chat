<template>
  <transition name="fade">
    <div class="emoji-select" v-show="show">
      <!-- <img
        class="emoji"
        v-for="emoji in emojiList"
        :key="emoji.url"
        :src="emoji.url"
        @click="selectEmoji(emoji.url)"
      /> -->
      <span
        class="emoji"
        v-for="(emoji, index) in emojiList"
        :key="index"
        @click="$emit('select', emoji)"
      >
        {{ emoji }}
      </span>
    </div>
  </transition>
</template>

<script lang="ts">
// import {fetchUserEmojiList} from '@/api/user'
import emjFaces from '@/assets/emoji-faces.json'
import {ref, SetupContext} from 'vue'

export default {
  name: 'EmojiPicker',
  props: {
    show: {
      type: Boolean,
    },
  },
  setup(props, context: SetupContext) {
    const selectedEmoji = ref('')
    function selectEmoji(url) {
      selectedEmoji.value = url
      context.emit('select', url)
    }
    return {
      selectEmoji,
      selectedEmoji,
      emojiList: emjFaces,
    }
  },
}
</script>

<style lang="less" scoped>
.emoji-select {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 16px;
  row-gap: 16px;
  padding: 8px;
  height: 200px;
  box-sizing: border-box;
  background-color: #fff;
  .emoji {
    text-align: center;
    user-select: none;
    border-radius: 4px;
    &:hover {
      background-color: #ccc;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: height 1s;
}

.fade-enter,
.fade-leave-to {
  height: 0;
}

.fade-enter-to {
  height: 200px;
}
</style>
