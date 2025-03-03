export interface CreateNewTask {
  assigned_to: string;
  collaborators?: string[];
  created_at?: string | null;
  description: string;
  id?: string;
  name: string;
  owner_id: string;
  project_id: string;
  status?: "in-progress" | "completed";
  tags: string[];
}
