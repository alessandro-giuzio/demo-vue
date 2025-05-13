
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  { path: '/', redirect: '/users', name: 'home' },
  { path: '/login', component: () => import('@/pages/login.vue'), name: 'login' },
  { path: '/register', component: () => import('@/pages/register.vue'), name: 'register' },
  { path: '/tasks', component: () => import('@/pages/tasks/index.vue'), name: 'tasks' },
  { path: '/tasks/:id', component: () => import('@/pages/tasks/[id].vue'), name: 'taskDetail' },
  { path: '/projects', component: () => import('@/pages/projects/index.vue'), name: 'projects' },
  { path: '/projects/:slug', component: () => import('@/pages/projects/[slug].vue'), name: 'projectDetail' },
  { path: '/users', component: () => import('@/pages/users/index.vue'), name: 'users' },
  { path: '/users/:username', component: () => import('@/pages/users/[username].vue'), name: 'userDetail' },


  // Catch-all route for 404s
  { path: '/:catchAll(.*)', component: () => import('@/pages/[...catchAll].vue'), name: 'notFound' }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.getSession()

  const isAuthPage = ['/login', '/register'].includes(to.path)

  if (!authStore.user && !isAuthPage) {
    return { path: '/login' } // Use path instead of name
  }

  if (authStore.user && isAuthPage) {
    return { path: '/' } // Use path instead of name
  }
})

export default router
