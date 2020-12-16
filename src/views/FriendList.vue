<template>
  <div class="friend-list">
    <my-nav-bar title="好友列表" :left-arrow="false">
      <template v-slot:right>
        <home-popup />
      </template>
    </my-nav-bar>
    <van-field
      class="new-friend"
      readonly
      label="新朋友"
      is-link
      @click="toFriendRequestList"
    >
      <template #right-icon>
        <div v-show="friendRequestUnReadCount" class="dot">
          {{ friendRequestUnReadCount }}
        </div>
      </template>
    </van-field>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="全部好友" name="all">
        <van-list>
          <van-cell
            v-for="friend in friendList"
            :key="friend.id"
            @click="checkFriendInfo(friend.friendUserInfo)"
          >
            <div class="list-item friend">
              <UserAvatar
                :avatar="friend.friendUserInfo.avatar"
                style="margin-right: 8px"
                round
              />
              <span class="username">{{ friend.friendUserInfo.username }}</span>
            </div>
          </van-cell>
        </van-list>
      </van-collapse-item>
      <van-collapse-item title="全部群组" name="groups">
        <van-list>
          <van-cell
            v-for="group in groupList"
            :key="group.groupId"
            @click="goToGroupTalkView(group.groupId)"
          >
            <div class="list-item group">
              <GroupAvatar
                :avatar="group.groupInfo.avatar"
                style="margin-right: 8px"
              />
              <span class="groupName">{{ group.groupInfo.groupName }}</span>
            </div>
          </van-cell>
        </van-list>
      </van-collapse-item>
      <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
    </van-collapse>
    <my-tab-bar />
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import UserAvatar from '@/components/user-avatar.vue'
import GroupAvatar from '@/components/group-avatar.vue'
import HomePopup from '@components/home-popup.vue'
import MyTabBar from '@components/my-tab-bar.vue'
import MyNavBar from '@components/my-nav-bar.vue'

export default {
  name: 'FriendList',
  components: {
    MyTabBar,
    MyNavBar,
    UserAvatar,
    GroupAvatar,
    HomePopup,
  },
  data() {
    return {
      activeName: 'groups',
    }
  },
  computed: {
    ...mapGetters(['friendRequestUnReadCount']),
    ...mapState({
      friendList: state => state.socketModule.friendList,
      groupList: state => state.socketModule.groupList,
    }),
  },
  methods: {
    toFriendRequestList() {
      this.$router.push({
        path: 'friend-request-list',
      })
    },
    checkFriendInfo(friend) {
      this.$router.push({
        name: 'UserInfo',
        params: {userId: friend.id},
      })
    },
    goToGroupTalkView(id) {
      this.$router.push({
        name: 'GroupTalkView',
        params: {id},
      })
    },
  },
}
</script>

<style lang="less" scoped>
.friend-list {
  height: calc(100% - 50px);
  overflow-y: auto;
  .new-friend {
    ::v-deep .van-field__right-icon {
      position: relative;
      .dot {
        position: absolute;
        top: 0;
        right: 16px;
        box-sizing: border-box;
        transform: translateY(-50%);
        min-width: 16px;
        padding: 0 3px;
        color: #fff;
        font-weight: 500;
        font-size: 12px;
        font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
        line-height: 14px;
        text-align: center;
        background-color: #ee0a24;
        border: 1px solid #fff;
        border-radius: 16px;
      }
    }
  }

  .van-collapse-item__content {
    .van-cell {
      padding: 0;
      margin-bottom: 16px;
      &:nth-last-child(2) {
        margin: 0;
        &::after {
          border: none;
        }
      }

      &::after {
        left: 50px;
      }
    }
    .list-item {
      display: flex;
      align-items: center;
      padding-left: 0;
      padding-right: 0;
      .van-cell__value {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
