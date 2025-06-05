-- Create project_status table
CREATE TABLE IF NOT EXISTS public.project_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- Add UNIQUE constraint here
  color TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for project_status
ALTER TABLE public.project_status ENABLE ROW LEVEL SECURITY;

-- Set project_status table policies
CREATE POLICY "Enable read access for all users" ON public.project_status
  FOR SELECT USING (true);

-- Insert default statuses (only if they don't exist)
INSERT INTO public.project_status (name, color, description, order_index)
VALUES
  ('Not Started', '#e5e7eb', 'Project has been created but work has not begun', 10),
  ('In Progress', '#3b82f6', 'Work on the project has started', 20),
  ('On Hold', '#f59e0b', 'Project temporarily paused', 30),
  ('Completed', '#10b981', 'Project has been finished', 40),
  ('Cancelled', '#ef4444', 'Project has been cancelled', 50)
ON CONFLICT (name) DO NOTHING;

-- Add status_id column to projects table
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS status_id UUID REFERENCES public.project_status(id);

-- Create index for status_id column
CREATE INDEX IF NOT EXISTS idx_projects_status_id ON public.projects(status_id);

-- Add triggers for updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for project_status table
DROP TRIGGER IF EXISTS set_project_status_updated_at ON public.project_status;
CREATE TRIGGER set_project_status_updated_at
  BEFORE UPDATE ON public.project_status
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Map the existing status string values to the new status_id references
-- For existing projects with status = 'in-progress'
UPDATE public.projects
SET status_id = (SELECT id FROM public.project_status WHERE name = 'In Progress')
WHERE status_id IS NULL AND status = 'in-progress';

-- For existing projects with status = 'completed'
UPDATE public.projects
SET status_id = (SELECT id FROM public.project_status WHERE name = 'Completed')
WHERE status_id IS NULL AND status = 'completed';

-- Set default status for any remaining projects with null status
UPDATE public.projects
SET status_id = (SELECT id FROM public.project_status WHERE name = 'Not Started')
WHERE status_id IS NULL;

-- Add a view for backward compatibility (optional)
CREATE OR REPLACE VIEW public.projects_with_status AS
SELECT
  p.*,
  ps.name as status_name,
  ps.color as status_color
FROM
  public.projects p
LEFT JOIN
  public.project_status ps ON p.status_id = ps.id;