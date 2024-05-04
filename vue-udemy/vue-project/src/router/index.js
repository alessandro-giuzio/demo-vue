import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostsView.vue'
import postsDetail from '../views/PostsDetailView.vue'
import modals from '../views/ModalsView.vue'

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
      component: PostView
    },
    {
      path: '/postsDetail/:id',
      name: 'postsDetail',
      component: postsDetail
    },
    {
      path: '/modals',
      name: 'modals',
      component: modals
    },
  ]
})

export default router
