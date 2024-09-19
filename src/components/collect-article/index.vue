<template>
  <div class="collect-article">
    <van-loading color="#1989fa"
    v-if="loading" ></van-loading>
    <van-icon
      v-else
      :color="isCollected ? '#ffa500' : '#777'"
      :name="isCollected ? 'star' : 'star-o'"
      @click="onCollectClick"
    />
  </div>
</template>

<script>
import { addCollect, removeCollect } from "@/api/article";
export default {
  name: "CollectArticle",
  //子组件 自定义 v-model 的数据名称，默认是 value及 监听事件input
  model: {
    prop: "isCollected",
    event: "update:isCollected",
  },
  props: {
    isCollected: {
      type: Boolean,
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
    async onCollectClick() {
      this.loading = true
      try {
        // 已收藏，点击取消收藏
        if (this.isCollected) {
           await removeCollect(this.artId);
        } else {
            // 未收藏，点击收藏
           await addCollect(this.artId);
        }
        // 更新视图
        this.$emit('update:isCollected',!this.isCollected)//子传父，更新 收藏状态
        await this.$nextTick()//注意：等父组件数据更新后，再执行
        this.$toast.success(this.isCollected?'已收藏':'取消收藏')
        // 或 下面方方式
        // this.$toast.success(!this.isCollected?'已收藏':'取消收藏')
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
.collect-article {
    .van-loading{
        width: 40px;
        height: 40px;
       .van-loading__spinner{
            color:#777 !important;
        }
    }
}
</style>