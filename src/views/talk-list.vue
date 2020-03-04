<template>
  <div class="talk-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="talk in talkList" :key="talk.id">
        <talk-list-item
          :id="talk.id"
          :src="talk.src"
          :username="talk.username"
          :date="talk.date"
          :message="talk.message"
          :type="talk.type"
        />
      </van-cell>
    </van-list>
    <my-tab-bar />
  </div>
</template>

<script>
import MyTabBar from '@components/my-tab-bar.vue'
import TalkListItem from '@components/talk-list-item.vue'
export default {
  name: 'TalkList',
  components: {
    TalkListItem,
    MyTabBar,
  },
  data() {
    return {
      talkList: [
        {
          id: 1,
          src: require('@assets/head/head-1.jpg'),
          username: '高明震',
          date: 1582861517672,
          message: '行，回去说吧😊',
          type: 1,
        },
        {
          id: 2,
          src: require('@assets/head/head-2.jpg'),
          username: '李积龙',
          date: 1582811517672,
          message: '中午吃啥',
          type: 1,
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
