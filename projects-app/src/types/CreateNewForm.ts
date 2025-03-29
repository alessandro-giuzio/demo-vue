export interface CreateNewTask {
  assigned_to: string;
  collaborators?: string[];
  created_at?: string | null;
  description: string;
  id?: string;
  name: string;
  owner_id: string | null;
  project_id: string;
  status?: "in-progress" | "completed";
  tags: string[];
}

export interface CreateNewProject {
  created_at?: string | null;
  description: string;
  id?: string;
  name: string;
  owner_id: string;
  status?: "in-progress" | "completed";
  tags: string[];
  collaborators?: (number | string)[];
  tasks?: (number | string)[];

}
