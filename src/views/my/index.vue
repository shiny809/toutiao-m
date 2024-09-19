<template>
  <div class="my-container">
    <!-- 已登录状态 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
           
          <!--  src="https://img01.yzcdn.cn/vant/cat.jpeg" -->
          <van-image
            class="avatar"
            :src="userInfo.photo"
            round
            fit="cover"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button 
          size="mini" 
          round class="edit-btn"
          to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
      </div>
    </div>
    <!-- 未登录状态 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img src="@/assets/mobile.png" alt="" class="mobile-img" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航 -->
    <van-grid :column-num="2" clickable border>
      <van-grid-item>
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <!-- 具名插槽，不然覆盖所有内容 -->
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item>
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      v-if="user"
      title="退出登录"
      class="logout-cell"
      @click="onLogout"
      clickable
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";
export default {
  name: "MyIndex",
  data(){
    return{
      userInfo:{}//用户信息
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    onLogout() {
      // 退出提示
      this.$dialog.confirm({
        title: "确定退出吗？",
      })
        .then(() => {
          // on confirm
          // 清除数据，容器的 user ＋ 本地存储 TOKEN
          this.$store.commit('setUser',null)
        })
        .catch(() => {
          // on cancel
        });
    },

    // 获取用户信息
    async loadUserInfo(){
      try {

        const {data} = await getUserInfo()
        console.log(data);
        this.userInfo = data.data
      }catch(err) {
        console.log(err);
        this.$toast('获取数据错误，请稍后重试！')
        // this.$router.push('/login')

      }
    }
  },
  created(){
    // 如果用户登录，则请求加载用户信息
    if(this.user) {
      this.loadUserInfo()
    }
  }
};
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 366px;
    // ~加不加 都没有影响？？？
    background: url("~@/assets/banner.png") no-repeat 0 / cover;
  }
  .not-login {
    .login-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-top: 113px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    box-sizing: border-box;
    padding: 80px 33px 20px;
    .base-info {
      height: 133px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 2px solid #fff;
        }
        .name {
          margin-left: 22px;
          font-size: 30px;
          color: #fff;
        }
      }
      .right {
        .edit-btn {
          width: 120px;
          height: 40px;
          font-size: 20px;
          color: #666;
        }
      }
    }
    .data-stats {
      display: flex;
      align-items: center;
      height: 153px;
      color: #fff;
      .data-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .count {
          font-size: 36px;
        }
        .text {
          margin-top: 15px;
          font-size: 23px;
        }
      }
    }
  }
  .van-grid {
    height: 140px;
    background-color: #fff;
    margin-bottom: 10px;
    i.toutiao:first-child {
      font-size: 45px;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
    span.text {
      margin-top: 10px;
      font-size: 28px;
      color: #333;
    }

    .van-grid-item {
      &:active {
        background-color: #f2f3f5;
      }
      height: 140px;
      padding: 24px 0;
      /*  例：外层类 /deep/ 第三方组件类{
        修改第三方组件的类
      }  */

      /deep/ .van-grid-item__content::after {
        // 添加红色边框
        border: 0;
        border-right: 4px solid #edeff3;
      }
      // 去除最后一个盒子红色边框
      .van-grid-item:last-child {
        /deep/ .van-grid-item__content::after {
          // 添加红色边框
          border: 0;
        }
      }
    }
  }
  .van-cell {
    font-size: 30px;
    color: #333;
  }
  .logout-cell {
    margin-top: 10px;
    text-align: center;
    color: #d86262;
    font-size: 30px;
  }
}
</style>