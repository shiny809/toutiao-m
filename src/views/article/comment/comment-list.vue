<template>
  <div class="comment-list">
    <!-- 只有 List  在可视范围内 才会检查滚动位置 触发 onLoad -->
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="加载失败，请点击重试！"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <comment-item
        @reply-click="$emit('reply-click', $event)"
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item.vue";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [String, Number, Object],
      required: true,
    },

    type: {
      type: String,
      // 给一个验证规则
      validator(value) {
        return ["a", "c"].includes(value);
      },
      default: "a",
    },
    // 控制回复 弹出层显示
    // isReplyShow:{
    //   type:Boolean,
    //   required:true
    // },

    list: {
      type: Array,
      default: () => [], //数组或者对象，需函数返回，数字或字符串可以直接设置
    },
  },
  data() {
    return {
      // list: [],//定义在父组件中，方便后续操作
      loading: false,
      error: false,
      finished: false,
      offset: null,
    };
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      try {
        //  1.请求获取数据
        const {
          data: { data },
        } = await getComments({
          type: this.type, //评论类型：a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, //文章或评论id
          offset: this.offset, //评论id,平路偏移量，默认值从第一页
          limit: 3, //返回的数据
        });
        console.log(data);
        // if (Math.random() > 0.6) {
        //   JSON.parse("asdfg");
        // }
        //   2.渲染数据
        this.list.push(...data.results);
        this.$emit("total-count", data.total_count);
        // 4.判断是否还有数据
        if (data.results.length) {
          // 更新获取下一页 的数据页码
          this.offset = data.last_id;
        } else {
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
        this.error = true;
      }
      //   3.将loading设置为 false
      this.loading = false;
    },
  },
  created() {
    // 出现问题！！！可能渲染加载评论重复两次
    // 手动加载，需要把 loading设置为true,不然识别不到loading变化
    this.loading = true;
    this.onLoad(); //方便一进去就 加载评论数量
  },
};
</script>

<style scoped lang="less">
</style>