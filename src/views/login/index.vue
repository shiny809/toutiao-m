<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
    title="登录" 
    left-arrow 
    @click-left="$router.back()">
      <!-- 定义右侧关闭图标 -->
      <template #right>
        <van-icon name="cross" size="18" @click="$router.push('/home')" />
      </template>

    </van-nav-bar>
    <!-- 登录表单 -->

    <van-form @submit="onSubmit" ref="loginForm">
      <!-- 1.内设图标 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        icon-prefix="toutiao"
        left-icon="shouji"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
        autocomplete="off"
      />
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
        autocomplete="off"
      >
        <!-- 插槽设置图标 -->
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- 点击获取验证码 -->
          <!-- 倒计时 -->
          <van-button
            v-if="isCountDownShow"
            round
            size="small"
            type="default"
            class="send-sms-btn"
            native-type="button"
          >
            <!-- 转化里面内容，v-if -->
            <van-count-down
              :time="10 * 1000"
              format=" ss s"
              @finish="isCountDownShow = false"
            />
          </van-button>

          <van-button
            v-else
            round
            size="small"
            type="default"
            class="send-sms-btn"
            native-type="button"
            @click="onsendMsm"
          >
            <!-- 转化里面内容，v-if -->

            <p>获取验证码</p>
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block class="login-btn" type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendMsm } from "@/api/user.js";

export default {
  name: "LoginPage",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "18084899359", //手机号
        code: "246810", //万能验证码---246810
      },

      // 定义校验规则
      userFormRules: {
        mobile: [
          { required: true, message: "手机号不能为空" },
          { pattern: /^1[3|5|6|8]\d{9}$/, message: "手机号格式错误" },
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          { pattern: /^\d{6}$/, message: "验证码格式错误" },
        ],
      },

      // 定义倒计时显示状态
      isCountDownShow: false,
    };
  },
  methods: {
    async onSubmit() {
      // 1，获取表单数据
      console.log(this.user);
      const user = this.user;
      //TODO: 2.提交表单验证
      // 在组件中必须通过 this.$toast 来调用toast组件
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0, //默认2000,为0 则持续展示
      });
      // 3.提交表单请求登录
      try {
        const res = await login(user);
        console.log(res.data.data);
        this.$store.commit("setUser", res.data.data);

        this.$toast.success("登陆成功");
        // 跳转到登录界面
        this.$router.push("/my");
        console.log(res);
      } catch (err) {
        console.log(err);
        if (err.response.status === 400) {
          // this.$toast.fail("手机号或验证码错误");
          return this.$toast.fail(err.response.data.message);
        }
        // this.$toast.fail("登陆失败，请稍后重试！");
        this.$toast.fail(err.response.data.message);
      }
    },

    // 方式验证码
    async onsendMsm() {
      // 1.验证手机号
      try {
        const res = await this.$refs.loginForm.validate("mobile");
        console.log(res);
      } catch (err) {
        console.log(err);
        return this.$toast.fail(err);
      }
      //  2.验证通过，显示倒计时

      // 3.请求发送验证码
      try {
        await sendMsm(this.user.mobile);
        this.$toast.success("发送成功");
        this.isCountDownShow = true;
      } catch (err) {
        console.log(err);
        if (err.response.status === 429) {
          return this.$toast.fail(err.response.data.message);
        }
        // this.$toast.fail(err.response.data.message);
        this.$toast.fail("发送失败，请稍后再试！");
      }
    },
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
};
</script>

<style  lang='less' >
.van-form {
  padding-top: 96px;
  .toutiao {
    font-size: 37px;
  }
}
.send-sms-btn {
  width: 152px;
  height: 46px;
  background-color: #ededed;
  color: #666;
  font-size: 22px;
}

.login-btn-wrap {
  padding: 53px 33px;
  .login-btn {
    border-radius: 5px;
    font-size: 30px;
    background-color: #6db4fb;
    border: none;
  }
}
</style>