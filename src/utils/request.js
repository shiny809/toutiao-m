// 请求模块
import axios from 'axios'
import store from '@/store'

// import JSONBig from 'json-bigint'

// const request = axios.create({
//   baseURL: 'https://toutiao.itheima.net/',
//   headers: {
//       // 注意Bearer后面有个空格
//    Authorization:`Bearer  ${store.state.user.token}`,
//       },
// })

// 请求拦截器
// Add a request interceptor
axios.interceptors.request.use(function (config) {
   //一、 设置基地址
   config.baseURL = 'https://toutiao.itheima.net/'
   // 请求发起会经过这里
   // config:本次请求的配置对象
   const { user } = store.state
   if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
      // console.log(config);

   }

   // Axios 提供了自定义处理原始后端返回数据的 API
   // 二、 transformResponse 允许自定义原始的响应数据（字符串）
   // config.transformResponse = function (data) {
   //    try {
   //       // 如果转换成功则返回转换的数据结果

   //       // !!!上面数字 可以 转换，下面出现字母（未加引号，不是字符串时）不行，会报错
   //       // 现在 的新接口 应该优化了 id，不是大数字。可以不用转换
   //       //使用的时候 需要把大数字（对象） 转化成字符串使用，但是接口 拼接已经默认转
   //console.log(JSONBig.parse('{"art_id":1234567890123456}'))  //转化为BigNumber对象
   //       console.log(JSONBig.parse('{"art_id":123abc-456}'));
   //       return JSONBig.parse(data)
   //    } catch (err) {
   //       console.log(err);
         
   //       // 如果转换失败，则包装为统一数据格式并返回
   //       return {
   //          data
   //       }
   //    }

   // }

   // 注意！！务必返回config对象，不然请求发不出去
   return config

}, function (err) {
   // 如果请求出错，还没发出去，会进入这里
   return Promise.reject(err)
})

// 响应拦截器


const request = axios
export default request
