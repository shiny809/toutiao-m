<template>

<!-- :to="`/article/${article.art_id}` -->
  <van-cell class="article-item" 
  :to="{
    name:'article',//路由名称跳转
    params:{//传递路由动态参数
    //属性名：路由路径中设置的动态参数名称
    articleId:article.art_id
    }


  }">
    <div slot="title" class="van-multi-ellipsis--l2 title">
      {{ article.title }}
    </div>

    <div slot="label">
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image :src="img" />
        </div>
      </div>
      <div class="label-info-wrap">
        <span class="top" v-if="article.is_top === 1"> 置顶 </span>
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image
      v-if="article.cover.type === 1"
      slot="default"
      :src="article.cover.images[0]"
      fit="cover"
    />
  </van-cell>
</template>

<script>
export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
    flex: 1;
  }
  .van-cell__value {
    width: 232px;
    height: 146px;
    flex: unset;
    margin-left: 25px;
  }

  .cover-wrap {
    display: flex;
    .cover-item {
      flex: 1;
      // height: 146px;
      margin-top: 30px;

      &:not(:last-child) {
        padding-right: 6px;
      }
    }
  }
  .label-info-wrap {
    margin-top: 30px;
    span {
      font-size: 23px;
      color: #b4b4b4;
      margin-right: 23px;
      &.top {
        color: #e22829;
      }
    }
  }
  .van-image {
    width: 100%;
    height: 146px;
  }
}
</style>