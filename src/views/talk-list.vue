<template>
  <div class="talk-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="talk in talkList"
        :key="talk.id"
        :title="talk.targetName"
      />
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'TalkList',
  data() {
    return {
      talkList: [
        {
          id: 1,
          targetName: '高明震',
          targetType: 'User',
        },
        {
          id: 2,
          targetName: '李积龙',
          targetType: 'User',
        },
      ],
      loading: false,
      finished: true,
    }
  },
  methods: {
    onLoad() {},
  },
}
</script>

<style lang="less" scoped></style>
