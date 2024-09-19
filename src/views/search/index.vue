<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" ref="result" />
    <!-- /搜索结果 -->
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->
    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
    />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from "./components/search-history.vue";
import SearchResult from "./components/search-result.vue";
import SearchSuggestion from "./components/search-suggestion.vue";

import { setItem, getItem } from "@/utils/storage";

export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion,
  },

  data() {
    return {
      searchText: "",
      isResultShow: false, //控制搜索结果的展示

      searchHistories: getItem("TOUTIAO_SEARCH_HISTORIES") || [], //历史记录
    };
  },
  methods: {
    onSearch(val) {
      this.searchText = val;
      // 调用 子组件 result 方法
      // console.log(this.$refs)
      //  this.$nextTick(() => {
      //   console.log(this.$refs.result)
      //   })//DOM渲染完在加载，不然 是 undefined

      // 存储搜索历史记录,
      let index = this.searchHistories.indexOf(val);
      if (index !== -1) this.searchHistories.splice(index, 1); //去除重复的搜索记录
      this.searchHistories.unshift(val);
      // 渲染搜索结果
      this.isResultShow = true;

      //  存储到本地
      // setItem("TOUTIAO_SEARCH_HISTORIES", this.searchHistories);
    },
    onCancel() {
      this.$router.back();
    },
  },
  watch: {
    //监视 数据变化，实时同步
    searchHistories(newVal) {  
      setItem("TOUTIAO_SEARCH_HISTORIES",newVal);
    },
  },
};
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  /deep/ .van-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    .van-field__left-icon .van-icon {
      font-size: 36px;
      color: #9a9a9a;
    }
    .van-field__control {
      &::placeholder {
        color: #999;
      }
    }
    .van-search__action {
      color: #fff;
    }
  }
}
</style>