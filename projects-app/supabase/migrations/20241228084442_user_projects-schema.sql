DROP TABLE IF EXISTS user_projects CASCADE;

CREATE TABLE user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NOT NULL,
  role TEXT DEFAULT 'collaborator',
  status TEXT DEFAULT 'in-progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT user_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT user_projects_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);