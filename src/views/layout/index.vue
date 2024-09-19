<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view> </router-view>
    <!--  总结： route 优先级高于 v-model,name 的值 高于 数字-->
    <van-tabbar  route>
      <van-tabbar-item  to='/home'>
        <span class="text">首页</span>
        <i slot="icon"  class="toutiao toutiao-shouye"></i>
      </van-tabbar-item>
      <van-tabbar-item  to='/qa' >
        <span class="text">问答</span>
        <i slot="icon" class="toutiao toutiao-wenda"></i>
      </van-tabbar-item>
      <van-tabbar-item to='/video'>
        <span class="text">视频</span>
        <i slot="icon"  class="toutiao toutiao-shipin"></i>
      </van-tabbar-item>
      <van-tabbar-item to='/my'>
        <span class="text">{{$store.state.user ? '我的' : '未登录'}}</span>
        <i slot="icon" class="toutiao toutiao-wode"></i>
      </van-tabbar-item>
    </van-tabbar>
    <!-- 导航栏 -->
  </div>
</template>

<script>
export default {
  name: "LayoutIndex",
  data() {
    return {
    //  active: this.$route.meta.active,
    //  active:this.$route.name
    // this.$route得到当前路由信息
     //防止在其他页面如video页面刷新网页，下面tabbar选中状态回到首页
    }
  },
};
</script>

<style scoped lang="less">
.layout-container{
  .van-tabbar {
    height: 98px;

     i.toutiao {
    font-size:40px;
  }
  span.text {
    font-size:24px;
  }
  }
 
}
</style>