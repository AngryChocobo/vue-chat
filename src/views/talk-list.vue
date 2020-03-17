<template>
  <div class="talk-list">
    <!-- todo 配置当前用户的头像作为左侧显示内容 -->
    <my-nav-bar title="聊天" :left-arrow="false" />
    <van-list>
      <van-cell :border="false" v-for="talk in talkList" :key="talk.id">
        <talk-list-item
          :id="talk.id"
          :src="talk.src"
          :targetUserName="talk.targetUserName"
          :targetUserId="talk.targetUserId"
          :sendDate="talk.sendDate"
          :lastMessageUserName="talk.lastMessageUserName"
          :message="talk.message"
          :unReadCount="talk.unReadCount"
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
    return {}
  },
  computed: {
    talkList() {
      return this.$store.state.talkModule.talkList
    },
  },
  mounted() {
    // console.log()
  },
  methods: {},
}
</script>

<style lang="less" scoped>
// .talk-list {
// }
</style>
