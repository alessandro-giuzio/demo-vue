import { supabase } from "@/lib/supabaseClient";
import type { CreateNewTask } from "@/types/CreateNewForm";
import type { Comment } from "../types/Comments";
import type { QueryData } from "@supabase/supabase-js";
import { showError, showSuccess } from "./toast";

// Storage


export const uploadFilesToStorage = async (file: File, path: string = 'uploads'): Promise<string> => {
  try {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('User is not authenticated')
    }

    // Create a unique file name to avoid collisions
    const uniqueFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    console.log('Attempting to upload file:', {
      bucketName: 'comments-updates',
      fileName: uniqueFileName,
      fileSize: file.size,
      fileType: file.type,
      userId: session.user.id
    });

    // Upload the file with upsert option
    const { data, error } = await supabase
      .storage
      .from('comments-updates')
      .upload(`${path}/${uniqueFileName}`, file, {
        cacheControl: '3600',
        upsert: true  // Change to true to replace any existing file
      });

    if (error) {
      // Use error store for consistent handling
      useErrorStore().setError({
        error: `Failed to upload ${file.name}: ${error.message}`,
        customCode: 500
      });
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    // Generate a public URL for the file
    const { data: urlData } = supabase
      .storage
      .from('comments-updates')
      .getPublicUrl(`${path}/${uniqueFileName}`);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Optional: Add a function to delete files from storage
export const deleteFileFromStorage = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract the path from the URL

    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    // Find the index of "public" and get everything after the bucket name
    const publicIndex = pathParts.indexOf('public');
    if (publicIndex === -1 || publicIndex + 2 >= pathParts.length) {
      throw new Error('Invalid file URL structure');
    }

    // Get the bucket name and file path
    const bucketName = pathParts[publicIndex + 1];
    const filePath = pathParts.slice(publicIndex + 2).join('/');

    console.log('Attempting to delete file:', { bucketName, filePath });

    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Delete error details:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }

    console.log('File successfully deleted');
    return true;
  } catch (error) {
    console.error('Delete file error:', error);
    return false;
  }
};
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
  try {
    if (!id) {
      showError('Task ID is required')
      throw new Error('Task ID is required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      showError(`Failed to delete task: ${error.message}`)
      console.error('Delete task error:', error)
      throw error
    }

    showSuccess('Task deleted successfully')
    return data
  } catch (error) {
    console.error('Error in deleteTaskQuery:', error)
    // Only show error if it hasn't been shown already
    if (!(error instanceof Error && error.message === 'Task ID is required')) {
      showError('Failed to delete task')
    }
    throw error
  }
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
// Add this new function to fetch all projects for a user
export const fetchUserProjectsQuery = async (userId: string) => {
  try {
    // First, get projects owned by the user
    const { data: ownedProjects, error: ownedError } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', userId);

    if (ownedError) {
      console.error('Error fetching owned projects:', ownedError);
      throw ownedError;
    }

    // Then, get projects assigned to the user
    const { data: assignedData, error: assignedError } = await supabase
      .from('user_projects')
      .select(`
        project_id,
        role,
        status,
        projects:project_id (*)
      `)
      .eq('user_id', userId);

    if (assignedError) {
      console.error('Error fetching assigned projects:', assignedError);
      throw assignedError;
    }

    // Extract project data from assigned projects
    const assignedProjects = assignedData
      .filter(item => item.projects) // Filter out any null projects
      .map(item => ({
        ...item.projects,
        user_role: item.role,     // Add role information
        user_status: item.status  // Add status information
      }));

    // Combine owned and assigned projects, avoiding duplicates
    const allProjectIds = new Set();
    const allProjects = [];

    // Add owned projects first
    for (const project of ownedProjects || []) {
      allProjectIds.add(project.id);
      allProjects.push({ ...project, user_role: 'owner' });
    }

    // Add assigned projects if not already included
    for (const project of assignedProjects || []) {
      if (!allProjectIds.has(project.id)) {
        allProjectIds.add(project.id);
        allProjects.push(project);
      }
    }

    console.log(`Found ${allProjects.length} projects for user (${ownedProjects?.length || 0} owned, ${assignedProjects?.length || 0} assigned)`);
    return allProjects;
  } catch (err) {
    console.error('Error in fetchUserProjectsQuery:', err);
    throw err;
  }
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

// New function to fetcch tasks comments
export async function fetchCommentsForTask(taskId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(username, avatar_url)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data as Comment[]
}

// New function to add a comment to a task
export async function addCommentToTask({
  content,
  taskId,
  userId
}: {
  content: string
  taskId: string
  userId: string
}): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        content,
        task_id: taskId,
        user_id: userId,
      },
    ])
    .select('*, users(username, avatar_url)')
    .single()

  if (error) {
    console.error('Error adding comment:', error)
    return null
  }
  console.log('Inserted comment:', data)
  return data as Comment
}
// New function to fetch comments for a project
export async function fetchCommentsForProject(projectId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(username, avatar_url)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching project comments:', error)
    return []
  }

  return data
}
// New function to add a comment to a project
export async function addCommentToProject({
  content,
  projectId,
  userId
}: {
  content: string
  projectId: string
  userId: string
}) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        content,
        project_id: projectId,
        user_id: userId
      }
    ])
    .select('*, users(username, avatar_url)')
    .single()

  if (error) {
    console.error('Error adding project comment:', error)
    return null
  }

  return data
}

// New function to upload a single file to storage
export const uploadSingleFileToStorage = async (file: File): Promise<string | null> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  try {
    const { error } = await supabase.storage
      .from('comment-updates')
      .upload(filePath, file)

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    const { data: publicUrlData } = supabase.storage
      .from('comment-updates')
      .getPublicUrl(filePath)

    return publicUrlData?.publicUrl || null
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

// Add comment-related operations

export const postComment = async (comment: { content: string; taskId: string; userId: string }) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        content: comment.content,
        task_id: comment.taskId,
        user_id: comment.userId
      })
      .select('*')
      .single()

    if (error) {
      showError(`Failed to post comment: ${error.message}`)
      throw error
    }

    showSuccess('Comment posted successfully')
    return data
  } catch (error) {
    console.error('Error posting comment:', error)
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError('Failed to post comment')
    }
    throw error
  }
}

export const deleteComment = async (commentId: string) => {
  try {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);

    if (error) {
      showError(`Failed to delete comment: ${error.message}`)
      throw error;
    }

    showSuccess('Comment deleted')
    return true;
  } catch (error) {
    console.error('Failed to delete comment:', error);
    showError('Failed to delete comment')
    throw error;
  }
};



export const submitEdit = async (commentId: string, content: string) => {
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .select('*') // Return the updated comment
    .single()

  if (error) throw error
  return data // Return the updated comment object
}
