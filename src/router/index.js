import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: 'login'
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/components/login/Login.vue')
},
{
  path: '/home',
  redirect: '/welcome',
  component: () => import('@components/home/Home.vue'),
  children: [
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('@components/home/Welcome.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@components/user/Users.vue')
    },
    {
      path: '/rights',
      name: 'rights',
      component: () => import('@components/power/Rights.vue')
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('@components/power/Roles.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@components/goods/Cate.vue')
    },
    {
      path: '/params',
      name: 'params',
      component: () => import('@components/goods/Params.vue')
    },
    {
      path: '/goods',
      name: 'goods',
      component: () => import('@components/goods/List.vue')
    },
    {
      path: '/goods/add',
      name: 'add',
      component: () => import('@components/goods/Add.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@components/orders/Orders.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@components/reports/Reports.vue')
    }
  ]
}
]

const router = new VueRouter({
  routes
})
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //      next() 放行 next('/login') 强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
