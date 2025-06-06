import {
  deleteTaskQuery,
  taskQuery,
  tasksWithProjectsQuery,
  updateTaskQuery
} from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'
import type { Task, TasksWithProjects } from '@/utils/supaQueries'

export const useTasksStore = defineStore('tasks-store', () => {
  const tasks = ref<TasksWithProjects | null>(null)
  const task = ref<Task | null>(null)
  const loadTasks = useMemoize(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (id: string) => await tasksWithProjectsQuery
  )
  const loadTask = useMemoize(async (slug: string) => await taskQuery(slug))

  interface ValidateCacheParams {
    ref: typeof tasks | typeof task
    query: typeof tasksWithProjectsQuery | typeof taskQuery
    key: string
    loaderFn: typeof loadTasks | typeof loadTask
  }
/*
TODO refactor validateCache to use a more efficient comparison method
what's finalQuery and why is it being compared to ref.value?
*/
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

  const getTasks = async () => {
    tasks.value = null

    const { data, error, status } = await loadTasks('tasks')

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) tasks.value = data

    validateCache({
      ref: tasks,
      query: tasksWithProjectsQuery,
      key: 'tasks',
      loaderFn: loadTasks
    })
  }

  const getTask = async (id: string) => {
    task.value = null

    const { data, error, status } = await loadTask(id)

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) task.value = data

    validateCache({
      ref: task,
      query: taskQuery,
      key: id,
      loaderFn: loadTask
    })
  }

  const updateTask = async (fields: Partial<Task>) => {
    console.log('Updating task with fields:', fields) // Debug
    try {
      if (!task.value) {
        throw new Error('No task selected for update')
      }
      const { error } = await updateTaskQuery(fields, task.value.id)
      if (error) throw error

      // Update local state with the fields
      task.value = { ...task.value, ...fields }
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  const deleteTask = async () => {
    try {
      if (!task.value?.id) {
        throw new Error('No task selected for deletion')
      }

      const { error, data } = await deleteTaskQuery(task.value.id)

      if (error) {
        throw new Error(`Failed to delete task: ${error.message}`)
      }

      // Clear local state after successful deletion
      task.value = null
      return data
    } catch (error) {
      console.error('Delete task error:', error)
      throw error
    }
  }
  return {
    tasks,
    getTasks,
    getTask,
    task,
    updateTask,
    deleteTask
  }
})
