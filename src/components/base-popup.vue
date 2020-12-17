<template>
  <div class="base-popup">
    <van-icon name="add-o" size="30" @click="show = true" />
    <van-popup
      v-model:show="show"
      position="right"
      class="popup-body"
      teleport="body"
      :style="{
        width: '50%',
        top: '46px',
        right: '8px',
        borderRadius: '8px',
        transform: 'translate3d(0, 0, 0)',
      }"
    >
      <div class="content">
        <div
          class="popup-item"
          v-for="item in items"
          :key="item.text"
          @click="item.callback()"
        >
          <van-icon :name="item.iconName" size="30" />
          <span>{{ item.text }}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    }
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.content {
  padding: 8px 16px;
  // display: flex;
  // flex-direction: column;
  .popup-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    &:last-child {
      margin: 0;
    }
    span {
      margin-left: 8px;
    }
  }
}
</style>
