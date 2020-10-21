<template>
  <div class="talk-list">
    <my-nav-bar
      title="聊天"
      :left-arrow="false"
      right-text="建群"
      :onClickRight="toCreateGroupPage"
    />
    <van-list>
      <van-cell :border="false" v-for="talk in talkList" :key="talk.id">
        <talk-list-item
          :userInfo="talk.targetUserInfo"
          :sendDate="talk.createdAt"
          :lastMessageUserName="talk.lastMessageUserInfo.username"
          :message="talk.lastMessageInfo.message"
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
  computed: {
    talkList() {
      return this.$store.state.talkModule.talkList
    },
  },
  methods: {
    toCreateGroupPage() {
      this.$router.push({
        name: 'CreateGroup',
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
