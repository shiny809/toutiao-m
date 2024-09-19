<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <!-- 随意判断里面的数据 判断是否加载成功 -->
      <div class="article-detail markdown-body" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 关注用户 --- 单独封装组件
          模板中的 $event 是事件参数
          当传递给 子组件 的数据既要 使用还要修改
           :is-followed="article.is_followed"
            @update-isFollowed="article.is_followed = $event"
          简写方式：组件上 使用 v-model 默认写法如下，对应写value和监听input事件
          value="article.is_followed"
          @input="article.is_followed = $event"
          需要修改 model 自定义 value和input名，可在组件中 操作 model属性

          !!!多个数据需要实现 v-model 的效果，咋办？
          可以使用属性的.sync修饰符 :isFollowed.sync="article.is_followed"-->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :aut-id="article.aut_id"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @total-count="totalCmtCount = $event"
          @reply-click="onReplyClick"
        ></comment-list>

        <!-- 底部区域 ---注意：文章内容加载完才有，不然子组件中的数据 undefined-->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="showPopup"
            is-link
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCmtCount" color="#777" />
          <collect-article
            v-model="article.is_collected"
            :art-id="article.art_id"
          />
          <like-article v-model="article.attitude" :art-id="article.art_id" />
          <van-icon name="share" color="#999"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 弹出层--发布评论 -->
        <!-- 弹出层是懒渲染，只有第一次才会渲染里面的内容，之后都是切换内容的显示隐藏 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- /发布评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle()"
          >点击重试</van-button
        >
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层--发布评论 -->
    <!-- 使用v-if 条件渲染  v-if="isReplyShow"-->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '95%' }"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @click-close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from '@/views/article/comment/comment-list.vue'
import CommentPost from '@/views/article/comment/comment-post.vue'
import CommentReply from '@/views/article/comment/comment-reply.vue'

import { ImagePreview } from 'vant'
import { getArticleById } from '@/api/article'
import './github-markdown.css'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  // provide:方便后代都可以使用的数据
  provide () {
    return {
      artId: this.articleId
    }
  },
  data () {
    return {
      article: [], // 文章详情
      loading: true,
      errStatus: 0, // 判断状态

      totalCmtCount: null, // 总评论数,开始没有数据
      commentList: [], // 定义在父组件中
      isPostShow: false, // 控制评论发布弹出层显示

      isReplyShow: false, // 控制评论回复弹出层显示

      currentComment: {} // 当前评论回复对象
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    onClickLeft () {
      this.$router.back()
    },

    // 处理图片
    previewImage () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index, // 起始位置，0 开始
            showIndicators: true
          })
        }
      })
    },

    async loadArticle () {
      try {
        // 展示 loading 状态
        this.loading = true
        const { data } = await getArticleById(this.articleId)
        if (Math.random() < 0.5) {
          JSON.parse('abc')
        }
        console.log(data)
        //  请求成功，关闭 loading
        this.article = data.data

        // 初始化图片点击预览 ,数据影响视图更新后才能获取到Dom
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        // this.$toast("获取文章详情失败！");
        console.log(err)

        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      // 无论成功还是失败，都要关闭loading
      this.loading = false
    },

    // 弹出层
    showPopup () {
      this.isPostShow = true
    },

    // 发布成功后的操作
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布数据显示到列表顶部
      this.commentList.unshift(data.new_obj)
      // 更新视图的评论个数
      this.totalCmtCount++
    },

    // 显示评论弹出层
    onReplyClick (comment) {
      console.log(comment)
      // 显示 评论回复弹出层
      this.isReplyShow = true
      this.currentComment = comment
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
