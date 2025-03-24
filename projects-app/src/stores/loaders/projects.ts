import { projectQuery, projectsQuery, updateProjectQuery, updateTaskQuery } from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'
import type { Project, Projects } from '@/utils/supaQueries'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)
  const project = ref<Project | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadProjects = useMemoize(async (key: string) => await projectsQuery)
  const loadProject = useMemoize(
    async (slug: string) => await projectQuery(slug)
  )

  interface ValidateCacheParams {
    ref: typeof projects | typeof project
    query: typeof projectsQuery | typeof projectQuery
    key: string
    loaderFn: typeof loadProjects | typeof loadProject
  }

  const validateCache = ({
    ref,
    query,
    key,
    loaderFn
  }: ValidateCacheParams) => {
    if (ref.value) {
      const finalQuery = typeof query === 'function' ? query(key) : query

      finalQuery.then(({ data, error }) => {
        if (JSON.stringify(ref.value) === JSON.stringify(data)) {
          return
        } else {
          loaderFn.delete(key)
          if (!error && data) ref.value = data
        }
      })
    }
  }

  const getProjects = async () => {
    projects.value = null
    const { data, error, status } = await loadProjects('projects')

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) projects.value = data

    validateCache({
      ref: projects,
      query: projectsQuery,
      key: 'projects',
      loaderFn: loadProjects
    })
  }

  const getProject = async (slug: string) => {
    project.value = null
    const { data, error, status } = await loadProject(slug)

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) project.value = data

    validateCache({
      ref: project,
      query: projectQuery,
      key: slug,
      loaderFn: loadProject
    })
  }

  const updateProject = async () => {
    if (!project.value) return;
    if (!project.value.id) {
      console.error("No project id");
      return;
    }
    // Remove properties that should not be updated
    const { tasks, id, users, ...projectProperties } = project.value;
    // Use the project's UUID string directly
    const pid = project.value.id;

    const { error } = await updateProjectQuery(projectProperties, pid);
    if (error) {
      console.error("Update error:", error);
    } else {
      console.log("Project updated successfully");
    }
  };



  const updateProjectStatus = async (newStatus: "in-progress" | "completed") => {
    if (!project.value || !project.value.id) {
      console.error("Project is missing or has no id");
      return;
    }
    const projectId = project.value.id;
    console.log("Updating project status:", { projectId, status: newStatus });

    const { data, error } = await updateProjectQuery({ status: newStatus }, projectId);
    if (error) {
      console.error("Error updating project status:", error);
    } else {
      console.log("Project updated successfully:", data);
      // Optionally update the local store
      project.value.status = newStatus;
    }
  };


/* TODO
Project Page: Update Task Status
Task Page - Update Task Status - Update Name - Update Description Update everything
*/
  const updateTask = async (taskId: string, newStatus: string) => {
    if (!taskId) {
      console.error("Task ID is missing")
      return
    }

    console.log("Updating task:", { taskId, status: newStatus }) // Debugging log

    const { data, error } = await updateTaskQuery(Number(taskId), newStatus)

    if (error) {
      console.error("Error updating task status:", error)
    } else {
      console.log("Task updated successfully:", data)
    }
  }


  return {
    projects,
    getProjects,
    getProject,
    project,
    updateProject,
    updateProjectStatus,
    updateTask
  }
})
