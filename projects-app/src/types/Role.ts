export interface Role {
  id: string;
  key: string;
  description: string;
  created_at?: string;
}

export type RoleKey = 'admin' | 'project_manager' | 'contributor';
