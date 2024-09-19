import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

// 解决路由重复问题--控制台报错
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


// 路由表
const routes = [
  // 登录路由
  {
    path:'/login',
    name:'login',
    component:()=>import('@/views/login')
  },
  // 首页父路由
  {
    path:'/',
    name:"layout",
    component:()=>import('@/views/layout'),
    redirect:'/home',
    // 子路由
    children:[
      {
        path: 'home',//留空，默认子路由,只能有一个
        name: 'home',
        component: () => import('@/views/home'),
        meta:{
          active:0
        }
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa'),
        meta: {
          active: 1
        }
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video'),
        meta: {
          active: 2
        }
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my'),
        meta: {
          active: 3
        }
      }
    ]
  },
  {
    path:'/search',
    name:'search',
    component:() => import('@/views/search')
  },
  {
    path: '/article/:articleId',//设置动态路由，根据ID获取内容
    name: 'article',
    component: () => import('@/views/article'),
    props:true//开启 props 传参，把路由参数 映射 到组件
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
  }
]

const router = new VueRouter({
  routes
})

export default router
