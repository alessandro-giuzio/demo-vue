import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { UserProject } from '@/types/UserProject'

export function useUserProjects() {
  const userProjects = ref<UserProject[]>([])
  const error = ref<string | null>(null)

  const fetchUserProjects = async (userId: string) => {
    const { data, error: fetchError } = await supabase
      .from('user_projects')
      .select('*, projects(*)') // join project info
      .eq('user_id', userId)

    if (fetchError) {
      error.value = fetchError.message
    } else {
      userProjects.value = data
    }
  }

  const assignUserToProject = async ({
    userId,
    projectId,
    role = 'collaborator',
    status = 'in-progress'
  }: {
    userId: string
    projectId: string
    role?: string
    status?: string
  }) => {
    const { data, error: insertError } = await supabase
      .from('user_projects')
      .insert([
        { user_id: userId, project_id: projectId, role, status }
      ])
      .select()

    if (insertError) {
      error.value = insertError.message
      return null
    }

    return data?.[0]
  }

  return {
    userProjects,
    fetchUserProjects,
    assignUserToProject,
    error
  }
}
