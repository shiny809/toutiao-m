<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        plain
        type="danger"
        class="edit-btn"
        round
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :border="false">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelsClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fixChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span
          slot="text"
          class="text"
          :class="{ active: index === channelActive }"
          >{{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="grid-recommend" :border="false">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="addChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels , addUserChannels ,deleteUserChannels} from "@/api/channel.js";
import { mapState} from 'vuex'
import { setItem ,getItem} from '@/utils/storage'
export default {
  name: "ChannelEdit",
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    channelActive: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels:getItem("TOUTIAO_ALL_CHANNELS")||[], //所有频道
      // 控制编辑 显示状态
      isEdit:false,
      // 固定频道，不允许删除！！
      fixChannels:[0,11]
    };
  },
  // 观测依赖数据的变化，则计算属性会重新执行
  computed: {
    //  recommendChannels(){
    //     const channels = []
    //   this.allChannels.forEach(channel => {
    //       // find病例数据，找到满足条件的元素项
    //      const res  = this.myChannels.find(myChannel =>{
    //       return myChannel.id === channel.id
    //       })

    //       // 如果我的频道不包括该频道，则收集到推荐频道
    //       if(!res){
    //         channels.push(channel)
    //       }
    //     })
    //     // 返回计算结果
    //     return  channels
    //   }
    // 方法2：
    // 数据filter方法，遍历数据，符合条件的元素存储到新数组
    recommendChannels() {
      return this.allChannels.filter(channel =>{
        // find 遍历数组，符合条件的元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })

      })
    },

    // 数据持久化,映射user
    ...mapState(['user'])
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        console.log(data);
        this.allChannels = data.data.channels;
        setItem("TOUTIAO_ALL_CHANNELS",this.allChannels)
      } catch (err) {
        this.$toast("获取频道数据失败！");
      }
    },
    // 添加频道
    async addChannel(channel){
      this.myChannels.push(channel)
      // 数据持久化
     try { 
      if(this.user){
        // 已登录：请求接口放到线上     
        await  addUserChannels({
            id:channel.id, //频道ID
            seq:this.myChannels.length //序号
        })
      }else{
        // 未登录，存储到本地
        setItem("TOUTIAO_CHANNELS",this.myChannels)
      } 
      }catch(err){
          this.$toast('添加失败，请稍后重试！')
        }
    },

    // 删除频道
    async deleteChannel (channel){
      try {
        if(this.user) {
        // 已登录，则将数据更新到线上 
        await deleteUserChannels(channel.id)
      }else{
        // 未登录，本地重新存储,更新到本地
        setItem("TOUTIAO_CHANNELS",this.myChannels)
      }
      }catch(err){
          this.$toast('操作失败，请重试！')
        }
    },

    // 点击我的频道的项
    onMyChannelsClick(channel,index){
      if(this.isEdit){
        // 编辑状态，移除频道
        // 固定频道不删除
        if(this.fixChannels.includes(channel.id)) return
        this.myChannels.splice(index,1)
        // 重新设置高亮
        if (index < this.channelActive){
          // 激活的频道索引 -1
            this.$emit('update-active',this.channelActive-1)
        }  
        // 处理持久化
        this.deleteChannel(channel)


      }else{
        // 非编辑状态，切换频道
        // 子传父
        this.$emit('update-active',index,false)
      }
    }
  },
};
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 110px;
    height: 50px;
    font-size: 24px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .van-grid {
    // 重新设置边距
    padding-left: 26px;

    .grid-item {
      width: 160px;
      height: 86px;
      padding-right: 26px;
      margin-bottom: 30px;
      .van-grid-item__content {
        background-color: #f4f5f6;
        border-radius: 6px;
        white-space: nowrap;
      }
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin: 0;
        // width: 58px;
        margin-top: 0;
        // overflow: hidden;
        // text-overflow: ellipsis;
        &.active {
          color: #f85959;
        }
      }
    }
  }

  /deep/ .my-grid {
    // 不设置icon-clear,设置父盒子绝对定位
    .van-grid-item__icon-wrapper {
      position: absolute;
      right: 10px;
      top: -10px;
      font-size: 40px;
      color: #cacaca;
      z-index: 2;
    }
  }
  /deep/ .grid-recommend {
    .van-grid-item__content {
      flex-direction: row;

      .van-grid-item__icon {
        font-size: 30px;
        margin-right: 6px;
      }
    }
  }
}
</style>