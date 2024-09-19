import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式
import './styles/index.less'
// 引入 Vant组件库---全局导入
import Vant from 'vant'
import 'vant/lib/index.css'
// 移动端 REM适配
import 'amfe-flexible'

// 加载dayjs初始化设置
import '@/utils/dayjs.js'



// 全局挂载 ，不需要，简单方便，但是不利于接口维护
// Vue.prototype.request = request

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
