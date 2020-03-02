<template>
  <div class="talk-view">
    <van-list>
      <van-cell v-for="msg in msgList" :key="msg.id">
        <msg-item
          :id="msg.id"
          :src="msg.src"
          :name="msg.name"
          :date="msg.date"
          :msg="msg.msg"
          :type="msg.type"
          :isMine="msg.isMine"
        />
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import MsgItem from '@components/msg-item.vue'
export default {
  name: 'TalkView',
  components: {
    MsgItem,
  },
  data() {
    return {
      msgList: [
        {
          id: 1,
          src: require('@assets/head/head-3.jpg'),
          name: '赵丽颖',
          date: 1582861517672,
          msg:
            '晚上玩Switch吗晚上玩Switch吗晚上玩Switch吗晚上玩Switch吗晚上玩Switch吗晚上玩Switch吗',
          type: 1,
          isMine: true,
        },
        {
          id: 2,
          src: require('@assets/head/head-1.jpg'),
          name: '高明震',
          date: 1582861517672,
          msg:
            '行，回去说吧😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊',
          type: 1,
          isMine: false,
        },
        {
          id: 3,
          src: require('@assets/head/head-1.jpg'),
          name: '高明震',
          date: 1582861517672,
          msg: 'Bye',
          type: 1,
          isMine: false,
        },
      ],
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.talk-view {
  .list {
    .talk {
    }
  }
}
</style>
