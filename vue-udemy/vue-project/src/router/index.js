import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/PostsView.vue')
    },
    {
      path: '/postsDetail/:id',
      name: 'postsDetail',
      component: () => import('../views/PostsDetailView.vue')
    },
  ]
})

export default router
