import { createRouter, createWebHistory } from 'vue-router/auto'
import { useAuthStore } from '@/stores/auth'
import { showError } from '@/utils/toast'

const routes = [
  { path: '/', redirect: '/dashboard', name: 'home' },
  { path: '/login', component: () => import('@/pages/login.vue'), name: 'login' },
  { path: '/register', component: () => import('@/pages/register.vue'), name: 'register' },

  // Authenticated routes
  {
    path: '/dashboard',
    component: () => import('@/pages/dashboard.vue'),
    name: 'dashboard',
    meta: { requiresAuth: true }
  },

  // Admin-only routes
  {
    path: '/admin',
    component: () => import('@/pages/admin.vue'),
    name: 'admin',
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/role-management',
    component: () => import('@/components/RoleManager.vue'),
    name: 'roleManagement',
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // Task routes
  {
    path: '/tasks',
    component: () => import('@/pages/tasks/index.vue'),
    name: 'tasks',
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/:id',
    component: () => import('@/pages/tasks/[id].vue'),
    name: 'taskDetail',
    meta: { requiresAuth: true }
  },

  // Project routes
  {
    path: '/projects',
    component: () => import('@/pages/projects/index.vue'),
    name: 'projects',
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/new',
    component: () => import('@/pages/projects/new.vue'),
    name: 'newProject',
    meta: { requiresAuth: true, requiresRole: ['admin', 'project_manager'] }
  },
  {
    path: '/projects/:slug',
    component: () => import('@/pages/projects/[slug].vue'),
    name: 'projectDetail',
    meta: { requiresAuth: true }
  },

  // User routes
  {
    path: '/users',
    component: () => import('@/pages/users/index.vue'),
    name: 'users',
    meta: { requiresAuth: true, requiresRole: ['admin', 'project_manager'] }
  },
  {
    path: '/users/:username',
    component: () => import('@/pages/users/[username].vue'),
    name: 'userDetail',
    meta: { requiresAuth: true }
  },

  // Catch-all route for 404s
  { path: '/:catchAll(.*)', component: () => import('@/pages/[...catchAll].vue'), name: 'notFound' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.getSession()

  // Get route meta information
  const requiresAuth = to.meta?.requiresAuth
  const requiresAdmin = to.meta?.requiresAdmin
  const requiresRole = to.meta?.requiresRole as string | string[] | undefined

  // Auth pages check
  const isAuthPage = ['/login', '/register'].includes(to.path)

  if (!authStore.user && !isAuthPage) {
    return next('/login')
  }

  if (authStore.user && isAuthPage) {
    return next('/dashboard')
  }

  // If route doesn't require authentication, allow access
  if (!requiresAuth) {
    return next()
  }

  // Route requires authentication but user is not logged in
  if (requiresAuth && !authStore.user) {
    showError('Please log in to access this page')
    return next('/login')
  }

  // For authenticated routes, ensure roles are loaded
  if (authStore.user) {
    try {
      if (!authStore.userRoles?.length) {
        await authStore.loadUserRoles()
      }

      // Admin route protection
      if (requiresAdmin && !authStore.isAdmin) {
        showError('Administrator privileges required to access this page')
        return next('/dashboard')
      }

      // Role-based route protection
      if (requiresRole) {
        const requiredRoles = Array.isArray(requiresRole) ? requiresRole : [requiresRole]
        const hasRequiredRole = requiredRoles.some(role => authStore.hasRole(role))

        if (!hasRequiredRole) {
          showError(`Access denied. Required role: ${requiredRoles.join(' or ')}`)

          // Smart fallback based on route
          if (to.path.startsWith('/projects')) {
            return next('/projects')
          } else if (to.path.startsWith('/tasks')) {
            return next('/tasks')
          } else {
            return next('/dashboard')
          }
        }
      }

      // All checks passed, allow access
      next()
    } catch (error) {
      console.error('Failed to load user roles:', error)
      showError('Failed to verify permissions')
      next('/dashboard')
    }
  } else {
    next()
  }
})

export default router
