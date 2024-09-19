<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import dayjs from "dayjs"
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateBirthday",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1), //可选范围 开始日期
      maxDate: new Date(), //可选范围 终止日期
      currentDate: new Date(this.value), // 同步日期选择器选择的日期,日期对象
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        // 默认日期对象，需要的格式需要转换
        const currentDate = dayjs(this.currentDate).format("YYYY-MM-DD")
        await updateUserProfile({
          birthday:currentDate
        })

        // 更新视图
        this.$emit('input',currentDate)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err);
        
        this.$toast.fail('更新失败，请重试！')
      }
    },
  },
};
</script>

<style scoped lang="less">
.update-birthday {
  /deep/ .van-picker__toolbar {
    .van-picker__confirm,
    .van-picker__cancel {
      color: rgb(67, 171, 208);
    }
  }
}
</style>