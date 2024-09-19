<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button
        :loading="commentLoading"
        class="like-btn"
        :class="{ liked: comment.is_liking }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        @click="onCommentLike"
        >{{ comment.like_count || "赞" }}</van-button
      >
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate }}</span>
        <van-button v-if="isLabelShow"
        class="reply-btn"  
        round
        @click="$emit('reply-click',comment)"
          >回复 {{ comment.reply_count }}</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, removeCommentLike } from "@/api/comment";
export default {
  name: "CommentItem",
  components: {},
  props: {
    comment: {
      type: Object,
      required: true,
    }
  },
  // 直接 接收 父辈的值，不需要层层传递
  inject:{
    isLabelShow:{
      type:Boolean,
      default:true
    }

  },

  data() {
    return {
      commentLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  methods: {
    // 对评论 点赞
    async onCommentLike() {
      this.commentLoading = true;
      // 已点赞，取消点赞
      try {
        if (this.comment.is_liking) {
          await removeCommentLike(this.comment.com_id);
          //   视图更新
        //   注意：此时的 comment 与 文章点赞的区别：props的art_id改变，则子传父
        // 这里没有直接 重新赋值 comment，不会报错！！！
        // this.comment = 不能这样！！
          this.comment.like_count--;
   
        } else {
          // 未点赞，点击点赞
        await addCommentLike(this.comment.com_id);
          this.comment.like_count++;
        }
        this.comment.is_liking = !this.comment.is_liking;

        // await this.$nextTick(); //注意：等父组件数据更新后，再执行
        this.$toast.success(this.comment.is_liking ? "点赞成功" : "取消点赞");
      } catch (err) {
        this.$toast.fail("点赞失败，请重试");
      }
      this.commentLoading = false;
    },
  },
};
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #e5645f;
    }
  }
}
</style>
