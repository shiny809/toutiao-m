<template>
  <div class="update-photo">
    <img :src="img" alt="" class="img" ref="img" />

    <div class="upload-photo" @click="uploadPhoto">更换头像</div>
    <div class="toolbar">
      <div @click="$emit('close')">取消</div>
      <div @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updateUserPhoto } from "@/api/user";
export default {
  name: "UpdatePhoto",
  props: {
    img: {
      type: [String, Object],
      requied: true,
    },
  },
  data() {
    return {
      cropper: null,
    };
  },

  methods: {
    uploadPhoto() {
      this.$emit("clickFile");
      // 直接设置 弹出层显示隐藏 来重新渲染cropper效果，不是最优方法
      // this.$emit("showPopup", false);
      // this.cropper.destroy()//直接销毁也不可取
      
    },

    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, //禁止背景点击
      });
      try {
        const formData = new FormData()
        formData.append("photo", blob)

        const { data } = await updateUserPhoto(formData);
        console.log(data);
        //  关闭弹出层
        this.$emit("close");
        // 更新视图
        this.$emit("update-photo", data.data.photo);
        this.$toast.success("更新成功");
      } catch (err) {
        console.log(err);
        
        this.$toast.fail("更新失败");
      }
    },

    onConfirm() {
      // console.log(this.cropper.getData());//基于服务端裁切，得到裁切的区域参数
      // console.log(this.cropper.getCroppedCanvas());//基于纯客户端的裁切，得到裁切之后的拖对象
      this.cropper.getCroppedCanvas().toBlob( blob => {
        console.log(blob);
        this.updateUserPhoto(blob);
        // 如果接口 Content-Type 是 application/json,则传递 普通 JS 对象
        // 如果接口 Content-Type 是 multipart/form-data,则传递 FormData 对象
      })
    },
  },
  mounted() {
    const img = this.$refs.img;
    this.cropper = new Cropper(img, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      autoCropArea: 2,
      cropBoxMovable: true,
      cropBoxResizable: true,
      background: false,
      // movable:true//默认值
    });
  },
};
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;

  .img {
    display: block;
    max-width: 100%;
  }
  .upload-photo {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 180px;
    display: flex;
    justify-content: center;
    color: #fff;
    font-size: 40px;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    div {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>