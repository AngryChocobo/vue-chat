<template>
  <div class="talk-list">
    <!-- todo 配置当前用户的头像作为左侧显示内容 -->
    <my-nav-bar />
    <van-list>
      <van-cell :border="false" v-for="talk in talkList" :key="talk.id">
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
import MyNavBar from '@components/my-nav-bar.vue'
import MyTabBar from '@components/my-tab-bar.vue'
import TalkListItem from '@components/talk-list-item.vue'
export default {
  name: 'TalkList',
  components: {
    TalkListItem,
    MyTabBar,
    MyNavBar,
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
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
// .talk-list {
// }
</style>
