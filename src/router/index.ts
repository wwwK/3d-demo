import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'CesiumIndex',
    component: () => import('@/views/CesiumIndex.vue')
  },
  {
    path: '/blackhole',
    name: 'blackHole',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/BlackHole.vue')
  },
  {
    path: '/iframe',
    name: 'iframe',
    component: () => import('@/views/IFrame.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
