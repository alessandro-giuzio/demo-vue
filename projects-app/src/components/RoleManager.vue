<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/composables/roles'
import { showSuccess, showError } from '@/utils/toast'

// Update the Role interface to use string IDs
interface Role {
  id: string // Change to string type for UUID
  key: string
  description: string
}

interface User {
  id: string
  email: string
  display_name?: string
}

const authStore = useAuthStore()
const users = ref<User[]>([])
const roles = ref<Role[]>([])
const isLoading = ref(false)
const isAssigning = ref(false)

// Form data for new role assignment
const newAssignment = ref({
  userId: '',
  roleId: ''
})

// Load all users and roles
onMounted(async () => {
  if (!authStore.isAdmin) return

  isLoading.value = true
  try {
    // Load all users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .order('email')

    if (usersError) throw new Error(`Failed to load users: ${usersError.message}`)
    users.value = usersData as User[]

    // Load all roles
    const { data: rolesData, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .order('key') // Order by key instead of id

    if (rolesError) throw new Error(`Failed to load roles: ${rolesError.message}`)

    // No need to convert IDs - keep them as strings for UUID
    roles.value = rolesData as Role[]

    // Load current role assignments for display
    await loadUserRoleAssignments()
  } catch (err) {
    showError((err as Error).message)
  } finally {
    isLoading.value = false
  }
})

// Track role assignments for each user - use string arrays for UUIDs
const userRoleMap = ref<Record<string, string[]>>({})

// Load all user role assignments
const loadUserRoleAssignments = async () => {
  try {
    const { data, error } = await supabase.from('user_roles').select('user_id, role_id')

    if (error) throw new Error(`Failed to load user roles: ${error.message}`)

    // Create a map of user_id -> array of role_ids (keeping UUIDs as strings)
    userRoleMap.value = {}
    data.forEach((item) => {
      if (!userRoleMap.value[item.user_id]) {
        userRoleMap.value[item.user_id] = []
      }
      userRoleMap.value[item.user_id].push(item.role_id)
    })
  } catch (err) {
    showError((err as Error).message)
  }
}

// Assign a role to a user
const assignRole = async () => {
  if (!newAssignment.value.userId || !newAssignment.value.roleId) {
    showError('Please select both a user and a role')
    return
  }

  isAssigning.value = true
  try {
    const { error } = await supabase.from('user_roles').insert({
      user_id: newAssignment.value.userId,
      role_id: newAssignment.value.roleId // Keep as string for UUID
    })

    if (error) {
      // Check if it's a duplicate error
      if (error.code === '23505') {
        showError('This user already has this role assigned')
      } else {
        throw new Error(`Failed to assign role: ${error.message}`)
      }
    } else {
      showSuccess('Role assigned successfully')
      // Refresh the assignments
      await loadUserRoleAssignments()
      // Reset form
      newAssignment.value = { userId: '', roleId: '' }
    }
  } catch (err) {
    showError((err as Error).message)
  } finally {
    isAssigning.value = false
  }
}

// Remove a role from a user - update parameter type to string
const removeRole = async (userId: string, roleId: string) => {
  if (!confirm('Are you sure you want to remove this role from the user?')) {
    return
  }

  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId)

    if (error) throw new Error(`Failed to remove role: ${error.message}`)

    showSuccess('Role removed successfully')
    // Refresh the assignments
    await loadUserRoleAssignments()
  } catch (err) {
    showError((err as Error).message)
  }
}

// Computed property for users with their roles
const usersWithRoles = computed(() => {
  return users.value.map((user) => ({
    ...user,
    roles: userRoleMap.value[user.id] || []
  }))
})
</script>

<template>
  <div class="role-manager">
    <h2 class="mb-4 text-xl font-bold">User Role Management</h2>
    <!-- Debug section -->
    <div class="p-4 mb-4 border border-yellow-300 rounded-md bg-yellow-50">
      <h3 class="mb-2 font-medium">Debug Information:</h3>
      <div class="space-y-1 text-sm">
        <p>Total Users: {{ users.length }}</p>
        <p>Total Roles: {{ roles.length }}</p>
        <p>Available Roles:</p>
        <ul class="ml-4 list-disc">
          <li v-for="role in roles" :key="role.id">{{ role.key }} (ID: {{ role.id }})</li>
        </ul>
      </div>
    </div>
    <div v-if="!authStore.isAdmin" class="p-4 bg-red-100 border border-red-300 rounded-lg">
      <p class="text-red-600">You don't have permission to manage user roles.</p>
    </div>

    <div v-else-if="isLoading" class="p-4">
      <p>Loading...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- New role assignment form -->
      <div class="p-4 border rounded-lg bg-muted/30">
        <h3 class="mb-3 font-medium">Assign New Role</h3>
        <div class="flex flex-wrap gap-4">
          <div class="flex-grow w-full sm:w-auto">
            <label class="block mb-1 text-sm font-medium" for="user">User</label>
            <select
              id="user"
              v-model="newAssignment.userId"
              class="w-full px-3 py-2 border rounded-md"
            >
              <option value="" disabled>Select a user</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.display_name || user.email }}
              </option>
            </select>
          </div>

          <div class="flex-grow w-full sm:w-auto">
            <label class="block mb-1 text-sm font-medium" for="role">Role</label>
            <select
              id="role"
              v-model="newAssignment.roleId"
              class="w-full px-3 py-2 border rounded-md"
            >
              <option value="" disabled>Select a role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.key }} - {{ role.description }}
              </option>
            </select>
          </div>

          <div class="flex items-end w-full sm:w-auto">
            <button
              @click="assignRole"
              :disabled="isAssigning"
              class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isAssigning ? 'Assigning...' : 'Assign Role' }}
            </button>
          </div>
        </div>
      </div>

      <!-- User role table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="p-2 text-left border-b">User</th>
              <th class="p-2 text-left border-b">Current Roles</th>
              <th class="p-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersWithRoles" :key="user.id" class="border-b hover:bg-muted/30">
              <td class="p-2">{{ user.display_name || user.email }}</td>
              <td class="p-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="roleId in user.roles"
                    :key="roleId"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300':
                        roles.find((r) => r.id === roleId)?.key === 'admin',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                        roles.find((r) => r.id === roleId)?.key === 'project_manager',
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
                        roles.find((r) => r.id === roleId)?.key === 'contributor'
                    }"
                  >
                    {{ roles.find((r) => r.id === roleId)?.key }}
                  </span>
                  <span v-if="user.roles.length === 0" class="text-sm text-muted-foreground">
                    No roles assigned
                  </span>
                </div>
              </td>
              <td class="p-2">
                <div class="flex gap-2">
                  <button
                    v-for="roleId in user.roles"
                    :key="roleId"
                    @click="removeRole(user.id, roleId)"
                    class="px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200"
                    title="Remove role"
                  >
                    Remove {{ roles.find((r) => r.id === roleId)?.key }}
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="usersWithRoles.length === 0">
              <td colspan="3" class="p-4 text-center text-muted-foreground">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
