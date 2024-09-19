<template>
  <div class="update-gender">
    <van-picker
      title="修改性别"
      show-toolbar
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onPickerChange"
      :default-index="value"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateGender",
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      localGender: this.value,
      columns: ["女", "男"],
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, //禁止背景点击
      });
      try {
        const localGender = this.localGender;
        await updateUserProfile({
          gender: localGender,
        });
        // 更新视图
        this.$emit("input", localGender);
        // 关闭弹窗
        this.$emit("close");
        // 提示成功
        this.$toast.success("修改成功");
      } catch (err) {
        console.log(err);
        this.$toast.fail("修改失败");
      }
    },
    onPickerChange(picker, value, index) {
      this.localGender = index;
    },
  },
};
</script>

<style scoped lang="less">
.update-gender {
  /deep/ .van-picker__toolbar {
    .van-picker__confirm,
    .van-picker__cancel {
      color: rgb(67, 171, 208);
    }
  }
}
</style>