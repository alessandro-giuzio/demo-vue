import { supabase } from "@/lib/supabaseClient";
import type { CreateNewTask } from "@/types/CreateNewForm";
import type { QueryData } from "@supabase/supabase-js";


export const tasksWithProjectsQuery = supabase.from('tasks').select(`
  *,
  projects (
  id,
  name,
  slug)
  `)

export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>


export const projectsQuery = supabase.from('projects').select()
export type Projects = QueryData<typeof projectsQuery>

export const projectQuery = (slug: string) =>
    supabase
    .from('projects')
    .select(`
   *,
   users!projects_owner_id_fkey(full_name),
   tasks (
    id,
    name,
    status,
    assigned_to
   )
  `
    )
    .eq('slug', slug)
    .single()

export type Project = QueryData<ReturnType<typeof projectQuery>>

export const updateProjectQuery = (updatedProject = {}, id: string) => {
  return supabase.from('projects').update(updatedProject).eq('id', id);
}

export const taskQuery = (id: string) => {
  if (!id) {
    console.error('Invalid Task ID:', id);
    return null; // Exit early to avoid making an invalid query
  }
  return supabase
    .from('tasks')
    .select(`
      *,
      projects(
        id,
        name,
        slug
        ),
        users!tasks_assigned_to_fkey (
        username
      )
      `) // Check for trailing commas here
    .eq('id', id)
    .single()
  }
export type Task = QueryData<ReturnType<typeof taskQuery>>

export const updateTaskQuery = (updateTask = {}, id: number) => {
  return supabase.from('tasks').update(updateTask).eq('id', id)
}

export const deleteTaskQuery = async (id: number | string) => {
  if (!id) {
    throw new Error('Task ID is required')
  }

  return supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .select()
}

export type User = QueryData<ReturnType<typeof userRegQuery>>
export const userRegQuery = ({column, value}: {column:string, value:string}) => {
  return supabase.from('users').select().eq(column,value).single()
}

export const groupedUsersQuery = (userIds: string[]) => {
  return supabase.from('users').select('username, avatar_url, id, full_name')
  .in('id', userIds)
}
export type Collabs = QueryData<ReturnType<typeof groupedUsersQuery>>

// New function to filter projects for the logged-in user
export const filterProjectsForUser = async (userId: string) => {
  const { data, error } = await projectsQuery.eq('owner_id', userId)
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}
// New function to filter tasks for the logged-in user
export const filterTasksForUser = async (userId: string) => {
  const { data, error } = await tasksWithProjectsQuery.eq('assigned_to', userId)
  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
  return data
}

export const usersQuery = supabase.from('users').select('id, full_name, username, avatar_url')

export const createNewTaskQuery = async (newTask: CreateNewTask) => {
  const { data, error } = await supabase.from('tasks').insert(newTask).select();
  return { data, error };
}

// New function to add a new project

export const createNewProjectQuery = async (newProject: Project) => {
  const { data, error } = await supabase.from('projects').insert(newProject).select();
  return { data, error };
}
