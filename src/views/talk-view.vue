<template>
  <div class="talk-view">
    <van-list>
      <van-cell v-for="msg in msgList" :key="msg.id">
        <msg-item
          :id="msg.id"
          :src="msg.src"
          :name="msg.username"
          :date="msg.date"
          :msg="msg.message"
          :type="msg.type"
        />
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import MsgItem from '@components/msg-item.vue'
import {getTalkViewDetail} from '@const/api'
export default {
  name: 'TalkView',
  components: {
    MsgItem,
  },
  data() {
    return {
      msgList: [],
    }
  },
  mounted() {
    this.getTalkViewDetail()
  },
  methods: {
    getTalkViewDetail() {
      this.axios.get(getTalkViewDetail(1, 2)).then(res => {
        this.msgList = res.data || []
      })
    },
  },
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
