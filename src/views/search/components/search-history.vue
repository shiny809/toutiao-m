<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <!-- 避免 更改props，可读不可重新赋值 -->
        <!-- <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp; -->
        <span @click="deleteHistoriesAll">全部删除</span>&nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="obj"
      v-for="(obj, index) in searchHistories"
      :key="index"
      @click="onClickItem(obj, index)"
    >
      <van-icon name="close" v-if="isDeleteShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
// import { setItem } from "@/utils/storage";
export default {
  name: "SearchHistory",
  data() {
    return {
      results: [],
      isDeleteShow: false, //控制历史记录刪除
    };
  },
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onClickItem(obj, index) {
      if (this.isDeleteShow) {
        // 删除 历史记录
        this.searchHistories.splice(index, 1);
        // setItem("TOUTIAO_SEARCH_HISTORIES", this.searchHistories);
      } else {
        // 非 删除状态，搜索内容
        this.$emit("search", obj);
      }
    },
    // 删除所有搜索历史记录
    deleteHistoriesAll() {
      // 报错，props 只可读 不可重新赋值
      // this.searchHistories = []

      // 但，使用 splice，push 等方法不会报错
      this.searchHistories.splice(0);
      // setItem("TOUTIAO_SEARCH_HISTORIES", this.searchHistories);
    },
  },
};
</script>

<style>
</style>