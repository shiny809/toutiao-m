<template>
    <van-button
      v-if="isFollowed"
      round
      size="small"
      :loading="loading"
      @click="onClickFollow"
      >已关注</van-button
    >
    <van-button
      v-else
      type="info"
      color="#3296fa"
      round
      size="small"
      icon="plus"
      :loading="loading"
      @click="onClickFollow"
      >关注</van-button
    >
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";
export default {
  name: "FollowUSer",

  //子组件 自定义 v-model 的数据名称，默认是 value及 监听事件input
  model:{
    prop:"isFollowed",
    event:"update:isFollowed"
  },
  props: {
    isFollowed: {
      type:Boolean,
      required: true,
    },
     autId: {
      type:[String,Number,Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false, // 关注 加载状态
    }
  },
  methods:{
     // 点击关注用户
    async onClickFollow() {
      this.loading = true
      try {
        // 已关注，点击取消关注关注
        if (this.isFollowed) {
          await deleteFollow(this.autId);
        } else {
          // 未关注，点击关注，不能关注自己
          await addFollow(this.autId);
        }
        // this.isFollowed=!this.isFollowed
        // 子传父，传递参数改变
        this.$emit('update:isFollowed',!this.isFollowed)

      } catch (err) {
        console.log(err);
        // if (err.response && err.response.status === 400) {
        //   return this.$toast(err.response.data.message);
        // }
        // 直接使用后端 返回的 messsge，不做判断
        let message = "操作失败，请稍后重试！"
        // 分情况讨论，可能出现的结果
        if(err.response) {
          message = err.response.data.message
          if(err.response.status === 401){
            message = "请先登录！"
          }
          }
          this.$toast(message)
      }
        this.loading = false

    },
  }
};
</script>

<style scoped lang='less'>

</style>