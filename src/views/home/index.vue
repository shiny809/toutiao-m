<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar">
      <form slot="title" action="/">
        <van-search
          v-model="value"
          left-icon="search"
          placeholder="搜索"
          input-align="center"
          @keydown="getVal"
          @blur="setIcon"
          ref="search"
          @click="$router.push('/search')"
        >
        </van-search>
      </form>
    </van-nav-bar>
    <!-- 频道列表 -->
    <!-- v-model 绑定当前激活标签的 索引值 -->
    <!-- swipeable开启滑动切换  -->
    <div class="nav-tab">
      <van-tabs v-model="active" swipeable>
        <van-tab 
        :title="item.name" 
        v-for="item in channels" 
        :key="item.id">
          <!-- 文章列表 -->
          <article-list :channel="item"> </article-list>
        </van-tab>

        <div slot="nav-right" class="placeholder"></div>
        <!-- 固定定位！！不起作用，外加一个盒子重新定位 -->
        <!-- <template #nav-right>
          <div class="hbg-btn">
            <i class="toutiao toutiao-gengduo"></i>
          </div>
         </template> -->
      </van-tabs>
      <div class="hbg-btn" @click="isChannelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </div>
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :myChannels="channels"
        :channelActive="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
// 加载子组件，新闻列表
import ArticleList from "./components/article-list.vue";
import ChannelEdit from "./components/channel-edit.vue";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      // 搜索框
      value: "",
      // tab栏标签
      active: 0,
      // 频道列表
      channels: getItem("TOUTIAO_CHANNELS")||[],
      // 是否显示频道弹出层
      isChannelEditShow: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    getVal() {
      let leftIcon = document.querySelector(".van-field__left-icon ");
      leftIcon.style.left = 0;
    },
    setIcon() {
      let leftIcon = document.querySelector(".van-field__left-icon ");
      if (this.value.trim().length === 0) {
        leftIcon.style.cssText = "left:2.46667rem";
        this.value = "";
      }
    },
    // 加载频道列表
    async loadChannels() {
      try {
        // 只有未登录且存在本地的频道记录才从本地获取
        if (!this.user) {
          let localStorage = getItem("TOUTIAO_CHANNELS");
          if (localStorage) {
            return (this.channels = localStorage);
          }
        }
        const { data } = await getUserChannels();
        console.log(data);
        this.channels = data.data.channels;
      } catch (err) {
        console.log(err);
        this.$toast("获取频道列表失败!");
      }
    },

    // popup 子传父 ，更新active
    // isShow 控制弹出层的显示，可以传入默认值 true
    onUpdateActive(index, isShow = true) {
      this.active = index;
      // 控制弹出层
      this.isChannelEditShow = isShow;
    },
  },
  created() {
    this.loadChannels();
  },
};
</script>

<style scoped lang="less">
.home-container {
  // 防止父级塌陷
  overflow: hidden;
  /deep/ .van-nav-bar {
    .van-nav-bar__title {
      max-width: unset;
    }
    .van-search {
      width: 555px;
      height: 64px;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 32px;
      // opacity: 0.3; //会穿透！影响子元素
      .van-search__content {
        background-color: transparent;
        color: #333;
      }

      .van-field__control {
        font-size: 30px;
        color: #eee;
        &::placeholder {
          color: #fff;
        }
      }

      .van-field__left-icon {
        position: relative;
        left: 185px;
        overflow: hidden;
        .van-icon-search {
          font-size: 40px;
        }
      }
    }
  }

  // ！！作用子组件样式，默认在scoped（作用域）组件样式中，只能作用到根节点
  // 需要加 深度操作符 >>> 或 /deep/
  .nav-tab {
    position: relative;
    .hbg-btn {
      position: fixed;
      top: 96px;
      right: 0;
      z-index: 99;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70px;
      height: 82px;
      background-color: #ffff;
      opacity: 0.9;
      // background: linear-gradient(to bottom, #ccc, #666,#999,#666,#ccc);
      i.toutiao {
        font-size: 40px;
        color: #333;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 13px;
        width: 2px;
        height: 58px;
        background: url(@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
    .placeholder {
      width: 70px;
      height: 82px;
      // 不参与 布局平分
      flex-shrink: 0;
    }
  }
  /deep/ .van-tabs {
    margin-top: 96px;
    margin-bottom: 98px;
    padding-top: 82px;

    .van-tabs__wrap {
      position: fixed;
      top: 96px;
      left: 0;
      width: 100%;
      z-index: 99;
      height: 82px;
      border-bottom: 2px solid #edeff3;
      .van-tabs__nav {
        overflow-y: hidden;
        overflow-x: auto; //防止只有五个时，不出现滚动条
        -webkit-overflow-scrolling: touch;
        padding: 0;
        // 电脑端可以，手机不行？？？和btn宽度一样
        // padding-right:70px;

        &::-webkit-scrollbar {
          height: 0; //去除 滚动条 样式
        }
      }
      .van-tab {
        min-width: 200px;
        border-right: 1px solid #edeff3;
        font-size: 28px;
        color: #777;
      }
      .van-tab--active {
        font-size: 30px;
        color: #333;
      }
      .van-tabs__line {
        width: 35px;
        height: 6px;
        background-color: #3296fa;
        border-radius: 3px;
        bottom: 10px;
        top: 68px;
      }
    }
  }
  // 设置弹出层的关闭按钮
  /deep/ .van-popup__close-icon--top-left {
    font-size: 35px;
    color: #222;
  }
}
</style>