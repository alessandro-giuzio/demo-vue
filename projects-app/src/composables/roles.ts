import { ref, computed } from 'vue'
// Update the import path below if your supabase file is in a different location
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import { showError } from '@/utils/toast'

// Define the Role type if not already imported
export interface Role {
  id: number
  key: string
  description: string
}


export function useRoles() {
  const authStore = useAuthStore()
  const userRoles = ref<Role[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Load current user's roles
  const loadUserRoles = async () => {
    if (!authStore.user) {
      userRoles.value = []
      return []
    }

    isLoading.value = true
    error.value = null

    try {
      const { data, error: apiError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles (
            id,
            key,
            description
          )
        `)
        .eq('user_id', authStore.user.id)

      if (apiError) {
        throw new Error(`Failed to load user roles: ${apiError.message}`)
      }

      userRoles.value = data.map(item => item.roles) as Role[]
      return userRoles.value
    } catch (err) {
      error.value = err as Error
      showError(error.value.message)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // Check if user has a specific role
  const hasRole = (roleKey: string): boolean => {
    return userRoles.value.some(role => role.key === roleKey)
  }

  // Computed properties for common role checks
  const isAdmin = computed(() => hasRole('admin'))

  const isProjectManager = computed(() =>
    hasRole('admin') || hasRole('project_manager')
  )

  const isContributor = computed(() =>
    hasRole('admin') || hasRole('project_manager') || hasRole('contributor')
  )

  return {
    userRoles,
    loadUserRoles,
    hasRole,
    isAdmin,
    isProjectManager,
    isContributor,
    isLoading,
    error
  }
}
