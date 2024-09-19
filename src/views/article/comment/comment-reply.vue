<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('click-close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment"  />
      <!-- /当前评论项 -->

      <van-cell title="所有回复" />

      <!-- 评论的回复列表 -->
      <comment-list 
        :source="comment.com_id"
        :list="commentReplyList"
        type="c"
      />
      <!-- /评论的回复列表 -->
    </div>

    <!-- 底部 -->
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部 -->

    <!-- 评论回复 -->
    <!-- 弹出层--发布评论 -->
    <!-- 使用v-if 条件渲染  v-if="isReplyShow"-->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import CommentList from "./comment-list.vue";
import CommentItem from "./comment-item.vue";
import CommentPost from "./comment-post.vue"
export default {
  name: "CommentReply",
  components: {
    CommentList,
    CommentItem,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  // 直接给后代组件 传值
  provide () {
    return {
    isLabelShow:false//实现跨级传值
    }
  },
  
  data() {
    return {
      commentReplyList: [],

      isPostShow:false,
    };
  },
  computed: {},
  watch: {},
  created() {
  
  },
  mounted() {},
  methods: {
    // 发布评论回复成功
    onPostSuccess(data){
      // 1.弹出层隐藏
      this.isPostShow = false
      // 2.视图更新
      this.commentReplyList.unshift(data.new_obj)
      // 3.更新评论总数
      this.comment.reply_count++

    }
  },
};
</script>

<style scoped lang="less">
.comment-reply {
  .van-nav-bar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
  }
  .scroll-wrap {
    padding-top: 20px;
    padding-bottom: 88px;
  }
  .post-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn {
      width: 60%;
    }
  }
}
</style>
