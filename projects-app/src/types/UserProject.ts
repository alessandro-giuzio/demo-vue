export type UserProject = {
  id: string
  user_id: string
  project_id: string
  role: 'owner' | 'collaborator' | string
  status: 'in-progress' | 'done' | 'blocked' | string
  created_at: string
  projects?: any // if you use `.select('*, projects(*)')` and want to include project data
}
