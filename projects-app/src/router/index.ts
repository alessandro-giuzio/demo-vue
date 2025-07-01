
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  { path: '/', redirect: '/dashboard', name: 'home' },
  { path: '/login', component: () => import('@/pages/login.vue'), name: 'login' },
  { path: '/register', component: () => import('@/pages/register.vue'), name: 'register' },
  { path: '/dashboard', component: () => import('@/pages/dashboard.vue'), name: 'dashboard' },
  { path: '/admin', component: () => import('@/pages/admin.vue'), name: 'admin' },
  { path: '/tasks', component: () => import('@/pages/tasks/index.vue'), name: 'tasks' },
  { path: '/tasks/:id', component: () => import('@/pages/tasks/[id].vue'), name: 'taskDetail' },
  { path: '/projects', component: () => import('@/pages/projects/index.vue'), name: 'projects' },
  { path: '/projects/new', component: () => import('@/pages/projects/new.vue'), name: 'newProject' },
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

  // Auth pages check
  const isAuthPage = ['/login', '/register'].includes(to.path)
  if (!authStore.user && !isAuthPage) {
    return { path: '/login' }
  }
  if (authStore.user && isAuthPage) {
    return { path: '/dashboard' }
  }

  // Role-based route protection
  if (authStore.user) {
    // Make sure roles are loaded
    if (!authStore.userRoles?.length) {
      await authStore.loadUserRoles()
    }

    // Admin route protection
    if (to.path === '/admin' && !authStore.isAdmin) {
      return { path: '/dashboard', query: { error: 'access_denied' } }
    }

    // Project manager route protection
    if (to.path === '/projects/new' && !authStore.isProjectManager) {
      return { path: '/projects', query: { error: 'access_denied' } }
    }
  }
})

export default router
