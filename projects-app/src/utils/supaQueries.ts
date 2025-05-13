import { supabase } from "@/lib/supabaseClient";
import type { CreateNewTask } from "@/types/CreateNewForm";
import type { QueryData } from "@supabase/supabase-js";


export const tasksWithProjectsQuery = supabase.from('tasks').select(`
 *,
  projects (
    id,
    name,
    slug
  ),
  assigned_user:assigned_to (
    full_name
  ),
  task_status (
    id,
    name,
    color
  )

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
      ),
      task_status (
        id,
        name,
        color
      )
      `) // Check for trailing commas here
    .eq('id', id)
    .single()
  }
export type Task = QueryData<ReturnType<typeof taskQuery>>

export const updateTaskQuery = (updateTask = {}, id: string) => {
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
  const { data } = await supabase
    .from('tasks')
    .select(`
      *,
      projects (id, name, slug),
      task_status (id, name, color)
    `)
    .eq('assigned_to', userId)

  return data || []
}

export const usersQuery = supabase.from('users').select('id, full_name, username, avatar_url')
/* TODO check for id */
export const createNewTaskQuery = async (newTask: CreateNewTask) => {
  try {
    // Check if required fields are present
    if (!newTask.name || !newTask.project_id || !newTask.status_id) {
      const error = new Error('Required fields missing: name, project_id, or status_id');
      console.error(error);
      return { data: null, error };
    }

    // If ID is provided but empty, remove it to let Supabase generate one
    const taskToInsert = {
      ...newTask,
      description: newTask.description ?? '' // Ensure description is a string
    };
    if (taskToInsert.id === undefined || taskToInsert.id === '') {
      delete taskToInsert.id;
    }

    // Insert the task and return the newly created record
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskToInsert as any) // Cast to 'any' to avoid TypeScript error
      .select('*, task_status(id, name, color)'); // Include related task_status

    if (error) {
      console.error('Error creating task:', error);
    }

    return { data, error };
  } catch (err) {
    console.error('Exception in createNewTaskQuery:', err);
    return { data: null, error: err as Error };
  }
}

// New function to add a new project

export const createNewProjectQuery = async (newProject: Project) => {
  const { data, error } = await supabase.from('projects').insert(newProject).select().single();
  return { data, error };
}

export const assignUserToProjectQuery = async ({
  userId,
  projectId,
  role = 'owner',
  status = 'in-progress'
}: {
  userId: string
  projectId: string
  role?: string
  status?: string
}) => {
  return supabase
    .from('user_projects')
    .insert([
      {
        user_id: userId,
        project_id: projectId,
        role,
        status
      }
    ])
    .select()
}

export const taskStatusesQuery = async () => {

  const { data, error } = await supabase
    .from('task_status')
    .select('*')
    .order('order_index', { ascending: true });



  if (error) {
    console.error('Error fetching task statuses:', error)
  }

  return { data, error };
}

