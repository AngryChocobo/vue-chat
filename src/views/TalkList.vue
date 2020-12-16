<template>
  <div class="talk-list">
    <my-nav-bar title="聊天" :left-arrow="false">
      <template v-slot:right>
        <home-popup />
      </template>
    </my-nav-bar>
    <van-list class="list-body">
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
import MyNavBar from '@/components/my-nav-bar.vue'
import MyTabBar from '@/components/my-tab-bar.vue'
import TalkListItem from '@/components/talk-list-item.vue'
import HomePopup from '@/components/home-popup.vue'
import {useStore} from 'vuex'

export default {
  name: 'TalkList',
  components: {
    TalkListItem,
    MyTabBar,
    MyNavBar,
    HomePopup,
  },
  computed: {
    talkList() {
      const store = useStore()
      return store.state.talkModule.talkList
    },
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.talk-list {
  height: calc(100% - 50px);
  overflow-y: auto;
}
</style>
