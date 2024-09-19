import Vue from 'vue'
import  dayjs  from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'
// dayjs默认语言是中文，配置为中文
dayjs.locale('zh-cn')//全局使用

// dayjs()获取当前最新时间
// console.log(dayjs().format('YYYY-MM-DD'));

// 引入相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// console.log(dayjs().to(dayjs('1995-11-01')));
// 定义全局 过滤器，就可以在任何组件中使用
// 参数1：过滤器名称，参数2：过滤器函数
// 使用方式：{{表达式 | 过滤器名称}}
Vue.filter('relativeTime', value => {
   return  dayjs().to(dayjs(value))

})
