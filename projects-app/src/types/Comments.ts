// types/comments.ts

export interface Comment {
  id: number;
  content: string;
  task_id?: string | null;
  project_id?: string | null;
  user_id: string;
  created_at: string;
  updated_at?: string;
  users?: {
    username: string;
    avatar_url?: string;
  };
}
