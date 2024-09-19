module.exports = {
  // 配置要使用的css插件
  plugins: {
    // vue-cli内部已经配置autoprefixer插件，重新配置会产生冲突
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // 设计稿宽度 的 1/10
      // 大多数设计稿的原型都是以 iphone6 为原型，iphone6 设备的宽是 750
      //  如果是 Vant 的样式，就把 `rootValue` 设置为 37.5 来转换
      // 如果是我们的样式，就按照 75 的`rootValue` 来转换
      // 返回的参数支持两种值：
      // 数字：Vant默认开发是37.5
      // 函数：动态计算返回
      // postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
      // 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      // 排除不转换的样式资源
      exclude:'github-markdown'
    }
  }
}
// 注意！！对于行内css设置px,不会转化为rem
