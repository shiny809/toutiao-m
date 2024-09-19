<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请点击重试！"
      @load="onLoad()"
    >
      <van-cell
        v-for="(result, index) in results"
        :key="index"
        :title="result.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from "@/api/search";
export default {
  name: "SearchResult",
  data() {
    return {
      results: [],
      loading: false,
      finished: false,
      error:false,//加载失败状态

      page: 1, //请求初始页数
    };
  },
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      try {
        // 1.请求 获取数据
        const {
          data: {data: { results }}} = await getSearchResults({
          page: this.page, //页码，不传默认为1
          per_page: 10, //每页数量，不传每页数量由后端决定
          q: this.searchText, //搜索关键词
        });
        console.log(results);
        // 模拟随机失败状态
        if(Math.random() > 0.5){
          JSON.parse('asdfgh')
        }
        // this.results=[...this.results,...data.data.results]
        // 2.将数据添加到数组中
        this.results.push(...results);

        // 3.加载状态结束
        this.loading = false;

        // 4.判断数据是否 全部加载完成
        if (results.length) {
          // 如果有，则更新获取 下一个数据页码
          this.page++;
        } else {
          // 没有，则加载 状态设置为 finished 设置为结束
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
        this.error = true
        this.loading = false//加载失败，loading关闭
      }
    },

    // async loadSearchResults(sug) {
    //   try {
    //     const { data } = await getSearchResults({
    //       page: this.page, //页数，不传默认为1
    //       per_page: 10, //每页数量，不传每页数量由后端决定
    //       q: sug, //搜索关键词
    //     });
    //     console.log(data);

    //     this.results.push(...data.data.results)
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
  },
};
</script>

<style>
</style>