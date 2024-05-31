import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects',
      name: 'projects',
      // Dynamically import the ProjectsView component only when needed
      component: () => import('@/views/ProjectsView.vue')
    },
    {
      // Define a dynamic route to handle individual project details by their ID
      path: '/projects/:id',
      name: 'single-project',
      component: () => import('@/views/SingleProjectView.vue')
    },
  ]
})

export default router
