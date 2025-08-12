import { useAuthStore } from '@/stores/auth'
import { showError } from '@/utils/toast'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import router from '.'

export interface RouteRole {
  requiresAuth?: boolean
  requiresRole?: string | string[]
  requiresAdmin?: boolean
  requiresProjectManager?: boolean
  fallbackRoute?: string
}

export const checkRoutePermissions = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  // Get route meta information
  const meta = to.meta as RouteRole

  // If route doesn't require any special permissions, allow access
  if (!meta.requiresAuth && !meta.requiresRole && !meta.requiresAdmin && !meta.requiresProjectManager) {
    return next()
  }

  // Check if user is authenticated
  if (meta.requiresAuth && !authStore.user) {
    showError('Please log in to access this page')
    return next('/login')
  }

  // Ensure user roles are loaded
  if (authStore.user && !authStore.userRoles.length) {
    try {
      await authStore.loadUserRoles()
    } catch (error) {
      console.error('Failed to load user roles:', error)
      showError('Failed to verify permissions')
      return next(meta.fallbackRoute || '/dashboard')
    }
  }

  // Check admin requirement
  if (meta.requiresAdmin && !authStore.isAdmin) {
    showError('Administrator privileges required to access this page')
    return next(meta.fallbackRoute || '/dashboard')
  }

  // Check project manager requirement
  if (meta.requiresProjectManager && !authStore.isProjectManager) {
    showError('Project Manager privileges required to access this page')
    return next(meta.fallbackRoute || '/dashboard')
  }

  // Check specific role requirements
  if (meta.requiresRole) {
    const requiredRoles = Array.isArray(meta.requiresRole) ? meta.requiresRole : [meta.requiresRole]
    const hasRequiredRole = requiredRoles.some(role => authStore.hasRole(role))

    if (!hasRequiredRole) {
      showError(`Access denied. Required role: ${requiredRoles.join(' or ')}`)
      return next(meta.fallbackRoute || '/dashboard')
    }
  }
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    await authStore.getSession()

    console.log('🔍 Route Guard Check:', {
      to: to.path,
      user: authStore.user?.email,
      roles: authStore.userRoles,
      isAdmin: authStore.isAdmin,
      isProjectManager: authStore.isProjectManager,
      meta: to.meta
    })

  // All checks passed, allow access
  next()
}
