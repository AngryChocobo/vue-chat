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
          :name="talk.name"
          :date="talk.date"
          :msg="talk.msg"
          :type="talk.type"
        />
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import TalkListItem from '@components/talk-list-item.vue'
export default {
  name: 'TalkList',
  components: {
    TalkListItem,
  },
  data() {
    return {
      talkList: [
        {
          id: 1,
          src: require('@assets/head/head-1.jpg'),
          name: '高明震',
          date: 1582861517672,
          msg: '行，回去说吧😊',
          type: 1,
        },
        {
          id: 2,
          src: require('@assets/head/head-2.jpg'),
          name: '李积龙',
          date: 1582811517672,
          msg: '中午吃啥',
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
