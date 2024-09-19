import Vue from 'vue'
import Vuex from 'vuex'
import {setItem,getItem} from '@/utils/storage'

Vue.use(Vuex)
// 定义 token字符串
const TOKEN_KEY = 'USER_TOKEN'
export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息（token等数据）
    // 从本地获取
    user: getItem(TOKEN_KEY)
  },
  getters: {
  },
  mutations: {
    setUser(state,data){
      state.user = data
      // 防止刷新数据丢失，存储更新的数据到本地
        setItem(TOKEN_KEY,state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
