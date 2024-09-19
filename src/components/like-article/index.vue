<template>
  <div class="like-article">
    <van-button
      :class="{liked:isLiked ===1}"
      :icon="isLiked === 1  ? 'good-job' : 'good-job-o'"
      :loading="loading"
      @click="onLikeClick"
    />
  </div>
</template>

<script>
import { addLike, removeLike } from "@/api/article";
export default {
  name: "CollectArticle",
  //子组件 自定义 v-model 的数据名称，默认是 value及 监听事件input
  model: {
    prop: "isLiked",
    event: "update:isLiked",
  },
  props: {
    isLiked: {
      type: Number,
      required: true,
    },
    artId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onLikeClick() {
      this.loading = true
      try {
        // 已收藏，点击取消收藏
        let status = -1
        if (this.isLiked === 1) {
           await removeLike(this.artId);
           
        } else {
            // 未收藏，点击收藏
           await addLike(this.artId)
           // 更新视图
          status = 1
        }
        this.$emit('update:isLiked',status)
        await this.$nextTick()//注意：等父组件数据更新后，再执行
        this.$toast.success(this.isLiked === 1?'点赞成功':'取消点赞')
        // 或 下面的方式
        // this.$toast.success(!this.isLiked?'已收藏':'取消收藏')
      } catch (err) {
        console.log(err);
          this.$toast.fail("操作失败，请稍后重试！")
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="less">
.like-article{
  .liked {
    color:#e5645f;
  }
}
</style>