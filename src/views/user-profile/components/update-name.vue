<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- /导航栏 -->

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateName",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localName: this.value,
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, //禁止背景点击
      });
      try {
        const localName = this.localName;
        if (!localName.length) {
          return this.$toast("昵称不能为空");
        }
        await updateUserProfile({
          name: localName,
        });
        // 更新视图
        this.$emit("input", localName);
        // 关闭弹窗
        this.$emit("close");
        // 提示成功
        this.$toast.success('修改昵称成功')
      } catch (err) {
        console.log(err);
        this.$toast.fail("修改昵称失败");
      }
    },
  },
};
</script>

<style scoped lang="less">
.update-name {
  .field-wrap {
    padding: 20px;
  }
}
</style>