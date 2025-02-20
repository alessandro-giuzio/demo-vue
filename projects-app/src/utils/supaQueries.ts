import { supabase } from "@/lib/supabaseClient";
import type { QueryData } from "@supabase/supabase-js";


export const tasksWithProjectsQuery = supabase.from('tasks').select(`
  *,
  projects (
  id,
  name,
  slug)
  `)

export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>


export const projectsQuery = supabase.from('projects').select(`
  *,
  users!projects_owner_id_fkey(full_name)  -- Fetch the owner's name
`
)
/* TODO */// add a where clause to filter out projects that dont belong to the current user
// for this we will look into the userprojects table
// we will need the id of the currently authenthicated user for this
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

export const updateProjectQuery = (updateProject = {}, id: number) => {
  return supabase.from('projects').update(updateProject).eq('id', id)
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

export type User = QueryData<ReturnType<typeof userRegQuery>>
export const userRegQuery = ({column, value}: {column:string, value:string}) => {
  return supabase.from('users').select().eq(column,value).single()
}

export const groupedUsersQuery = (userIds: string[]) => {
  if (userIds.length === 0) {
    console.error('No user IDs provided');
    return null; // Exit early to avoid making an invalid query
  }
  return supabase.from('users')
    .select('username,avatar_url,id,full_name')
    .in('id', userIds)
}
    export type Collabs = QueryData<ReturnType<typeof groupedUsersQuery>>

