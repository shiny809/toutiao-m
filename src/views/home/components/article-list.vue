<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
      <article-item 
      v-for = "(article,index) in list" :key='index'
      :article="article"
     />
      
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from '@/components/article-item.vue'
export default {
  name: "ArticleList",
  components:{
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [], //存储列表数据的数据
      loading: false, //控制加载中 loading状态
      finished: false,
      timestamp: null, //请求获取下一页数据的事件戳
      error: false, //请求失败的提示

      isRefreshLoading: false, //控制下拉刷新的状态
      refreshSuccessText: "刷新成功",
    };
  },
  methods: {
    async onLoad() {
      try {
        //初始化或者加载到底部会触发onLoad事件
        // 请求的数据太少导致内容无法铺满屏幕，会继续触发onLoad
        // 直到铺满屏幕或全部加载完成
        console.log("加载数据");

        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        //  1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道ID
          // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          timestamp: this.timestamp || Date.now(), //时间戳，请求数据的页码
          with_top: 1, //是否包含置顶，值1或0
        });
        const { results } = data.data;
        console.log(results);

        // ！！！！ 强制制造一个随机错误
        // if (Math.random() < 0.8) {
        //   JSON.parse("zbsjaonzfc");
        // }

        //  2.把请求结果数据放入list数组中
        // this.list = results
        this.list.push(...results);
        // this.list = [...this.list,...results]
        //  3.本次数据加载结束后，加载状态设置为 结束 loading = false
        // 原因：loading 关闭后才能触发下一次loading
        // this.loading = false;
        //  4.判断数据是否全部加载完成 ，完成则 finished = true，不再触发加载更多
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp;
        } else {
          // 没有数据,不再加载
          this.finished = true;
        }
      } catch (err) {
        // console.log(err);
        this.error = true;
        // 请求失败，关闭loading
        // this.loading = false
      }
      this.loading = false;
    },

    // 当下拉刷新的时候，触发调用函数
    async onRefresh() {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道ID
          // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          timestamp: Date.now(), //获取最新的数据
          with_top: 1, //是否包含置顶，值1或0
        });
        if (Math.random() < 0.8) {
          JSON.parse("zbsygjson");
        }
        // 2.将数据追加到列表顶部
        this.list.unshift(...data.data.results);

        //3.关闭下拉刷新状态
        this.isRefreshLoading = false;
        // 设置刷新成功提示
        this.refreshSuccessText = `刷新成功！更新了${data.data.results.length}条数据`;
      } catch (err) {
        this.refreshSuccessText = "刷新失败！";
        this.isRefreshLoading = false;

      }
    },
  },
};
</script>


<style scoped lang="less">
.article-list {
  // 百分比是相对于 父元素
  // height:100%;
  height:79vh;
  overflow-y:auto;
}
</style>