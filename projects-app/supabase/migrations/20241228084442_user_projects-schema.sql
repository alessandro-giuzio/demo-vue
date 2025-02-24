DROP TABLE IF EXISTS user_projects CASCADE;
CREATE TABLE user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'collaborator',  -- Optional: Define roles ('admin', 'editor', 'viewer')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


