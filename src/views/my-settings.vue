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
            <img :src="imgSrc" alt="" class="user-img" />
          </template>
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="nickname"
          label="昵称"
          class="nickname"
          readonly
          @click="nickNamePopupVisible = true"
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
      <van-button type="primary" size="large" @click="onSaveNickName">
        保存
      </van-button>
    </van-popup>
    <avatar-select @select="onSelectAvatar" />
    <my-tab-bar />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import MyTabBar from '@components/my-tab-bar.vue'
import MyNavBar from '@components/my-nav-bar.vue'
import AvatarSelect from '@components/avatar-select.vue'
export default {
  name: 'MySettings',
  components: {
    MyTabBar,
    MyNavBar,
    AvatarSelect,
  },
  data() {
    const nickname = this.$store.state.loggedInUserModule.loggedInUser.nickname
    return {
      nickname,
      nickNamePopupVisible: false,
      avatarSelectVisible: false,
    }
  },
  computed: {
    ...mapState({
      loggedInUserInfo: state => state.loggedInUserModule.loggedInUser,
    }),
    imgSrc() {
      return this.loggedInUserInfo && this.loggedInUserInfo.src
        ? require('@assets/head/' + this.loggedInUserInfo.src)
        : require('@assets/head/head.jpg')
    },
  },
  methods: {
    onSaveNickName() {
      console.log(this.nickname)
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
    .nickname {
      /deep/ .van-field__control {
        text-align: right;
      }
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
  .user-img {
    width: 48px;
  }
  .info-content {
    margin-left: 16px;
    h3 {
      margin: 0;
    }
    p {
      margin: 0.5em 0;
      font-size: 14px;
      color: #888;
    }
  }
}
</style>
