<template>
  <div class="my-settings">
    <my-nav-bar title="我" :left-arrow="false" />
    <div class="setting-fields">
      <van-cell-group>
        <van-field
          label="头像"
          class="user-img-field"
          is-link
          @click="showAvatarSelect"
        >
          <template slot="input">
            <UserAvatar :avatar="loggedInUser.avatar" width="48" height="48" />
          </template>
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          :value="loggedInUser.nickname"
          label="昵称"
          class="nickname"
          readonly
          @click.native="onShowNamePopup"
        />
      </van-cell-group>
    </div>

    <van-popup
      v-model="nickNamePopupVisible"
      position="bottom"
      class="nickname-popup"
      :safe-area-inset-bottom="true"
      :close-on-click-overlay="false"
      :style="{height: '25%'}"
      @opened="focusInput"
      closeable
    >
      <van-field
        v-model="nickname"
        ref="nickname"
        label="昵称"
        placeholder="请输入昵称"
        class="nickname"
      />
      <van-button type="primary" size="large" @click="onConfirmNickName">
        保存
      </van-button>
    </van-popup>
    <van-dialog
      class="avatar-select-dialog"
      v-model="avatarSelectVisible"
      title="选择头像"
      show-cancel-button
      @confirm="onConfirmAvatar"
    >
      <avatar-select class="content" @select="onSelectAvatar" />
    </van-dialog>
    <my-tab-bar />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MyTabBar from '@components/my-tab-bar.vue'
import MyNavBar from '@components/my-nav-bar.vue'
import AvatarSelect from '@components/avatar-select.vue'
import UserAvatar from '@/components/user-avatar.vue'
import {CONFIRM_NICK_NAME, CONFIRM_AVATAR} from '@store/types/action-types.js'

export default {
  name: 'MySettings',
  components: {
    MyTabBar,
    MyNavBar,
    AvatarSelect,
    UserAvatar,
  },
  data() {
    return {
      nickname: '', // 编辑中的昵称
      nickNamePopupVisible: false,
      avatarSelectVisible: false,
      selectAvatar: '',
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  methods: {
    onShowNamePopup() {
      this.nickname = this.loggedInUser.nickname
      this.nickNamePopupVisible = true
    },
    onConfirmNickName() {
      console.log(this.nickname)
      this.$store.dispatch(CONFIRM_NICK_NAME, {nickname: this.nickname})
      this.nickNamePopupVisible = false
    },
    focusInput() {
      console.log(this.$refs.nickname)
      this.$refs.nickname.focus()
    },
    showAvatarSelect() {
      this.avatarSelectVisible = true
    },
    onSelectAvatar(src) {
      console.log('选择了头像： ' + src)
      this.selectAvatar = src
    },
    onConfirmAvatar() {
      console.log('修改了头像' + this.selectAvatar)
      this.$store.dispatch(CONFIRM_AVATAR, {avatar: this.selectAvatar})
    },
  },
}
</script>

<style lang="less" scoped>
.my-settings {
  .setting-fields {
    .user-img-field {
      display: flex;
      align-items: center;
      /deep/ .van-field__control {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .nickname {
    /deep/ .van-field__control {
      text-align: right;
    }
  }
  .nickname-popup {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .nickname {
      margin-top: 48px;
    }
  }
  .avatar-select-dialog {
    .content {
      padding: 32px;
    }
  }
}
</style>
