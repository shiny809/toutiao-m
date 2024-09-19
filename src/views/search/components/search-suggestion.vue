<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(suggestion, index) in suggestions"
      :key="index"
      @click ="$emit('search',suggestion)"
    >
      <!-- 搜索词高亮 -->
      <div slot="title" v-html="highlight(suggestion)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash";
import { Vue } from "vue";
export default {
  name: "SearchSuggestion",
  data() {
    return {
      suggestions: [],
      timer: null, // 计时器
    };
  },
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q);
        console.log(data);
        this.suggestions = data.data.options;
      } catch (err) {
        this.$toast("数据获取失败，请稍后重试！");
      }
    },

    // 搜索关键词 高亮
    highlight(text) {
      const reg= new RegExp(this.searchText,'ig')
      const highlightStr = `<span class="active">${this.searchText}</span>`;
      if (text === null) return this.suggestions = []  
      return text.replace(reg, highlightStr)
    },
  },
  watch: {
    searchText: {
      // 当searchText发生改变就会调用 handler函数
      // handler:function(val) {
      //   if(this.timer) clearTimeout(this.timer)

      //   this.timer = setTimeout(() => { //注意this指向，此时用 箭头函数
      //   // console.log(this.__VUE_HOT_MAP__.ca1cd426.options.methods)
      //    this.loadSearchSuggestions(val)//此时的this 指向 window,不能调用函数
      //   //  下面虽然能调用，但是执行后赋值 不是 实时更新的！
      //   // this.__VUE_HOT_MAP__.ca1cd426.options.methods.loadSearchSuggestions(val)
      //   },1000);
      // },

      // debounce函数
      // 参数1：一个函数
      // 参数2：延迟时间，单位是 毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val);
      }, 1000),
      // 侦听开始之后被立即调用
      immediate: true,
    },
  },
};
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ .active {
    color: rgb(223, 85, 85);
  }
}
</style>