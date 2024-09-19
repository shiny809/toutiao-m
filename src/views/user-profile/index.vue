<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <input type="file" ref="file" hidden @change="onFileChange" />
    <div class="user-edit">
      <van-cell
        title="头像"
        is-link
        class="my-photo"
        @click="isUpdatePhotoShow = true,img = user.photo"
      >
        <van-image class="avatar" fit="cover" round :src="user.photo" />
      </van-cell>
      <van-cell
        title="昵称"
        :value="user.name"
        is-link
        @click="isUpdateNameShow = true"
      />
      <!-- 避免刷新 时，未获取数据前会出现性别显示 -->
      <van-cell
        title="性别"
        :value="
          user.gender === undefined ? '' : user.gender === 0 ? '女' : '男'
        "
        is-link
        @click="isUpdateGenderShow = true"
      />
      <van-cell
        title="生日"
        :value="user.birthday"
        is-link
        @click="isUpdateBirthdayShow = true"
      />
    </div>
    <!-- /个人信息 -->

    <!-- 弹出层 ：编辑昵称 -->
    <van-popup
      style="height: 100%"
      v-if="isUpdateNameShow"
      v-model="isUpdateNameShow"
      position="bottom"
    >
      <update-name @close="isUpdateNameShow = false" v-model="user.name" />
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 弹出层 ：修改性别 -->
    <van-popup
      v-if="isUpdateGenderShow"
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- /修改性别 -->

    <!-- 弹出层 ：编辑生日 -->
    <van-popup
      v-if="isUpdateBirthdayShow"
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        @close="isUpdateBirthdayShow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 弹出层 ：编辑头像 -->
    <van-popup
      v-if="isUpdatePhotoShow"
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        @close="isUpdatePhotoShow = false"
        ref="photo"
        :img="img"
        @clickFile="$refs.file.click()"
        @update-photo="user.photo = $event"
        @showPopup="isUpdatePhotoShow = $event"
      />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateBirthday from "./components/update-birthday";
import UpdateName from "./components/update-name";
import UpdateGender from "./components/update-gender";
import UpdatePhoto from "./components/update-photo";

export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  data() {
    return {
      user: {},
      isUpdateNameShow: false, //控制名字修改弹出层显示
      isUpdateGenderShow: false, //控制性别修改弹出层显示
      isUpdateBirthdayShow: false, //控制生日修改弹出层显示
      isUpdatePhotoShow: false, //控制头像修改弹出层显示
      img: null,
    };
  },
  methods: {
    async loadUserProfile() {
      try {
        const {
          data: { data },
        } = await getUserProfile();
        console.log(data);
        this.user = data;
        this.img = this.user.photo;
      } catch (err) {
        console.log(err);
        this.$toast.fail("获取信息失败");
      }
    },

    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0];
      console.log(file);
      // 基于文件对象 获取blob数据
      // 如果点击取消，file是undefined,下面会报错，每次都把value清空
      this.img = window.URL.createObjectURL(file);

      // 更换图片看到效果，需要重新渲染
      // this.isUpdatePhotoShow = true;

      // 每次替换得到新的 url
      this.$refs.photo.cropper.replace(this.img)


      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法：每次使用完毕，把它的value清空
      this.$refs.file.value = "";
    },
  },
  created() {
    this.loadUserProfile();
  },
};
</script>

<style scoped lang="less">
.user-profile {
  .user-edit {
    padding-top: 96px;
    // 为了 设置 上下居中
    .my-photo {
      .van-cell__title {
        line-height: 60px;
      }
      .van-cell__value {
        height: 60px;
        .avatar {
          width: 60px;
          height: 60px;
        }
      }
    }
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>