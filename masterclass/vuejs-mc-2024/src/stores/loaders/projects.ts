import type { Projects } from "@/utils/supaQueries"
import { useMemoize } from '@vueuse/core'
import { projectsQuery } from '@/utils/supaQueries'

// Define a Pinia store for managing projects data
export const useProjectsStore = defineStore('projects-store', ()=>{
  // Reactive variable to store project data or null if not loaded
  const projects = ref<Projects| null>(null)
  const loadProjects = useMemoize( async (key: string) => await projectsQuery)

  const getProjects = async () => {
    const { data, error, status } = await loadProjects('projects')
    if (error) useErrorStore().setError({ error, customCode: status })

    projects.value = data
  }
  return {
      projects,
      getProjects
  }
})