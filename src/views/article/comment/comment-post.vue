<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <van-button class="post-btn" 
    @click="onPostCom"
   :disabled="!message.length">发布</van-button>
  </div>
</template>

<script>
import { addComment } from "@/api/comment";
export default {
  name: "CommentPost",
  components: {},
  props: {
    target: {
      type: [String, Number, Object],
      required: true,
    },
  },
  // 直接接收祖先 传下来的数据
  inject:{
    artId:{
      type:[Number,String,Object],
      default:null//非必须，若父辈未传值 使用默认值
    }
  },
  data() {
    return {
      message: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPostCom() {
      // 在组件中必须通过 this.$toast 来调用toast组件
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true,
        duration: 0, //默认2000,为0 则持续展示
      });
      try {
        const { data } = await addComment({
          target: this.target, //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id)
          content: this.message, //评论内容
          art_id: this.artId, //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。	
        });
        console.log(data);
        // 1.关闭弹出层
        // 2.发布内容显示到列表顶部---视图更新
        // 将获得数据全部 传入父组件， 统一处理，不单独传入数据
        this.$emit("post-success", data.data)
        this.$toast.success('发布成功')
        // 3.清空文本框
        this.message=''
      } catch (err) {
        console.log(err);
        if (err && err.response) {
          return this.$toast.fail(err.response.data.message);
        }
        this.$toast.fail("发布失败");
      }
    },
  },
};
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
